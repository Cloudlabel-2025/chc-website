import { requireAdmin } from '@/lib/cms/auth-helpers'
import AdminShell from '@/app/(admin)/components/AdminShell'
import ChangePasswordForm from './ChangePasswordForm'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const session = await requireAdmin()

  return (
    <AdminShell session={session}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Settings</h1>
          <p className="admin-page-subtitle">Account settings for {session.user.email}</p>
        </div>
      </div>

      <div style={{ maxWidth: 480 }}>
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Change password</span>
          </div>
          <div className="admin-card-body">
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
