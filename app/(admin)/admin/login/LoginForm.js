'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction } from './actions'

export default function LoginForm({ callbackUrl }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [rateLimited, setRateLimited] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setRateLimited(false)

    const formData = new FormData(e.currentTarget)

    // Client-side UX validation (not authoritative — server validates too)
    const email = formData.get('email')?.toString().trim()
    const password = formData.get('password')?.toString()
    if (!email || !password) {
      setError('Email and password are required.')
      return
    }

    startTransition(async () => {
      const result = await loginAction(formData)

      if (result?.rateLimited) {
        setRateLimited(true)
        setError(result.error)
        return
      }

      if (result?.error) {
        setError(result.error)
        return
      }

      // Success — navigate to dashboard (or callbackUrl)
      router.push(callbackUrl)
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && (
        <div className={`admin-alert ${rateLimited ? 'admin-alert-warning' : 'admin-alert-error'} admin-mb-16`} role="alert">
          {error}
        </div>
      )}

      <div className="admin-form-group">
        <label htmlFor="email" className="admin-label admin-label-required">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isPending || rateLimited}
          className="admin-input"
          placeholder="admin@example.com"
        />
      </div>

      <div className="admin-form-group">
        <label htmlFor="password" className="admin-label admin-label-required">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isPending || rateLimited}
          className="admin-input"
          placeholder="••••••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={isPending || rateLimited}
        className="admin-btn admin-btn-primary admin-btn-lg admin-btn-full admin-mt-8"
      >
        {isPending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
