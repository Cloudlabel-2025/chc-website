// Log identifiers only: Prisma messages can contain database URLs and queries.
export function authDiagnostic(error, env = process.env) {
  const cause = error?.cause?.err ?? error
  const safeLabel = (value) => typeof value === 'string' && /^[A-Za-z0-9_]{1,80}$/.test(value) ? value : null
  const message = String(cause?.message ?? '')
  const reason = /authentication failed|bad auth|SCRAM|P1000/i.test(message) ? 'DATABASE_AUTHENTICATION_FAILED'
    : /server selection|timed out|ECONNREFUSED|ENOTFOUND|DNS|P1001/i.test(message) ? 'DATABASE_UNREACHABLE_OR_TIMEOUT'
    : /replica set|P2031/i.test(message) ? 'DATABASE_REPLICA_SET_REQUIRED'
    : /environment variable not found.*MONGODB_URI/is.test(message) ? 'MONGODB_URI_MISSING'
    : null
  return {
    type: safeLabel(error?.type),
    cause: safeLabel(cause?.name),
    code: safeLabel(cause?.code ?? cause?.errorCode),
    reason,
    mongodbConfigured: Boolean(env.MONGODB_URI),
    authSecretConfigured: Boolean(env.AUTH_SECRET || env.NEXTAUTH_SECRET),
  }
}
