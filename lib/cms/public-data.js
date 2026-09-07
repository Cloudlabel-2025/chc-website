/**
 * CHC CMS — Public Data Layer
 *
 * All functions are server-only. Every function returns hardcoded fallback
 * values when the DB is unavailable or the page has not been seeded yet,
 * so the public site always renders correctly.
 *
 * Convention: getBlock(blocks, fieldKey) extracts a single block value.
 */

import prisma from '@/lib/prisma'
import { getNavigationFallback } from '@/lib/cms/navigation-defaults'
import { topLevelNavigationWhere } from '@/lib/cms/navigation'

// Public pages must remain usable when MongoDB is temporarily unreachable.
// Prisma's MongoDB driver can otherwise wait around 30 seconds before it
// rejects, which leaves server-rendered content appearing blank or stalled.
const PUBLIC_DATA_TIMEOUT_MS = 2500

function withPublicDataTimeout(operation) {
  let timeoutId
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('CMS data request timed out')), PUBLIC_DATA_TIMEOUT_MS)
  })

  return Promise.race([operation, timeout]).finally(() => clearTimeout(timeoutId))
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getBlock(blocks = [], fieldKey) {
  return blocks.find((b) => b.fieldKey === fieldKey) ?? null
}

function text(blocks, fieldKey, fallback = '') {
  return getBlock(blocks, fieldKey)?.textValue ?? fallback
}

function imageUrl(blocks, fieldKey, fallback = '') {
  const block = getBlock(blocks, fieldKey)
  return block?.mediaAsset?.publicUrl ?? block?.textValue ?? fallback
}

function imageAlt(blocks, fieldKey, fallback = '') {
  return getBlock(blocks, fieldKey)?.mediaAsset?.altText ?? fallback
}

async function fetchSection(slug, sectionKey) {
  if (!prisma) return []
  const section = await withPublicDataTimeout(prisma.section.findFirst({
    where: { page: { slug, isPublished: true }, sectionKey, isVisible: true },
    include: {
      blocks: {
        where: { parentId: null, isPublished: true },
        orderBy: { sortOrder: 'asc' },
        include: { mediaAsset: true },
      },
    },
  }))
  return section?.blocks ?? []
}

async function fetchSectionWithChildren(slug, sectionKey) {
  if (!prisma) return []
  const section = await withPublicDataTimeout(prisma.section.findFirst({
    where: { page: { slug, isPublished: true }, sectionKey, isVisible: true },
    include: {
      blocks: {
        where: { isPublished: true },
        orderBy: { sortOrder: 'asc' },
        include: { mediaAsset: true },
      },
    },
  }))
  return section?.blocks ?? []
}

// ─── SEO ──────────────────────────────────────────────────────────────────────

export async function getPageSeo(slug, defaults = {}) {
  try {
    if (!prisma) return defaults
    const seo = await withPublicDataTimeout(prisma.seoMeta.findFirst({
      where: { page: { slug, isPublished: true } },
    }))
    if (!seo) return defaults
    return {
      title:       seo.metaTitle       || defaults.title       || '',
      description: seo.metaDescription || defaults.description || '',
      openGraph: {
        title:       seo.ogTitle       || seo.metaTitle       || defaults.title       || '',
        description: seo.ogDescription || seo.metaDescription || defaults.description || '',
        ...(seo.ogImageUrl ? { images: [{ url: seo.ogImageUrl }] } : {}),
      },
      ...(seo.canonical ? { alternates: { canonical: seo.canonical } } : {}),
      ...(seo.noIndex   ? { robots: { index: false, follow: false } } : {}),
    }
  } catch {
    return defaults
  }
}

// ─── Navigation ───────────────────────────────────────────────────────────────

const NAV_FALLBACK = getNavigationFallback().filter((item) => item.label !== 'What we do')

const WHAT_WE_DO_FALLBACK = [
  { id: 'a', label: 'Our Delivery Model', href: '/our-delivery-model', icon: 'bi bi-card-text',  description: 'Telling your story with impact.',      badge: null, children: [] },
  { id: 'b', label: 'Our Impact',         href: '/our-impact',         icon: 'bi bi-send',        description: 'Strategies for lasting impact.',       badge: null, children: [] },
  { id: 'c', label: 'Our People',         href: '/our-people',         icon: 'bi bi-briefcase',   description: 'Turning concepts into products.',      badge: null, children: [] },
]

export async function getNavData() {
  try {
    if (!prisma) return NAV_FALLBACK
    const items = await withPublicDataTimeout(prisma.navigationItem.findMany({
      where: { isVisible: true, ...topLevelNavigationWhere() },
      orderBy: { sortOrder: 'asc' },
      include: { children: { where: { isVisible: true }, orderBy: { sortOrder: 'asc' } } },
    }))
    // Header renders "What we do" as its dedicated dropdown, so it must not
    // also be returned as a normal nav link.
    const regularItems = items.filter((item) => item.label !== 'What we do')
    return regularItems.length ? regularItems : NAV_FALLBACK
  } catch {
    return NAV_FALLBACK
  }
}

export async function getWhatWeDoNav() {
  try {
    if (!prisma) return WHAT_WE_DO_FALLBACK
    const parent = await withPublicDataTimeout(prisma.navigationItem.findFirst({
      where: { label: 'What we do', ...topLevelNavigationWhere() },
      include: { children: { where: { isVisible: true }, orderBy: { sortOrder: 'asc' } } },
    }))
    return parent?.children?.length ? parent.children : WHAT_WE_DO_FALLBACK
  } catch {
    return WHAT_WE_DO_FALLBACK
  }
}

