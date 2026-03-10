# Microsoft Graph API Setup Instructions

To enable OneDrive automation, you must register an application in the Microsoft Entra admin center (formerly Azure AD).

## 1. Register the Application
1. Go to the [Microsoft Entra admin center](https://entra.microsoft.com/).
2. Navigate to **Identity > Applications > App registrations > New registration**.
3. **Name**: Video Automation Bot (or similar).
4. **Supported account types**: "Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant)".
5. Click **Register**.

## 2. Configure Credentials
1. In your app page, go to **Certificates & secrets > Client secrets > New client secret**.
2. Add a description and expiration. Click **Add**.
3. **IMPORTANT**: Copy the **Value** (not Secret ID). This is your `ONEDRIVE_CLIENT_SECRET`.

## 3. Configure Permissions
1. Go to **API permissions > Add a permission**.
2. Select **Microsoft Graph**.
3. Select **Application permissions**.
4. Search for and add:
   - `Files.ReadWrite.All` (To rename and list files).
   - `Sites.ReadWrite.All` (If using SharePoint folders).
5. Click **Grant admin consent for [Your Org]** (Requires Admin status).

## 4. Environment Variables
Add these to your Render environment or `.env` file:
- `ONEDRIVE_CLIENT_ID`: Found on the **Overview** page (Application ID).
- `ONEDRIVE_TENANT_ID`: Found on the **Overview** page (Directory ID).
- `ONEDRIVE_CLIENT_SECRET`: The secret value from Step 2.
