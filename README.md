# TactSpaces

React 19 + TypeScript, Vite, and Tailwind CSS 4. This is a styling-preserving migration of the original five-page HTML site, not a redesign.

## Run locally

Requires Node.js 22.12+.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Other commands:

```sh
npm run typecheck
npm test
npm run build
npm run preview
```

Deploy the generated `dist/` folder. Vite builds the five main pages and pre-renders each published project at `/projects/<slug>/index.html`. Existing links (`anatomy.html`, `standard.html`, `command-center.html`, and `studio.html#team`) still work without rewrite rules or a client-side router. The static host should serve directory indexes, not rewrite unknown project URLs to the homepage. Serve through Vite or a web server rather than opening the HTML shells as local files.

## Lead capture (Google Sheets)

Command Center can save enquiries to a client-owned Google Sheet using Apps Script,
with no additional paid service. Follow [the setup guide](docs/lead-capture.md) and
paste [`scripts/google-sheets-leads.gs`](scripts/google-sheets-leads.gs) into the
client Sheet's Apps Script editor. Set `VITE_GOOGLE_APPS_SCRIPT_URL` in the build
environment and rebuild. Until configured, submission is safely disabled; it does
not show a demo confirmation. Live Google deployment/browser checks are required
before accepting real leads.

## Google Analytics

GA4 is wired into every page, including pre-rendered project pages. To enable it, set one environment variable in the hosting provider's **build environment**, then rebuild and redeploy:

```dotenv
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Ask the client for their GA4 **web stream Measurement ID**, found in Google Analytics → Admin → Data streams → their website. This is a public `G-...` identifier, not a numeric property ID, `GTM-...` container ID, API secret, or service-account credential. No other credentials or code changes are needed.

- Missing, blank, or malformed IDs disable analytics without loading Google's script.
- Analytics only runs in production builds, not `npm run dev`. For a local check, copy `.env.example` to `.env.local`, fill in the ID, then run `npm run build` and `npm run preview`. These preview visits will reach the configured property.
- Page views are automatic on each document load; additional automatic events depend on the web stream's Enhanced Measurement settings. No custom lead-conversion events are configured. Do not treat automatic form events as proof that an enquiry was saved.
- Verify a deployed visit in GA4's **Realtime** report with ad blockers disabled. Changing the variable requires another build and deployment; setting it on an already-built static site has no effect.

**Consent:** When configured, this integration loads GA4 immediately and allows its standard cookies. It does not include a consent banner or consent-management integration. Before enabling it, the client must confirm their privacy notice and any consent requirements for their audience; where prior consent is required, add consent gating first.

## Structure

```text
archive/html/          Original, byte-for-byte HTML files; open index.html here for the old site
src/app/<page>/        React page, entry point, original page-specific CSS, and local components
src/components/       Shared navigation/footer/layout and the project planner
src/constants/        Navigation and planner options
src/content/projects/ One JSON file per project, including listing-only projects
plugins/              Project content validation and static page generation
src/hooks/            Scroll and reveal effects with cleanup
src/assets/           Original logo extracted from the embedded PNG
src/styles/           Tailwind integration and matching theme tokens
src/test/             DOM-based interaction and content/style regression tests
```

The original CSS declarations, fonts, responsive breakpoints, layout, hover effects, and animation timings are retained in each page's stylesheet. They are in Tailwind's `components` layer. Shared typography and spacing refinements live in `src/styles/typography-spacing.css`, in a `refinements` layer above page styles and below utilities. Tailwind Preflight is intentionally omitted to avoid changing the original reset. Google Fonts remains an external dependency, as before.

The archive is source-only and is not bundled into production. Do not edit archived HTML when changing the React application.

## Existing placeholders

- Lead capture requires the client-owned Apps Script deployment and a configured build URL; see [the setup guide](docs/lead-capture.md).
- The studio's “Download Profile (PDF)” link still points to `#`; no PDF was supplied.
- Existing geometric image placeholders are retained. Projects without details appear as non-clickable cards instead of dead links.

## Projects

All eight portfolio cards are defined in `src/content/projects/*.json`. Three currently include a `details` object and receive individual pages; the other five remain visible as listing-only cards. The homepage uses projects marked `"featured": true` from the same content source. Old anatomy-page case-study fragments redirect to the corresponding project page.

To add or edit projects, see [the project content guide](docs/project-content.md). Content changes require a rebuild for deployment; no route or React component needs to be added. Invalid JSON content and missing local image files fail the build.
