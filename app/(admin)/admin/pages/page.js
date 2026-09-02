import { requireAdmin } from '@/lib/cms/auth-helpers'
import AdminShell from '@/app/(admin)/components/AdminShell'
import prisma from '@/lib/prisma'

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
    pages = await prisma.page.findMany({
      select: { id: true, slug: true, title: true, isPublished: true, updatedAt: true },
      orderBy: { slug: 'asc' },
    })
  } catch { /* DB not connected yet */ }

  // Merge DB rows with known slugs so all 10 always appear
  const rows = PAGE_SLUGS.map((known) => {
    const db = pages.find((p) => p.slug === known.slug)
    return db ?? { id: null, slug: known.slug, title: known.title, isPublished: false, updatedAt: null }
  })

  return (
    <AdminShell session={session}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Pages</h1>
          <p className="admin-page-subtitle">Manage content for all {rows.length} site pages</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Page</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Last updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.slug}>
                  <td style={{ fontWeight: 600 }}>{row.title}</td>
                  <td><code style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>/{row.slug === 'home' ? '' : row.slug}</code></td>
                  <td>
                    {row.id
                      ? <span className={`admin-badge ${row.isPublished ? 'admin-badge-published' : 'admin-badge-draft'}`}>
                          {row.isPublished ? 'Published' : 'Draft'}
                        </span>
                      : <span className="admin-badge admin-badge-locked">Not seeded</span>
                    }
                  </td>
                  <td className="admin-text-muted admin-text-sm">
                    {row.updatedAt ? new Date(row.updatedAt).toLocaleDateString('en-AU') : '—'}
                  </td>
                  <td>
                    <a
                      href={`/admin/pages/${row.slug}`}
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                    >
                      Edit →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
