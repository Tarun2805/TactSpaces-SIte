# Command Center → Google Sheets

The existing four-step planner sends enquiries to a client-owned Google Sheet
using a Google Apps Script web app. No paid form service, separate server,
database, or automation subscription is required. Google account storage and
[Apps Script quotas](https://developers.google.com/apps-script/guides/services/quotas)
still apply. This is intended for a low-volume enquiry form, not a high-volume CRM.

## 1. Set up the client's Sheet

Do this while signed into the **client's Google account**, so they own both the
data and the deployment. Do not create a publicly shared spreadsheet.

1. Create a Google Sheet, for example **TactSpaces Leads**.
2. Open **Extensions → Apps Script**.
3. Replace the starter code with the entire contents of
   [`scripts/google-sheets-leads.gs`](../scripts/google-sheets-leads.gs).
4. At the top, set `LEAD_CONFIG.allowedOrigins` to the actual website origins.
   The supplied values are `https://tactspaces.in` and `https://www.tactspaces.in`;
   confirm these match the deployed site. Use origins only—no path or trailing `/`.
   If testing locally, temporarily add the exact Vite origin, for example
   `http://localhost:5173`. For `npm run preview`, typically add
   `http://localhost:4173`. Remove test origins before the final deployment.
5. Leave `notificationEmail: ''` for Sheets-only capture. Optionally enter the
   team's email address for one notification per new lead. Email has a separate
   Google sending quota; notification failure does not discard a saved lead.
6. Save, select **setupLeadSheet**, and click **Run**. Authorize the requested
   permissions using the client account. If Google shows an unverified-app
   warning, only continue after confirming this is the script you just created;
   follow the client's Workspace policy. Visitors must never have to authorize it.

`setupLeadSheet` creates a **Website Leads** tab and remembers the spreadsheet ID
in server-side Script Properties. It does not overwrite an existing tab's data.
If the same tab exists with different headers, it stops rather than replacing it.

Columns, in order:

| Saved automatically | Managed by the team |
|---|---|
| Received at, Submission ID, Payload hash | Status (starts as **New**) |
| Full name, Phone, Email, Project location | Assigned to |
| Project type, Other project type, Scope, Timeline | Next follow-up |
| Budget (INR lakh) | Notes |

Keep the header names and column order unchanged. Hide **Submission ID** and
**Payload hash** if desired; they prevent duplicate rows after uncertain retries.
Use filter views instead of sorting only part of a row. Set the Sheet's timezone
under **File → Settings** and the script timezone under **Project Settings** to
the client's timezone (for example, Asia/Kolkata).

## 2. Deploy the Apps Script

1. Click **Deploy → New deployment → Web app**.
2. Set **Execute as: Me** (the client account).
3. Set **Who has access: Anyone**, including signed-out visitors. **Anyone with a
   Google account** is not sufficient. Workspace administrators can prohibit
   public web apps; if this option is missing, ask the client's administrator.
4. Click **Deploy**, authorize if prompted, and copy the **Web app URL** ending
   in `/exec`. Do not use the `/dev` test URL or a redirected googleusercontent URL.

The public URL accepts submissions; it does **not** make the Sheet public or
offer a way to read leads. Share the Sheet privately with the discovery team.

After editing script code or configuration, use **Deploy → Manage deployments →
Edit → New version → Deploy** to update the existing deployment. Saving the file
alone does not update the public `/exec` version. Updating the existing deployment
preserves its URL; a new deployment requires updating the website environment.

## 3. Configure and rebuild the website

For local testing, copy `.env.example` to `.env.local` and fill in:

```dotenv
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Set the same variable in the hosting provider's **build environment**, then
rebuild and redeploy the static website. It is a public endpoint, not a secret.
No Google password, OAuth token, service-account key, or Sheet edit link belongs
in website code or a `VITE_` variable.

If the URL is missing or malformed, the planner still works but the final submit
button is disabled and displays the existing contact number instead of faking
delivery. Restart Vite after changing local environment variables.

If the host sets a Content Security Policy, allow:

- `form-action`: `https://script.google.com`
- `frame-src` (or the applicable `child-src` fallback):
  `https://script.google.com https://*.googleusercontent.com`

Do not weaken unrelated CSP directives. Sites embedded inside another site are
not supported: the confirmation is addressed to the top-level website window.

## How submission and confirmation work

The browser POSTs a hidden native form to a hidden iframe. Apps Script validates
the fields, appends a row under a script lock, flushes the write, and returns a
small HTML response. Google's sandbox sends a `postMessage` confirmation to the
configured website origin. The website checks Google's sender origin and the
random submission ID before showing **Received**.

This avoids adding a CORS proxy or another hosted service. We do **not** use
`fetch(..., { mode: 'no-cors' })`, treat an iframe's `load` as proof of saving, or
show success just because the user clicked submit.

- Submitting disables the form to prevent double-clicks.
- After 45 seconds without confirmation, input is retained and a retry is offered.
- Retrying unchanged details reuses the Submission ID. If the first write already
  succeeded, the script confirms it instead of appending another row.
- Editing the details creates a new ID. Do not change details after a timeout
  unless you intend a new enquiry. Reloading the page also creates a new ID;
  contact details and IDs are not persisted in browser storage.
- Optional email notifications contain a private Sheet link, not contact details.
- The success screen retains the client's existing promise of a call within
  24 hours. The team must be prepared to meet it; the script does not schedule calls.

## Protection and limits

Both the website and script validate contact fields, project options, and budget.
The script rejects the honeypot field, includes a basic timing check, escapes
formula-like text, verifies the column schema, and applies a best-effort shared
limit of 20 new leads/minute. Retries of a saved ID do not consume this allowance.
Changing a saved ID's payload is rejected. No contact data is logged deliberately.

**The endpoint is public.** The origin field and honeypot are not authentication,
and the burst limit is not a full bot defence. An attacker can forge requests or
consume Google execution quotas. If abuse occurs, add a free CAPTCHA with
server-side verification or rotate the deployment and investigate. There is no
paid-service SLA. Google may take several seconds to respond or reject requests
when quotas are reached; the site must not promise a save without confirmation.

Keep Sheet access restricted and agree a lead-retention period with the client.
The form explains that details are used to respond to the enquiry. The client
should also confirm their privacy notice covers Google-hosted lead storage.

## Go-live checks (required on the real deployment)

1. Open the deployed Command Center in a signed-out/private browser session.
2. Submit a lead using a distinctive test name. Confirm exactly one row contains
   all fields, the selected budget in **lakh**, and Status **New**.
3. Confirm **Received** appears only after the row is saved. If enabled, check the
   notification inbox and spam folder; email arrival is separate from saving.
4. Test **Other**, back navigation, missing fields, invalid email/phone, and a
   phone beginning with `+91`. Check the phone remains text and retains `+`.
5. Test a formula-like name such as `=1+1` and confirm it is literal text, not a
   formula. Delete test rows afterwards only when no requests are in flight.
6. Test offline/failure behaviour and retry an uncertain submission without
   editing it. Check there is no duplicate Submission ID.
7. Test Chrome, Safari, and mobile browsers, including tracking-protection modes.
   Google's iframe/sandbox behaviour and Workspace restrictions require this
   deployed-browser check; unit tests cannot verify Google's live service.
8. Remove local test origins, deploy a new script version, and recheck production.

### Troubleshooting

- **Submit disabled:** confirm the build contains a valid `/exec` URL, then rebuild.
- **Timeout / no execution appears:** check the deployment URL, public access,
  network connection, content blockers, and host CSP. The returned Google HTML
  must be allowed inside the hidden frame.
- **Execution appears but no row:** inspect Apps Script **Executions** for errors;
  rerun `setupLeadSheet` if needed, check headers and permissions, and ensure the
  active deployment uses the latest version. Check the allowed origin exactly.
- **Row saved but website times out:** check iframe blocking and the configured
  origin/confirmation path. Retry unchanged details; don't switch to fake success.
- **No email:** the Sheet is authoritative. Check `notificationEmail`, permissions,
  quota, and spam filtering. Do not resubmit a saved lead just to resend email.
- **Moving ownership/accounts:** redeployment and authorization may be required.
  Keep the deployment under the client account from the start.
