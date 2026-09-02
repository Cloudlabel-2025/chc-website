# CHC CMS phase audit

Audited against the repository on 2026-09-02. “Partial” means useful implementation exists, but one or more stated acceptance criteria are not met or are not evidenced.

| Phase | Status | Evidence and remaining gaps |
|---|---|---|
| 0 — source verification | Partial | The ten required public routes exist and an asset inventory exists. There is no checked-in, source-derived section/prop report or corrected fixed-vs-dynamic matrix. The oversized logo/spinner were re-encoded, but the requested pre-build Phase 0 report is absent. |
| 1 — Prisma schema | Partial | Normalized `Page` → `Section` → typed `ContentBlock`, media, auth, navigation, footer, SEO, submissions and audit models exist with migrations and seed data. The requirement's dedicated repeatable models and form-definition models are absent; audit ownership fields are not present on every content entity. Fresh-database migration/smoke-query evidence is absent. |
| 2 — authentication | Partial | Auth.js credentials, bcrypt, server-side route/service authorization and database-backed login throttling exist. Sessions use JWT despite the explicit database-session requirement; the `Session` table is unused. No authentication integration tests exist. |
| 3 — media backend | Partial | S3-compatible storage, metadata, reference checks and server-side raster inspection exist. Phase 10 now rejects SVG and spoofed/invalid raster bytes. Provider-failure and upload-boundary integration tests are still absent. |
| 4 — CMS backend | Partial | Admin APIs and service modules exist and import central field rules/schemas. Generic section/block operations do not fully prove the complete permission matrix, and there are no API tests for every forbidden operation. |
| 5 — admin UI | Partial | Dashboard, page editor, locked indicators, media, navigation, footer, SEO, settings and submissions screens exist. There is no authenticated draft-preview route, no form-definition editor, and no interaction/accessibility test suite. Reorder controls are button-based rather than the specified drag-reorder UI. |
| 6 — public DB wiring | Partial | Public pages read published content with hardcoded graceful fallbacks; Phase 10 added the missing parent-page `isPublished` condition. Pixel-diff evidence and ISR/revalidation verification are absent, and substantial fallback content remains in source. |
| 7 — migration | Partial | Seed extraction/content data and `migrate-media.mjs` exist. The required `scripts/migrate-content` extractor and a checked content/media diff are absent. |
| 8 — validation pass | Partial | Central field rules, generated Zod schemas and server validation exist. Boundary/fuzz/API-bypass coverage is absent. |
| 9 — testing | Not complete | The repository previously had no test suite or CI configuration. Phase 10 adds focused hardening tests only; full unit/integration/e2e, accessibility and visual regression coverage is still required. |
| 10 — production hardening | Implemented, deployment verification pending | CSP/HSTS and other headers, no-store admin responses, same-origin mutation checks, middleware auth/role enforcement for admin APIs, PostgreSQL-backed public-form throttling, safe env documentation, raster content checks, published-only public reads, and automated tracked-secret/security checks are implemented. Apply the new DB migration and test against the real production proxy/storage/database before release. |

## Security checklist result

- Passwords: bcrypt hashes; seed does not contain a usable plaintext password.
- Server authorization: admin pages, admin APIs and service-layer mutations are protected.
- Secrets: local env files are ignored; `.env.example` contains placeholders; automated tracked-file scanning was added.
- Uploads: JPEG/PNG/WebP only, with extension/MIME, byte signature/dimensions and size checks. SVG is rejected because no sanitizer is installed.
- Rich text: no arbitrary rich-text HTML rendering path was found; no generic HTML/JS editor is exposed.
- SQL injection: Prisma parameterization/tagged templates are used, including the atomic limiter upsert.
- Draft isolation: sections, blocks, SEO and their parent pages must be published/visible for public reads.
- Referenced media: normal deletion is blocked while referenced; forced deletion remains an explicit admin-only action.

## Release gates

1. Set a valid production `DATABASE_URL`, `AUTH_SECRET`, storage credentials and canonical URL; set `AUTH_TRUST_HOST=true` only behind the trusted production proxy.
2. Run `npm run db:migrate` before deploying the application code.
3. Run `npm test`, `npm run security:audit`, `npx prisma validate`, and `npm run build` in CI.
4. Complete the Phase 0 report and Phases 1–9 gaps above before claiming the entire specification is complete.
