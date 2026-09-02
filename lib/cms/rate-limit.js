import prisma from '@/lib/prisma'

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

/**
 * Checks whether an identifier (email or IP) is currently rate-limited.
 * @param {string} identifier
 * @returns {Promise<{ limited: boolean, remaining: number, resetAt: Date|null }>}
 */
export async function checkRateLimit(identifier) {
  const windowStart = new Date(Date.now() - WINDOW_MS)

  const recentFailures = await prisma.loginAttempt.count({
    where: {
      identifier,
      success: false,
      attemptedAt: { gte: windowStart },
    },
  })

  if (recentFailures >= MAX_ATTEMPTS) {
    // Find when the oldest failure in the window expires
    const oldest = await prisma.loginAttempt.findFirst({
      where: { identifier, success: false, attemptedAt: { gte: windowStart } },
      orderBy: { attemptedAt: 'asc' },
    })
    const resetAt = oldest
      ? new Date(oldest.attemptedAt.getTime() + WINDOW_MS)
      : null

    return { limited: true, remaining: 0, resetAt }
  }

  return {
    limited: false,
    remaining: MAX_ATTEMPTS - recentFailures,
    resetAt: null,
  }
}

/**
 * Records a login attempt.
 * @param {string} identifier
 * @param {boolean} success
 */
export async function recordLoginAttempt(identifier, success) {
  await prisma.loginAttempt.create({
    data: { identifier, success },
  })

  // Prune old records to keep the table lean (keep last 7 days)
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  await prisma.loginAttempt.deleteMany({
    where: { identifier, attemptedAt: { lt: cutoff } },
  })
}
