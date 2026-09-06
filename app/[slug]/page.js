import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import PageHero from '@/components/PageHero'
import ContentSection from '@/components/ContentSection'
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

  return (
    <article className="chc-dynamic-page">
      {page.sections.map((section) => {
        const blocks = section.blocks ?? []
        const getField = (key) => blocks.find((b) => b.fieldKey === key)
        const textVal = (key, def = '') => getField(key)?.textValue ?? def
        const imgUrl = (key, def = '') => getField(key)?.mediaAsset?.publicUrl ?? getField(key)?.textValue ?? def

        // Hero sections
        if (section.sectionKey === 'hero' || section.sectionKey === 'innerPageHero') {
          return (
            <PageHero
              key={section.id}
              backgroundImage={imgUrl('backgroundImage', '/images/Oracle-hcm-hero.png')}
              heading={textVal('heading', page.title)}
              subtitle={textVal('paragraph', textVal('subtitle', ''))}
            />
          )
        }

        // Feature / Two Column Content Sections
        if (section.sectionKey === 'contentSection' || section.sectionKey === 'intro') {
          return (
            <ContentSection
              key={section.id}
              leftImage={imgUrl('leftImage', '/images/Oracle-hcm-content.jpg')}
              rightImage={imgUrl('rightImage', 'https://res.cloudinary.com/asllbyrd/image/upload/v1788602849/chc/static/oracle-hcm-content-02.jpg')}
              badge={textVal('badge', 'We are modern business agency')}
              heading={textVal('heading', 'The leading agency for startup success.')}
              paragraph={textVal('paragraph', 'We strive to develop real-world web solutions that are ideal for small to large projects.')}
            />
          )
        }

        // CTA Banner Section (supports both 'cta' and 'ctaBanner' keys)
        if (section.sectionKey === 'cta' || section.sectionKey === 'ctaBanner') {
          return (
            <section key={section.id} className="chc-cta-section py-5 text-center bg-gradient-dark-gray-transparent text-white">
              <div className="container py-4">
                <h2 className="text-white alt-font fw-700 mb-3">{textVal('heading', 'Ready to Transform Your Delivery?')}</h2>
                <p className="w-75 mx-auto mb-4 opacity-8">{textVal('paragraph', 'Contact our senior consultants today.')}</p>
                <a href={textVal('buttonHref', '/contact')} className="btn btn-large btn-gradient-purple-pink btn-rounded">
                  {textVal('buttonLabel', 'Get in Touch')}
                </a>
              </div>
            </section>
          )
        }

        // Default Generic Section Renderer for custom/added sections
        const parentBlocks = blocks.filter((b) => !b.parentId)

        return (
          <section
            key={section.id}
            className="chc-cms-section py-5"
            aria-labelledby={`section-title-${section.id}`}
          >
            <div className="container-fluid px-5">
              <div className="row justify-content-center mb-4">
                <div className="col-lg-8 text-center">
                  <span className="text-uppercase alt-font text-base-color fw-600 fs-12 ls-1px d-block mb-2">
                    CHC Solution
                  </span>
                  <h2 id={`section-title-${section.id}`} className="alt-font text-dark-gray fw-600">
                    {textVal('sectionHeading', section.sectionKey.replace(/([A-Z])/g, ' $1'))}
                  </h2>
                </div>
              </div>

              <div className="row justify-content-center g-4">
                {parentBlocks.map((block) => {
                  const children = blocks.filter((b) => b.parentId === block.id)
                  const childVal = (key) => children.find((c) => c.fieldKey === key)?.textValue
                  const childImg = (key) => children.find((c) => c.fieldKey === key)?.mediaAsset?.publicUrl

                  return (
                    <div key={block.id} className="col-md-6 col-lg-4">
                      <div className="p-4 border-radius-8px bg-white box-shadow-quadruple-large h-100">
                        {(block.mediaAsset?.publicUrl || childImg('image') || childImg('photo') || childImg('icon')) && (
                          <img
                            src={block.mediaAsset?.publicUrl || childImg('image') || childImg('photo') || childImg('icon')}
                            alt=""
                            className="img-fluid border-radius-6px mb-3 w-100"
                            style={{ maxHeight: 240, objectFit: 'cover' }}
                          />
                        )}
                        <h4 className="alt-font text-dark-gray fw-600 mb-2">
                          {block.textValue || childVal('title') || childVal('heading') || childVal('name') || childVal('label')}
                        </h4>
                        <p className="text-medium-gray fs-15 mb-0">
                          {childVal('description') || childVal('paragraph') || childVal('role') || childVal('answer')}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })}
    </article>
  )
}
