import SignOutButton from './SignOutButton'

export default function AdminHeader({ session }) {
  return (
    <header className="admin-header">
      <a href="/admin/dashboard" className="admin-header-brand">
        CHC <span>Admin</span>
      </a>
      <div className="admin-header-actions">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-btn admin-btn-secondary admin-btn-sm"
        >
          View site ↗
        </a>
        <span className="admin-text-muted admin-text-sm">
          {session?.user?.name}
        </span>
        <SignOutButton />
      </div>
    </header>
  )
}
