'use client'

import { usePathname } from 'next/navigation'

export default function AdminHeader({ session }) {
  const pathname = usePathname()
  const pageName = pathname.split('/').filter(Boolean).at(-1)?.replaceAll('-', ' ') || 'dashboard'

  return (
    <header className="admin-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <label
          htmlFor="admin-mobile-menu"
          className="admin-menu-toggle"
          aria-controls="admin-sidebar"
          aria-label="Toggle navigation"
        >
          <svg viewBox="0 0 16 16" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M2 4h12M2 8h12M2 12h12" />
          </svg>
        </label>
        <a href="/admin/dashboard" className="admin-header-brand">
          <img src="/images/chc-logo.png" alt="CHC" className="admin-header-logo" />
          CHC <span>Admin</span>
        </a>
        <span className="admin-header-context">/ {pageName}</span>
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
        <span className="admin-user-chip"><span className="admin-user-initial">{session?.user?.name?.slice(0, 1).toUpperCase() || 'A'}</span>{session?.user?.name}</span>
      </div>
    </header>
  )
}
