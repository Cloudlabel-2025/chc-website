import { getSession } from '@/lib/cms/auth-helpers'
import { redirect } from 'next/navigation'
import LoginForm from './LoginForm'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Sign In' }

export default async function LoginPage({ searchParams }) {
  // If already authenticated, skip login
  const session = await getSession()
  if (session?.user?.id) {
    redirect('/admin/dashboard')
  }

  const params = await searchParams
  const callbackUrl = params?.callbackUrl ?? '/admin/dashboard'

  return (
    <div className="admin-login-shell">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <img src="/images/chc-logo.png" alt="CHC" />
        </div>
        <h1 className="admin-login-title">Admin Panel</h1>
        <p className="admin-login-subtitle">Sign in to manage CHC website content</p>
        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </div>
  )
}
