/** MongoDB-backed fixed-window limiter shared by all app instances. */
import prisma from '@/lib/prisma'

const WINDOW_MS = 60 * 60 * 1000
const MAX_PER_IP = 10

export async function formRateLimit(ip) {
  if (!ip) return { limited: false, remaining: MAX_PER_IP }
  const now = new Date()
  const windowStart = Math.floor(now.getTime() / WINDOW_MS) * WINDOW_MS
  const key = `public-form:${ip}:${windowStart}`
  const res = await prisma.$runCommandRaw({
    findAndModify: 'rate_limit_buckets',
    query: { key },
    update: {
      $inc: { count: 1 },
      $setOnInsert: { key, windowStart: new Date(windowStart), updatedAt: now },
    },
    upsert: true,
    new: true,
  })
  const count = Number(res?.value?.count ?? 1)
  return count > MAX_PER_IP
    ? { limited: true, remaining: 0, message: 'Too many submissions. Please try again later.' }
    : { limited: false, remaining: MAX_PER_IP - count }
}