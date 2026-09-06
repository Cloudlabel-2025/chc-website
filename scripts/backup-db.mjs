/**
 * Point-in-time read-only backup of the whole `chc` DB to JSON.
 * Usage: node scripts/backup-db.mjs [outDir]
 * Never writes to the DB — findMany only.
 */
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const outDir = process.argv[2] ?? 'backups/2026-09-05-1830IST'
mkdirSync(outDir, { recursive: true })

const prisma = new PrismaClient()
const manifest = { takenAt: new Date().toISOString(), collections: {} }

const jobs = {
  users: () => prisma.user.findMany(),
  sessions: () => prisma.session.findMany(),
  loginAttempts: () => prisma.loginAttempt.findMany(),
  rateLimitBuckets: () => prisma.rateLimitBucket.findMany(),
  mediaAssets: () => prisma.mediaAsset.findMany(),
  pages: () => prisma.page.findMany(),
  sections: () => prisma.section.findMany(),
  contentBlocks: () => prisma.contentBlock.findMany(),
  navigationItems: () => prisma.navigationItem.findMany(),
  footerConfigs: () => prisma.footerConfig.findMany(),
  seoMeta: () => prisma.seoMeta.findMany(),
  formSubmissions: () => prisma.formSubmission.findMany(),
  formDefinitions: () => prisma.formDefinition.findMany(),
  pageTemplates: () => prisma.pageTemplate.findMany(),
  auditLogs: () => prisma.auditLog.findMany(),
}

for (const [name, fn] of Object.entries(jobs)) {
  const rows = await fn()
  writeFileSync(join(outDir, `${name}.json`), JSON.stringify(rows, null, 1))
  manifest.collections[name] = rows.length
  console.log(`${name}: ${rows.length}`)
}

manifest.node = process.version
writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2))
console.log(`Backup written to ${outDir}`)
await prisma.$disconnect()
