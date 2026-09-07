/**
 * Repair ContentBlock rows left behind by the old upsertBlock, which
 * inserted a new unpublished row for every save instead of updating in
 * place. Fixes any group (sectionId, fieldKey, parentId) whose value is
 * hidden or duplicated:
 *   - keep the most recently updated row and publish it (isPublished = true)
 *   - delete the other rows (children deleted first for FK safety)
 *
 * Single-row groups are also published so cards whose image/text was saved
 * via the buggy path (and never got an isPublished flag) appear live.
 *
 * Groups where fieldKey === 'item' are repeatable item markers and are
 * deliberately left untouched.
 *
 * Usage: node scripts/cleanup-duplicate-blocks.mjs [--dry-run]
 */
import 'dotenv/config'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()
const dryRun = process.argv.includes('--dry-run')

function describe(block) {
  const slug = block.section?.page?.slug ?? '?'
  const sectionKey = block.section?.sectionKey ?? '?'
  return `${slug}.${sectionKey} fk=${block.fieldKey} parent=${block.parentId ? 'item' : 'singleton'}`
}

async function main() {
  const blocks = await prisma.contentBlock.findMany({
    include: {
      section: { select: { sectionKey: true, page: { select: { slug: true } } } },
    },
  })

  const groups = new Map()
  for (const block of blocks) {
    const key = `${block.sectionId}|${block.fieldKey}|${block.parentId ?? 'null'}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(block)
  }

  const affected = []
  for (const rows of groups.values()) {
    if (rows[0].fieldKey === 'item') continue
    rows.sort((a, b) => (b.updatedAt - a.updatedAt) || (b.createdAt - a.createdAt))
    affected.push({ keep: rows[0], losers: rows.slice(1) })
  }

  const extraRows = affected.reduce((sum, g) => sum + g.losers.length, 0)

  console.log(`${dryRun ? 'DRY RUN' : 'APPLYING'} — ${affected.length} groups, ${extraRows} redundant rows to remove`)
  console.log('')

  for (const { keep, losers } of affected) {
    const media = keep.mediaAssetId ? ' media=yes' : ''
    console.log(
      `  KEEP   ${describe(keep).padEnd(52)} rows=${losers.length + 1} published=${keep.isPublished}${media} upd=${keep.updatedAt.toISOString().slice(0, 19)}`
    )
    for (const loser of losers) {
      const key = describe(loser)
      const children = await prisma.contentBlock.count({ where: { parentId: loser.id } })
      console.log(`  DELETE ${key.padEnd(52)} children=${children} upd=${loser.updatedAt.toISOString().slice(0, 19)}`)
      if (!dryRun) {
        if (children > 0) {
          await prisma.contentBlock.deleteMany({ where: { parentId: loser.id } })
        }
        await prisma.contentBlock.delete({ where: { id: loser.id } })
      }
    }
  }

  console.log('')
  if (dryRun) {
    console.log('Dry run complete — nothing changed. Re-run without --dry-run to apply.')
  } else {
    const keepIds = affected.map((g) => g.keep.id)
    await Promise.all(keepIds.map((id) => prisma.contentBlock.update({ where: { id }, data: { isPublished: true } })))
    const finalBlocks = await prisma.contentBlock.count()
    console.log(`Done. Published ${keepIds.length} kept rows. ContentBlock total: ${finalBlocks}.`)
  }
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())