import { requireAdmin } from '@/lib/cms/auth-helpers'
import AdminShell from '@/app/(admin)/components/AdminShell'
import FooterForm from './FooterForm'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Footer' }

export default async function FooterPage() {
  const session = await requireAdmin()

  let footer = null
  try {
    footer = await prisma.footerConfig.findFirst()
  } catch { /* DB not connected */ }

  return (
    <AdminShell session={session}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Footer</h1>
          <p className="admin-page-subtitle">Manage footer addresses, CTA, social links, and copyright</p>
        </div>
      </div>
      <FooterForm initial={footer ? JSON.parse(JSON.stringify(footer)) : null} />
    </AdminShell>
  )
}
