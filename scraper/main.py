import os
import uuid
import json
import asyncio
import pandas as pd
import sqlite3
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from playwright.async_api import async_playwright
import random

app = FastAPI()

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "scraper/jobs.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS jobs
                 (id TEXT PRIMARY KEY, filename TEXT, status TEXT,
                  total_rows INTEGER, processed_rows INTEGER, created_at TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS results
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, job_id TEXT,
                  row_index INTEGER, original_data TEXT, map_link TEXT, error TEXT)''')
    conn.commit()
    conn.close()

init_db()

async def scrape_task(job_id: str, df: pd.DataFrame):
    async with async_playwright() as p:
        # Use headless=True for production
        browser = await p.chromium.launch(headless=True)
        # Use a real user agent to avoid detection
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = await context.new_page()

        conn = sqlite3.connect(DB_PATH)

        for index, row in df.iterrows():
            name = row.get('Business Name', '')
            address = row.get('Address', '')
            postal = row.get('Postal code', '')

            query = f"{name} {address} {postal}".strip()
            map_link = ""
            error_msg = ""

            try:
                # Search on Google Maps
                search_url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}"
                await page.goto(search_url)

                # Wait for page load
                await asyncio.sleep(random.uniform(3, 6))

                # Handle cookie consent if it appears
                try:
                    consent_button = page.locator('button:has-text("Accept all"), button:has-text("I agree"), button:has-text("Agree")')
                    if await consent_button.is_visible():
                        await consent_button.click()
                        await asyncio.sleep(1)
                except:
                    pass

                # Try to find the "Share" button
                share_button = page.locator('button[data-value="Share"]')

                # Sometimes a list of results appears instead of a direct profile
                # If share button is not visible, check for the first result in a list
                if not await share_button.is_visible():
                    # Click the first result if it's a list
                    # Selector for result in list can be [role="article"] or similar
                    first_result = page.locator('a[href*="/maps/place/"]').first
                    if await first_result.is_visible():
                        await first_result.click()
                        await asyncio.sleep(3)

                # Now look for share button again
                try:
                    await share_button.wait_for(timeout=10000)
                    await share_button.click()

                    # Wait for the "Copy link" text to ensure dialog is open
                    # Look for input with the link
                    link_input = page.locator('input[readonly][value*="goo.gl"], input[readonly][value*="maps"]')
                    await link_input.wait_for(timeout=5000)
                    map_link = await link_input.get_attribute("value")

                    # Close dialog
                    await page.keyboard.press("Escape")
                except Exception as e:
                    # Fallback to current URL if it looks like a place URL
                    current_url = page.url
                    if "/maps/place/" in current_url:
                        map_link = current_url
                    else:
                        error_msg = "Could not find profile or share link"

            except Exception as e:
                error_msg = str(e)

            # Save result
            c = conn.cursor()
            c.execute("INSERT INTO results (job_id, row_index, original_data, map_link, error) VALUES (?, ?, ?, ?, ?)",
                      (job_id, index, json.dumps(row.to_dict()), map_link, error_msg))

            # Update job progress
            c.execute("UPDATE jobs SET processed_rows = ? WHERE id = ?", (index + 1, job_id))
            conn.commit()

            # Anti-blocking: Wait longer between rows
            await asyncio.sleep(random.uniform(5, 12))

        # Mark job as completed
        c = conn.cursor()
        c.execute("UPDATE jobs SET status = 'completed' WHERE id = ?", (job_id,))
        conn.commit()
        conn.close()
        await browser.close()

@app.post("/upload")
async def upload_csv(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    content = await file.read()
    from io import BytesIO
    try:
        df = pd.read_csv(BytesIO(content))
    except Exception as e:
         raise HTTPException(status_code=400, detail=f"Invalid CSV: {str(e)}")

    # Check required columns
    required_cols = ['Business Name', 'Address']
    if not all(col in df.columns for col in required_cols):
         raise HTTPException(status_code=400, detail=f"CSV must contain {required_cols}")

    job_id = str(uuid.uuid4())
    total_rows = len(df)

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO jobs (id, filename, status, total_rows, processed_rows, created_at) VALUES (?, ?, ?, ?, ?, ?)",
              (job_id, file.filename, 'processing', total_rows, 0, datetime.now().isoformat()))
    conn.commit()
    conn.close()

    background_tasks.add_task(scrape_task, job_id, df)

    return {"job_id": job_id}

@app.get("/job/{job_id}")
async def get_job_status(job_id: str):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT status, total_rows, processed_rows FROM jobs WHERE id = ?", (job_id,))
    job = c.fetchone()
    conn.close()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return {
        "status": job[0],
        "total_rows": job[1],
        "processed_rows": job[2]
    }

@app.get("/job/{job_id}/download")
async def download_results(job_id: str):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT original_data, map_link, error FROM results WHERE job_id = ? ORDER BY row_index", (job_id,))
    rows = c.fetchall()
    conn.close()

    if not rows:
        raise HTTPException(status_code=404, detail="No results found for this job")

    enriched_data = []
    for row in rows:
        data = json.loads(row[0])
        data['Google Maps Link'] = row[1]
        data['Error'] = row[2]
        enriched_data.append(data)

    df = pd.DataFrame(enriched_data)
    csv_content = df.to_csv(index=False)

    from fastapi.responses import Response
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=enriched_results_{job_id}.csv"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