// ─── Home page — What We Do cards ─────────────────────────────────────────────

const HOME_WHAT_WE_DO_FALLBACK = [
  { href: '#oracle-hcm', image: '/images/oracle-home-hcm.jpg',  title: 'Oracle HCM',              description: 'Oracle HCM consulting, delivery, remediation, testing, VBCS/Redwood, reporting, integrations and managed support.' },
  { href: '#app-dev',    image: '/images/app-dev-home.jpg',     title: 'Application Development', description: 'Practical applications designed around real operational problems, including LIMS and school management solutions.' },
  { href: '#pts',        image: '/images/pts-home.jpg',         title: 'Productised Tech Services',description: 'Fixed-scope healthchecks, release assurance, technology support pods and specialist advisory services.' },
]

export async function getHomeWhatWeDo() {
  try {
    const allBlocks = await fetchSectionWithChildren('home', 'whatWeDo')
    const parents = allBlocks.filter((b) => !b.parentId)
    if (!parents.length) return HOME_WHAT_WE_DO_FALLBACK
    return parents.map((parent) => {
      const children = allBlocks.filter((b) => b.parentId === parent.id)
      const field = (key) => children.find((c) => c.fieldKey === key)
      return {
        href:        field('href')?.textValue        ?? '#',
        image:       field('image')?.mediaAsset?.publicUrl ?? field('image')?.textValue ?? '/images/oracle-home-hcm.jpg',
        title:       field('title')?.textValue       ?? '',
        description: field('description')?.textValue ?? '',
      }
    })
  } catch {
    return HOME_WHAT_WE_DO_FALLBACK
  }
}

// ─── Home page — Why CHC stack cards ──────────────────────────────────────────

const HOME_WHY_CHC_FALLBACK = [
  { image: '/images/sls-home.jpg',       heading: 'Senior-led Delivery',      paragraph: 'Solutions are designed and governed by experienced enterprise technology professionals.',                                                    rotate: '-20deg', blur: '100px' },
  { image: '/images/cost-effective.jpg', heading: 'Cost-effective execution', paragraph: 'The right level of capability is applied to each part of delivery.',                                                                          rotate: '-60deg', blur: '75px'  },
  { image: '/images/cap-dev.jpg',        heading: 'Capability development',   paragraph: 'Consultants progress through structured assignments, review cycles and real delivery expectations.',                                          rotate: '-10deg', blur: '20px'  },
  { image: '/images/social-impact.jpg',  heading: 'Social impact',            paragraph: 'Each successful engagement helps create sustainable technology careers while delivering client outcomes.',                                    rotate: '-10deg', blur: '20px'  },
]

export async function getHomeWhyChc() {
  try {
    const allBlocks = await fetchSectionWithChildren('home', 'whyChc')
    const parents = allBlocks.filter((b) => !b.parentId)
    if (!parents.length) return HOME_WHY_CHC_FALLBACK
    return parents.map((parent, i) => {
      const children = allBlocks.filter((b) => b.parentId === parent.id)
      const field = (key) => children.find((c) => c.fieldKey === key)
      // rotate/blur are layout values — not CMS-editable, use fallback positionally
      const fb = HOME_WHY_CHC_FALLBACK[i] ?? HOME_WHY_CHC_FALLBACK[0]
      return {
        image:     field('image')?.mediaAsset?.publicUrl ?? field('image')?.textValue ?? fb.image,
        heading:   field('heading')?.textValue   ?? '',
        paragraph: field('paragraph')?.textValue ?? '',
        rotate:    fb.rotate,
        blur:      fb.blur,
      }
    })
  } catch {
    return HOME_WHY_CHC_FALLBACK
  }
}

// ─── Footer ───────────────────────────────────────────────────────────────────

const FOOTER_FALLBACK = {
  address1Label: '',
  address1Text:  '',
  address2Label: '',
  address2Text:  '',
  ctaText:       'Interested in working with us?',
  ctaLinkText:   'cloudheard.org',
  ctaLinkHref:   'https://cloudheard.org',
  copyrightText: '© 2026 Cloudheard Consultancy.',
  facebookUrl:   'https://www.facebook.com/',
  instagramUrl:  'http://www.instagram.com',
  youtubeUrl:    'https://www.youtube.com/',
  linkedinUrl:   'http://www.linkedin.com',
}

export async function getFooterData() {
  try {
    if (!prisma) return FOOTER_FALLBACK
    const footer = await withPublicDataTimeout(prisma.footerConfig.findFirst())
    return footer ?? FOOTER_FALLBACK
  } catch {
    return FOOTER_FALLBACK
  }
}

// ─── Inner page hero ──────────────────────────────────────────────────────────

export async function getInnerPageHero(slug, defaults = {}) {
  try {
    const blocks = await fetchSection(slug, 'innerPageHero')
    return {
      backgroundImage: imageUrl(blocks, 'backgroundImage', defaults.backgroundImage ?? '/images/Oracle-hcm-hero.png'),
      heading:         text(blocks, 'heading',  defaults.heading  ?? ''),
      subtitle:        text(blocks, 'subtitle', defaults.subtitle ?? ''),
    }
  } catch {
    return {
      backgroundImage: defaults.backgroundImage ?? '/images/Oracle-hcm-hero.png',
      heading:         defaults.heading  ?? '',
      subtitle:        defaults.subtitle ?? '',
    }
  }
}

