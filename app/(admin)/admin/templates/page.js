import { requireAdmin } from '@/lib/cms/auth-helpers'
import AdminShell from '@/app/(admin)/components/AdminShell'
import prisma from '@/lib/prisma'
import { SITE_TEMPLATES } from '@/lib/cms/site-template-catalog'
import TemplatesManager from './TemplatesManager'
import { databaseQuery } from '@/lib/cms/database-query'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Page templates' }

export default async function TemplatesPage() {
  const session = await requireAdmin()
  let templates = []
  let pages = []
  try { templates = await databaseQuery(prisma.pageTemplate.findMany({ orderBy: { updatedAt: 'desc' } })) } catch {}
  try { pages = await databaseQuery(prisma.page.findMany({ select: { id: true, slug: true, title: true, isPublished: true, updatedAt: true }, orderBy: { slug: 'asc' } })) } catch {}

  return <AdminShell session={session}>
    <div className="admin-page-header"><div><h1 className="admin-page-title">Page templates</h1><p className="admin-page-subtitle">Use the website’s real layouts on any page, then tailor the content in the page editor.</p></div></div>
    <TemplatesManager initialTemplates={templates} pages={pages} catalogue={SITE_TEMPLATES} />
  </AdminShell>
}
