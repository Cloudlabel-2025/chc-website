import { requireAdmin } from '@/lib/cms/auth-helpers'
import AdminShell from '@/app/(admin)/components/AdminShell'
import PageEditor from './PageEditor'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  return { title: `Edit: ${params.slug}` }
}

export default async function PageEditorPage({ params }) {
  const session = await requireAdmin()
  const { slug } = params

  let page = null
  try {
    page = await prisma.page.findUnique({
      where: { slug },
      include: {
        seoMeta: true,
        sections: {
          orderBy: { sortOrder: 'asc' },
          include: {
            blocks: {
              where: { parentId: null },
              orderBy: { sortOrder: 'asc' },
              include: { mediaAsset: true },
            },
          },
        },
      },
    })
  } catch { /* DB not connected */ }

  return (
    <AdminShell session={session}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            Edit: <span style={{ color: 'var(--admin-primary)' }}>{slug}</span>
          </h1>
          <p className="admin-page-subtitle">
            <a href="/admin/pages" style={{ color: 'var(--admin-text-muted)' }}>← Pages</a>
            {' · '}
            <a href={`/${slug === 'home' ? '' : slug}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--admin-text-muted)' }}>
              View page ↗
            </a>
          </p>
        </div>
        {page && (
          <span className={`admin-badge ${page.isPublished ? 'admin-badge-published' : 'admin-badge-draft'}`}>
            {page.isPublished ? 'Published' : 'Draft'}
          </span>
        )}
      </div>

      {!page ? (
        <div className="admin-card">
          <div className="admin-card-body">
            <div className="admin-empty">
              <div className="admin-empty-icon">📄</div>
              <p className="admin-empty-title">Page not seeded yet</p>
              <p className="admin-text-muted">
                Run <code>npm run db:seed</code> to populate the database with the current site content,
                then return here to edit.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <PageEditor page={JSON.parse(JSON.stringify(page))} slug={slug} />
      )}
    </AdminShell>
  )
}