// ─── ContentSection (shared) ──────────────────────────────────────────────────

export async function getContentSection(slug, defaults = {}) {
  try {
    const blocks = await fetchSection(slug, 'contentSection')
    return {
      leftImage:  imageUrl(blocks, 'leftImage',  defaults.leftImage  ?? '/images/Oracle-hcm-content.jpg'),
      rightImage: imageUrl(blocks, 'rightImage', defaults.rightImage ?? '/images/oracle-hcm-content-02.jpg'),
      badge:      text(blocks, 'badge',     defaults.badge     ?? 'We are modern business agency'),
      heading:    text(blocks, 'heading',   defaults.heading   ?? 'The leading agency for startup success.'),
      paragraph:  text(blocks, 'paragraph', defaults.paragraph ?? 'We strive to develop real-world web solutions that are ideal for small to large projects with bespoke project requirements.'),
    }
  } catch {
    return {
      leftImage:  defaults.leftImage  ?? '/images/Oracle-hcm-content.jpg',
      rightImage: defaults.rightImage ?? '/images/oracle-hcm-content-02.jpg',
      badge:      defaults.badge      ?? 'We are modern business agency',
      heading:    defaults.heading    ?? 'The leading agency for startup success.',
      paragraph:  defaults.paragraph  ?? 'We strive to develop real-world web solutions that are ideal for small to large projects with bespoke project requirements.',
    }
  }
}

// ─── Home page ────────────────────────────────────────────────────────────────

export async function getHomeHero() {
  try {
    const blocks = await fetchSection('home', 'hero')
    return {
      backgroundImage: imageUrl(blocks, 'backgroundImage', '/images/Oracle-hcm-hero.png'),
      badge:     text(blocks, 'badge',     'Grow your business with us'),
      heading:   text(blocks, 'heading',   'Technology delivery with a social conscience.'),
      paragraph: text(blocks, 'paragraph', 'CHC provides cost-effective Oracle HCM, application development and technology delivery services through senior-led teams. Our model combines experienced technology leadership with structured development of emerging talent\u2014helping clients deliver important work while creating meaningful technology careers.'),
      cta1Label: text(blocks, 'cta1Label', 'About'),
      cta1Href:  text(blocks, 'cta1Href',  '/about'),
      cta2Label: text(blocks, 'cta2Label', 'Contact us'),
      cta2Href:  text(blocks, 'cta2Href',  '/contact'),
    }
  } catch {
    return {
      backgroundImage: '/images/Oracle-hcm-hero.png',
      badge: 'Grow your business with us',
      heading: 'Technology delivery with a social conscience.',
      paragraph: 'CHC provides cost-effective Oracle HCM, application development and technology delivery services through senior-led teams.',
      cta1Label: 'About', cta1Href: '/about',
      cta2Label: 'Contact us', cta2Href: '/contact',
    }
  }
}

export async function getHomeIntro() {
  try {
    const blocks = await fetchSection('home', 'intro')
    return {
      leftImage:  imageUrl(blocks, 'leftImage',  '/images/home-first-section.jpg'),
      rightImage: imageUrl(blocks, 'rightImage', '/images/home-content-2.jpg'),
      badge:      text(blocks, 'badge',     'We are modern business agency'),
      heading:    text(blocks, 'heading',   'Powerful agency for corporate business.'),
      paragraph:  text(blocks, 'paragraph', 'We strive to develop real-world web solutions that are ideal for small to large projects with bespoke project requirements.'),
    }
  } catch {
    return {
      leftImage: '/images/home-first-section.jpg', rightImage: '/images/home-content-2.jpg',
      badge: 'We are modern business agency', heading: 'Powerful agency for corporate business.',
      paragraph: 'We strive to develop real-world web solutions that are ideal for small to large projects with bespoke project requirements.',
    }
  }
}

// ─── Contact page ─────────────────────────────────────────────────────────────

export async function getContactData() {
  try {
    const blocks = await fetchSection('contact', 'contact')
    return {
      officeLabel:   text(blocks, 'officeLabel',   'CHC office'),
      officeAddress: text(blocks, 'officeAddress', '401 Broadway, 24th Floor, Orchard View, London, UK'),
      phoneLabel:    text(blocks, 'phoneLabel',    'Call us directly'),
      phone:         text(blocks, 'phone',         '1-800-222-000'),
      faxLabel:      text(blocks, 'faxLabel',      'Fax:'),
      fax:           text(blocks, 'fax',           '1-800-222-002'),
      emailLabel:    text(blocks, 'emailLabel',    'E-mail us'),
      email1:        text(blocks, 'email1',        'info@yourdomain.com'),
      email2:        text(blocks, 'email2',        'hr@yourdomain.com'),
      mapLat:        text(blocks, 'mapLat',        '-37.805688'),
      mapLng:        text(blocks, 'mapLng',        '144.962312'),
      mapPopupHtml:  text(blocks, 'mapPopupHtml',  '<div class=infowindow><strong class="mb-3 d-inline-block alt-font">CHC Consulting</strong><p class="alt-font">16122 Collins street, Melbourne, Australia</p></div>'),
    }
  } catch {
    return {
      officeLabel: 'CHC office',
      officeAddress: '401 Broadway, 24th Floor, Orchard View, London, UK',
      phoneLabel: 'Call us directly',
      phone: '1-800-222-000', faxLabel: 'Fax:', fax: '1-800-222-002',
      emailLabel: 'E-mail us',
      email1: 'info@yourdomain.com', email2: 'hr@yourdomain.com',
      mapLat: '-37.805688', mapLng: '144.962312',
      mapPopupHtml: '<div class=infowindow><strong class="mb-3 d-inline-block alt-font">CHC Consulting</strong><p class="alt-font">16122 Collins street, Melbourne, Australia</p></div>',
    }
  }
}

