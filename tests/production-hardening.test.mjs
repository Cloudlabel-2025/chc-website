import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('required production security headers are configured', () => {
  const config = readFileSync('next.config.js', 'utf8')
  for (const header of ['Content-Security-Policy', 'Strict-Transport-Security', 'X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy', 'Permissions-Policy']) assert.match(config, new RegExp(header))
  assert.doesNotMatch(config, /X-XSS-Protection/)
})
test('admin APIs are protected and mutations require same origin', () => {
  const middleware = readFileSync('middleware.js', 'utf8')
  assert.match(middleware, /\/api\/admin/)
  assert.match(middleware, /Invalid request origin/)
  assert.match(middleware, /ADMIN.*SUPER_ADMIN/s)
})
test('public form rate limiting uses an atomic MongoDB counter', () => {
  const limiter = readFileSync('lib/cms/form-rate-limit.js', 'utf8')
  assert.match(limiter, /prisma\.\$runCommandRaw/)
  assert.match(limiter, /findAndModify/)
  assert.match(limiter, /\$inc/)
  assert.doesNotMatch(limiter, /new Map/)
})
test('unsafe SVG/spoofed raster uploads are rejected and public reads require published pages', () => {
  const media = readFileSync('lib/cms/media-validation.js', 'utf8')
  const publicData = readFileSync('lib/cms/public-data.js', 'utf8')
  const allowlist = media.slice(media.indexOf('const ALLOWED_MIME_TYPES'), media.indexOf('const EXT_TO_MIME'))
  assert.doesNotMatch(allowlist, /image\/svg\+xml/)
  assert.match(media, /uploaded bytes do not match/)
  assert.match(publicData, /page: \{ slug, isPublished: true \}/)
})
test('environment template is safe and local env files are ignored', () => {
  const env = readFileSync('.env.example', 'utf8')
  const gitignore = readFileSync('.gitignore', 'utf8')
  assert.match(env, /DATABASE_URL=.*<db_user>/)
  assert.match(env, /AUTH_SECRET=.*<generate_/)
  assert.match(gitignore, /^\.env$/m)
  assert.match(gitignore, /^\.env\*\.local$/m)
})
