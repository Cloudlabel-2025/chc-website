/** @type {import('next').NextConfig} */
const isDevelopment = process.env.NODE_ENV !== 'production'

const nextConfig = {
  // Keep `next dev` output separate from `next build` output. Running a build
  // while a dev server is open must never remove the CSS/client chunks that the
  // browser is currently using.
  distDir: isDevelopment ? '.next-dev' : '.next',
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  output: 'standalone',
  async headers() {
    const securityHeaders = [
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'", "base-uri 'self'", "form-action 'self'",
          "frame-ancestors 'self'", "object-src 'none'",
          // Next.js dev client chunks use eval-based source maps. Without this
          // development-only allowance, React cannot hydrate any interactive
          // component (including the CMS login form).
          `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ''}`,
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' data: https://fonts.gstatic.com",
          "img-src 'self' data: blob: https:",
          `connect-src 'self'${isDevelopment ? ' ws: wss:' : ''}`,
          'upgrade-insecure-requests',
        ].join('; '),
      },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
    ]
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      { source: '/admin/:path*', headers: [{ key: 'Cache-Control', value: 'no-store, max-age=0' }] },
      { source: '/api/admin/:path*', headers: [{ key: 'Cache-Control', value: 'no-store, max-age=0' }] },
    ]
  },
}

module.exports = nextConfig
