import prisma from '@/lib/prisma'
import { databaseQuery } from '@/lib/cms/database-query'
import { authDiagnostic } from '@/lib/cms/auth-diagnostics'
import { orderVisibleSections } from '@/lib/cms/section-layout'
import CmsSection from '@/components/CmsSection'

export default async function CmsPageLayout({ slug, children }) {
  let page
  try {
    page = await databaseQuery(prisma.page.findUnique({
      where: { slug, isPublished: true },
      include: { sections: {
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        include: { blocks: { where: { isPublished: true }, orderBy: { sortOrder: 'asc' }, include: { mediaAsset: true } } },
      } },
    }))
  } catch (error) {
    console.error('[cms-sections]', JSON.stringify(authDiagnostic(error)))
    return children
  }
  if (!page) return children
  return orderVisibleSections(page.sections).map((section) => (
    <CmsSection key={section.id} section={section} siblings={page.sections} />
  ))
}
