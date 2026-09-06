/**
 * Backfill: publish all unpublished blocks on published, visible sections
 * of published pages. Safe to re-run (idempotent).
 * Dry-run: node scripts/publish-live-blocks.mjs --dry-run
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const dryRun = process.argv.includes('--dry-run')

const unpublished = await prisma.contentBlock.findMany({
  where: { isPublished: false },
  select: { id: true, sectionId: true, fieldKey: true },
})

let eligible = 0
let candidates = []

for (const block of unpublished) {
  const section = await prisma.section.findUnique({
    where: { id: block.sectionId },
    select: { isVisible: true, pageId: true },
  })
  if (!section?.isVisible) continue
  const page = await prisma.page.findUnique({
    where: { id: section.pageId },
    select: { isPublished: true, slug: true },
  })
  if (!page?.isPublished) continue
  eligible++
  candidates.push(block)
}

console.log(`Found ${unpublished.length} unpublished blocks, ${eligible} on published pages/visible sections.`)

if (dryRun) {
  console.log('Dry run — no changes written.')
  for (const c of candidates.slice(0, 20)) console.log(`  would publish: ${c.fieldKey} (${c.id}) section ${c.sectionId}`)
  if (candidates.length > 20) console.log(`  ... and ${candidates.length - 20} more`)
} else if (eligible > 0) {
  const result = await prisma.contentBlock.updateMany({
    where: { id: { in: candidates.map((c) => c.id) } },
    data: { isPublished: true },
  })
  console.log(`Published ${result.count} blocks.`)
} else {
  console.log('Nothing to publish.')
}

await prisma.$disconnect()
