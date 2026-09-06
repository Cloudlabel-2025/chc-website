import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const isAdminRoute = pathname.startsWith('/admin')
  const isAdminApi = pathname.startsWith('/api/admin')
  const isLoginPage = pathname === '/admin/login'
  const devBypass = process.env.NODE_ENV !== 'production' && process.env.CMS_DEV_BYPASS === 'true'
  const requestHeaders = new Headers(request.headers)
  if (isAdminRoute || isAdminApi) requestHeaders.set('x-admin-route', '1')

  if (isAdminApi && !['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    const origin = request.headers.get('origin')
    if (!origin || origin !== request.nextUrl.origin) {
      return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
    }
  }

  // Verify JWT token — Edge-compatible, no Node.js modules
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  })

  const isAuthenticated = !!token?.id
  const role = token?.role

  // Allow login page through
  if (isLoginPage) {
    if (isAuthenticated || devBypass) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  // All other /admin/* routes require a valid session
  if ((isAdminRoute || isAdminApi) && !isAuthenticated && !devBypass) {
    if (isAdminApi) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Role check
  if ((isAdminRoute || isAdminApi) && (isAuthenticated || devBypass)) {
    // The local bypass has no JWT, so its admin identity is resolved server-side
    // by auth(). Do not reject it here for having no token role.
    if (devBypass) return NextResponse.next({ request: { headers: requestHeaders } })
    if (!['ADMIN', 'SUPER_ADMIN'].includes(role)) {
      if (isAdminApi) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
