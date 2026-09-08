# CMS production checks

Login and public CMS content both depend on MongoDB. Public pages already use
`force-dynamic`; failed database reads show default content. Look for `[cms-auth]`
and `[cms-data]` in the server runtime logs, not the browser console.

## Deployment configuration

In the Vercel project that serves cloudheard.org, check the **Production** scope:

- `MONGODB_URI`: use the same cluster AND database name as the working CMS.
  A local `.env` file is ignored by Git and is not deployed as Vercel configuration.
- `AUTH_SECRET`: set a stable secret. Do not regenerate it on every deployment.
- `AUTH_URL`: `https://cloudheard.org`, not localhost.
- `NEXT_PUBLIC_APP_URL`: `https://cloudheard.org`.
- `CMS_DEV_BYPASS`: `false`.
- Cloudinary: set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and
  `CLOUDINARY_API_SECRET` for media uploads.

Confirm the project root is `chc-website` if the connected repository contains
that folder. Deploy the latest source with `npm run build`, which generates the
MongoDB Prisma client before building Next.js. Redeploy after changing variables.

MongoDB must accept connections from the deployment's network, and the database
user needs read/write access to the selected database. Check Atlas Network Access
and Database Access if server diagnostics report connection or authentication errors.

## Read-only database check

Run `npm run cms:check` in an environment with the intended database variables.
It reports a database fingerprint, active admin count, published page/block counts,
and connection timing. It never writes records or prints connection strings.
Externally supplied variables take precedence over local environment files.

Compare the fingerprint in the working environment and deployment environment.
A check on your laptop does not verify that Vercel can reach the database.
If the fingerprint differs, the environments target different databases.
If there are no admins or published pages, first verify the selected database;
do not reseed or overwrite the working content to troubleshoot a connection problem.

## Verify after deployment

1. Sign in at `https://cloudheard.org/admin/login`.
2. If it fails, expand the `/api/auth/callback/credentials` runtime entry and
   inspect `[cms-auth]`: it reports safe error type/code/reason and whether the
   database URI and authentication secret are configured.
3. Confirm the page is published, its section is visible, and the edited block
   is published. Saving an intentionally unpublished block does not publish it.
4. Save a content change and reload its public page. If defaults appear, inspect
   `[cms-data]`. Cold database reads now have 12 seconds rather than 2.5 seconds.

The workspace database check found 1 active admin, 10 published pages, and 500
published blocks. The initial read took approximately 6.5 seconds. This confirms
the workspace database contains CMS data, but does not establish Vercel's settings.
