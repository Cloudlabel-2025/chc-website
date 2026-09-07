import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  // Public pages fall back to hardcoded content when MongoDB is unreachable
  // (see lib/cms/public-data.js), so engine error/warn logs are silenced to
  // avoid noisy terminal overlays in development.
  log: [],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
