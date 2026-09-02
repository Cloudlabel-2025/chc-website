import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

export default function AdminShell({ session, children }) {
  return (
    <div className="admin-shell">
      <AdminHeader session={session} />
      <AdminSidebar />
      <main className="admin-main">
        {children}
      </main>
    </div>
  )
}
