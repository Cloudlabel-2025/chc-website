'use server'

import { signIn } from '@/lib/auth'
import { loginSchema } from '@/lib/cms/schemas'
import { checkRateLimit } from '@/lib/cms/rate-limit'
import { headers } from 'next/headers'
import { AuthError } from 'next-auth'

/**
 * @typedef {{ error?: string, rateLimited?: boolean }} LoginResult
 */

/**
 * Server action for admin login.
 * Validates input, checks rate limit, delegates to Auth.js signIn.
 *
 * @param {FormData} formData
 * @returns {Promise<LoginResult>}
 */
export async function loginAction(formData) {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  // 1. Zod validation (server-authoritative)
  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: 'Invalid email or password format.' }
  }

  // 2. Pre-check rate limit before hitting the DB via Auth.js
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const identifier = parsed.data.email.toLowerCase()

  const [emailLimit, ipLimit] = await Promise.all([
    checkRateLimit(identifier),
    checkRateLimit(ip),
  ])

  if (emailLimit.limited || ipLimit.limited) {
    return {
      rateLimited: true,
      error: 'Too many failed attempts. Please wait 15 minutes before trying again.',
    }
  }

  // 3. Attempt sign-in via Auth.js (which runs the full authorize() flow)
  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    })
    // signIn with redirect:false returns on success — redirect is handled client-side
    return {}
  } catch (err) {
    if (err instanceof AuthError) {
      if (err.message?.includes('RATE_LIMITED')) {
        return {
          rateLimited: true,
          error: 'Too many failed attempts. Please wait 15 minutes before trying again.',
        }
      }
      return { error: 'Invalid email or password.' }
    }
    // Re-throw unexpected errors (e.g. DB down)
    console.error('Login action error:', err)
    return { error: 'Something went wrong. Please try again.' }
  }
}
