import { requireAdmin } from '@/lib/cms/auth-helpers'
import AdminShell from '@/app/(admin)/components/AdminShell'
import prisma from '@/lib/prisma'
import FormBuilder from './FormBuilder'
import { databaseQuery } from '@/lib/cms/database-query'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Forms' }

export default async function FormsPage() {
  const session = await requireAdmin()
  let forms = []
  try { forms = await databaseQuery(prisma.formDefinition.findMany({ orderBy: { createdAt: 'asc' } })) } catch {}
  return (
    <AdminShell session={session}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Forms</h1>
          <p className="admin-page-subtitle">Create and manage forms — add fields, set restrictions, publish/unpublish.</p>
        </div>
      </div>
      <FormBuilder initialForms={JSON.parse(JSON.stringify(forms))} />
    </AdminShell>
  )
}
