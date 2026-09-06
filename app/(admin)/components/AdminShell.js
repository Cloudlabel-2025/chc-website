'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

export default function AdminShell({ session, children }) {
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('chc-mobile-menu-open', navOpen)
    const onKey = (e) => { if (e.key === 'Escape') setNavOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.classList.remove('chc-mobile-menu-open')
      window.removeEventListener('keydown', onKey)
    }
  }, [navOpen])

  return (
    <div className="admin-shell">
      <AdminHeader session={session} navOpen={navOpen} onToggleNav={() => setNavOpen((v) => !v)} />
      <AdminSidebar isOpen={navOpen} onClose={() => setNavOpen(false)} />
      {navOpen && <div className="admin-backdrop" onClick={() => setNavOpen(false)} />}
      <main className="admin-main">
        {children}
      </main>
    </div>
  )
}
