import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const failures = []
const tracked = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split(/\r?\n/)
if (tracked.some((file) => /^\.env(?:\.|$)/.test(file) && file !== '.env.example')) failures.push('A real environment file is tracked by git.')

const secretPattern = /(postgres(?:ql)?:\/\/[^<\s]+|AUTH_SECRET\s*=\s*["']?(?!<)[^\s"']+|BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY)/i
for (const file of tracked.filter(Boolean)) {
  if (/\.(?:png|jpe?g|gif|woff2?|ttf|eot|docx|map)$/i.test(file)) continue
  let value
  try { value = readFileSync(file, 'utf8') } catch { continue }
  if (file !== '.env.example' && secretPattern.test(value)) failures.push(`Potential secret in ${file}`)
}
const config = readFileSync('next.config.js', 'utf8')
for (const header of ['Content-Security-Policy', 'Strict-Transport-Security', 'X-Content-Type-Options', 'Permissions-Policy']) {
  if (!config.includes(header)) failures.push(`Missing security header: ${header}`)
}
const middleware = readFileSync('middleware.js', 'utf8')
if (!middleware.includes("'/api/admin/:path*'")) failures.push('Admin API is not covered by middleware.')
if (!middleware.includes('Invalid request origin.')) failures.push('Admin API origin validation is missing.')
if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join('\n'))
  process.exit(1)
}
console.log('Security audit passed: headers, admin API boundary, env tracking, and tracked-secret scan.')
