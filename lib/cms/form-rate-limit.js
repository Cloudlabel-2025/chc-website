/** Database-backed fixed-window limiter shared by all app instances. */
import prisma from '@/lib/prisma'

const WINDOW_MS = 60 * 60 * 1000
const MAX_PER_IP = 10

export async function formRateLimit(ip) {
  if (!ip) return { limited: false, remaining: MAX_PER_IP }
  const now = new Date()
  const windowStart = new Date(Math.floor(now.getTime() / WINDOW_MS) * WINDOW_MS)
  const key = `public-form:${ip}`
  const rows = await prisma.$queryRaw`
    INSERT INTO "rate_limit_buckets" ("key", "windowStart", "count", "updatedAt")
    VALUES (${key}, ${windowStart}, 1, ${now})
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE WHEN "rate_limit_buckets"."windowStart" = ${windowStart}
        THEN "rate_limit_buckets"."count" + 1 ELSE 1 END,
      "windowStart" = ${windowStart}, "updatedAt" = ${now}
    RETURNING "count"
  `
  const count = Number(rows[0]?.count ?? 1)
  return count > MAX_PER_IP
    ? { limited: true, remaining: 0, message: 'Too many submissions. Please try again later.' }
    : { limited: false, remaining: MAX_PER_IP - count }
}
