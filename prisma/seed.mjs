/**
 * CHC CMS — Content Seed Script
 *
 * Populates the database with the current hardcoded site content so the
 * public site is reproducible from the DB before any hardcoded content is removed.
 *
 * Safe to re-run: uses upsert throughout. Does NOT overwrite existing content
 * that has been edited via the admin panel (upsert only creates if absent).
 *
 * Usage:
 *   npm run db:seed
 *
 * Requires DATABASE_URL in environment (loaded from .env automatically via dotenv).
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getOrCreateSystemUser() {
  const existing = await prisma.user.findFirst({ where: { email: 'seed@system.internal' } })
  if (existing) return existing.id
  const user = await prisma.user.create({
    data: {
      email: 'seed@system.internal',
      passwordHash: 'DISABLED',
      name: 'Seed Script',
      role: 'ADMIN',
      isActive: false,
      updatedAt: new Date(),
    },
  })
  return user.id
}

async function upsertPage(userId, slug, title) {
  return prisma.page.upsert({
    where: { slug },
    create: { slug, title, isPublished: true, createdById: userId, updatedById: userId, updatedAt: new Date() },
    update: { title, isPublished: true, updatedById: userId },
  })
}

async function upsertSection(userId, pageId, sectionKey, sortOrder) {
  return prisma.section.upsert({
    where: { pageId_sectionKey: { pageId, sectionKey } },
    create: { pageId, sectionKey, sortOrder, isVisible: true, createdById: userId, updatedById: userId, updatedAt: new Date() },
    update: { sortOrder, updatedById: userId },
  })
}

// Only creates if absent — preserves admin edits on re-run
async function seedBlock(userId, sectionId, fieldKey, blockType, textValue = null) {
  const existing = await prisma.contentBlock.findFirst({
    where: { sectionId, fieldKey, parentId: null },
  })
  if (existing) return existing
  return prisma.contentBlock.create({
    data: {
      sectionId, fieldKey, blockType, textValue,
      isPublished: true, sortOrder: 0,
      createdById: userId, updatedById: userId, updatedAt: new Date(),
    },
  })
}

// Creates a repeatable parent + child field blocks
async function seedRepeatableItem(userId, sectionId, sortOrder, fields) {
  const parent = await prisma.contentBlock.create({
    data: {
      sectionId, fieldKey: 'item', blockType: 'TEXT', textValue: null,
      isPublished: true, sortOrder,
      createdById: userId, updatedById: userId, updatedAt: new Date(),
    },
  })
  for (const [fieldKey, { blockType, textValue }] of Object.entries(fields)) {
    await prisma.contentBlock.create({
      data: {
        sectionId, fieldKey, blockType, textValue: textValue ?? null,
        isPublished: true, sortOrder: 0, parentId: parent.id,
        createdById: userId, updatedById: userId, updatedAt: new Date(),
      },
    })
  }
  return parent
}

async function hasRepeatableItems(sectionId) {
  const count = await prisma.contentBlock.count({ where: { sectionId, parentId: null } })
  return count > 0
}

async function upsertSeo(userId, pageId, data) {
  const existing = await prisma.seoMeta.findUnique({ where: { pageId } })
  if (existing) return existing
  return prisma.seoMeta.create({
    data: { pageId, ...data, updatedById: userId, updatedAt: new Date() },
  })
}

// ─── Navigation ───────────────────────────────────────────────────────────────

async function seedNavigation(userId) {
  const existing = await prisma.navigationItem.count()
  if (existing > 0) { console.log('  navigation: already seeded, skipping'); return }

  const topLevel = [
    { label: 'Home',          href: '/',              badge: null,  sortOrder: 0 },
    { label: 'Oracle HCM',    href: '/oracle-hcm',    badge: null,  sortOrder: 1 },
    { label: 'Applications',  href: '/applications',  badge: null,  sortOrder: 2 },
    { label: 'Services',      href: '/services',      badge: 'Hot', sortOrder: 3 },
    { label: 'What we do',    href: '#',              badge: null,  sortOrder: 4 },
    { label: 'Give One Hour', href: '/give-one-hour', badge: null,  sortOrder: 5 },
    { label: 'About',         href: '/about',         badge: null,  sortOrder: 6 },
    { label: 'Contact',       href: '/contact',       badge: null,  sortOrder: 7 },
  ]

  const created = {}
  for (const item of topLevel) {
    const nav = await prisma.navigationItem.create({
      data: { ...item, isVisible: true, updatedById: userId, updatedAt: new Date() },
    })
    created[item.label] = nav.id
  }

  const whatWeDoChildren = [
    { label: 'Our Delivery Model', href: '/our-delivery-model', icon: 'bi bi-card-text', description: 'Telling your story with impact.',   sortOrder: 0 },
    { label: 'Our Impact',         href: '/our-impact',         icon: 'bi bi-send',       description: 'Strategies for lasting impact.',    sortOrder: 1 },
    { label: 'Our People',         href: '/our-people',         icon: 'bi bi-briefcase',  description: 'Turning concepts into products.',   sortOrder: 2 },
  ]
  for (const child of whatWeDoChildren) {
    await prisma.navigationItem.create({
      data: { ...child, parentId: created['What we do'], isVisible: true, updatedById: userId, updatedAt: new Date() },
    })
  }
  console.log('  navigation: seeded')
}

// ─── Footer ───────────────────────────────────────────────────────────────────

async function seedFooter(userId) {
  const existing = await prisma.footerConfig.findFirst()
  if (existing) { console.log('  footer: already seeded, skipping'); return }
  await prisma.footerConfig.create({
    data: {
      ctaText:       'Interested in working with us?',
      ctaLinkText:   'cloudheard.org',
      ctaLinkHref:   'https://cloudheard.org',
      copyrightText: '© 2026 Cloudheard Consultancy.',
      facebookUrl:   'https://www.facebook.com/',
      instagramUrl:  'http://www.instagram.com',
      youtubeUrl:    'https://www.youtube.com/',
      linkedinUrl:   'http://www.linkedin.com',
      updatedById:   userId,
      updatedAt:     new Date(),
    },
  })
  console.log('  footer: seeded')
}

// ─── Home ─────────────────────────────────────────────────────────────────────

async function seedHome(userId) {
  const page = await upsertPage(userId, 'home', 'Home')
  await upsertSeo(userId, page.id, {
    metaTitle:       'CHC - Technology Delivery with a Social Conscience',
    metaDescription: 'CHC provides cost-effective Oracle HCM, application development and technology delivery services through senior-led teams.',
  })

  const heroSection = await upsertSection(userId, page.id, 'hero', 0)
  await seedBlock(userId, heroSection.id, 'badge',     'TEXT', 'Grow your business with us')
  await seedBlock(userId, heroSection.id, 'heading',   'TEXT', 'Technology delivery with a social conscience.')
  await seedBlock(userId, heroSection.id, 'paragraph', 'TEXT', 'CHC provides cost-effective Oracle HCM, application development and technology delivery services through senior-led teams. Our model combines experienced technology leadership with structured development of emerging talent\u2014helping clients deliver important work while creating meaningful technology careers.')
  await seedBlock(userId, heroSection.id, 'cta1Label', 'TEXT', 'About')
  await seedBlock(userId, heroSection.id, 'cta1Href',  'URL',  '/about')
  await seedBlock(userId, heroSection.id, 'cta2Label', 'TEXT', 'Contact us')
  await seedBlock(userId, heroSection.id, 'cta2Href',  'URL',  '/contact')

  const introSection = await upsertSection(userId, page.id, 'intro', 1)
  await seedBlock(userId, introSection.id, 'badge',     'TEXT', 'We are modern business agency')
  await seedBlock(userId, introSection.id, 'heading',   'TEXT', 'Powerful agency for corporate business.')
  await seedBlock(userId, introSection.id, 'paragraph', 'TEXT', 'We strive to develop real-world web solutions that are ideal for small to large projects with bespoke project requirements.')

  const whatWeDoSection = await upsertSection(userId, page.id, 'whatWeDo', 2)
  if (!(await hasRepeatableItems(whatWeDoSection.id))) {
    const cards = [
      { href: '#oracle-hcm', title: 'Oracle HCM',               description: 'Oracle HCM consulting, delivery, remediation, testing, VBCS/Redwood, reporting, integrations and managed support.' },
      { href: '#app-dev',    title: 'Application Development',   description: 'Practical applications designed around real operational problems, including LIMS and school management solutions.' },
      { href: '#pts',        title: 'Productised Tech Services', description: 'Fixed-scope healthchecks, release assurance, technology support pods and specialist advisory services.' },
    ]
    for (let i = 0; i < cards.length; i++) {
      await seedRepeatableItem(userId, whatWeDoSection.id, i, {
        href:        { blockType: 'URL',  textValue: cards[i].href },
        title:       { blockType: 'TEXT', textValue: cards[i].title },
        description: { blockType: 'TEXT', textValue: cards[i].description },
      })
    }
  }

  const whyChcSection = await upsertSection(userId, page.id, 'whyChc', 3)
  if (!(await hasRepeatableItems(whyChcSection.id))) {
    const cards = [
      { heading: 'Senior-led Delivery',      paragraph: 'Solutions are designed and governed by experienced enterprise technology professionals.' },
      { heading: 'Cost-effective execution', paragraph: 'The right level of capability is applied to each part of delivery.' },
      { heading: 'Capability development',   paragraph: 'Consultants progress through structured assignments, review cycles and real delivery expectations.' },
      { heading: 'Social impact',            paragraph: 'Each successful engagement helps create sustainable technology careers while delivering client outcomes.' },
    ]
    for (let i = 0; i < cards.length; i++) {
      await seedRepeatableItem(userId, whyChcSection.id, i, {
        heading:   { blockType: 'TEXT', textValue: cards[i].heading },
        paragraph: { blockType: 'TEXT', textValue: cards[i].paragraph },
      })
    }
  }

  console.log('  home: seeded')
}

// ─── Inner pages (shared hero + contentSection pattern) ───────────────────────

async function seedInnerPage(userId, slug, title, hero, cs, seo) {
  const page = await upsertPage(userId, slug, title)
  await upsertSeo(userId, page.id, seo)

  const heroSection = await upsertSection(userId, page.id, 'innerPageHero', 0)
  await seedBlock(userId, heroSection.id, 'heading',  'TEXT', hero.heading)
  await seedBlock(userId, heroSection.id, 'subtitle', 'TEXT', hero.subtitle)

  const csSection = await upsertSection(userId, page.id, 'contentSection', 1)
  await seedBlock(userId, csSection.id, 'badge',     'TEXT', cs.badge)
  await seedBlock(userId, csSection.id, 'heading',   'TEXT', cs.heading)
  await seedBlock(userId, csSection.id, 'paragraph', 'TEXT', cs.paragraph)

  console.log(`  ${slug}: seeded`)
  return page
}

// ─── About ────────────────────────────────────────────────────────────────────

async function seedAbout(userId, CS_DEFAULT) {
  const page = await seedInnerPage(userId, 'about', 'About',
    { heading: 'About', subtitle: 'We deliver smart solutions that help your business grow successfully.' },
    CS_DEFAULT,
    { metaTitle: 'About - CHC', metaDescription: 'We deliver smart solutions that help your business grow successfully.' }
  )
  const featureSection = await upsertSection(userId, page.id, 'featureCards', 2)
  if (!(await hasRepeatableItems(featureSection.id))) {
    const cards = [
      { title: 'Development',         text: 'From startups to enterprises, we craft adaptable web solutions that scale with your business.', href: '/' },
      { title: 'UX / UI design',      text: 'We build real-world web solutions ideal for all project sizes and a range of requirements.',    href: '/' },
      { title: 'Marketing',           text: 'We deliver web solutions designed to meet the evolving needs of startups alike.',              href: '/' },
      { title: 'Content writing',     text: 'From startups to enterprises, we craft adaptable web solutions that scale with your business.', href: '/' },
      { title: 'Product development', text: 'We build flexible web solutions that grow from small startups to large-scale demands.',        href: '/' },
      { title: 'eCommerce solutions', text: 'Create scalable web solutions tailored for startups to enterprise-level project needs.',        href: '/' },
    ]
    for (let i = 0; i < cards.length; i++) {
      await seedRepeatableItem(userId, featureSection.id, i, {
        title:     { blockType: 'TEXT', textValue: cards[i].title },
        paragraph: { blockType: 'TEXT', textValue: cards[i].text },
        href:      { blockType: 'URL',  textValue: cards[i].href },
      })
    }
  }
}

// ─── Services ─────────────────────────────────────────────────────────────────

async function seedServices(userId, CS_DEFAULT) {
  const page = await seedInnerPage(userId, 'services', 'Services',
    { heading: 'Services', subtitle: 'We deliver smart solutions that help your business grow successfully.' },
    CS_DEFAULT,
    { metaTitle: 'Services - CHC', metaDescription: 'We deliver smart solutions that help your business grow successfully.' }
  )
  const featureSection = await upsertSection(userId, page.id, 'featureCards', 2)
  if (!(await hasRepeatableItems(featureSection.id))) {
    const cards = [
      { title: 'Development',         text: 'From startups to enterprises, we craft adaptable web solutions that scale with your business.', href: '/' },
      { title: 'UX / UI design',      text: 'We build real-world web solutions ideal for all project sizes and a range of requirements.',    href: '/' },
      { title: 'Marketing',           text: 'We deliver web solutions designed to meet the evolving needs of startups alike.',              href: '/' },
      { title: 'Content writing',     text: 'From startups to enterprises, we craft adaptable web solutions that scale with your business.', href: '/' },
      { title: 'Product development', text: 'We build flexible web solutions that grow from small startups to large-scale demands.',        href: '/' },
      { title: 'eCommerce solutions', text: 'Create scalable web solutions tailored for startups to enterprise-level project needs.',        href: '/' },
    ]
    for (let i = 0; i < cards.length; i++) {
      await seedRepeatableItem(userId, featureSection.id, i, {
        title:     { blockType: 'TEXT', textValue: cards[i].title },
        paragraph: { blockType: 'TEXT', textValue: cards[i].text },
        href:      { blockType: 'URL',  textValue: cards[i].href },
      })
    }
  }
}

// ─── Oracle HCM ───────────────────────────────────────────────────────────────

async function seedOracleHcm(userId, CS_DEFAULT) {
  const page = await seedInnerPage(userId, 'oracle-hcm', 'Oracle HCM',
    { heading: 'Oracle HCM', subtitle: 'CHC provides senior-led Oracle HCM delivery supported by trained functional and technical consultants.' },
    CS_DEFAULT,
    { metaTitle: 'Oracle HCM - CHC', metaDescription: 'CHC provides senior-led Oracle HCM delivery supported by trained functional and technical consultants.' }
  )

  const capSection = await upsertSection(userId, page.id, 'capabilityItem', 2)
  if (!(await hasRepeatableItems(capSection.id))) {
    const caps = [
      'Core HR', 'Workforce Structure', 'Compensation', 'Talent', 'Learning',
      'Payroll', 'Security/AOR', 'Approvals', 'Journey', 'HCM Extracts',
      'Integrations', 'Testing', 'Quarterly Releases', 'Redwood / VBCS', 'Technical Remediation',
    ]
    for (let i = 0; i < caps.length; i++) {
      await seedRepeatableItem(userId, capSection.id, i, {
        label: { blockType: 'TEXT', textValue: caps[i] },
      })
    }
  }

  const svcSection = await upsertSection(userId, page.id, 'productisedService', 3)
  if (!(await hasRepeatableItems(svcSection.id))) {
    const services = [
      { title: 'Oracle HCM Health Check', cta: 'Request a Healthcheck',    desc: 'Focused assessment of an existing Oracle HCM environment covering configuration, security, integrations, reporting, technical debt and operational risk.' },
      { title: 'Oracle Rapid Response',   cta: 'Discuss an Oracle Problem', desc: 'For broken approvals, absence issues, security problems, reporting failures, integration defects, Redwood/VBCS issues and payroll/interface problems.' },
      { title: 'Release Assurance',       cta: 'Discuss Release Support',   desc: 'Quarterly release assessment and regression support covering impact analysis, business-process testing, integrations, security validation, defect tracking and go/no-go reporting.' },
      { title: 'Oracle Technology Pod',   cta: 'Discuss a Work Package',    desc: 'Flexible senior-led team supporting an agreed Oracle backlog across testing, reporting, configuration, VBCS, data, integrations, support and documentation.' },
    ]
    for (let i = 0; i < services.length; i++) {
      await seedRepeatableItem(userId, svcSection.id, i, {
        title:            { blockType: 'TEXT', textValue: services[i].title },
        ctaText:          { blockType: 'TEXT', textValue: services[i].cta },
        hoverDescription: { blockType: 'TEXT', textValue: services[i].desc },
      })
    }
  }

  const dcSection = await upsertSection(userId, page.id, 'deliveryCapacity', 4)
  await seedBlock(userId, dcSection.id, 'heading',   'TEXT', 'Looking for Oracle Delivery Capacity?')
  await seedBlock(userId, dcSection.id, 'paragraph', 'TEXT', 'CHC can operate as a specialist subcontracting and delivery partner for larger Oracle consultancies and implementation partners. We can take responsibility for defined work packages or provide supervised functional and technical delivery capacity under your program.')

  const carSection = await upsertSection(userId, page.id, 'serviceCarouselItem', 5)
  if (!(await hasRepeatableItems(carSection.id))) {
    const slides = [
      { title: 'Configuration',   desc: "Configure Oracle HCM Cloud to align with your organization's business processes, workforce structures, roles, approvals, and HR requirements." },
      { title: 'Testing',         desc: 'Ensure reliable HCM implementations through functional, integration, regression, and user acceptance testing before moving solutions into production.' },
      { title: 'Reporting',       desc: 'Build meaningful HR insights using OTBI, BI Publisher, dashboards, and customized reports to support better workforce decisions.' },
      { title: 'Data',            desc: 'Manage, validate, transform, and maintain employee and organizational data with accuracy across Oracle HCM Cloud.' },
      { title: 'Integrations',    desc: 'Connect Oracle HCM with external applications and enterprise systems using reliable integrations, APIs, and data exchange solutions.' },
      { title: 'VBCS',            desc: 'Develop modern, scalable business applications and extensions using Oracle Visual Builder Cloud Service while seamlessly working with Oracle HCM.' },
      { title: 'Release Support', desc: "Stay ahead of Oracle's quarterly updates with impact analysis, testing, issue identification, and post-release validation." },
      { title: 'Managed Support', desc: 'Get continuous technical and functional support for Oracle HCM, including troubleshooting, enhancements, monitoring, and day-to-day application assistance.' },
    ]
    for (let i = 0; i < slides.length; i++) {
      await seedRepeatableItem(userId, carSection.id, i, {
        title:       { blockType: 'TEXT', textValue: slides[i].title },
        description: { blockType: 'TEXT', textValue: slides[i].desc },
      })
    }
  }
}

// ─── Applications ─────────────────────────────────────────────────────────────

const APP_STACK_CARDS = [
  { badge: 'Outstanding speed',    heading: 'Excellence framework.',  paragraph: 'Our excellence framework is a strategic approach that ensures quality and continuous improvement across all operations.' },
  { badge: 'Performance playbook', heading: 'Strategic performance.', paragraph: 'Our excellence framework is a strategic approach that ensures quality and continuous improvement across all operations.' },
  { badge: 'Performance power',    heading: 'Outcome accelerator.',   paragraph: 'Our excellence framework is a strategic approach that ensures quality and continuous improvement across all operations.' },
]

async function seedApplications(userId, CS_DEFAULT) {
  const page = await seedInnerPage(userId, 'applications', 'Applications',
    { heading: 'Applications', subtitle: 'We deliver smart solutions that help your business grow successfully.' },
    CS_DEFAULT,
    { metaTitle: 'Applications - CHC', metaDescription: 'We deliver smart solutions that help your business grow successfully.' }
  )
  const groups = [['stackCards1', 2], ['stackCards2', 3], ['stackCards3', 4]]
  for (const [sectionKey, sortOrder] of groups) {
    const section = await upsertSection(userId, page.id, sectionKey, sortOrder)
    if (!(await hasRepeatableItems(section.id))) {
      for (let i = 0; i < APP_STACK_CARDS.length; i++) {
        await seedRepeatableItem(userId, section.id, i, {
          badge:     { blockType: 'TEXT', textValue: APP_STACK_CARDS[i].badge },
          heading:   { blockType: 'TEXT', textValue: APP_STACK_CARDS[i].heading },
          paragraph: { blockType: 'TEXT', textValue: APP_STACK_CARDS[i].paragraph },
        })
      }
    }
  }
}

// ─── Our Impact ───────────────────────────────────────────────────────────────

async function seedOurImpact(userId, CS_DEFAULT) {
  const page = await seedInnerPage(userId, 'our-impact', 'Our Impact',
    { heading: 'Our Impact', subtitle: 'We deliver smart solutions that help your business grow successfully.' },
    CS_DEFAULT,
    { metaTitle: 'Our Impact - CHC', metaDescription: 'We deliver smart solutions that help your business grow successfully.' }
  )
  const slideSection = await upsertSection(userId, page.id, 'serviceSlide', 2)
  if (!(await hasRepeatableItems(slideSection.id))) {
    const slides = [
      { title: 'Development',    desc: 'From startups to enterprises, we craft adaptable web solutions that scale with your business.' },
      { title: 'UX / UI Design', desc: 'Expertise lies in scalable web solutions for both emerging startups and enterprise.' },
      { title: 'Marketing',      desc: 'We build real-world web solutions ideal for all project sizes and a range of requirements.' },
      { title: 'Content writing',desc: 'Deliver web solutions designed to meet the evolving needs of startups alike.' },
      { title: 'Product design', desc: 'Create scalable web solutions tailored for startups to enterprise-level project needs.' },
      { title: 'Development',    desc: 'We build flexible web solutions that grow from small startups to large-scale demands.' },
      { title: 'UX / UI Design', desc: 'From startups to enterprises, we craft adaptable web solutions that scale with your business.' },
      { title: 'Marketing',      desc: 'We deliver web solutions designed to meet the evolving needs of startups alike.' },
      { title: 'Content writing',desc: 'We build real-world web solutions ideal for all project sizes and a range of requirements.' },
      { title: 'Product design', desc: 'From startups to enterprises, we craft adaptable web solutions that scale with your business.' },
    ]
    for (let i = 0; i < slides.length; i++) {
      await seedRepeatableItem(userId, slideSection.id, i, {
        title:       { blockType: 'TEXT', textValue: slides[i].title },
        description: { blockType: 'TEXT', textValue: slides[i].desc },
      })
    }
  }
}

// ─── Our Delivery Model ───────────────────────────────────────────────────────

async function seedOurDeliveryModel(userId, CS_DEFAULT) {
  const page = await seedInnerPage(userId, 'our-delivery-model', 'Our Delivery Model',
    { heading: 'Our Delivery Model', subtitle: 'We deliver smart solutions that help your business grow successfully.' },
    CS_DEFAULT,
    { metaTitle: 'Our Delivery Model - CHC', metaDescription: 'We deliver smart solutions that help your business grow successfully.' }
  )

  const STEPS1 = [
    { icon: 'line-icon-Idea-5',       label: 'Research',     description: 'We research your business needs and identify the best technology solutions.' },
    { icon: 'line-icon-Fountain-Pen', label: 'Sketches',     description: 'We sketch out the solution architecture and design.' },
    { icon: 'line-icon-Loading-2',    label: 'Concept',      description: 'We develop a proof of concept to validate the approach.' },
    { icon: 'line-icon-Juice',        label: 'Presentation', description: 'We present the solution to stakeholders for feedback.' },
    { icon: 'line-icon-Idea-5',       label: 'Delivery',     description: 'We deliver the solution with full documentation and support.' },
  ]
  const steps1Section = await upsertSection(userId, page.id, 'processSteps1', 2)
  if (!(await hasRepeatableItems(steps1Section.id))) {
    for (let i = 0; i < STEPS1.length; i++) {
      await seedRepeatableItem(userId, steps1Section.id, i, {
        icon:        { blockType: 'TEXT', textValue: STEPS1[i].icon },
        label:       { blockType: 'TEXT', textValue: STEPS1[i].label },
        description: { blockType: 'TEXT', textValue: STEPS1[i].description },
      })
    }
  }

  const FAQS = [
    { q: 'Can you help us raise money?',       a: 'We focus on technology delivery rather than fundraising, but our senior-led teams can help you build the technology foundations that attract investment.' },
    { q: 'Do we really need a business plan?', a: 'A clear scope and objectives are essential. We work with you to define requirements before any delivery begins.' },
    { q: 'Will you sign a agreement?',         a: 'Yes. All engagements are covered by a formal statement of work or services agreement before work commences.' },
    { q: 'Can you send us samples of work?',   a: 'We can share case studies and reference examples under NDA. Contact us to discuss your specific requirements.' },
  ]
  const faqSection = await upsertSection(userId, page.id, 'faqItem', 3)
  if (!(await hasRepeatableItems(faqSection.id))) {
    for (let i = 0; i < FAQS.length; i++) {
      await seedRepeatableItem(userId, faqSection.id, i, {
        question: { blockType: 'TEXT', textValue: FAQS[i].q },
        answer:   { blockType: 'TEXT', textValue: FAQS[i].a },
      })
    }
  }

  const STEPS2 = [
    { icon: 'line-icon-Idea-5',       label: 'Discovery',  description: 'Deep-dive into your current state, pain points and desired outcomes.' },
    { icon: 'line-icon-Fountain-Pen', label: 'Design',     description: 'Solution design aligned to your architecture standards and constraints.' },
    { icon: 'line-icon-Loading-2',    label: 'Build',      description: 'Iterative delivery with regular checkpoints and quality gates.' },
    { icon: 'line-icon-Juice',        label: 'Test',       description: 'Functional, integration and regression testing before go-live.' },
    { icon: 'line-icon-Fountain-Pen', label: 'Deploy',     description: 'Controlled deployment with rollback plan and hypercare support.' },
    { icon: 'line-icon-Loading-2',    label: 'Stabilise',  description: 'Post-go-live stabilisation period with dedicated support.' },
    { icon: 'line-icon-Juice',        label: 'Optimise',   description: 'Continuous improvement based on user feedback and performance data.' },
    { icon: 'line-icon-Idea-5',       label: 'Handover',   description: 'Full knowledge transfer and documentation to your internal team.' },
  ]
  const steps2Section = await upsertSection(userId, page.id, 'processSteps2', 4)
  if (!(await hasRepeatableItems(steps2Section.id))) {
    for (let i = 0; i < STEPS2.length; i++) {
      await seedRepeatableItem(userId, steps2Section.id, i, {
        icon:        { blockType: 'TEXT', textValue: STEPS2[i].icon },
        label:       { blockType: 'TEXT', textValue: STEPS2[i].label },
        description: { blockType: 'TEXT', textValue: STEPS2[i].description },
      })
    }
  }
}

// ─── Our People ───────────────────────────────────────────────────────────────

async function seedOurPeople(userId) {
  const page = await upsertPage(userId, 'our-people', 'Our People')
  await upsertSeo(userId, page.id, { metaTitle: 'Our People - CHC', metaDescription: 'Meet the team behind CHC.' })

  const heroSection = await upsertSection(userId, page.id, 'innerPageHero', 0)
  await seedBlock(userId, heroSection.id, 'heading',  'TEXT', 'Our People')
  await seedBlock(userId, heroSection.id, 'subtitle', 'TEXT', 'Meet the team behind CHC.')

  const csSection = await upsertSection(userId, page.id, 'contentSection', 1)
  await seedBlock(userId, csSection.id, 'badge',     'TEXT', 'We are modern business agency')
  await seedBlock(userId, csSection.id, 'heading',   'TEXT', 'The leading agency for startup success.')
  await seedBlock(userId, csSection.id, 'paragraph', 'TEXT', 'We strive to develop real-world web solutions that are ideal for small to large projects with bespoke project requirements.')

  const teamSection = await upsertSection(userId, page.id, 'teamMember', 2)
  if (!(await hasRepeatableItems(teamSection.id))) {
    const members = [
      { name: 'User 1', role: 'Director' },
      { name: 'User 2', role: 'Specialist' },
      { name: 'User 3', role: 'Manager' },
      { name: 'User 4', role: 'Consultant' },
      { name: 'User 5', role: 'Architect' },
      { name: 'User 6', role: 'Lead Developer' },
      { name: 'User 7', role: 'Data Analyst' },
      { name: 'User 8', role: 'Solutions Engineer' },
    ]
    for (let i = 0; i < members.length; i++) {
      await seedRepeatableItem(userId, teamSection.id, i, {
        name:          { blockType: 'TEXT', textValue: members[i].name },
        role:          { blockType: 'TEXT', textValue: members[i].role },
        capability:    { blockType: 'TEXT', textValue: '' },
        learningFocus: { blockType: 'TEXT', textValue: '' },
      })
    }
  }
  console.log('  our-people: seeded')
}

// ─── Contact ──────────────────────────────────────────────────────────────────

async function seedContact(userId) {
  const page = await upsertPage(userId, 'contact', 'Contact')
  await upsertSeo(userId, page.id, { metaTitle: 'Contact - CHC', metaDescription: 'Get in touch with CHC.' })

  const heroSection = await upsertSection(userId, page.id, 'innerPageHero', 0)
  await seedBlock(userId, heroSection.id, 'heading',  'TEXT', 'Contact')
  await seedBlock(userId, heroSection.id, 'subtitle', 'TEXT', 'Get in touch with CHC.')

  const contactSection = await upsertSection(userId, page.id, 'contact', 1)
  await seedBlock(userId, contactSection.id, 'officeAddress', 'TEXT', '401 Broadway, 24th Floor, Orchard View, London, UK')
  await seedBlock(userId, contactSection.id, 'phone',         'TEXT', '1-800-222-000')
  await seedBlock(userId, contactSection.id, 'fax',           'TEXT', '1-800-222-002')
  await seedBlock(userId, contactSection.id, 'email1',        'TEXT', 'info@yourdomain.com')
  await seedBlock(userId, contactSection.id, 'email2',        'TEXT', 'hr@yourdomain.com')
  await seedBlock(userId, contactSection.id, 'mapLat',        'TEXT', '-37.805688')
  await seedBlock(userId, contactSection.id, 'mapLng',        'TEXT', '144.962312')
  await seedBlock(userId, contactSection.id, 'mapPopupHtml',  'TEXT', '<div class=infowindow><strong class="mb-3 d-inline-block alt-font">CHC Consulting</strong><p class="alt-font">16122 Collins street, Melbourne, Australia</p></div>')

  console.log('  contact: seeded')
}

// ─── Give One Hour ────────────────────────────────────────────────────────────

async function seedGiveOneHour(userId) {
  const page = await upsertPage(userId, 'give-one-hour', 'Give One Hour')
  await upsertSeo(userId, page.id, { metaTitle: 'Give One Hour - CHC', metaDescription: 'Share your expertise, shape a career.' })

  const heroSection = await upsertSection(userId, page.id, 'innerPageHero', 0)
  await seedBlock(userId, heroSection.id, 'heading',  'TEXT', 'Give One Hour')
  await seedBlock(userId, heroSection.id, 'subtitle', 'TEXT', 'CHC provides senior-led Oracle HCM delivery supported by trained functional and technical consultants.')

  const csSection = await upsertSection(userId, page.id, 'contentSection', 1)
  await seedBlock(userId, csSection.id, 'badge',     'TEXT', 'We are modern business agency')
  await seedBlock(userId, csSection.id, 'heading',   'TEXT', 'The leading agency for startup success.')
  await seedBlock(userId, csSection.id, 'paragraph', 'TEXT', 'We strive to develop real-world web solutions that are ideal for small to large projects with bespoke project requirements.')

  const gohSection = await upsertSection(userId, page.id, 'giveOneHour', 2)
  await seedBlock(userId, gohSection.id, 'sectionHeading',    'TEXT', 'Share your expertise, shape a career.')
  await seedBlock(userId, gohSection.id, 'sectionSubheading', 'TEXT', '')

  console.log('  give-one-hour: seeded')
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('CHC CMS — seeding content...\n')

  const userId = await getOrCreateSystemUser()

  await seedNavigation(userId)
  await seedFooter(userId)
  await seedHome(userId)

  const CS_DEFAULT = {
    badge:     'We are modern business agency',
    heading:   'The leading agency for startup success.',
    paragraph: 'We strive to develop real-world web solutions that are ideal for small to large projects with bespoke project requirements.',
  }

  await seedAbout(userId, CS_DEFAULT)
  await seedServices(userId, CS_DEFAULT)
  await seedOracleHcm(userId, CS_DEFAULT)
  await seedApplications(userId, CS_DEFAULT)
  await seedOurDeliveryModel(userId, CS_DEFAULT)
  await seedOurImpact(userId, CS_DEFAULT)

  await seedOurPeople(userId)
  await seedContact(userId)
  await seedGiveOneHour(userId)

  console.log('\n✅ Seed complete.')
  console.log('   Run `npm run db:seed:admin` to create the admin user if not done yet.')
}

main()
  .catch((err) => { console.error('\nSeed failed:', err); process.exit(1) })
  .finally(() => prisma.$disconnect())
