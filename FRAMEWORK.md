# Video Assignment Automation Framework

This framework automates the process of assigning client videos from OneDrive to editors based on a daily content calendar.

## Architecture

### 1. Data Layer (Prisma)
- **Client Model**: Links clients to specific OneDrive folders and assigned Editors (Users).
- **ContentCalendar Model**: Tracks daily video topics, platforms, and assignment status.

### 2. Integration Layer (Microsoft Graph API)
- **Service**: `src/lib/onedrive.ts`
- **Functionality**:
  - Authenticates with Microsoft using MSAL.
  - Scans client OneDrive folders for new videos.
  - Renames files to `Assigned-[EditorName]-[FileName]`.
  - Records the OneDrive Web URL back to the database.

### 3. User Interface (Next.js App Router)
- **Admin Dashboard** (`/admin/calendar`, `/admin/clients`):
  - Manage client-editor mappings.
  - Schedule daily content.
  - Trigger manual "Sync Now" for immediate assignment.
- **Editor Dashboard** (`/editor/dashboard`):
  - View personalized daily assignments.
  - Direct links to assigned videos on OneDrive.
  - "Complete" status tracking.

### 4. Automation Layer
- **Cron Job**: `scripts/cron-sync.ts`
- **Schedule**: Runs daily at 10 AM IST (04:30 UTC).
- **Process**: Iterates through all tenants and processes pending calendar entries.

## Configuration
Requires the following environment variables:
- `DATABASE_URL`: PostgreSQL connection string.
- `ONEDRIVE_CLIENT_ID`: Azure App Client ID.
- `ONEDRIVE_CLIENT_SECRET`: Azure App Client Secret.
- `ONEDRIVE_TENANT_ID`: Azure Tenant ID.
