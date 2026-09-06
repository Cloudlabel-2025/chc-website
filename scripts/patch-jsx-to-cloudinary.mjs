import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const assets = await prisma.mediaAsset.findMany({ select: { filename: true, publicUrl: true } })
const map = new Map()
for (const a of assets) {
  if (a.publicUrl.includes('res.cloudinary.com')) {
    map.set(`/images/${a.filename}`.toLowerCase(), a.publicUrl)
  }
}

const jsxFiles = [
  'components/Header.jsx',
  'components/Footer.jsx',
  'components/ContentSection.jsx',
  'app/layout.js',
  'app/page.js',
  'app/applications/page.js',
  'app/our-impact/page.js',
  'app/[slug]/page.js',
  'app/(admin)/admin/login/page.js',
  'app/(admin)/components/AdminHeader.js',
]

let totalReplaced = 0
for (const relPath of jsxFiles) {
  const fullPath = path.join(process.cwd(), relPath)
  if (!fs.existsSync(fullPath)) { console.log(`skip ${relPath} — not found`); continue }
  let content = fs.readFileSync(fullPath, 'utf8')
  let fileReplaced = 0
  for (const [local, cloudUrl] of map.entries()) {
    // Match both single and double quoted occurrences
    const escaped = local.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const re = new RegExp(`(['"])${escaped}\\1`, 'g')
    const matches = (content.match(re) || []).length
    if (matches > 0) {
      content = content.replace(re, `'${cloudUrl}'`)
      fileReplaced += matches
    }
    // Also match url('/images/...') and url("/images/...")
    const reUrl = new RegExp(`url\\((['"])${escaped}\\1\\)`, 'g')
    const matchesUrl = (content.match(reUrl) || []).length
    if (matchesUrl > 0) {
      content = content.replace(reUrl, `url('${cloudUrl}')`)
      fileReplaced += matchesUrl
    }
  }
  if (fileReplaced > 0) {
    fs.writeFileSync(fullPath, content)
    console.log(`Patched ${relPath}: ${fileReplaced} replacements`)
    totalReplaced += fileReplaced
  } else {
    console.log(`No matches in ${relPath}`)
  }
}
console.log(`\nTotal JSX replacements: ${totalReplaced}`)
await prisma.$disconnect()
