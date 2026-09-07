import { requireAdmin } from '@/lib/cms/auth-helpers'
import AdminShell from '@/app/(admin)/components/AdminShell'
import PagesManager from './PagesManager'
import prisma from '@/lib/prisma'
import { databaseQuery } from '@/lib/cms/database-query'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Pages' }

const PAGE_SLUGS = [
  { slug: 'home',              title: 'Home' },
  { slug: 'about',             title: 'About' },
  { slug: 'services',          title: 'Services' },
  { slug: 'oracle-hcm',        title: 'Oracle HCM' },
  { slug: 'applications',      title: 'Applications' },
  { slug: 'our-delivery-model',title: 'Our Delivery Model' },
  { slug: 'our-impact',        title: 'Our Impact' },
  { slug: 'our-people',        title: 'Our People' },
  { slug: 'contact',           title: 'Contact' },
  { slug: 'give-one-hour',     title: 'Give One Hour' },
]

export default async function PagesPage() {
  const session = await requireAdmin()

  let pages = []
  try {
    pages = await databaseQuery(prisma.page.findMany({
      select: { id: true, slug: true, title: true, isPublished: true, updatedAt: true },
      orderBy: { slug: 'asc' },
    }))
  } catch { /* DB not connected yet */ }

  let templates = []
  try {
    templates = await databaseQuery(prisma.pageTemplate.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }))
  } catch { /* templates table may not exist yet */ }

  // Merge DB rows with known slugs so all 10 always appear
  const rows = PAGE_SLUGS.map((known) => {
    const db = pages.find((p) => p.slug === known.slug)
    return db ?? { id: null, slug: known.slug, title: known.title, isPublished: false, updatedAt: null }
  })
  // Append any extra DB pages not in the known list (created via + Create Page)
  for (const p of pages) {
    if (!rows.some((r) => r.slug === p.slug)) rows.push(p)
  }
  rows.sort((a, b) => a.slug.localeCompare(b.slug))

  return (
    <AdminShell session={session}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Pages</h1>
          <p className="admin-page-subtitle">Manage content for all {rows.length} site pages</p>
        </div>
      </div>

      <PagesManager
        initialPages={JSON.parse(JSON.stringify(rows))}
        templates={JSON.parse(JSON.stringify(templates))}
      />
    </AdminShell>
  )
}