// ─── Our People ───────────────────────────────────────────────────────────────

const PEOPLE_FALLBACK = [
  { name: 'User 1', role: 'Director',          photo: 'https://placehold.co/600x756', capability: '', learningFocus: '' },
  { name: 'User 2', role: 'Specialist',         photo: 'https://placehold.co/600x756', capability: '', learningFocus: '' },
  { name: 'User 3', role: 'Manager',            photo: 'https://placehold.co/600x756', capability: '', learningFocus: '' },
  { name: 'User 4', role: 'Consultant',         photo: 'https://placehold.co/600x756', capability: '', learningFocus: '' },
  { name: 'User 5', role: 'Architect',          photo: 'https://placehold.co/600x756', capability: '', learningFocus: '' },
  { name: 'User 6', role: 'Lead Developer',     photo: 'https://placehold.co/600x756', capability: '', learningFocus: '' },
  { name: 'User 7', role: 'Data Analyst',       photo: 'https://placehold.co/600x756', capability: '', learningFocus: '' },
  { name: 'User 8', role: 'Solutions Engineer', photo: 'https://placehold.co/600x756', capability: '', learningFocus: '' },
]

// ─── About / Services — feature cards ────────────────────────────────────────

const FEATURE_CARDS_FALLBACK = [
  { img: 'https://placehold.co/180x150', title: 'Development',         text: 'From startups to enterprises, we craft adaptable web solutions that scale with your business.', href: '/' },
  { img: 'https://placehold.co/160x150', title: 'UX / UI design',      text: 'We build real-world web solutions ideal for all project sizes and a range of requirements.',    href: '/' },
  { img: 'https://placehold.co/200x150', title: 'Marketing',           text: 'We deliver web solutions designed to meet the evolving needs of startups alike.',              href: '/' },
  { img: 'https://placehold.co/196x150', title: 'Content writing',     text: 'From startups to enterprises, we craft adaptable web solutions that scale with your business.', href: '/' },
  { img: 'https://placehold.co/244x150', title: 'Product development', text: 'We build flexible web solutions that grow from small startups to large-scale demands.',        href: '/' },
  { img: 'https://placehold.co/210x150', title: 'eCommerce solutions', text: 'Create scalable web solutions tailored for startups to enterprise-level project needs.',        href: '/' },
]

async function getFeatureCards(slug, sectionKey) {
  try {
    const allBlocks = await fetchSectionWithChildren(slug, sectionKey)
    // A feature-card section also has section-level blocks such as
    // `sectionHeading`. Only a parent block with child fields is an actual
    // card; treating the heading as a card produced an empty tile.
    const parents = allBlocks.filter((block) =>
      !block.parentId && allBlocks.some((child) => child.parentId === block.id)
    )
    if (!parents.length) return FEATURE_CARDS_FALLBACK
    const cards = parents.map((parent) => {
      const children = allBlocks.filter((b) => b.parentId === parent.id)
      const field = (key) => children.find((c) => c.fieldKey === key)
      return {
        img:   field('image')?.mediaAsset?.publicUrl ?? field('image')?.textValue ?? 'https://placehold.co/200x150',
        title: field('title')?.textValue     ?? '',
        text:  field('paragraph')?.textValue ?? '',
        href:  field('href')?.textValue      ?? '/',
      }
    })
    return cards.filter((card) => card.title.trim() || card.text.trim())
  } catch {
    return FEATURE_CARDS_FALLBACK
  }
}

export function getAboutFeatureCards()    { return getFeatureCards('about',    'featureCards') }
export function getServicesFeatureCards() { return getFeatureCards('services', 'featureCards') }

// ─── Oracle HCM — capabilities marquee ───────────────────────────────────────

const ORACLE_CAPABILITIES_FALLBACK = [
  { img: '/images/core-hr-vec.png',               label: 'Core HR' },
  { img: '/images/wfs.png',                       label: 'Workforce Structure' },
  { img: '/images/compensation-vector.png',       label: 'Compensation' },
  { img: '/images/talent-vector.png',             label: 'Talent' },
  { img: '/images/learning-vector.png',           label: 'Learning' },
  { img: '/images/payroll-vector.png',            label: 'Payroll' },
  { img: '/images/security-aor-vector.png',       label: 'Security/AOR' },
  { img: '/images/approvals-vector.png',          label: 'Approvals' },
  { img: '/images/journey-vector.png',            label: 'Journey' },
  { img: '/images/hcm-extracts-vector.png',       label: 'HCM Extracts' },
  { img: '/images/integrations-vector.png',       label: 'Integrations' },
  { img: '/images/testing-vectot.png',            label: 'Testing' },
  { img: '/images/qua-rel-vec.png',               label: 'Quarterly Releases' },
  { img: '/images/redwood-vec.png',               label: 'Redwood / VBCS' },
  { img: '/images/technical-remediation-vec.png', label: 'Technical Remediation' },
]

