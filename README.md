# TactSpaces

Next.js 16 + React 19, TypeScript, and Tailwind CSS 4. The design and content are preserved, with the main pages server-rendered and project case studies statically generated for search engines.

## Run locally

Requires Node.js 22.12+.

```sh
pnpm install
pnpm dev
```

Open the local URL printed by Next.js. Other commands:

```sh
pnpm typecheck
pnpm test
pnpm build
pnpm start
```

Deploy with Vercel's Next.js preset or run `pnpm build` followed by `pnpm start`. The homepage, information pages, and published `/projects/<slug>/` pages are pre-rendered as HTML at build time. Legacy `.html` paths permanently redirect to clean URLs. `sitemap.xml` and `robots.txt` are generated from the published project data.

For a Squarespace domain hosted on Vercel while keeping DNS at Squarespace, follow the [domain setup guide](docs/domain-setup.md).

## Lead capture (Google Sheets)

Command Center can save enquiries to a client-owned Google Sheet using Apps Script,
with no additional paid service. Follow [the setup guide](docs/lead-capture.md) and
paste [`scripts/google-sheets-leads.gs`](scripts/google-sheets-leads.gs) into the
client Sheet's Apps Script editor. Set `NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL` in the build
environment and rebuild. Until configured, submission is safely disabled; it does
not show a demo confirmation. Live Google deployment/browser checks are required
before accepting real leads.

## Google Analytics

GA4 is wired into every page, including pre-rendered project pages. After the live domain is connected, follow the [GA4 setup guide](docs/google-analytics.md) to create a web stream, configure `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel, redeploy, and verify visits in Realtime.

Missing or invalid Measurement IDs leave analytics disabled. The site sends page views automatically; no custom lead-conversion events are configured. Confirm privacy and consent requirements before enabling tracking.

## Structure

```text
archive/html/          Original, byte-for-byte HTML files; open index.html here for the old site
src/app/              Next.js App Router pages, metadata, sitemap, and global stylesheet
src/components/       Shared navigation/footer/layout and the project planner
src/constants/        Navigation and planner options
src/content/projects/ One JSON file per project, including listing-only projects
src/hooks/            Scroll and reveal effects with cleanup
src/assets/           Original logo extracted from the embedded PNG
src/test/             DOM-based interaction and content/style regression tests
```

Page and component presentation uses Tailwind utilities colocated with JSX. `src/app/globals.css` loads Tailwind, shared theme tokens, the preserved base reset, and a few CSS-only motion/accessibility effects. Shared typography and spacing refinements remain in `src/styles/typography-spacing.css`, in a `refinements` layer below utilities. Tailwind Preflight is intentionally omitted to avoid changing the original reset. Google Fonts remains an external dependency, as before.

The archive is source-only and is not bundled into production. Do not edit archived HTML when changing the React application. Routes live in `src/app/**/page.tsx`; generated HTML in `.next/` or the deployment output is a build artifact, not a route source file.

## Existing placeholders

- Lead capture requires the client-owned Apps Script deployment and a configured build URL; see [the setup guide](docs/lead-capture.md).
- The studio profile CTA requests the profile by email; no PDF was supplied.
- Existing geometric image placeholders are retained. Projects without details appear as non-clickable cards instead of dead links.

## Projects

All eight portfolio cards are defined in `src/content/projects/*.json`. Three currently include a `details` object and receive individual pages; the other five remain visible as listing-only cards. The homepage uses projects marked `"featured": true` from the same content source. Old anatomy-page case-study fragments redirect to the corresponding project page.

To add or edit projects, see [the project content guide](docs/project-content.md). Content changes require a rebuild for deployment; no route or React component needs to be added. Invalid JSON content and missing local image files fail the build.
