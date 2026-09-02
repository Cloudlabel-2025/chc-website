import { requireAdmin } from '@/lib/cms/auth-helpers'
import AdminShell from '@/app/(admin)/components/AdminShell'
import MediaLibrary from './MediaLibrary'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Media Library' }

export default async function MediaPage() {
  const session = await requireAdmin()

  return (
    <AdminShell session={session}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Media Library</h1>
          <p className="admin-page-subtitle">Upload and manage images used across the site</p>
        </div>
      </div>
      <MediaLibrary />
    </AdminShell>
  )
}
