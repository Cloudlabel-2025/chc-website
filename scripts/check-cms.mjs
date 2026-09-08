import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env')
loadEnvConfig(process.cwd(), process.argv.includes('--development'))
const { PrismaClient } = require('@prisma/client')

// Read-only. No user records, passwords, or connection strings are printed.
const env = process.env
let databaseFingerprint = null
let databaseNamePresent = false
try {
  const url = new URL(env.MONGODB_URI)
  databaseNamePresent = url.pathname.length > 1
  databaseFingerprint = createHash('sha256').update(`${url.hostname.toLowerCase()}${url.pathname}`).digest('hex').slice(0, 16)
} catch {}
console.log(JSON.stringify({
  check: 'configuration', mongodbConfigured: Boolean(env.MONGODB_URI), databaseNamePresent,
  databaseFingerprint, authSecretConfigured: Boolean(env.AUTH_SECRET || env.NEXTAUTH_SECRET),
  authUrlIsLocal: /localhost|127\.0\.0\.1/.test(env.AUTH_URL ?? ''),
  developmentBypass: env.CMS_DEV_BYPASS === 'true',
}))

const prisma = new PrismaClient({ log: [] })
try {
  const started = Date.now()
  const [admins, pages, publishedPages, publishedBlocks, recentFailures] = await Promise.all([
    prisma.user.count({ where: { isActive: true, role: { in: ['ADMIN', 'SUPER_ADMIN'] } } }),
    prisma.page.count(),
    prisma.page.count({ where: { isPublished: true } }),
    prisma.contentBlock.count({ where: { isPublished: true, section: { isVisible: true, page: { isPublished: true } } } }),
    prisma.loginAttempt.count({ where: { success: false, attemptedAt: { gte: new Date(Date.now() - 15 * 60 * 1000) } } }),
  ])
  console.log(JSON.stringify({ check: 'database', reachable: true, elapsedMs: Date.now() - started, admins, pages, publishedPages, publishedBlocks, recentFailures }))
} catch (error) {
  console.error(JSON.stringify({ check: 'database', reachable: false, error: error.name, code: error.code ?? error.errorCode ?? null }))
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
