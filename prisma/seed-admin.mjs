/**
 * CHC CMS — Admin User Seed
 *
 * Creates the initial admin user with a bcrypt-hashed password.
 * Safe to re-run — uses upsert so it won't duplicate.
 *
 * Usage:
 *   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=YourSecurePass123! npm run db:seed:admin
 *
 * Password requirements:
 *   - Minimum 12 characters
 *   - At least one uppercase letter, one lowercase letter, one number, one special character
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })
const SALT_ROUNDS = 12

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME ?? 'CHC Admin'

  if (!email || !password) {
    console.error(
      'Error: ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required.\n' +
      'Usage: ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=YourPass123! npm run db:seed:admin'
    )
    process.exit(1)
  }

  const passwordErrors = []
  if (password.length < 12)            passwordErrors.push('at least 12 characters')
  if (!/[A-Z]/.test(password))         passwordErrors.push('one uppercase letter')
  if (!/[a-z]/.test(password))         passwordErrors.push('one lowercase letter')
  if (!/[0-9]/.test(password))         passwordErrors.push('one number')
  if (!/[^A-Za-z0-9]/.test(password))  passwordErrors.push('one special character')

  if (passwordErrors.length > 0) {
    console.error(`Error: Password must contain ${passwordErrors.join(', ')}.`)
    process.exit(1)
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

  const user = await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: { passwordHash, name, isActive: true, updatedAt: new Date() },
    create: {
      email: email.toLowerCase(),
      passwordHash,
      name,
      role: 'SUPER_ADMIN',
      isActive: true,
      updatedAt: new Date(),
    },
  })

  console.log(`✅ Admin user ready: ${user.email} (${user.role})`)
  console.log('   Never commit passwords or this output to version control.')
}

main()
  .catch((err) => { console.error('Seed failed:', err); process.exit(1) })
  .finally(() => prisma.$disconnect())
