# Video Assignment Automation: Detailed Work Structure

This document outlines the logical prompt/structure used to drive the automation logic in this system.

## 1. Data Mapping Prompt
**Objective**: Associate every Content Calendar entry with a specific Video File and Editor.

**Logic**:
- **Input**: Current Date, Client Name, OneDrive Folder Path.
- **Search**: Scan the OneDrive folder for any files that **DO NOT** start with the prefix "Assigned-".
- **Selection**: Pick the first available unassigned video.
- **Assignment**: Identify the Editor mapped to that Client in the database.

## 2. Action Prompt (The "Bot" Logic)
**Objective**: Tag and Rename files to signify assignment.

**Logic**:
- **Rename Format**: `Assigned-[EditorName]-[OriginalFileName]`.
- **Database Update**:
  - Change Status from `PENDING` to `ASSIGNED`.
  - Store the OneDrive Web URL for the Editor to access easily.

## 3. Notification & Closure Prompt
**Objective**: Signal completion of the day's assignments.

**Logic**:
- **Daily Check**: If all Calendar entries for the current date (Before 10 AM IST) are processed and renamed, send a "Content Assignment Over" notification (Console/Log/Dashboard).
- **Manual Override**: If an Admin clicks "Sync", ignore the timer and process immediately.

## 4. Editor Dashboard Prompt
**Objective**: Provide a focused work view for the Editor.

**Logic**:
- Filter the Content Calendar to show only entries where `Client.editorId == CurrentUser.id`.
- Display a direct link to the renamed video on OneDrive.
- Provide a "Mark Complete" action to track progress.
