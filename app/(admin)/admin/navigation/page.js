import { requireAdmin } from '@/lib/cms/auth-helpers'
import AdminShell from '@/app/(admin)/components/AdminShell'
import NavEditor from './NavEditor'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Navigation' }

export default async function NavigationPage() {
  const session = await requireAdmin()

  let items = []
  try {
    items = await prisma.navigationItem.findMany({
      where: { parentId: null },
      orderBy: { sortOrder: 'asc' },
      include: { children: { orderBy: { sortOrder: 'asc' } } },
    })
  } catch { /* DB not connected */ }

  return (
    <AdminShell session={session}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Navigation</h1>
          <p className="admin-page-subtitle">Manage header navigation items and dropdowns</p>
        </div>
      </div>
      <NavEditor initialItems={JSON.parse(JSON.stringify(items))} />
    </AdminShell>
  )
}
