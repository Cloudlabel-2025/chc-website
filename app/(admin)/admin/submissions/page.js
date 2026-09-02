import { requireAdmin } from '@/lib/cms/auth-helpers'
import AdminShell from '@/app/(admin)/components/AdminShell'
import SubmissionsInbox from './SubmissionsInbox'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Submissions' }

export default async function SubmissionsPage() {
  const session = await requireAdmin()

  let submissions = []
  let total = 0
  let unread = 0

  try {
    ;[submissions, total, unread] = await Promise.all([
      prisma.formSubmission.findMany({
        orderBy: { submittedAt: 'desc' },
        take: 20,
      }),
      prisma.formSubmission.count(),
      prisma.formSubmission.count({ where: { isRead: false } }),
    ])
  } catch { /* DB not connected */ }

  return (
    <AdminShell session={session}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            Submissions
            {unread > 0 && (
              <span className="admin-badge admin-badge-draft" style={{ marginLeft: 10, fontSize: 12 }}>
                {unread} unread
              </span>
            )}
          </h1>
          <p className="admin-page-subtitle">{total} total submission{total !== 1 ? 's' : ''}</p>
        </div>
      </div>
      <SubmissionsInbox
        initialSubmissions={JSON.parse(JSON.stringify(submissions))}
        initialTotal={total}
      />
    </AdminShell>
  )
}
