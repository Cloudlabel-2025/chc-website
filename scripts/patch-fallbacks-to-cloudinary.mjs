import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const assets = await prisma.mediaAsset.findMany({ select: { filename: true, publicUrl: true } })
const map = new Map()
for (const a of assets) {
  if (a.publicUrl.includes('res.cloudinary.com')) {
    const base = path.basename(a.filename)
    const baseNoExt = base.replace(/\.[^.]+$/, '').toLowerCase()
    map.set(base.toLowerCase(), a.publicUrl)
    map.set(baseNoExt, a.publicUrl)
    // Also map full /images path
    map.set(`/images/${base}`.toLowerCase(), a.publicUrl)
    map.set(`/images/${base}`.toLowerCase().replace('.png', '.png').replace('.jpg', '.jpg'), a.publicUrl)
  }
}
console.log(`Cloudinary assets: ${map.size} keys (sample: ${[...map.keys()].slice(0,3).join(', ')})`)

let filePath = path.join(process.cwd(), 'lib/cms/public-data.js')
let content = fs.readFileSync(filePath, 'utf8')
let replaced = 0
for (const [local, cloudUrl] of map.entries()) {
  // Only replace full /images/... occurrences
  if (!local.startsWith('/images/')) continue
  const escaped = local.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`'${escaped}'`, 'g')
  const matches = (content.match(re) || []).length
  if (matches > 0) {
    content = content.replace(re, `'${cloudUrl}'`)
    replaced += matches
    console.log(`  replaced ${matches}x '${local}'`)
  }
}
if (replaced > 0) {
  fs.writeFileSync(filePath, content)
  console.log(`Patched lib/cms/public-data.js: ${replaced} replacements`)
} else {
  console.log('No /images/ fallbacks found to replace (already Cloudinary or no match)')
}

// Also patch section-templates.js
let tplPath = path.join(process.cwd(), 'lib/cms/section-templates.js')
let tplContent = fs.readFileSync(tplPath, 'utf8')
let tplReplaced = 0
for (const [local, cloudUrl] of map.entries()) {
  if (!local.startsWith('/images/')) continue
  const escaped = local.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`'${escaped}'`, 'g')
  const matches = (tplContent.match(re) || []).length
  if (matches > 0) {
    tplContent = tplContent.replace(re, `'${cloudUrl}'`)
    tplReplaced += matches
    console.log(`  tpl replaced ${matches}x '${local}'`)
  }
}
if (tplReplaced > 0) {
  fs.writeFileSync(tplPath, tplContent)
  console.log(`Patched lib/cms/section-templates.js: ${tplReplaced} replacements`)
}

await prisma.$disconnect()
console.log('Done')