export async function getOracleCapabilities() {
  try {
    const allBlocks = await fetchSectionWithChildren('oracle-hcm', 'capabilityItem')
    const parents = allBlocks.filter((b) => !b.parentId && (b.fieldKey === 'item' || b.fieldKey.startsWith('template:')))
    if (!parents.length) return ORACLE_CAPABILITIES_FALLBACK
    return parents.map((parent) => {
      const children = allBlocks.filter((b) => b.parentId === parent.id)
      const field = (key) => children.find((c) => c.fieldKey === key)
      return {
        img:   field('icon')?.mediaAsset?.publicUrl ?? field('icon')?.textValue ?? '',
        label: field('label')?.textValue ?? '',
      }
    })
  } catch {
    return ORACLE_CAPABILITIES_FALLBACK
  }
}

// ─── Oracle HCM — productised services cards ──────────────────────────────────

const ORACLE_SERVICES_FALLBACK = [
  { img: '/images/healthcheck.jpg',       title: 'Oracle HCM Health Check',  cta: 'Request a Healthcheck',     desc: 'Focused assessment of an existing Oracle HCM environment covering configuration, security, integrations, reporting, technical debt and operational risk.' },
  { img: '/images/rapid-response.jpg',    title: 'Oracle Rapid Response',    cta: 'Discuss an Oracle Problem',  desc: 'For broken approvals, absence issues, security problems, reporting failures, integration defects, Redwood/VBCS issues and payroll/interface problems.' },
  { img: '/images/release-assurance.jpg', title: 'Release Assurance',        cta: 'Discuss Release Support',   desc: 'Quarterly release assessment and regression support covering impact analysis, business-process testing, integrations, security validation, defect tracking and go/no-go reporting.' },
  { img: '/images/oracle-tech-pod.jpg',   title: 'Oracle Technology Pod',    cta: 'Discuss a Work Package',    desc: 'Flexible senior-led team supporting an agreed Oracle backlog across testing, reporting, configuration, VBCS, data, integrations, support and documentation.' },
]

export async function getOracleProductisedServices() {
  try {
    const allBlocks = await fetchSectionWithChildren('oracle-hcm', 'productisedService')
    const parents = allBlocks.filter((b) => !b.parentId && (b.fieldKey === 'item' || b.fieldKey.startsWith('template:')))
    if (!parents.length) return ORACLE_SERVICES_FALLBACK
    return parents.map((parent) => {
      const children = allBlocks.filter((b) => b.parentId === parent.id)
      const field = (key) => children.find((c) => c.fieldKey === key)
      return {
        img:   field('image')?.mediaAsset?.publicUrl ?? field('image')?.textValue ?? '',
        title: field('title')?.textValue            ?? '',
        cta:   field('ctaText')?.textValue          ?? '',
        desc:  field('hoverDescription')?.textValue ?? '',
      }
    })
  } catch {
    return ORACLE_SERVICES_FALLBACK
  }
}

// ─── Oracle HCM — delivery capacity section ───────────────────────────────────

const ORACLE_DELIVERY_FALLBACK = {
  heading:   'Looking for Oracle Delivery Capacity?',
  paragraph: 'CHC can operate as a specialist subcontracting and delivery partner for larger Oracle consultancies and implementation partners. We can take responsibility for defined work packages or provide supervised functional and technical delivery capacity under your program.',
}

export async function getOracleDeliveryCapacity() {
  try {
    const blocks = await fetchSection('oracle-hcm', 'deliveryCapacity')
    return {
      heading:   text(blocks, 'heading',   ORACLE_DELIVERY_FALLBACK.heading),
      paragraph: text(blocks, 'paragraph', ORACLE_DELIVERY_FALLBACK.paragraph),
    }
  } catch {
    return ORACLE_DELIVERY_FALLBACK
  }
}

// ─── Oracle HCM — service carousel slides ─────────────────────────────────────

const ORACLE_CAROUSEL_FALLBACK = [
  { img: '/images/config.png',        title: 'Configuration',   desc: "Configure Oracle HCM Cloud to align with your organization's business processes, workforce structures, roles, approvals, and HR requirements." },
  { img: '/images/testing.jpg',       title: 'Testing',         desc: 'Ensure reliable HCM implementations through functional, integration, regression, and user acceptance testing before moving solutions into production.' },
  { img: '/images/reporting.jpg',     title: 'Reporting',       desc: 'Build meaningful HR insights using OTBI, BI Publisher, dashboards, and customized reports to support better workforce decisions.' },
  { img: '/images/data.jpg',          title: 'Data',            desc: 'Manage, validate, transform, and maintain employee and organizational data with accuracy across Oracle HCM Cloud.' },
  { img: '/images/integration.jpg',   title: 'Integrations',    desc: 'Connect Oracle HCM with external applications and enterprise systems using reliable integrations, APIs, and data exchange solutions.' },
  { img: '/images/vbcs.jpg',          title: 'VBCS',            desc: 'Develop modern, scalable business applications and extensions using Oracle Visual Builder Cloud Service while seamlessly working with Oracle HCM.' },
  { img: '/images/support.jpg',       title: 'Release Support', desc: "Stay ahead of Oracle's quarterly updates with impact analysis, testing, issue identification, and post-release validation." },
  { img: '/images/manage-support.jpg',title: 'Managed Support', desc: 'Get continuous technical and functional support for Oracle HCM, including troubleshooting, enhancements, monitoring, and day-to-day application assistance.' },
]

