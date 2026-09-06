import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { loginSchema } from '@/lib/cms/schemas'
import { checkRateLimit, recordLoginAttempt } from '@/lib/cms/rate-limit'

const { handlers, auth: nextAuth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, request) {
        // 1. Validate input shape with Zod (server-authoritative)
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data
        const identifier = email.toLowerCase()

        // 2. Rate limit by email + IP
        const ip =
          request?.headers?.get('x-forwarded-for')?.split(',')[0]?.trim() ??
          'unknown'

        const [emailLimit, ipLimit] = await Promise.all([
          checkRateLimit(identifier),
          checkRateLimit(ip),
        ])

        if (emailLimit.limited || ipLimit.limited) {
          throw new Error('RATE_LIMITED')
        }

        // 3. Look up user — constant-time path regardless of existence
        const user = await prisma.user.findUnique({
          where: { email: identifier },
        })

        if (!user || !user.isActive) {
          // Still record attempt and do a dummy compare to prevent timing attacks
          await Promise.all([
            recordLoginAttempt(identifier, false),
            recordLoginAttempt(ip, false),
            bcrypt.compare(password, '$2a$12$dummyhashtopreventtimingattacksx'),
          ])
          return null
        }

        // 4. Verify password (bcrypt — never plaintext)
        const valid = await bcrypt.compare(password, user.passwordHash)

        if (!valid) {
          await Promise.all([
            recordLoginAttempt(identifier, false),
            recordLoginAttempt(ip, false),
          ])
          return null
        }

        // 5. Record success + update lastLoginAt
        await Promise.all([
          recordLoginAttempt(identifier, true),
          prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          }),
        ])

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },

  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },

  // CSRF protection is built into Auth.js v5 via signed tokens
  trustHost: process.env.AUTH_TRUST_HOST === 'true',
})

// Local-only convenience for CMS development. It is deliberately impossible
// to enable in production and avoids a DB round-trip so the admin shell remains
// reachable while a local database is unavailable.
export async function auth(...args) {
  if (process.env.NODE_ENV !== 'production' && process.env.CMS_DEV_BYPASS === 'true') {
    return { user: { id: '000000000000000000000000', email: 'local-admin@localhost', name: 'Local Admin', role: 'SUPER_ADMIN' } }
  }
  return nextAuth(...args)
}

export { handlers, signIn, signOut }
