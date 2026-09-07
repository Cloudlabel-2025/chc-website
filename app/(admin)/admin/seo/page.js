import { requireAdmin } from '@/lib/cms/auth-helpers'
import AdminShell from '@/app/(admin)/components/AdminShell'
import SeoManager from './SeoManager'
import prisma from '@/lib/prisma'
import { databaseQuery } from '@/lib/cms/database-query'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'SEO' }

const PAGE_SLUGS = [
  'home','about','services','oracle-hcm','applications',
  'our-delivery-model','our-impact','our-people','contact','give-one-hour',
]

export default async function SeoPage() {
  const session = await requireAdmin()

  let seoList = []
  let pages   = []
  try {
    pages = await databaseQuery(prisma.page.findMany({ select: { id: true, slug: true, title: true } }))
    seoList = await databaseQuery(prisma.seoMeta.findMany({
      include: { page: { select: { slug: true, title: true } } },
    }))
  } catch { /* DB not connected */ }

  // Build rows for all known slugs
  const rows = PAGE_SLUGS.map((slug) => {
    const page = pages.find((p) => p.slug === slug)
    const seo  = seoList.find((s) => s.page.slug === slug)
    return { slug, title: page?.title ?? slug, pageId: page?.id ?? null, seo: seo ?? null }
  })

  return (
    <AdminShell session={session}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">SEO</h1>
          <p className="admin-page-subtitle">Meta titles, descriptions, and OG tags for all pages</p>
        </div>
      </div>
      <SeoManager rows={JSON.parse(JSON.stringify(rows))} />
    </AdminShell>
  )
}
