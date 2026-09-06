import { requireAdmin } from '@/lib/cms/auth-helpers'
import AdminShell from '@/app/(admin)/components/AdminShell'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Dashboard' }

async function getDashboardCounts() {
  if (process.env.NODE_ENV !== 'production' && process.env.CMS_DEV_BYPASS === 'true') {
    return { pages: '—', media: '—', submissions: '—' }
  }
  try {
    const [pages, media, submissions] = await Promise.all([
      prisma.page.count(),
      prisma.mediaAsset.count(),
      prisma.formSubmission.count({ where: { isRead: false } }),
    ])
    return { pages, media, submissions }
  } catch {
    return { pages: '—', media: '—', submissions: '—' }
  }
}

export default async function DashboardPage() {
  const session = await requireAdmin()
  const counts = await getDashboardCounts()

  return (
    <AdminShell session={session}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Welcome back, {session.user.name}</p>
        </div>
      </div>

      <div className="admin-grid-3 admin-mb-16">
        <div className="admin-card">
          <div className="admin-card-body">
            <p className="admin-text-muted admin-text-sm">Pages</p>
            <p style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>{counts.pages}</p>
          </div>
        </div>
        <div className="admin-card">
          <div className="admin-card-body">
            <p className="admin-text-muted admin-text-sm">Media assets</p>
            <p style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>{counts.media}</p>
          </div>
        </div>
        <div className="admin-card">
          <div className="admin-card-body">
            <p className="admin-text-muted admin-text-sm">Unread submissions</p>
            <p style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>{counts.submissions}</p>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">Getting started</span>
        </div>
        <div className="admin-card-body">
          <p className="admin-text-muted">
            Connect your PostgreSQL database and configure your <code>.env</code> file to begin managing content.
          </p>
          <ul style={{ marginTop: 12, paddingLeft: 20, lineHeight: 2 }} className="admin-text-muted">
            <li>Phase 1 ✅ Database schema + Prisma migrations</li>
            <li>Phase 2 ✅ Authentication (Auth.js + bcrypt + rate limiting)</li>
            <li>Phase 3 ✅ Media library (S3-compatible storage + admin UI)</li>
            <li>Phase 4 ✅ CMS backend (pages, sections, blocks, nav, footer, SEO, forms)</li>
            <li>Phase 5 ✅ Admin UI (page editor, nav editor, footer editor, SEO manager, submissions inbox)</li>
            <li>Phase 6 ✅ Public site wired to DB (all 10 pages, fallbacks on every function)</li>
            <li>Phase 7 ✅ Media migration script (S3 upload + MediaAsset rows)</li>
            <li>Phase 8 ✅ Validation audit (seoSchema fix, field-rules single source of truth)</li>
            <li>Phase 9 ✅ All repeatable sections wired to DB (about, services, oracle-hcm, applications, our-impact)</li>
            <li>Phase 10 ✅ Production hardening (our-delivery-model wired, form rate limiting, security headers)</li>
          </ul>
        </div>
      </div>
    </AdminShell>
  )
}