export async function getOracleServiceCarousel() {
  try {
    const allBlocks = await fetchSectionWithChildren('oracle-hcm', 'serviceCarouselItem')
    const parents = allBlocks.filter((b) => !b.parentId && (b.fieldKey === 'item' || b.fieldKey.startsWith('template:')))
    if (!parents.length) return ORACLE_CAROUSEL_FALLBACK
    return parents.map((parent) => {
      const children = allBlocks.filter((b) => b.parentId === parent.id)
      const field = (key) => children.find((c) => c.fieldKey === key)
      return {
        img:   field('image')?.mediaAsset?.publicUrl ?? field('image')?.textValue ?? '',
        title: field('title')?.textValue       ?? '',
        desc:  field('description')?.textValue ?? '',
        href:  field('href')?.textValue        ?? '/services',
      }
    })
  } catch {
    return ORACLE_CAROUSEL_FALLBACK
  }
}

// ─── Our Impact — service slides ──────────────────────────────────────────────

const OUR_IMPACT_SLIDES_FALLBACK = [
  { title: 'Development',    img: 'https://placehold.co/180x150', desc: 'From startups to enterprises, we craft adaptable web solutions that scale with your business.', href: '/services' },
  { title: 'UX / UI Design', img: 'https://placehold.co/160x150', desc: 'Expertise lies in scalable web solutions for both emerging startups and enterprise.', href: '/services' },
  { title: 'Marketing',      img: 'https://placehold.co/200x150', desc: 'We build real-world web solutions ideal for all project sizes and a range of requirements.', href: '/services' },
  { title: 'Content writing',img: 'https://placehold.co/196x150', desc: 'Deliver web solutions designed to meet the evolving needs of startups alike.', href: '/services' },
  { title: 'Product design', img: 'https://placehold.co/244x150', desc: 'Create scalable web solutions tailored for startups to enterprise-level project needs.', href: '/services' },
  { title: 'Development',    img: 'https://placehold.co/180x150', desc: 'We build flexible web solutions that grow from small startups to large-scale demands.', href: '/services' },
  { title: 'UX / UI Design', img: 'https://placehold.co/160x150', desc: 'From startups to enterprises, we craft adaptable web solutions that scale with your business.', href: '/services' },
  { title: 'Marketing',      img: 'https://placehold.co/200x150', desc: 'We deliver web solutions designed to meet the evolving needs of startups alike.', href: '/services' },
  { title: 'Content writing',img: 'https://placehold.co/196x150', desc: 'We build real-world web solutions ideal for all project sizes and a range of requirements.', href: '/services' },
  { title: 'Product design', img: 'https://placehold.co/244x150', desc: 'From startups to enterprises, we craft adaptable web solutions that scale with your business.', href: '/services' },
]

const CURRENT_IMPACT_SLIDES_FALLBACK = [
  { title: 'Configuration', img: '/images/config.png', desc: 'Align Oracle HCM Cloud with the way your workforce and approvals operate.', href: '/oracle-hcm' },
  { title: 'Testing', img: '/images/testing.jpg', desc: 'Build confidence through functional, integration, regression, and user acceptance testing.', href: '/oracle-hcm' },
  { title: 'Reporting', img: '/images/reporting.jpg', desc: 'Create useful workforce insights with reports, dashboards, and tailored analytics.', href: '/oracle-hcm' },
  { title: 'Data', img: '/images/data.jpg', desc: 'Manage and maintain workforce data accurately throughout delivery and operations.', href: '/oracle-hcm' },
  { title: 'Integrations', img: '/images/integration.jpg', desc: 'Connect Oracle HCM to the systems your organisation relies on every day.', href: '/oracle-hcm' },
  { title: 'Application design', img: '/images/app-dev-home.jpg', desc: 'Develop practical technology solutions around real operational requirements.', href: '/applications' },
]

export async function getOurImpactSlides() {
  try {
    const allBlocks = await fetchSectionWithChildren('our-impact', 'serviceSlide')
    const parents = allBlocks.filter((b) => !b.parentId)
    if (!parents.length) return CURRENT_IMPACT_SLIDES_FALLBACK
    return parents.map((parent) => {
      const children = allBlocks.filter((b) => b.parentId === parent.id)
      const field = (key) => children.find((c) => c.fieldKey === key)
      return {
        img:   field('image')?.mediaAsset?.publicUrl ?? field('image')?.textValue ?? 'https://placehold.co/200x150',
        title: field('title')?.textValue       ?? '',
        desc:  field('description')?.textValue ?? '',
        href:  field('href')?.textValue        ?? '/services',
      }
    })
  } catch {
    return CURRENT_IMPACT_SLIDES_FALLBACK
  }
}

// ─── Applications — stack card groups ─────────────────────────────────────────

const STACK_CARDS_FALLBACK = [
  { rotate: '-20deg', blur: '100px', badge: 'Outstanding speed',    heading: 'Excellence framework.',  paragraph: 'Our excellence framework is a strategic approach that ensures quality and continuous improvement across all operations.', img: 'https://placehold.co/674x452' },
  { rotate: '-60deg', blur: '75px',  badge: 'Performance playbook', heading: 'Strategic performance.', paragraph: 'Our excellence framework is a strategic approach that ensures quality and continuous improvement across all operations.', img: 'https://placehold.co/674x452' },
  { rotate: '-10deg', blur: '20px',  badge: 'Performance power',    heading: 'Outcome accelerator.',   paragraph: 'Our excellence framework is a strategic approach that ensures quality and continuous improvement across all operations.', img: 'https://placehold.co/674x452' },
]

