import '@/app/(admin)/admin.css'

export const metadata = {
  title: { template: '%s — CHC Admin', default: 'CHC Admin' },
  robots: { index: false, follow: false },
}

export default function AdminGroupLayout({ children }) {
  return children
}
