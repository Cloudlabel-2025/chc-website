/**
 * CHC CMS — Media Migration Script
 *
 * Uploads CMS-referenced images from public/images/ to S3-compatible storage
 * and creates MediaAsset rows in the database.
 *
 * Only migrates images that are actually referenced in JSX/CSS (the CMS-editable
 * set). Demo/vendor/unused Crafto theme assets are excluded.
 *
 * Safe to re-run: skips any image whose storageKey already exists in the DB.
 *
 * Usage:
 *   npm run migrate:media
 *
 * Requires all STORAGE_* and DATABASE_URL env vars to be set.
 */

import dotenv from 'dotenv'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PrismaClient } from '@prisma/client'
import { uploadFile, generateStorageKey } from '../lib/cms/storage.js'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT      = path.resolve(__dirname, '..')
const PUBLIC    = path.join(ROOT, 'public', 'images')

const prisma = new PrismaClient()

// ─── CMS-referenced images ────────────────────────────────────────────────────
// Derived from Phase 0 audit: images actually used in JSX/components.
// Excludes: demo-*, country flags, icomoon fonts, unused Crafto template assets.
// Each entry: { file, altText, usedIn }

const CMS_IMAGES = [
  // Brand / fixed assets (uploaded for reference; not CMS-editable but needed)
  { file: 'chc-logo.png',              altText: 'CHC logo',                    usedIn: 'Header, Footer' },
  { file: 'chc-spinner.png',           altText: 'CHC spinner animation',       usedIn: 'Home intro, Footer' },
  { file: 'chc-spin-support.png',      altText: 'CHC spin support graphic',    usedIn: 'Home intro, Footer' },

  // Home hero
  { file: 'Oracle-hcm-hero.png',       altText: 'Hero background',             usedIn: 'Home hero, inner page hero fallback' },

  // Home intro section
  { file: 'home-first-section.jpg',    altText: 'CHC team at work',            usedIn: 'Home intro left image' },
  { file: 'home-content-2.jpg',        altText: 'CHC consulting',              usedIn: 'Home intro right image' },

  // Home — What We Do cards
  { file: 'oracle-home-hcm.jpg',       altText: 'Oracle HCM',                  usedIn: 'Home What We Do card' },
  { file: 'app-dev-home.jpg',          altText: 'Application Development',     usedIn: 'Home What We Do card' },
  { file: 'pts-home.jpg',              altText: 'Productised Tech Services',   usedIn: 'Home What We Do card' },

  // Home — Why CHC stack cards
  { file: 'sls-home.jpg',              altText: 'Senior-led Delivery',         usedIn: 'Home Why CHC card' },
  { file: 'cost-effective.jpg',        altText: 'Cost-effective execution',    usedIn: 'Home Why CHC card' },
  { file: 'cap-dev.jpg',               altText: 'Capability development',      usedIn: 'Home Why CHC card' },
  { file: 'social-impact.jpg',         altText: 'Social impact',               usedIn: 'Home Why CHC card' },

  // Oracle HCM page — content section
  { file: 'Oracle-hcm-content.jpg',    altText: 'Oracle HCM content',         usedIn: 'Oracle HCM content section left' },
  { file: 'oracle-hcm-content-02.jpg', altText: 'Oracle HCM consulting',      usedIn: 'Oracle HCM content section right' },

  // Oracle HCM — core capability icons
  { file: 'core-hr-vec.png',           altText: 'Core HR',                     usedIn: 'Oracle HCM capabilities' },
  { file: 'wfs.png',                   altText: 'Workforce Structure',         usedIn: 'Oracle HCM capabilities' },
  { file: 'compensation-vector.png',   altText: 'Compensation',                usedIn: 'Oracle HCM capabilities' },
  { file: 'talent-vector.png',         altText: 'Talent',                      usedIn: 'Oracle HCM capabilities' },
  { file: 'learning-vector.png',       altText: 'Learning',                    usedIn: 'Oracle HCM capabilities' },
  { file: 'payroll-vector.png',        altText: 'Payroll',                     usedIn: 'Oracle HCM capabilities' },
  { file: 'security-aor-vector.png',   altText: 'Security/AOR',                usedIn: 'Oracle HCM capabilities' },
  { file: 'approvals-vector.png',      altText: 'Approvals',                   usedIn: 'Oracle HCM capabilities' },
  { file: 'journey-vector.png',        altText: 'Journey',                     usedIn: 'Oracle HCM capabilities' },
  { file: 'hcm-extracts-vector.png',   altText: 'HCM Extracts',                usedIn: 'Oracle HCM capabilities' },
  { file: 'integrations-vector.png',   altText: 'Integrations',                usedIn: 'Oracle HCM capabilities' },
  { file: 'testing-vectot.png',        altText: 'Testing',                     usedIn: 'Oracle HCM capabilities' },
  { file: 'qua-rel-vec.png',           altText: 'Quarterly Releases',          usedIn: 'Oracle HCM capabilities' },
  { file: 'redwood-vec.png',           altText: 'Redwood / VBCS',              usedIn: 'Oracle HCM capabilities' },
  { file: 'technical-remediation-vec.png', altText: 'Technical Remediation',   usedIn: 'Oracle HCM capabilities' },

  // Oracle HCM — productised services
  { file: 'healthcheck.jpg',           altText: 'Oracle HCM Health Check',     usedIn: 'Oracle HCM productised services' },
  { file: 'rapid-response.jpg',        altText: 'Oracle Rapid Response',       usedIn: 'Oracle HCM productised services' },
  { file: 'release-assurance.jpg',     altText: 'Release Assurance',           usedIn: 'Oracle HCM productised services' },
  { file: 'oracle-tech-pod.jpg',       altText: 'Oracle Technology Pod',       usedIn: 'Oracle HCM productised services' },

  // Oracle HCM — service carousel
  { file: 'config.png',                altText: 'Configuration',               usedIn: 'Oracle HCM service carousel' },
  { file: 'testing.jpg',               altText: 'Testing',                     usedIn: 'Oracle HCM service carousel' },
  { file: 'reporting.jpg',             altText: 'Reporting',                   usedIn: 'Oracle HCM service carousel' },
  { file: 'data.jpg',                  altText: 'Data',                        usedIn: 'Oracle HCM service carousel' },
  { file: 'integration.jpg',           altText: 'Integrations',                usedIn: 'Oracle HCM service carousel' },
  { file: 'vbcs.jpg',                  altText: 'VBCS',                        usedIn: 'Oracle HCM service carousel' },
  { file: 'support.jpg',               altText: 'Release Support',             usedIn: 'Oracle HCM service carousel' },
  { file: 'manage-support.jpg',        altText: 'Managed Support',             usedIn: 'Oracle HCM service carousel' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase()
  const map = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' }
  return map[ext] ?? 'application/octet-stream'
}

// Reads PNG/JPEG/WebP dimensions from buffer without external deps
function readDimensions(buffer, mimeType) {
  try {
    if (mimeType === 'image/png' && buffer.length >= 24 && buffer[0] === 0x89) {
      return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
    }
    if (mimeType === 'image/jpeg' && buffer[0] === 0xFF && buffer[1] === 0xD8) {
      let offset = 2
      while (offset < buffer.length - 8) {
        if (buffer[offset] !== 0xFF) break
        const marker = buffer[offset + 1]
        const length = buffer.readUInt16BE(offset + 2)
        if (marker === 0xC0 || marker === 0xC2) {
          return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) }
        }
        offset += 2 + length
      }
    }
  } catch { /* ignore */ }
  return null
}

