# Set up Google Analytics 4

## Create the GA4 web stream

1. After the domain is purchased and connected to the live Vercel site, sign in to [Google Analytics](https://analytics.google.com/) with the customer's Google account.
2. Create an account or property for the customer, then choose **Web** to create a data stream.
3. Enter the live website URL (for example, `https://example.com`) and a stream name, then create the stream.
4. Copy the stream's **Measurement ID** in the format `G-XXXXXXXXXX`. Do not use the numeric Property ID or a `GTM-...` ID.

## Connect the site to GA4

1. In Vercel, open the website project and go to **Settings → Environment Variables**.
2. Add `VITE_GA_MEASUREMENT_ID` with the copied `G-...` Measurement ID; enable it for **Production**.
3. Save the variable and redeploy the site so Vite includes it in the production build.
4. Open the live website in a new tab with ad blockers disabled. Analytics does not run in the local development server.

## Confirm visits are arriving

1. In Google Analytics, open **Reports → Realtime**.
2. Visit a few pages on the live site and check that the active-user count and page views appear; allow a few minutes for events to show.
3. Open **Pages and screens** to view page activity, or **Reports → Acquisition → Traffic acquisition** to view traffic sources after reports have processed.
4. If no activity appears, check the Measurement ID, Vercel Production environment, latest deployment, ad blockers, and any consent settings.

## Before enabling analytics

1. Confirm the customer's privacy notice covers Google Analytics and determine whether visitors must consent before tracking.
2. This site loads GA4 immediately when the Measurement ID is configured; it does not currently provide a consent banner or consent gating.
3. If consent is required, add consent handling before setting the Production Measurement ID.
