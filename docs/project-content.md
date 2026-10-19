# Project content

Add one file at `src/content/projects/<slug>.json`. The filename and `slug` must match. All projects appear in the portfolio, sorted by `order` (then slug). Set `featured` to `true` to also show a project on the homepage.

## Listing-only project

Omit `details` entirely when a project has no individual page. Its card remains visible and filterable, but is not a link. No detail HTML is generated. Do not use `"details": null` or an empty object.

```json
{
  "slug": "new-studio",
  "order": 9,
  "name": "New Studio",
  "category": "commercial",
  "location": "Bengaluru",
  "duration": "2 months",
  "area": "2,000 sq. ft.",
  "scope": "Design & Execution",
  "cover": { "kind": "placeholder", "preset": "studio" }
}
```

Categories: `commercial`, `residential`, `hospitality`. Optional card fields: `featured` (boolean) and `status` (for example, `"Ongoing"`, shown instead of duration).

## Publish a detail page

Add a `details` object to the same file. A summary and at least one stat are required. Sections are optional and render in the exact order supplied; omit any section you do not have content for.

```json
"details": {
  "summary": "Your project overview.",
  "stats": [
    { "value": "2,000", "label": "Sq. Ft." },
    { "value": "2", "label": "Months to Handover" }
  ],
  "sections": [
    {
      "type": "hero",
      "media": { "kind": "placeholder", "preset": "hero" },
      "callouts": [
        { "top": "20%", "left": "30%", "text": "Material description" }
      ]
    },
    {
      "type": "timeline",
      "stages": [
        {
          "label": "Day 1",
          "title": "Raw Site",
          "description": "Describe this project stage.",
          "media": { "kind": "placeholder", "preset": "raw-commercial" }
        }
      ]
    },
    { "type": "comparison" },
    { "type": "testimonial", "quote": "The client's actual words.", "author": "Client name" }
  ]
}
```

The page is generated at `/projects/new-studio/`. Removing `details` unpublishes the page on the next build while retaining the card. Deploy the complete new `dist/` output rather than merging it over older project files.

## Images

Place images inside `public/images/projects/<slug>/`. Replace a cover or section's `media` with:

```json
{ "kind": "image", "src": "/images/projects/new-studio/finished.jpg", "alt": "Describe the finished space" }
```

Root-relative image paths must point to existing files inside `public/`. HTTPS image URLs are also supported, but their availability is not checked during builds. Alt text is required.

For a real comparison, supply **both** images:

```json
{
  "type": "comparison",
  "before": { "kind": "image", "src": "/images/projects/new-studio/before.jpg", "alt": "Space before renovation" },
  "after": { "kind": "image", "src": "/images/projects/new-studio/after.jpg", "alt": "Space after renovation" }
}
```

`{ "type": "comparison" }` retains the existing geometric comparison placeholder. Omit the section entirely if no comparison should appear.

Available placeholder presets: `studio`, `residence`, `hotel`, `vimal`, `manjunath`, `arun`, `manikantan`, `office`, `hero`, `raw-commercial`, `raw-residential`, `structure`, `finishes-commercial`, `finishes-residential`, `handover`, `pending`. These preserve the original site's placeholder artwork; new real imagery does not need a new preset.

## Validation and publishing

Run `npm test` and `npm run build`. The build checks required fields, supported section types, slug/filename consistency, duplicate legacy anchors, and local image paths. The generated HTML includes the full case study, project-specific title and description, shared navigation/footer, and interactive timeline/callout/comparison components. No backend, client-side router, or per-project HTML source file is required.

`legacyAnchor` is optional and only needed to preserve an old `/anatomy.html#...` bookmark. New projects can omit it.
