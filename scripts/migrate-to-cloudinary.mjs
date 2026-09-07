/**
 * Migrate local assets + static images to Cloudinary.
 * - DB rows: every MediaAsset with local publicUrl (/, /media/, /images/, /uploads/)
 * - Static files: optionally walk public/images/** for hardcoded paths (Phase 4 code swap reads from Cloudinary)
 *
 * Usage: CLOUDINARY_CLOUD_NAME=xxx CLOUDINARY_API_KEY=xxx CLOUDINARY_API_SECRET=xxx node scripts/migrate-to-cloudinary.mjs [--dry-run] [--include=rows|static|all] [--exclude=prefix1,prefix2]
 * Default --include=rows. Use all to also upload static files not yet in DB.
 * --exclude skips DB rows whose filename starts with any given prefix (e.g. --exclude=demo-,crafto-).
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const dryRun = process.argv.includes('--dry-run')
const includeArg = process.argv.find((a) => a.startsWith('--include='))?.split('=')[1] ?? 'rows'
const includeRows = includeArg === 'rows' || includeArg === 'all'
const includeStatic = includeArg === 'static' || includeArg === 'all'
const excludeArg = process.argv.find((a) => a.startsWith('--exclude='))?.split('=')[1] ?? ''
const excludePrefixes = excludeArg.split(',').map((p) => p.trim()).filter(Boolean)

async function getCloudinary() {
  const { v2: cloudinary } = await import('cloudinary')
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
  return cloudinary
}

function canonicalPublicId(storageKey) {
  if (storageKey.startsWith('media/')) return storageKey.replace(/^media\//, 'chc/media/').replace(/\.[^.]+$/, '')
  if (storageKey.startsWith('local/')) {
    const base = path.basename(storageKey).replace(/\.[^.]+$/, '')
    return `chc/static/${base}`
  }
  if (storageKey.startsWith('uploads/')) return storageKey.replace(/^uploads\//, 'chc/uploads/').replace(/\.[^.]+$/, '')
  return `chc/media/${storageKey.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9/_-]/g, '_')}`
}

async function main() {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error('Missing CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET in env')
    process.exit(1)
  }
  const cloudinary = await getCloudinary()
  const staticMap = {}

  if (includeRows) {
    const assets = await prisma.mediaAsset.findMany({
      where: { publicUrl: { startsWith: '/' } },
      orderBy: { createdAt: 'asc' },
    })
    console.log(`Found ${assets.length} local assets to migrate (publicUrl starting with /)`)
    if (assets.length === 0) {
      console.log('No local DB rows to migrate.')
    } else {
      let migrated = 0, skipped = 0, failed = 0
      for (const asset of assets) {
        if (excludePrefixes.some((p) => asset.filename.startsWith(p))) {
          console.log(`  skip ${asset.filename} — excluded by --exclude prefix`)
          skipped++
          continue
        }
        const localPath = path.join(process.cwd(), 'public', asset.publicUrl.replace(/^\//, ''))
        if (!fs.existsSync(localPath)) {
          console.log(`  skip ${asset.filename} — file not found: ${localPath}`)
          skipped++
          continue
        }
        const publicId = canonicalPublicId(asset.storageKey, asset.mimeType)
        if (dryRun) {
          console.log(`  [dry-run] would upload ${asset.filename} (${asset.publicUrl}) -> ${publicId}`)
          staticMap[asset.publicUrl] = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`
          migrated++
          continue
        }
        try {
          const result = await cloudinary.uploader.upload(localPath, {
            public_id: publicId,
            overwrite: false,
            resource_type: asset.mimeType === 'image/svg+xml' ? 'image' : 'auto',
          })
          await prisma.mediaAsset.update({
            where: { id: asset.id },
            data: { storageKey: result.public_id, publicUrl: result.secure_url, width: result.width ?? asset.width, height: result.height ?? asset.height },
          })
          staticMap[asset.publicUrl] = result.secure_url
          console.log(`  migrated ${asset.filename} -> ${result.public_id} (${result.width}x${result.height})`)
          migrated++
        } catch (err) {
          console.error(`  failed ${asset.filename}:`, err.message)
          failed++
        }
      }
      console.log(`\nDone: ${migrated} migrated, ${skipped} skipped, ${failed} failed${dryRun ? ' (dry-run)' : ''}`)
      if (Object.keys(staticMap).length) {
        const mapPath = path.join(process.cwd(), 'static-url-map.json')
        fs.writeFileSync(mapPath, JSON.stringify(staticMap, null, 2))
        console.log(`Wrote ${mapPath} (${Object.keys(staticMap).length} entries) — used by Phase 4 fallback/code swaps.`)
      }
      if (!dryRun && failed === 0 && migrated > 0) {
        console.log('Local files preserved — move public/images/* to backup manually ONLY after visual verification.')
      }
    }
  }

  if (includeStatic) {
    const imagesDir = path.join(process.cwd(), 'public', 'images')
    if (!fs.existsSync(imagesDir)) {
      console.log('\n[static] public/images not found — skipping static walk.')
    } else {
      const files = fs.readdirSync(imagesDir).filter((f) => !f.startsWith('.'))
      console.log(`\n[static] Found ${files.length} files in public/images`)
      for (const file of files) {
        const localPath = path.join(imagesDir, file)
        if (fs.statSync(localPath).isDirectory()) continue
        const publicId = `chc/static/${path.basename(file).replace(/\.[^.]+$/, '')}`
        if (dryRun) {
          console.log(`  [dry-run] would upload static ${file} -> ${publicId}`)
          continue
        }
        try {
          const result = await cloudinary.uploader.upload(localPath, { public_id: publicId, overwrite: false, resource_type: file.endsWith('.svg') ? 'image' : 'auto' })
          console.log(`  uploaded static ${file} -> ${result.public_id} (${result.width ?? '?'}x${result.height ?? '?'})`)
        } catch (err) {
          if (err.message?.includes('already exists') || err.http_code === 400) {
            console.log(`  skip static ${file} — already exists in Cloudinary`)
          } else {
            console.error(`  failed static ${file}:`, err.message)
          }
        }
      }
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
