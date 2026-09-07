'use client'

import { signOut } from 'next-auth/react'

export default function SignOutButton({ className = '' }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className={`admin-btn admin-btn-secondary admin-btn-sm ${className}`.trim()}
    >
      Sign out
    </button>
  )
}
