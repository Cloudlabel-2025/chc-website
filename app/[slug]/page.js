import CmsSection from '@/components/CmsSection'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { getPageSeo } from '@/lib/cms/public-data'
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  return getPageSeo(params.slug, {
    title: `${params.slug.charAt(0).toUpperCase() + params.slug.slice(1)} - CHC`,
    description: 'CHC Technology Delivery and Consulting Services',
  })
}

export default async function CmsPage({ params }) {
  const page = await prisma.page.findUnique({
    where: { slug: params.slug, isPublished: true },
    include: {
      sections: {
        where: { isVisible: true },
        orderBy: { sortOrder: 'asc' },
        include: {
          blocks: {
            where: { isPublished: true },
            orderBy: { sortOrder: 'asc' },
            include: { mediaAsset: true },
          },
        },
      },
    },
  })

  if (!page) notFound()

  return page.sections.map((section) => <CmsSection key={section.id} section={section} siblings={page.sections} />)
}
