import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync('lib/cms/database-query.js', 'utf8')
const { databaseQuery } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)

test('database reads return data and propagate failures', async () => {
  assert.deepEqual(await databaseQuery(Promise.resolve({ title: 'CMS title' })), { title: 'CMS title' })
  const failure = new Error('database unavailable')
  await assert.rejects(databaseQuery(Promise.reject(failure)), (error) => error === failure)
})

test('database reads time out with a diagnostic code', async () => {
  await assert.rejects(databaseQuery(new Promise(() => {}), 5), { code: 'CMS_DATABASE_TIMEOUT' })
})

test('public CMS reads allow cold connections and report safe fallback diagnostics', async () => {
  const publicSource = readFileSync('lib/cms/public-data.js', 'utf8')
  const wrapperSource = publicSource.slice(publicSource.indexOf('const PUBLIC_DATA_TIMEOUT_MS'), publicSource.indexOf('//', publicSource.indexOf('\n}\n', publicSource.indexOf('function withPublicDataTimeout')) + 3))
  const calls = []
  const warnings = []
  const wrap = new Function('databaseQuery', 'authDiagnostic', 'console', `${wrapperSource}; return withPublicDataTimeout`)(
    (operation, timeout) => { calls.push(timeout); return operation },
    () => ({ code: 'TEST_DATABASE_ERROR' }),
    { error: (...args) => warnings.push(args) },
  )
  assert.equal(await wrap(Promise.resolve('published content')), 'published content')
  assert.equal(calls[0], 12000)
  for (let i = 0; i < 2; i++) await assert.rejects(wrap(Promise.reject(new Error('private connection string'))))
  assert.equal(warnings.length, 1)
  assert.equal(warnings[0][0], '[cms-data]')
  assert.doesNotMatch(JSON.stringify(warnings), /private connection string/)
})
