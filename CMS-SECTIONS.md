# Reusable CMS sections

All fixed routes and CMS-created pages now render visible section instances in
the database's `sortOrder`. The editor's existing up/down buttons persist that
order. Newly inserted sections can move above existing sections, including heroes.

`CmsPageLayout` loads published section content. `CmsSection` selects the authored
view for the template instead of replacing carousels and other layouts with
generic cards. The authored markup is identified by `data-cms-template` in the
page modules; the containing source page is not mounted. Its CSS classes, image
rules and client component imports therefore stay with the selected view.

`section-context.js` uses request-local asynchronous context to bind each view
to one section's blocks. Duplicate templates can render concurrently without
reading another instance's content. Hidden sections are excluded, and edits
still respect the existing block publication rules.

To add a new visual template, register its source view in `CmsSection` and mark
that view with `data-cms-template`. Keep interactive behavior in a component
with instance-local refs. Shared CSS is loaded by the site layout; raw CSS or
JavaScript does not need to be pasted into CMS content fields.

Section IDs are namespaced. Hero scroll buttons follow the next rendered section,
and reveal animations register sections that arrive through server streaming.

Validation: `node --test tests/cms-sections.test.mjs` checks ordering, hidden
sections, duplicate-instance isolation and authored view selection. After a
production build, `node scripts/verify-cms-layout.mjs` checks all published pages
against their saved visible section order using read-only database queries.
