import { Children, cloneElement, isValidElement } from 'react'
import { withSectionContext } from '@/lib/cms/section-context'
import { findSectionView } from '@/lib/cms/section-layout'
import { ContactForm, GiveOneHourForm } from '@/components/CmsForms'
import DynamicForm from '@/components/DynamicForm'
import SlideLink from '@/components/SlideLink'
import { resolveContentBlocks } from '@/lib/cms/content-blocks'

// Use the original authored section views, including their client components.
// Rendering a source page here only constructs its element tree: its layout
// is never mounted, and all data reads are isolated to this section instance.
const sources = {
  home: () => import('@/app/page'),
  about: () => import('@/app/about/page'),
  applications: () => import('@/app/applications/page'),
  oracle: () => import('@/app/oracle-hcm/page'),
  impact: () => import('@/app/our-impact/page'),
  people: () => import('@/app/our-people/page'),
  delivery: () => import('@/app/our-delivery-model/page'),
  contact: () => import('@/app/contact/page'),
  volunteer: () => import('@/app/give-one-hour/page'),
}
const views = {
  hero: ['home', 'hero'], intro: ['home', 'intro'], whatWeDo: ['home', 'whatWeDo'], whyChc: ['home', 'whyChc'],
  innerPageHero: ['about', 'innerPageHero'], contentSection: ['about', 'contentSection'],
  content: ['about', 'contentSection'], introSection: ['about', 'contentSection'],
  featureCards: ['about', 'featureCards'],
  stackCards1: ['applications', 'stackCards1'], stackCards2: ['applications', 'stackCards1'], stackCards3: ['applications', 'stackCards1'],
  capabilityItem: ['oracle', 'capabilityItem'], productisedService: ['oracle', 'productisedService'],
  serviceCarouselItem: ['oracle', 'serviceCarouselItem'], serviceSlide: ['impact', 'serviceSlide'],
  teamMember: ['people', 'teamMember'], processStep: ['delivery', 'processSteps1'],
  processSteps1: ['delivery', 'processSteps1'], processSteps2: ['delivery', 'processSteps2'], faqItem: ['delivery', 'faqItem'],
  contact: ['contact', 'contact'], contactMap: ['contact', 'contactMap'],
  giveOneHour: ['volunteer', 'giveOneHourForm', 'giveOneHour'],
}

function namespaceIds(node, prefix, templateKey, separateKeys) {
  return Children.map(node, (child) => {
    if (!isValidElement(child)) return child
    if (templateKey && child.props['data-cms-template'] !== templateKey && separateKeys.has(child.props['data-cms-template'])) return null
    const props = {}
    if (child.props['data-cms-template']) props.id = `${prefix}-${child.props['data-cms-template']}`
    if (child.props.id) props.id = `${prefix}-${child.props.id}`
    if (child.props.htmlFor) props.htmlFor = `${prefix}-${child.props.htmlFor}`
    if (child.props.children) props.children = namespaceIds(child.props.children, prefix, templateKey, separateKeys)
    return cloneElement(child, props)
  })
}

export default async function CmsSection({ section, siblings = [] }) {
  const blocks = resolveContentBlocks(section.blocks)
  const values = Object.fromEntries(blocks.filter((block) => !block.parentId).map((block) => [block.fieldKey, block.mediaAsset?.publicUrl ?? block.textValue ?? '']))
  let view
  // The original programme section owns its form. Only separate it when the
  // editor has explicitly added a standalone form section (even if hidden).
  const source = section.sectionKey === 'giveOneHour' && siblings.some((item) => item.sectionKey === 'giveOneHourForm')
    ? null : views[section.sectionKey]
  if (source) {
    view = await withSectionContext(section, source[2] ?? source[1], siblings, async () => {
      const { default: Page } = await sources[source[0]]()
      const tree = await Page()
      const selected = findSectionView(tree, source[1])
      if (section.sectionKey === 'contact') {
        return <>{selected}{findSectionView(tree, 'contactMap')}{!siblings.some((item) => item.sectionKey === 'contactForm') && findSectionView(tree, 'contactForm')}</>
      }
      return selected
    })
    if (!view) throw new Error(`Missing authored CMS section view: ${section.sectionKey}`)
  } else {
    const title = values.sectionHeading || values.heading || values.capabilitiesHeading || values.servicesHeading
    const body = values.paragraph || values.sectionSubheading || values.note || values.text || values.content || ''
    view = <section className="chc-cms-section py-5">
      <div className="container-fluid px-5 lg-px-10">
        <div className="row justify-content-center"><div className="col-lg-10">
          {(values.badge || values.eyebrow || values.formBadge) && <span className="text-base-color text-uppercase fw-600">{values.badge || values.eyebrow || values.formBadge}</span>}
          {title && <h2 className="alt-font text-dark-gray fw-600">{title}</h2>}
          {body && <p style={{ whiteSpace: 'pre-line' }}>{body.replace(/<[^>]*>/g, ' ').trim()}</p>}
          {(values.buttonLabel || values.label) && <SlideLink href={values.buttonHref || values.href} className="btn btn-dark-gray btn-rounded">{values.buttonLabel || values.label}</SlideLink>}
          {section.sectionKey === 'contactForm' && <ContactForm formFields={values} />}
          {section.sectionKey === 'giveOneHourForm' && <GiveOneHourForm formFields={values} />}
          {section.sectionKey === 'cmsForm' && (values.formSlug
            ? <DynamicForm slug={values.formSlug} />
            : <p className="admin-text-muted">Set a form slug on this section to embed a form.</p>)}
        </div></div>
      </div>
    </section>
  }
  const separateKeys = new Set(siblings.map((item) => views[item.sectionKey]?.[1] ?? item.sectionKey))
  const rendered = namespaceIds(view, `cms-${section.id}`, section.sectionKey === 'contact' ? null : source?.[1], separateKeys)
  const content = view.type === 'div' ? <section><div className="container-fluid px-5 lg-px-10">{rendered}</div></section> : rendered
  return <div data-cms-section={section.id} data-cms-section-type={section.sectionKey} style={{ display: 'contents' }}>{content}</div>
}
