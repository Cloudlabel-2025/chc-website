'use client'

import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="admin-btn admin-btn-secondary admin-btn-sm"
    >
      Sign out
    </button>
  )
}
