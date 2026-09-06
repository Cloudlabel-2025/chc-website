/**
 * Backfill ContentBlock.mediaAssetId for seeded IMAGE fields that have null FK.
 * Matches by textValue basename -> MediaAsset filename, or fallback filename per fieldKey.
 * Safe to re-run: skips blocks that already have mediaAssetId.
 */
import 'dotenv/config'
import path from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Map fieldKey -> fallback filename to use when textValue is null/empty
const FIELD_FALLBACK = {
  backgroundImage: 'Oracle-hcm-hero.png',
  leftImage: 'Oracle-hcm-content.jpg',
  rightImage: 'oracle-hcm-content-02.jpg',
  image: null, // generic, use per-section logic below
  icon: null,
  photo: null,
}

async function main() {
  const mediaByFilename = new Map()
  const assets = await prisma.mediaAsset.findMany({ select: { id: true, filename: true, publicUrl: true } })
  for (const a of assets) mediaByFilename.set(path.basename(a.filename).toLowerCase(), a.id)
  // Also index by full filename lower
  console.log(`Indexed ${assets.length} media assets`)

  const blocks = await prisma.contentBlock.findMany({
    where: { blockType: 'IMAGE', mediaAssetId: null },
    select: { id: true, fieldKey: true, textValue: true, sectionId: true },
  })
  console.log(`Found ${blocks.length} IMAGE blocks with null mediaAssetId`)

  let linked = 0, skipped = 0, noMatch = 0
  for (const block of blocks) {
    let filename = null
    if (block.textValue) {
      filename = path.basename(block.textValue)
    } else if (FIELD_FALLBACK[block.fieldKey]) {
      filename = FIELD_FALLBACK[block.fieldKey]
    } else {
      // For generic image/icon/photo with no textValue, try section-aware fallback
      const section = await prisma.section.findUnique({ where: { id: block.sectionId }, select: { sectionKey: true } })
      // Use parent section context if needed, but skip linking if ambiguous
      noMatch++
      continue
    }
    const assetId = mediaByFilename.get(filename.toLowerCase())
    if (!assetId) {
      noMatch++
      continue
    }
    await prisma.contentBlock.update({ where: { id: block.id }, data: { mediaAssetId: assetId } })
    linked++
    if (linked <= 10) console.log(`  linked ${block.fieldKey} (${block.id.slice(-6)}) -> ${filename}`)
  }
  if (linked > 10) console.log(`  ... and ${linked - 10} more`)
  console.log(`\nDone: ${linked} linked, ${noMatch} no match (no textValue/fallback), ${skipped} skipped`)
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
