'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function LoginForm({ callbackUrl }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [rateLimited, setRateLimited] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)

  function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setRateLimited(false)
    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')?.toString().trim()
    const password = formData.get('password')?.toString()

    if (!username || !password) {
      setError('Username and password are required.')
      return
    }

    startTransition(async () => {
      try {
        // This client helper posts directly to Auth.js's credentials callback,
        // which is the request that creates the signed session cookie.
        const result = await signIn('credentials', { username, password, redirect: false, callbackUrl })
        if (!result?.ok) {
          const nextFailures = failedAttempts + 1
          setFailedAttempts(nextFailures)
          if (nextFailures >= 6) {
            setRateLimited(true)
            setError('Too many failed attempts. Please wait 15 minutes before trying again.')
            return
          }
          setError('Invalid email or password.')
          return
        }

        router.replace(callbackUrl)
        router.refresh()
      } catch {
        setError('Unable to sign in right now. Please try again.')
      }
    })
  }

  // `method="post"` is a safety fallback: if JavaScript ever fails to load,
  // credentials can never be appended to the URL by a native GET submission.
  return <form onSubmit={handleSubmit} action="/admin/login" method="post" noValidate>
    {error && <div className={`admin-alert ${rateLimited ? 'admin-alert-warning' : 'admin-alert-error'} admin-mb-16`} role="alert">{error}</div>}
    <div className="admin-form-group">
      <label htmlFor="username" className="admin-label admin-label-required">Username (email address)</label>
      <input id="username" name="username" type="email" autoComplete="email" required disabled={isPending} className="admin-input" placeholder="admin@example.com" />
    </div>
    <div className="admin-form-group admin-password-group">
      <label htmlFor="password" className="admin-label admin-label-required">Password</label>
      <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required disabled={isPending} className="admin-input" placeholder="Enter your password" />
      <button type="button" className="admin-password-toggle" onClick={() => setShowPassword((shown) => !shown)} disabled={isPending} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button>
    </div>
    <button type="submit" disabled={isPending} className="admin-btn admin-btn-primary admin-btn-lg admin-btn-full admin-mt-8">{isPending ? 'Signing in…' : 'Sign in'}</button>
  </form>
}