export async function getApplicationsStackCards(sectionKey) {
  try {
    const allBlocks = await fetchSectionWithChildren('applications', sectionKey)
    const parents = allBlocks.filter((b) => !b.parentId)
    if (!parents.length) return STACK_CARDS_FALLBACK
    return parents.map((parent, i) => {
      const children = allBlocks.filter((b) => b.parentId === parent.id)
      const field = (key) => children.find((c) => c.fieldKey === key)
      const fb = STACK_CARDS_FALLBACK[i] ?? STACK_CARDS_FALLBACK[0]
      return {
        img:       field('image')?.mediaAsset?.publicUrl ?? field('image')?.textValue ?? fb.img,
        badge:     field('badge')?.textValue     ?? '',
        heading:   field('heading')?.textValue   ?? '',
        paragraph: field('paragraph')?.textValue ?? '',
        rotate:    fb.rotate,
        blur:      fb.blur,
      }
    })
  } catch {
    return STACK_CARDS_FALLBACK
  }
}

// ─── Shared header / CTA sections ───────────────────────────────────────────

const HOME_STACK_HEADER_FALLBACK = {
  eyebrow: 'What we deliver',
  heading: 'Solutions that stack up',
}

export async function getHomeStackHeader() {
  try {
    const blocks = await fetchSection('home', 'homeStackHeader')
    return {
      eyebrow: text(blocks, 'eyebrow', HOME_STACK_HEADER_FALLBACK.eyebrow),
      heading: text(blocks, 'heading', HOME_STACK_HEADER_FALLBACK.heading),
    }
  } catch {
    return HOME_STACK_HEADER_FALLBACK
  }
}

const CTA_BANNER_FALLBACK = {
  heading: "Let's make something great work together.",
  paragraph: '',
  buttonLabel: 'Got a project in mind?',
  buttonHref: '/contact',
}

export async function getCtaBanner(slug) {
  try {
    const blocks = await fetchSection(slug, 'ctaBanner')
    return {
      heading:     text(blocks, 'heading',     CTA_BANNER_FALLBACK.heading),
      paragraph:   text(blocks, 'paragraph',   CTA_BANNER_FALLBACK.paragraph),
      buttonLabel: text(blocks, 'buttonLabel', CTA_BANNER_FALLBACK.buttonLabel),
      buttonHref:  text(blocks, 'buttonHref',  CTA_BANNER_FALLBACK.buttonHref),
    }
  } catch {
    return CTA_BANNER_FALLBACK
  }
}

const PEOPLE_HEADER_FALLBACK = {
  badge: 'Meet our people',
  heading: 'Leading experts',
}

export async function getPeopleHeader() {
  try {
    const blocks = await fetchSection('our-people', 'peopleHeader')
    return {
      badge:   text(blocks, 'badge',   PEOPLE_HEADER_FALLBACK.badge),
      heading: text(blocks, 'heading', PEOPLE_HEADER_FALLBACK.heading),
    }
  } catch {
    return PEOPLE_HEADER_FALLBACK
  }
}

const FAQ_HEADER_FALLBACK = {
  eyebrow: 'Frequently asked questions',
  heading: 'How can we help?',
}

export async function getFaqHeader() {
  try {
    const blocks = await fetchSection('our-delivery-model', 'faqHeader')
    return {
      eyebrow: text(blocks, 'eyebrow', FAQ_HEADER_FALLBACK.eyebrow),
      heading: text(blocks, 'heading', FAQ_HEADER_FALLBACK.heading),
    }
  } catch {
    return FAQ_HEADER_FALLBACK
  }
}

const FAQ_FOOTER_FALLBACK = {
  text: "Didn't find the right response?",
  label: 'view more from here',
  href: '/',
}

export async function getFaqFooter() {
  try {
    const blocks = await fetchSection('our-delivery-model', 'faqFooter')
    return {
      text:  text(blocks, 'text',  FAQ_FOOTER_FALLBACK.text),
      label: text(blocks, 'label', FAQ_FOOTER_FALLBACK.label),
      href:  text(blocks, 'href',  FAQ_FOOTER_FALLBACK.href),
    }
  } catch {
    return FAQ_FOOTER_FALLBACK
  }
}

const PROCESS_HEADER2_FALLBACK = {
  heading: 'Explore the simple business process.',
}

export async function getProcessHeader2() {
  try {
    const blocks = await fetchSection('our-delivery-model', 'processHeader2')
    return {
      heading: text(blocks, 'heading', PROCESS_HEADER2_FALLBACK.heading),
    }
  } catch {
    return PROCESS_HEADER2_FALLBACK
  }
}

const IMPACT_HEADER_FALLBACK = {
  badge: 'Services and solutions',
  heading: 'Experienced services',
}

export async function getImpactHeader() {
  try {
    const blocks = await fetchSection('our-impact', 'impactHeader')
    return {
      badge:   text(blocks, 'badge',   IMPACT_HEADER_FALLBACK.badge),
      heading: text(blocks, 'heading', IMPACT_HEADER_FALLBACK.heading),
    }
  } catch {
    return IMPACT_HEADER_FALLBACK
  }
}

