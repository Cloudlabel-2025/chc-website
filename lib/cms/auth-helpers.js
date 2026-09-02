import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

/**
 * Asserts a valid session exists. Redirects to login if not.
 * Use at the top of every admin server action and route handler.
 *
 * @returns {Promise<import('next-auth').Session>}
 */
export async function requireAuth() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/admin/login')
  }
  return session
}

/**
 * Asserts a valid session with ADMIN or SUPER_ADMIN role.
 * Redirects to login if not authenticated, throws 403 if wrong role.
 *
 * @returns {Promise<import('next-auth').Session>}
 */
export async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/admin/login')
  }
  if (!['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    redirect('/admin/login')
  }
  return session
}

/**
 * Returns the current session without redirecting.
 * Use in layouts that need to conditionally render based on auth state.
 *
 * @returns {Promise<import('next-auth').Session|null>}
 */
export async function getSession() {
  return auth()
}
