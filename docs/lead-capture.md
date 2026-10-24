# Connect the enquiry form to Google Sheets

## Create and connect the Sheet

1. Sign in to the account that should own the leads, create a Google Sheet, then open **Extensions → Apps Script**.
2. Replace the editor contents with [`scripts/google-sheets-leads.gs`](../scripts/google-sheets-leads.gs).
3. Check `LEAD_CONFIG.allowedOrigins` includes each live website origin, with no path or trailing slash.
4. Save, select `setupLeadSheet`, click **Run**, and approve the requested permissions.
5. Keep the Sheet private; share it only with the people who handle enquiries.

## Deploy the Apps Script

1. In Apps Script, click **Deploy → New deployment → Web app**.
2. Set **Execute as** to your account and **Who has access** to **Anyone**.
3. Click **Deploy**, authorize if prompted, and copy the Web app URL ending in `/exec`.

## Connect the website

1. Set `VITE_GOOGLE_APPS_SCRIPT_URL` to the `/exec` URL in the hosting provider's build environment.
2. For local development, set the same variable in `.env.local` and restart Vite.
3. Rebuild and redeploy the website after changing its environment variable.
4. Submit a test enquiry on the live site and confirm it appears once in the Sheet.

## Redeploy after changing the script

1. Update the Apps Script code or configuration and click **Save**.
2. Click **Deploy → Manage deployments**, select the web app, then click **Edit**.
3. Select **New version** and click **Deploy**. The existing `/exec` URL stays the same.
4. Submit a test enquiry on the live site and confirm it appears once in the Sheet.

## Change the website origin allowlist

1. Add the exact origin to `LEAD_CONFIG.allowedOrigins` in the Apps Script editor and in [`scripts/google-sheets-leads.gs`](../scripts/google-sheets-leads.gs).
2. Save and redeploy the Apps Script using the steps above.
3. Rebuild and redeploy the website if its code changed, then test an enquiry from that origin.

## Troubleshoot a failed submission

1. Confirm the website has a valid `/exec` URL and the Apps Script deployment allows **Anyone**.
2. Confirm the live website origin exactly matches an entry in `allowedOrigins`.
3. In Apps Script, open **Executions** and check for errors; verify the Sheet headers have not been changed.
4. Retry the same enquiry without editing its details; confirm the Sheet contains only one row for it.
