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

for (const error of ['CredentialsSignin', 'Configuration', undefined]) {
  test(`login handles HTTP 200 with ${error ?? 'successful authentication'}`, async () => {
    let pending
    let message
    let destination
    const handleSubmit = new Function('signIn', 'startTransition', 'setError', 'setRateLimited', 'setFailedAttempts', 'failedAttempts', 'router', 'callbackUrl', 'FormData', `${submitSource}; return handleSubmit`)(
      async () => ({ ok: true, error }),
      (callback) => { pending = callback() },
      (value) => { message = value },
      () => {}, () => {}, 0,
      { replace: (value) => { destination = value }, refresh: () => {} },
      '/admin/dashboard',
      class { get(key) { return key === 'username' ? 'admin@example.test' : 'test-password' } },
    )
    handleSubmit({ preventDefault() {}, currentTarget: {} })
    await pending
    if (error) {
      assert.equal(destination, undefined)
      assert.ok(message)
    } else {
      assert.equal(destination, '/admin/dashboard')
      assert.equal(message, '')
    }
  })
}
