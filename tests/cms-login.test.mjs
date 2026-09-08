import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { encode, getToken } from 'next-auth/jwt'

const middlewareSource = readFileSync('middleware.js', 'utf8')
  .replace(/^import .*$/gm, '')
  .replace('export async function middleware', 'async function middleware')
  .replace('export const config', 'const config')
const secret = 'cms-login-regression-test-secret-only'
const middleware = new Function('NextResponse', 'getToken', 'process', `${middlewareSource}; return middleware`)(
  { next: () => ({ status: 200 }), redirect: () => ({ status: 307 }), json: (_, options) => options },
  getToken,
  { env: { NODE_ENV: 'production', AUTH_SECRET: secret } },
)

for (const protocol of ['http:', 'https:']) {
  test(`middleware accepts an Auth.js session over ${protocol}`, async () => {
    const cookieName = `${protocol === 'https:' ? '__Secure-' : ''}authjs.session-token`
    const token = await encode({ secret, salt: cookieName, token: { id: 'admin-test', role: 'ADMIN' } })
    const request = new Request(`${protocol}//example.test/admin/dashboard`, {
      headers: { cookie: `${cookieName}=${token}` },
    })
    request.nextUrl = new URL(request.url)
    assert.equal((await middleware(request)).status, 200)
  })
}

test('middleware rejects missing and tampered production sessions', async () => {
  for (const cookie of ['', '__Secure-authjs.session-token=invalid']) {
    const request = new Request('https://example.test/admin/dashboard', { headers: { cookie } })
    request.nextUrl = new URL(request.url)
    assert.equal((await middleware(request)).status, 307)
  }
})

const loginSource = readFileSync('app/(admin)/admin/login/LoginForm.js', 'utf8')
const submitSource = loginSource.slice(loginSource.indexOf('  function handleSubmit'), loginSource.indexOf('  // `method='))

for (const [error, code] of [['CredentialsSignin'], ['CredentialsSignin', 'rate_limited'], ['Configuration'], [undefined]]) {
  test(`login handles HTTP 200 with ${code ?? error ?? 'successful authentication'}`, async () => {
    let pending
    let message
    let destination
    const handleSubmit = new Function('signIn', 'startTransition', 'setError', 'setRateLimited', 'router', 'callbackUrl', 'FormData', `${submitSource}; return handleSubmit`)(
      async () => ({ ok: true, error, code }),
      (callback) => { pending = callback() },
      (value) => { message = value },
      () => {},
      { replace: (value) => { destination = value }, refresh: () => {} },
      '/admin/dashboard',
      class { get(key) { return key === 'username' ? 'admin@example.test' : 'test-password' } },
    )
    handleSubmit({ preventDefault() {}, currentTarget: {} })
    await pending
    if (error) {
      assert.equal(destination, undefined)
      assert.ok(message)
      if (code === 'rate_limited') assert.match(message, /15 minutes/)
    } else {
      assert.equal(destination, '/admin/dashboard')
      assert.equal(message, '')
    }
  })
}

const diagnosticsSource = readFileSync('lib/cms/auth-diagnostics.js', 'utf8')
const { authDiagnostic } = await import(`data:text/javascript;base64,${Buffer.from(diagnosticsSource).toString('base64')}`)

test('auth diagnostics report database error codes without exposing secrets', () => {
  const secretValue = 'mongodb://private-user:private-password@database'
  const diagnostic = authDiagnostic({
    type: 'CallbackRouteError',
    cause: { err: { name: 'PrismaClientInitializationError', errorCode: 'P1001', message: secretValue, stack: secretValue } },
  }, { MONGODB_URI: secretValue, AUTH_SECRET: secretValue })
  assert.equal(diagnostic.code, 'P1001')
  assert.equal(diagnostic.cause, 'PrismaClientInitializationError')
  assert.equal(diagnostic.mongodbConfigured, true)
  assert.doesNotMatch(JSON.stringify(diagnostic), /private-password/)
  assert.equal(authDiagnostic({}, {}).mongodbConfigured, false)
})

test('server lockout returns a client-safe credentials error and does not query users', async () => {
  const source = readFileSync('lib/auth.js', 'utf8')
    .replace(/^import .*$/gm, '')
    .replace('export async function auth', 'async function auth')
    .replace('export { handlers, signIn, signOut }', '')
  let config
  const credentialsError = class extends Error { type = 'CredentialsSignin' }
  new Function('NextAuth', 'CredentialsSignin', 'Credentials', 'Google', 'bcrypt', 'prisma', 'loginSchema', 'checkRateLimit', 'clearLoginFailures', 'recordLoginAttempt', 'getRequestIp', 'normalizeUsername', 'authDiagnostic', 'process', source)(
    (value) => { config = value; return {} }, credentialsError, (value) => value, () => {}, {},
    { user: { findUnique() { assert.fail('Locked-out requests must not reach user lookup') } } },
    { safeParse: () => ({ success: true, data: { username: 'test@example.test', password: 'test' } }) },
    async () => ({ limited: true }), async () => {}, async () => {}, () => 'test-ip', (value) => value,
    authDiagnostic, { env: { NODE_ENV: 'production' } },
  )
  await assert.rejects(config.providers[0].authorize({}, {}), (error) => {
    assert.equal(error.type, 'CredentialsSignin')
    assert.equal(error.code, 'rate_limited')
    return true
  })
})
