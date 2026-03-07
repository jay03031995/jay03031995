import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        # We can't easily run the Next.js server here without a full build and start
        # but we can check if the file exists and is valid.
        # Actually, I can try to start the dev server briefly.
        process = await asyncio.create_subprocess_exec(
            "npx", "next", "dev", "-p", "3001",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )

        await asyncio.sleep(15) # Wait for dev server to start

        try:
            await page.goto("http://localhost:3001/map-scraper")
            await page.screenshot(path="map_scraper_screenshot.png")
            print("Screenshot saved to map_scraper_screenshot.png")
            title = await page.title()
            print(f"Page title: {title}")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            process.terminate()
            await process.wait()
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
