import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { loginSchema } from '@/lib/cms/schemas'
import { checkRateLimit, clearLoginFailures, recordLoginAttempt } from '@/lib/cms/rate-limit'
import { getRequestIp, normalizeUsername } from '@/lib/cms/auth-utils'
import Google from 'next-auth/providers/google'

const oauthProviders =
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
    ? [Google({ clientId: process.env.AUTH_GOOGLE_ID, clientSecret: process.env.AUTH_GOOGLE_SECRET })]
    : []

const { handlers, auth: nextAuth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, request) {
        // 1. Validate input shape with Zod (server-authoritative)
        const parsed = loginSchema.safeParse({
          username: credentials?.username ?? credentials?.email,
          password: credentials?.password,
        })
        if (!parsed.success) return null

        const { username, password } = parsed.data
        const identifier = normalizeUsername(username)

        // 2. Rate limit by email + IP
        const ip = getRequestIp(request?.headers)

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
          const [emailLimitAfterFailure, ipLimitAfterFailure] = await Promise.all([
            checkRateLimit(identifier),
            checkRateLimit(ip),
          ])
          if (emailLimitAfterFailure.limited || ipLimitAfterFailure.limited) {
            throw new Error('RATE_LIMITED')
          }
          return null
        }

        // 4. Verify password (bcrypt — never plaintext)
        const valid = await bcrypt.compare(password, user.passwordHash)

        if (!valid) {
          await Promise.all([
            recordLoginAttempt(identifier, false),
            recordLoginAttempt(ip, false),
          ])
          const [emailLimitAfterFailure, ipLimitAfterFailure] = await Promise.all([
            checkRateLimit(identifier),
            checkRateLimit(ip),
          ])
          if (emailLimitAfterFailure.limited || ipLimitAfterFailure.limited) {
            throw new Error('RATE_LIMITED')
          }
          return null
        }

        // 5. Record success + update lastLoginAt
        await Promise.all([
          recordLoginAttempt(identifier, true),
          clearLoginFailures(identifier),
          clearLoginFailures(ip),
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
    ...oauthProviders,
  ],

  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // exactly one hour
  },

  callbacks: {
    async signIn({ user, account }) {
      // OAuth proves identity, but it must not automatically provision CMS
      // administrators. A Google account must map to an active CMS admin.
      if (account?.provider !== 'google') return true
      const email = normalizeUsername(user?.email)
      if (!email) return false
      const dbUser = await prisma.user.findUnique({ where: { email } })
      return Boolean(dbUser?.isActive && ['ADMIN', 'SUPER_ADMIN'].includes(dbUser.role))
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === 'google') {
          const dbUser = await prisma.user.findUnique({
            where: { email: normalizeUsername(user.email) },
          })
          if (!dbUser) return token
          token.id = dbUser.id
          token.role = dbUser.role
        } else {
          token.id = user.id
          token.role = user.role
        }
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

  // CSRF protection is built into Auth.js v5 via signed tokens.
  // Dev (localhost) is always trusted; production requires explicit
  // AUTH_TRUST_HOST=true behind a trusted proxy, or AUTH_URL set.
  trustHost: process.env.AUTH_TRUST_HOST === 'true' || process.env.NODE_ENV !== 'production',
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
