import { requireAdmin } from '@/lib/cms/auth-helpers'
import AdminShell from '@/app/(admin)/components/AdminShell'
import NavEditor from './NavEditor'
import prisma from '@/lib/prisma'
import { getNavigationFallback } from '@/lib/cms/navigation-defaults'
import { restoreDefaultNavigation, topLevelNavigationWhere } from '@/lib/cms/navigation'
import { databaseQuery } from '@/lib/cms/database-query'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Navigation' }

export default async function NavigationPage() {
  const session = await requireAdmin()

  let items = []
  let databaseAvailable = true
  try {
    items = await databaseQuery(prisma.navigationItem.findMany({
      where: topLevelNavigationWhere(),
      orderBy: { sortOrder: 'asc' },
      include: { children: { orderBy: { sortOrder: 'asc' } } },
    }))
    // A connected but newly created database has no navigation rows. Populate
    // it from the public site defaults once so the editor is never blank.
    if (items.length === 0) {
      await databaseQuery(restoreDefaultNavigation(session.user.id))
      items = await databaseQuery(prisma.navigationItem.findMany({
        where: topLevelNavigationWhere(),
        orderBy: { sortOrder: 'asc' },
        include: { children: { orderBy: { sortOrder: 'asc' } } },
      }))
    }
  } catch {
    items = getNavigationFallback()
    databaseAvailable = false
  }

  return (
    <AdminShell session={session}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Navigation</h1>
          <p className="admin-page-subtitle">Manage header navigation items and dropdowns</p>
        </div>
      </div>
      <NavEditor initialItems={JSON.parse(JSON.stringify(items))} databaseAvailable={databaseAvailable} />
    </AdminShell>
  )
}
