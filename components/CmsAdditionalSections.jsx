import prisma from '@/lib/prisma'
import { cloudinaryUrl } from '@/lib/cms/cloudinary-url'

/**
 * Renders CMS section instances that are not claimed by a page's dedicated
 * design. This lets editors add reusable sections to fixed routes without
 * losing the route's existing bespoke hero/content layout.
 */
export default async function CmsAdditionalSections({ slug, skipFirst = {} }) {
  let page
  try {
    page = await prisma.page.findUnique({
      where: { slug, isPublished: true },
      include: {
        sections: {
          where: { isVisible: true }, orderBy: { sortOrder: 'asc' },
          include: { blocks: { where: { isPublished: true }, orderBy: { sortOrder: 'asc' }, include: { mediaAsset: true } } },
        },
      },
    })
  } catch { return null }

  const seen = {}
  const extra = (page?.sections ?? []).filter((section) => {
    const occurrence = seen[section.sectionKey] ?? 0
    seen[section.sectionKey] = occurrence + 1
    return occurrence >= (skipFirst[section.sectionKey] ?? 0)
  })
  if (!extra.length) return null

  return extra.map((section) => {
    const blocks = section.blocks ?? []
    const field = (key) => blocks.find((block) => !block.parentId && block.fieldKey === key)
    const title = field('sectionHeading')?.textValue
      || field('heading')?.textValue
      || field('capabilitiesHeading')?.textValue
      || field('servicesHeading')?.textValue
      || field('formBadge')?.textValue
      || section.sectionKey.replace(/([A-Z])/g, ' $1')
    const content = (field('content')?.textValue ?? field('paragraph')?.textValue ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    const sectionFields = new Set([
      'sectionHeading', 'sectionSubheading', 'heading', 'paragraph', 'content',
      'badge', 'eyebrow', 'capabilitiesHeading', 'servicesEyebrow',
      'servicesHeading', 'exploreLabel', 'formBadge', 'submitLabel',
      'successMessage', 'buttonLabel', 'buttonHref', 'cta1Label', 'cta1Href',
      'cta2Label', 'cta2Href', 'backgroundImage', 'leftImage', 'rightImage',
    ])
    const items = blocks.filter((block) => !block.parentId && !sectionFields.has(block.fieldKey))

    return <section key={section.id} className="chc-cms-section py-5"><div className="container-fluid px-5 lg-px-10"><div className="row justify-content-center mb-4"><div className="col-lg-8 text-center"><h2 className="alt-font text-dark-gray fw-600">{title}</h2>{content && <p className="text-medium-gray mb-0">{content}</p>}</div></div><div className="row justify-content-center g-4">{items.map((item) => {
      const children = blocks.filter((block) => block.parentId === item.id)
      const child = (key) => children.find((block) => block.fieldKey === key)
      const image = child('image')?.mediaAsset?.publicUrl || child('photo')?.mediaAsset?.publicUrl || child('icon')?.mediaAsset?.publicUrl || child('image')?.textValue || child('photo')?.textValue || child('icon')?.textValue
      const itemTitle = child('title')?.textValue || child('heading')?.textValue || child('name')?.textValue || child('label')?.textValue || item.textValue
      const itemText = child('description')?.textValue || child('paragraph')?.textValue || child('answer')?.textValue || child('role')?.textValue
      return <div key={item.id} className="col-md-6 col-lg-4"><article className="p-4 bg-white border-radius-8px box-shadow-quadruple-large h-100">{image && <img src={cloudinaryUrl(image, 'card')} alt="" className="img-fluid border-radius-6px mb-3 w-100" style={{ maxHeight: 240, objectFit: 'cover' }} />}{itemTitle && <h4 className="alt-font text-dark-gray fw-600 mb-2">{itemTitle}</h4>}{itemText && <p className="text-medium-gray fs-15 mb-0">{itemText}</p>}</article></div>
    })}</div></div></section>
  })
}
