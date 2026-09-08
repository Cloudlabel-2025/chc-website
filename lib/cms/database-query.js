/**
 * Keeps CMS screens responsive when MongoDB is temporarily unreachable.
 * Prisma's MongoDB driver can otherwise leave a server render pending for
 * tens of seconds before its own connection timeout expires.
 */
// Atlas can take several seconds to establish the first connection after the
// development server starts. Keep the CMS responsive without incorrectly
// switching a healthy, cold connection into preview mode.
export function databaseQuery(operation, timeoutMs = 12000) {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const error = new Error('Database connection timed out')
      error.code = 'CMS_DATABASE_TIMEOUT'
      reject(error)
    }, timeoutMs)
  })
  return Promise.race([operation, timeout]).finally(() => clearTimeout(timer))
}