const IMPACT_FOOTER_FALLBACK = {
  note: 'Create your own website in one time without any coding knowledge.',
}

export async function getImpactFooter() {
  try {
    const blocks = await fetchSection('our-impact', 'impactFooter')
    return {
      note: text(blocks, 'note', IMPACT_FOOTER_FALLBACK.note),
    }
  } catch {
    return IMPACT_FOOTER_FALLBACK
  }
}

const ORACLE_HEADINGS_FALLBACK = {
  capabilitiesHeading: 'Core Capabilities',
  servicesEyebrow: 'Oracle',
  servicesHeading: 'Productised Oracle Services',
  exploreLabel: 'Explore services',
}

export async function getOracleHeadings() {
  try {
    const blocks = await fetchSection('oracle-hcm', 'oracleHeadings')
    return {
      capabilitiesHeading: text(blocks, 'capabilitiesHeading', ORACLE_HEADINGS_FALLBACK.capabilitiesHeading),
      servicesEyebrow:     text(blocks, 'servicesEyebrow',     ORACLE_HEADINGS_FALLBACK.servicesEyebrow),
      servicesHeading:     text(blocks, 'servicesHeading',     ORACLE_HEADINGS_FALLBACK.servicesHeading),
      exploreLabel:        text(blocks, 'exploreLabel',        ORACLE_HEADINGS_FALLBACK.exploreLabel),
    }
  } catch {
    return ORACLE_HEADINGS_FALLBACK
  }
}

// ─── Our Delivery Model — process steps ──────────────────────────────────────

const PROCESS_STEPS_FALLBACK = [
  { icon: 'line-icon-Idea-5',       label: 'Research',     description: 'Lorem ipsum is simply text the printing.' },
  { icon: 'line-icon-Fountain-Pen', label: 'Sketches',     description: 'Lorem ipsum is simply text the printing.' },
  { icon: 'line-icon-Loading-2',    label: 'Concept',      description: 'Lorem ipsum is simply text the printing.' },
  { icon: 'line-icon-Juice',        label: 'Presentation', description: 'Lorem ipsum is simply text the printing.' },
  { icon: 'line-icon-Idea-5',       label: 'Research',     description: 'Lorem ipsum is simply text the printing.' },
]

export async function getDeliveryModelProcessSteps(sectionKey) {
  try {
    const allBlocks = await fetchSectionWithChildren('our-delivery-model', sectionKey)
    const parents = allBlocks.filter((b) => !b.parentId)
    if (!parents.length) return PROCESS_STEPS_FALLBACK
    return parents.map((parent) => {
      const children = allBlocks.filter((b) => b.parentId === parent.id)
      const field = (key) => children.find((c) => c.fieldKey === key)
      return {
        icon:        field('icon')?.textValue        ?? 'line-icon-Idea-5',
        label:       field('label')?.textValue       ?? '',
        description: field('description')?.textValue ?? '',
      }
    })
  } catch {
    return PROCESS_STEPS_FALLBACK
  }
}

// ─── Our Delivery Model — FAQ items ───────────────────────────────────────────

const FAQS_FALLBACK = [
  { q: 'Can you help us raise money?',       a: 'Lorem ipsum is simply dummy text of the printing typesetting industry.' },
  { q: 'Do we really need a business plan?', a: 'Lorem ipsum is simply dummy text of the printing typesetting industry.' },
  { q: 'Will you sign a agreement?',         a: 'Lorem ipsum is simply dummy text of the printing typesetting industry.' },
  { q: 'Can you send us samples of work?',   a: 'Lorem ipsum is simply dummy text of the printing typesetting industry.' },
]

export async function getDeliveryModelFaqs() {
  try {
    const allBlocks = await fetchSectionWithChildren('our-delivery-model', 'faqItem')
    const parents = allBlocks.filter((b) => !b.parentId)
    if (!parents.length) return FAQS_FALLBACK
    return parents.map((parent) => {
      const children = allBlocks.filter((b) => b.parentId === parent.id)
      const field = (key) => children.find((c) => c.fieldKey === key)
      return {
        q: field('question')?.textValue ?? '',
        a: field('answer')?.textValue   ?? '',
      }
    })
  } catch {
    return FAQS_FALLBACK
  }
}

// ─── Graceful missing-content helper ─────────────────────────────────────────
// Returns the fallback value when a DB record exists but a specific field block
// is absent — prevents crashes on partially-seeded pages.

export function withFallback(value, fallback) {
  return value !== undefined && value !== null && value !== '' ? value : fallback
}

export async function getPeopleData() {
  try {
    const allBlocks = await fetchSectionWithChildren('our-people', 'teamMember')
    // Parent blocks are the repeatable items; children hold the fields
    const parents = allBlocks.filter((b) => !b.parentId)
    if (!parents.length) return PEOPLE_FALLBACK

    return parents.map((parent) => {
      const children = allBlocks.filter((b) => b.parentId === parent.id)
      const field = (key) => children.find((c) => c.fieldKey === key)
      return {
        name:          field('name')?.textValue          ?? '',
        role:          field('role')?.textValue          ?? '',
        capability:    field('capability')?.textValue    ?? '',
        learningFocus: field('learningFocus')?.textValue ?? '',
        photo:         field('photo')?.mediaAsset?.publicUrl ?? field('photo')?.textValue ?? 'https://placehold.co/600x756',
      }
    })
  } catch {
    return PEOPLE_FALLBACK
  }
}
