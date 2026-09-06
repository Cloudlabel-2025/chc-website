import { requireAdmin } from '@/lib/cms/auth-helpers'
import AdminShell from '@/app/(admin)/components/AdminShell'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Templates' }

export default async function TemplatesPage() {
  const session = await requireAdmin()
  let templates = []
  try { templates = await prisma.pageTemplate.findMany({ orderBy: { updatedAt: 'desc' } }) } catch {}
  return <AdminShell session={session}><div className="admin-page-header"><div><h1 className="admin-page-title">Templates</h1><p className="admin-page-subtitle">Save a page structure and reuse it on new pages.</p></div></div><div className="admin-card"><div className="admin-table-wrap">          <table className="admin-table"><thead><tr><th>Name</th><th>Description</th><th>Updated</th></tr></thead><tbody>{templates.length ? templates.map((template) => <tr key={template.id}><td style={{ fontWeight: 600 }}>{template.name}</td><td className="admin-text-muted">{template.description || '—'}</td><td className="admin-text-muted admin-text-sm" suppressHydrationWarning>{new Date(template.updatedAt).toLocaleDateString('en-AU')}</td></tr>) : <tr><td colSpan="3" className="admin-text-muted">No templates saved yet. Open a page and choose “Save as template”.</td></tr>}</tbody></table></div></div></AdminShell>
}
