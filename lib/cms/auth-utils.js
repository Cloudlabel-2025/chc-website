/**
 * Normalizes a CMS username. The current user store uses email addresses as
 * usernames, so this deliberately returns an email-shaped identifier.
 */
export function normalizeUsername(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

/**
 * Prevents login from becoming an open redirect. CMS users may only be sent
 * back to an internal /admin route after a successful sign-in.
 */
export function safeAdminCallbackUrl(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) {
    return '/admin/dashboard'
  }

  try {
    const url = new URL(value, 'http://localhost')
    return url.pathname.startsWith('/admin')
      ? `${url.pathname}${url.search}${url.hash}`
      : '/admin/dashboard'
  } catch {
    return '/admin/dashboard'
  }
}

export function getRequestIp(requestHeaders) {
  const forwarded = requestHeaders?.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim().slice(0, 45) || 'unknown'
}
