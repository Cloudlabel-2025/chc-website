/**
 * Diagnose a "works locally, login fails in production" CMS login.
 *
 * Checks, against the database the current environment connects to:
 *   1. whether the CMS admin user exists and is active (isActive, role)
 *   2. whether the email (and, if supplied, an IP) is rate-limited by the
 *      DB-backed login lock (6 failures per 15 minutes — see lib/cms/rate-limit.js)
 *
 * IMPORTANT: run it with the PRODUCTION connection string if the live site is
 * failing, e.g. from a shell where MONGODB_URI points at the live database.
 *
 * Usage:
 *   node scripts/check-login-state.mjs <email> [ip]
 *   node scripts/check-login-state.mjs <email> [ip] --clear
 */
import 'dotenv/config'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

const email = process.argv[2]?.trim().toLowerCase()
const ip = process.argv[3] && !process.argv[3].startsWith('--') ? process.argv[3].trim() : null
const clear = process.argv.includes('--clear')

if (!email) {
  console.error('Usage: node scripts/check-login-state.mjs <email> [ip] [--clear]')
  process.exit(1)
}

const WINDOW_MS = 15 * 60 * 1000
const windowStart = new Date(Date.now() - WINDOW_MS)

async function countFailures(identifier) {
  return prisma.loginAttempt.count({
    where: { identifier, success: false, attemptedAt: { gte: windowStart } },
  })
}

async function clearFailures(identifier) {
  const { count } = await prisma.loginAttempt.deleteMany({
    where: { identifier, success: false, attemptedAt: { gte: windowStart } },
  })
  return count
}

console.log(`Database: ${(process.env.MONGODB_URI || '').replace(/\/\/[^@]+@/, '//***:***@')}\n`)

const user = await prisma.user.findUnique({ where: { email } })
if (!user) {
  console.error(`[USER] No CMS user found for "${email}" in this database.`)
  console.error('       If localhost works but live does not, the live app may be pointing at a')
  console.error('       different database. Seed the admin there (npm run db:seed:admin) or align')
  console.error('       the live MONGODB_URI with the database that contains this user.\n')
} else {
  console.log('[USER]', { id: user.id, email: user.email, role: user.role, isActive: user.isActive, hasPassword: Boolean(user.passwordHash) })
  if (!user.isActive || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
    console.log('       WARNING: user is disabled or not an admin — login will be rejected.\n')
  }
}

for (const identifier of [email, ip].filter(Boolean)) {
  const failures = await countFailures(identifier)
  const limited = failures >= 6
  console.log(`[LOCK] identifier "${identifier}": ${failures} failed attempt(s) in last 15 min → ${limited ? 'RATE LIMITED' : 'ok'}`)
  if (limited) {
    console.log('       This is why the login form says "Invalid email or password." even with valid')
    console.log('       credentials. Wait 15 minutes or clear the lock below.\n')
    if (clear) {
      const removed = await clearFailures(identifier)
      console.log(`       --clear: removed ${removed} failure(s) for "${identifier}".`)
    }
  }
}

if (clear && !ip) {
  console.log('\nNote: also clear your IP identifier if you know it (pass it as the third argument).')
}

await prisma.$disconnect()