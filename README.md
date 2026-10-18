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

Deploy the generated `dist/` folder. Vite builds all five HTML entry points, so existing links and bookmarks (`anatomy.html`, `standard.html`, `command-center.html`, and `studio.html#team`) still work without rewrite rules or a client-side router. Serve through Vite or a web server rather than opening the new HTML shells as local files.

## Structure

```text
archive/html/          Original, byte-for-byte HTML files; open index.html here for the old site
src/app/<page>/        React page, entry point, original page-specific CSS, and local components
src/components/       Shared navigation/footer/layout and the project planner
src/constants/        Navigation and planner options
src/hooks/            Scroll and reveal effects with cleanup
src/assets/           Original logo extracted from the embedded PNG
src/styles/           Tailwind integration and matching theme tokens
src/test/             DOM-based interaction and content/style regression tests
```

The original CSS declarations, fonts, responsive breakpoints, layout, hover effects, and animation timings are retained in each page's stylesheet. They are in Tailwind's `components` layer so utilities can override them predictably. Tailwind Preflight is intentionally omitted to avoid changing the original reset. Google Fonts remains an external dependency, as before.

The archive is source-only and is not bundled into production. Do not edit archived HTML when changing the React application.

## Existing placeholders

- The project planner retains the original **demo-only** confirmation screen. It does not transmit or save enquiries; the confirmation copy is not evidence of delivery. A backend must be connected before collecting real leads.
- The studio's “Download Profile (PDF)” link still points to `#`; no PDF was supplied.
- Existing geometric image placeholders and incomplete project links are unchanged.