async function getOrCreateSystemUser() {
  const existing = await prisma.user.findFirst({ where: { email: 'seed@system.internal' } })
  if (existing) return existing.id
  const user = await prisma.user.create({
    data: { email: 'seed@system.internal', passwordHash: 'DISABLED', name: 'Seed Script', role: 'ADMIN', isActive: false, updatedAt: new Date() },
  })
  return user.id
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('CHC CMS — media migration\n')

  // Validate storage config before doing anything
  const required = ['MONGODB_URI', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']
  const missing  = required.filter((k) => !process.env[k])
  if (missing.length) {
    console.error(`Missing required env vars: ${missing.join(', ')}`)
    console.error('Copy .env.example to .env and fill in the storage credentials.')
    process.exit(1)
  }

  const userId = await getOrCreateSystemUser()

  let uploaded = 0
  let skipped  = 0
  let missing_files = 0

  for (const entry of CMS_IMAGES) {
    const filePath = path.join(PUBLIC, entry.file)

    // Skip if file doesn't exist in public/images/
    if (!existsSync(filePath)) {
      console.log(`  ⚠  missing locally: ${entry.file}`)
      missing_files++
      continue
    }

    // Skip if already migrated (storageKey pattern: media/YYYY/MM/<hash>.<ext>)
    // We identify by original filename stored in the DB
    const existing = await prisma.mediaAsset.findFirst({
      where: { filename: entry.file },
    })
    if (existing) {
      console.log(`  ↷  already migrated: ${entry.file}`)
      skipped++
      continue
    }

    const buffer     = await readFile(filePath)
    const mimeType   = getMimeType(entry.file)
    const sizeBytes  = buffer.length
    const storageKey = generateStorageKey(entry.file)
    const dims       = readDimensions(buffer, mimeType)

    // Upload using the same Cloudinary adapter as the CMS media library.
    let storageResult
    try {
      storageResult = await uploadFile({ buffer, storageKey, mimeType, sizeBytes })
    } catch (err) {
      console.error(`  ✗  upload failed: ${entry.file} — ${err.message}`)
      continue
    }

    // Create MediaAsset row
    await prisma.mediaAsset.create({
      data: {
        filename:     entry.file,
        storageKey:   storageResult.storageKey,
        publicUrl:    storageResult.publicUrl,
        mimeType,
        sizeBytes,
        width:        storageResult.width  ?? dims?.width  ?? null,
        height:       storageResult.height ?? dims?.height ?? null,
        altText:      entry.altText,
        uploadedById: userId,
        updatedAt:    new Date(),
      },
    })

    console.log(`  ✓  ${entry.file} → ${storageKey} (${(sizeBytes / 1024).toFixed(0)}KB)`)
    uploaded++
  }

  console.log(`\n✅ Done. Uploaded: ${uploaded}, skipped (already migrated): ${skipped}, missing locally: ${missing_files}`)

  if (missing_files > 0) {
    console.log('\n⚠  Some files were not found in public/images/.')
    console.log('   These images will continue to be served from /images/ until uploaded via the admin media library.')
  }

  if (uploaded > 0) {
    console.log('\nNext step: run `npm run db:seed` to link migrated MediaAsset rows to content blocks.')
    console.log('Or use the admin media library to assign images to content fields manually.')
  }
}

main()
  .catch((err) => { console.error('\nMigration failed:', err); process.exit(1) })
  .finally(() => prisma.$disconnect())
