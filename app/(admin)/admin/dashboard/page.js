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
  const databaseConnected = counts.pages !== '—'

  return (
    <AdminShell session={session}>
      <div className="admin-dashboard-hero">
        <div>
          <p className="admin-eyebrow">Content operations</p>
          <h1 className="admin-page-title">Good to see you, {session.user.name}</h1>
          <p className="admin-page-subtitle">Manage your website content, assets, and enquiries from one place.</p>
        </div>
        <div className={`admin-connection-status${databaseConnected ? ' is-online' : ' is-offline'}`}>
          <span /> {databaseConnected ? 'Database connected' : 'Preview data mode'}
        </div>
      </div>

      <div className="admin-dashboard-stats admin-mb-16">
        <div className="admin-stat-card"><span className="admin-stat-icon">P</span><div><p className="admin-stat-label">Pages</p><p className="admin-stat-value">{counts.pages}</p></div></div>
        <div className="admin-stat-card"><span className="admin-stat-icon">M</span><div><p className="admin-stat-label">Media assets</p><p className="admin-stat-value">{counts.media}</p></div></div>
        <div className="admin-stat-card"><span className="admin-stat-icon">I</span><div><p className="admin-stat-label">Unread enquiries</p><p className="admin-stat-value">{counts.submissions}</p></div></div>
      </div>

      <div className="admin-dashboard-grid">
        <section className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">Quick actions</span></div>
          <div className="admin-quick-actions">
            <a href="/admin/pages" className="admin-quick-action"><strong>Manage pages</strong><span>Update sections and publish content →</span></a>
            <a href="/admin/media" className="admin-quick-action"><strong>Media library</strong><span>Upload and organise visual assets →</span></a>
            <a href="/admin/navigation" className="admin-quick-action"><strong>Site navigation</strong><span>Update menus and visibility →</span></a>
          </div>
        </section>
        <section className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">CMS health</span></div>
          <div className="admin-card-body">
            <p className="admin-text-muted">{databaseConnected ? 'Your live content connection is available. Changes made here can be published from the relevant workspace.' : 'The CMS is using safe preview data while the database reconnects. Editing controls remain limited until the connection returns.'}</p>
            <div className="admin-health-list">
              <span><i className={databaseConnected ? 'is-ok' : 'is-pending'} /> Content source</span>
              <span><i className="is-ok" /> Authentication</span>
              <span><i className="is-ok" /> Public site</span>
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  )
}
