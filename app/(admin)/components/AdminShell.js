import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

export default function AdminShell({ session, children }) {
  return (
    <div className="admin-shell">
      <input id="admin-mobile-menu" className="admin-mobile-menu-state" type="checkbox" aria-hidden="true" tabIndex={-1} />
      <AdminHeader session={session} />
      <AdminSidebar session={session} />
      <label htmlFor="admin-mobile-menu" className="admin-backdrop" aria-label="Close navigation" />
      <main className="admin-main">
        {children}
      </main>
    </div>
  )
}
