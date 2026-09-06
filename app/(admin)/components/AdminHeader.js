import SignOutButton from './SignOutButton'

export default function AdminHeader({ session, navOpen, onToggleNav }) {
  return (
    <header className="admin-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          type="button"
          className="admin-menu-toggle"
          aria-expanded={!!navOpen}
          aria-controls="admin-sidebar"
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
          onClick={onToggleNav}
        >
          <svg viewBox="0 0 16 16" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {navOpen
              ? <path d="M3 3l10 10M13 3L3 13" />
              : <path d="M2 4h12M2 8h12M2 12h12" />}
          </svg>
        </button>
        <a href="/admin/dashboard" className="admin-header-brand">
          CHC <span>Admin</span>
        </a>
      </div>
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
