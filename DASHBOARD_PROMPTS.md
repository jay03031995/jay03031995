# Dashboard Creation Prompts (Detailed)

Use these detailed prompts to recreate or enhance the dashboard screens in this system.

## 1. Admin: Client Management Dashboard
**Role**: Admin
**Goal**: Link clients to editors and OneDrive folders.

**Prompt**:
> Create a React (Next.js) dashboard page for managing 'Clients'. The screen should include:
> - **Grid View**: Display cards for each client showing the Client Name, the assigned OneDrive folder path (e.g., 'Clients/ClientA'), and the assigned Editor's name.
> - **'Add Client' Modal**: A form to input:
>   - Client Name (String)
>   - OneDrive Folder Path (String - used by the bot to find videos)
>   - Editor Selection (Dropdown - list of users with the 'EDITOR' role)
> - **Visual Style**: Clean, modern cards using Tailwind CSS, including icons for 'Folder' and 'User' (e.g., from Lucide-React).

## 2. Admin: Content Calendar & Sync Dashboard
**Role**: Admin
**Goal**: Schedule video content and trigger the automation bot.

**Prompt**:
> Create a 'Content Calendar' dashboard page with a focus on automation:
> - **Date Filter**: A date picker to view scheduled videos for a specific day.
> - **Action Header**:
>   - A 'Sync Now' button with a loading/spinning icon to manually trigger the OneDrive assignment bot.
>   - An 'Add Entry' button to schedule new video topics.
> - **Calendar Table**: Columns for:
>   - Client Name
>   - Video Topic (e.g., 'Benefits of Retinol')
>   - Platform (Dropdown: Instagram, YouTube, TikTok)
>   - Status (Badge: PENDING, ASSIGNED, COMPLETED)
>   - Assigned Editor
> - **Logic**: When 'Sync' is clicked, call the `/api/admin/sync` endpoint and show a success toast indicating how many videos were renamed and assigned.

## 3. Editor: Task Assignment Dashboard
**Role**: Editor
**Goal**: View and access assigned video files.

**Prompt**:
> Create a simplified dashboard for 'Editors' to manage their daily tasks:
> - **Personalized View**: Automatically filter the list to show only videos assigned to the logged-in user.
> - **Task Cards**: Each card should show:
>   - Client Name and Date.
>   - Video Topic and Platform.
>   - **Action: 'Open Video'**: A button that opens the OneDrive Web URL in a new tab.
>   - **Action: 'Complete'**: A button to mark the task as done, changing the status to COMPLETED and showing a success toast.
> - **Empty State**: A helpful message ("No videos assigned yet") with a dashed border if the editor has no tasks today.

## 4. Navigation & Layout
**Prompt**:
> Create two distinct sidebar layouts:
> - **Admin Sidebar**: Links for Dashboard, Posts, Clients, and Calendar.
> - **Editor Sidebar**: A minimal layout with a link to 'My Assignments' and a Sign Out button.
> Ensure both layouts handle authentication checks to redirect unauthorized users to the login page.
