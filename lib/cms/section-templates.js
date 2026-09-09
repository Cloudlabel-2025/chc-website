/**
 * CHC CMS — Section Template Catalog
 *
 * Pre-configured section templates that can be inserted into any page.
 * Each template includes default blocks and field definitions.
 */

const text = (fieldKey, textValue) => ({ fieldKey, blockType: 'TEXT', textValue })
const url = (fieldKey, textValue) => ({ fieldKey, blockType: 'URL', textValue })
const image = (fieldKey, textValue) => ({ fieldKey, blockType: 'IMAGE', textValue })

const CORE_SECTION_TEMPLATES = [
  {
    key: 'hero',
    name: 'Hero Banner Section',
    category: 'Banners',
    description: 'Full-width hero section with background image, badge, heading, subtitle and call-to-action buttons.',
    defaultBlocks: [
      { fieldKey: 'backgroundImage', blockType: 'IMAGE', textValue: '/images/Oracle-hcm-hero.png' },
      { fieldKey: 'badge', blockType: 'TEXT', textValue: 'Welcome to CHC' },
      { fieldKey: 'heading', blockType: 'TEXT', textValue: 'Technology Delivery with a Social Conscience' },
      { fieldKey: 'paragraph', blockType: 'TEXT', textValue: 'We deliver enterprise technology services through senior-led teams and structured talent development.' },
      { fieldKey: 'cta1Label', blockType: 'TEXT', textValue: 'Explore Services' },
      { fieldKey: 'cta1Href', blockType: 'URL', textValue: '/services' },
      { fieldKey: 'cta2Label', blockType: 'TEXT', textValue: 'Get in Touch' },
      { fieldKey: 'cta2Href', blockType: 'URL', textValue: '/contact' },
    ],
  },
  {
    key: 'intro',
    name: 'Homepage Intro Section',
    category: 'Homepage',
    description: 'Two-column homepage introduction with a primary button and secondary text link.',
    defaultBlocks: [
      image('leftImage', '/images/home-first-section.jpg'),
      image('rightImage', '/images/home-content-2.jpg'),
      text('badge', 'We are modern business agency'),
      text('heading', 'Powerful agency for corporate business.'),
      text('paragraph', 'We strive to develop real-world web solutions that are ideal for small to large projects with bespoke project requirements.'),
      text('buttonLabel', 'Discuss Tech Requirement'),
      url('buttonHref', '#contact'),
      text('linkLabel', 'Explore our services'),
      url('linkHref', '/services'),
      text('note', 'Reliable insights powered by the latest data.'),
    ],
  },
  {
    key: 'contentSection',
    name: 'Two-Column Feature Section',
    category: 'Features',
    description: 'Two-column layout featuring offset imagery on left and badge, heading, paragraph on right.',
    defaultBlocks: [
      { fieldKey: 'leftImage', blockType: 'IMAGE', textValue: '/images/Oracle-hcm-content.jpg' },
      { fieldKey: 'rightImage', blockType: 'IMAGE', textValue: 'https://res.cloudinary.com/asllbyrd/image/upload/v1788602849/chc/static/oracle-hcm-content-02.jpg' },
      { fieldKey: 'badge', blockType: 'TEXT', textValue: 'About Our Capabilities' },
      { fieldKey: 'heading', blockType: 'TEXT', textValue: 'Leading Technology Delivery & Solutions' },
      { fieldKey: 'paragraph', blockType: 'TEXT', textValue: 'We strive to develop real-world web solutions that are ideal for small to large projects with bespoke requirements.' },
    ],
  },
  {
    key: 'whatWeDo',
    name: 'Services & Solutions Grid',
    category: 'Services',
    description: 'Grid of interactive service cards with custom background images, titles, and descriptions.',
    defaultBlocks: [
      { fieldKey: 'sectionHeading', blockType: 'TEXT', textValue: 'What We Do' },
    ],
    defaultItems: [{ key: 'service-1', fields: [image('image', '/images/config.png'), text('title', 'Service title'), text('description', 'Describe this service and its outcome.'), url('href', '/services')] }],
  },
  {
    key: 'whyChc',
    name: 'Stack Cards / Value Propositions',
    category: 'Features',
    description: 'Stacked cards highlighting core differentiators, methodology, and value pillars.',
    defaultBlocks: [
      { fieldKey: 'sectionHeading', blockType: 'TEXT', textValue: 'Why Choose Us?' },
    ],
    defaultItems: [{ key: 'value-1', fields: [image('image', '/images/sls-home.jpg'), text('heading', 'Senior-led delivery'), text('paragraph', 'Describe the value this delivery principle provides.')] }],
  },
  {
    key: 'processStep',
    name: 'Step-by-Step Delivery Model',
    category: 'Process',
    description: 'Numbered process steps with custom icons, titles, and descriptive text.',
    defaultBlocks: [
      { fieldKey: 'sectionHeading', blockType: 'TEXT', textValue: 'Our Delivery Model' },
    ],
  },
  {
    key: 'teamMember',
    name: 'Team / People Grid',
    category: 'Team',
    description: 'Grid of team members showing photos, names, roles, and focus areas.',
    defaultBlocks: [
      { fieldKey: 'sectionHeading', blockType: 'TEXT', textValue: 'Our People' },
    ],
    defaultItems: [{ key: 'person-1', fields: [image('photo', '/images/healthcheck.jpg'), text('name', 'Team member'), text('role', 'Consultant'), text('capability', ''), text('learningFocus', '')] }],
  },
  {
    key: 'cta',
    name: 'Call-to-Action Banner',
    category: 'Banners',
    description: 'High-impact call-to-action banner to drive conversions.',
    defaultBlocks: [
      { fieldKey: 'heading', blockType: 'TEXT', textValue: 'Ready to Transform Your Delivery?' },
      { fieldKey: 'paragraph', blockType: 'TEXT', textValue: 'Contact our senior consultants today to discuss your technology requirements.' },
      { fieldKey: 'buttonLabel', blockType: 'TEXT', textValue: 'Contact Us Now' },
      { fieldKey: 'buttonHref', blockType: 'URL', textValue: '/contact' },
    ],
  },
  {
    key: 'richText',
    name: 'Custom Rich Text Content',
    category: 'Content',
    description: 'Flexible HTML / formatted text section for general content, announcements, or documentation.',
    defaultBlocks: [
      { fieldKey: 'sectionHeading', blockType: 'TEXT', textValue: 'Section heading' },
      { fieldKey: 'content', blockType: 'RICH_TEXT', textValue: '<p>Write your section content here...</p>' },
    ],
  },
  {
    key: 'oracleHeadings',
    name: 'Oracle HCM Section Headings',
    category: 'Oracle HCM',
    description: 'Headings and labels shared by the Oracle HCM capability and services sections.',
    defaultBlocks: [
      { fieldKey: 'capabilitiesHeading', blockType: 'TEXT', textValue: 'Core Capabilities' },
      { fieldKey: 'servicesEyebrow', blockType: 'TEXT', textValue: 'Oracle HCM' },
      { fieldKey: 'servicesHeading', blockType: 'TEXT', textValue: 'Productised Oracle Services' },
      { fieldKey: 'exploreLabel', blockType: 'TEXT', textValue: 'Explore services' },
    ],
  },
  {
    key: 'capabilityItem',
    name: 'Oracle HCM Capabilities',
    category: 'Oracle HCM',
    description: 'A looping capability ticker with editable icons and labels.',
    defaultBlocks: [{ fieldKey: 'sectionHeading', blockType: 'TEXT', textValue: 'Core Capabilities' }],
    defaultItems: [
      { key: 'core-hr', fields: [{ fieldKey: 'icon', blockType: 'IMAGE', textValue: '/images/core-hr-vec.png' }, { fieldKey: 'label', blockType: 'TEXT', textValue: 'Core HR' }] },
      { key: 'workforce-structure', fields: [{ fieldKey: 'icon', blockType: 'IMAGE', textValue: '/images/wfs.png' }, { fieldKey: 'label', blockType: 'TEXT', textValue: 'Workforce Structure' }] },
    ],
  },
  {
    key: 'serviceCarouselItem',
    name: 'Oracle Delivery Services Carousel',
    category: 'Oracle HCM',
    description: 'Drag-enabled Oracle delivery-service cards.',
    defaultBlocks: [
      { fieldKey: 'heading', blockType: 'TEXT', textValue: 'Looking for Oracle Delivery Capacity?' },
      { fieldKey: 'paragraph', blockType: 'TEXT', textValue: 'CHC can operate as a specialist subcontracting and delivery partner for larger Oracle consultancies and implementation partners.' },
      { fieldKey: 'sectionHeading', blockType: 'TEXT', textValue: 'Oracle Delivery Services' },
    ],
    defaultItems: [
      { key: 'configuration', fields: [{ fieldKey: 'image', blockType: 'IMAGE', textValue: '/images/config.png' }, { fieldKey: 'title', blockType: 'TEXT', textValue: 'Configuration' }, { fieldKey: 'description', blockType: 'TEXT', textValue: 'Configure Oracle HCM Cloud to align with your organisation’s business processes and HR requirements.' }, { fieldKey: 'href', blockType: 'URL', textValue: '/services' }] },
    ],
  },
  {
    key: 'productisedService',
    name: 'Oracle Productised Services',
    category: 'Oracle HCM',
    description: 'Image-led Oracle HCM service cards.',
    defaultBlocks: [{ fieldKey: 'sectionHeading', blockType: 'TEXT', textValue: 'Productised Oracle Services' }],
    defaultItems: [
      { key: 'health-check', fields: [{ fieldKey: 'image', blockType: 'IMAGE', textValue: '/images/healthcheck.jpg' }, { fieldKey: 'title', blockType: 'TEXT', textValue: 'Oracle HCM Health Check' }, { fieldKey: 'hoverDescription', blockType: 'TEXT', textValue: 'Focused assessment of your Oracle HCM environment, configuration, security and operational risk.' }, { fieldKey: 'ctaText', blockType: 'TEXT', textValue: 'Request a Health Check' }] },
    ],
  },
]

// Every key below is supported by the CMS editor and/or seed data. Keeping
// these definitions here makes add/restore behavior consistent for any page.
const COMPLETE_SECTION_TEMPLATES = [
  { key: 'innerPageHero', name: 'Inner Page Hero', category: 'Banners', description: 'Page hero with title and subtitle.', defaultBlocks: [image('backgroundImage', '/images/demo-business-banner-bg.jpg'), text('heading', 'Page title'), text('subtitle', 'A short introduction to this page.')] },
  { key: 'featureCards', name: 'Feature Cards', category: 'Content', description: 'A reusable feature-card grid.', defaultBlocks: [text('sectionHeading', 'Our capabilities')], defaultItems: [{ key: 'feature-1', fields: [image('image', '/images/config.png'), text('title', 'Feature title'), text('paragraph', 'Describe this capability and its outcome.'), url('href', '/services')] }] },
  { key: 'serviceSlide', name: 'Service Slides', category: 'Carousels', description: 'A horizontal services carousel with an optional eyebrow badge.', defaultBlocks: [text('sectionBadge', 'Services and solutions'), text('sectionHeading', 'Experienced services')], defaultItems: [{ key: 'service-1', fields: [image('image', '/images/config.png'), text('title', 'Service title'), text('description', 'Describe this service and its value.'), url('href', '/services')] }] },
  { key: 'stackCards1', name: 'Stack Cards', category: 'Content', description: 'Layered content cards.', defaultBlocks: [text('sectionHeading', 'Our approach')], defaultItems: [{ key: 'card-1', fields: [image('image', '/images/sls-home.jpg'), text('badge', 'CHC'), text('heading', 'Card heading'), text('paragraph', 'Describe this card.')] }] },
  { key: 'stackCards2', name: 'Stack Cards Extended', category: 'Content', description: 'An additional layered card group.', defaultBlocks: [text('sectionHeading', 'Our approach')], defaultItems: [{ key: 'card-1', fields: [image('image', '/images/sls-home.jpg'), text('badge', 'CHC'), text('heading', 'Card heading'), text('paragraph', 'Describe this card.')] }] },
  { key: 'stackCards3', name: 'Stack Cards Showcase', category: 'Content', description: 'A third layered card group.', defaultBlocks: [text('sectionHeading', 'Our approach')], defaultItems: [{ key: 'card-1', fields: [image('image', '/images/sls-home.jpg'), text('badge', 'CHC'), text('heading', 'Card heading'), text('paragraph', 'Describe this card.')] }] },
  { key: 'processSteps1', name: 'Process Steps', category: 'Process', description: 'Numbered delivery steps.', defaultBlocks: [text('sectionHeading', 'Our delivery process')], defaultItems: [{ key: 'step-1', fields: [text('icon', 'line-icon-Idea-5'), text('label', 'Discover'), text('description', 'Understand the current state and desired outcomes.')] }] },
  { key: 'processSteps2', name: 'Extended Process Steps', category: 'Process', description: 'Additional delivery steps.', defaultBlocks: [text('sectionHeading', 'Delivery steps')], defaultItems: [{ key: 'step-1', fields: [text('icon', 'line-icon-Rocket'), text('label', 'Deliver'), text('description', 'Deliver, validate, and improve the solution.')] }] },
  { key: 'faqItem', name: 'FAQ Cards', category: 'Content', description: 'Frequently asked questions with an optional eyebrow badge.', defaultBlocks: [text('sectionBadge', 'Frequently asked questions'), text('sectionHeading', 'Frequently asked questions')], defaultItems: [{ key: 'faq-1', fields: [text('question', 'Frequently asked question'), text('answer', 'Add a clear, helpful answer.')] }] },
  { key: 'contact', name: 'Contact Details', category: 'Contact', description: 'Office, phone, email, and map details.', defaultBlocks: [text('officeLabel', 'Office'), text('officeAddress', 'Add your office address'), text('phoneLabel', 'Phone'), text('phone', ''), text('emailLabel', 'Email'), text('email1', ''), text('mapLat', ''), text('mapLng', ''), text('mapPopupHtml', '')] },
  { key: 'giveOneHour', name: 'Give One Hour Intro', category: 'Content', description: 'Heading and copy for the Give One Hour programme.', defaultBlocks: [text('sectionHeading', 'Share your expertise, shape a career.'), text('sectionSubheading', '')] },
  { key: 'contactForm', name: 'Contact Form Copy', category: 'Forms', description: 'Editable copy for the contact form.', defaultBlocks: [text('formBadge', 'Get in touch'), text('heading', 'Talk to our team'), text('paragraph', 'Tell us how we can help.'), text('submitLabel', 'Send enquiry'), text('successMessage', 'Thanks. We will be in touch shortly.')] },
  { key: 'giveOneHourForm', name: 'Give One Hour Form Copy', category: 'Forms', description: 'Editable copy for the Give One Hour form.', defaultBlocks: [text('formBadge', 'Give one hour'), text('heading', 'Share your expertise'), text('paragraph', 'Tell us about your experience.'), text('successMessage', 'Thank you for your interest.')] },
  { key: 'cmsForm', name: 'CMS Form (embed a created form)', category: 'Forms', description: 'Embed a form built in Admin → Forms by entering its slug.', defaultBlocks: [text('formSlug', '')] },
  { key: 'peopleHeader', name: 'People Header', category: 'Headers', description: 'Heading for a people section.', defaultBlocks: [text('badge', 'Meet our people'), text('heading', 'Leading experts')] },
  { key: 'faqHeader', name: 'FAQ Header', category: 'Headers', description: 'Heading for an FAQ section.', defaultBlocks: [text('eyebrow', 'Questions answered'), text('heading', 'Frequently asked questions')] },
  { key: 'faqFooter', name: 'FAQ Footer Link', category: 'Headers', description: 'Supporting FAQ link.', defaultBlocks: [text('text', 'Still have questions?'), text('label', 'Contact us'), url('href', '/contact')] },
  { key: 'processHeader2', name: 'Process Header', category: 'Headers', description: 'Heading for an extended process section.', defaultBlocks: [text('heading', 'Our delivery process')] },
  { key: 'impactHeader', name: 'Impact Header', category: 'Headers', description: 'Heading for an impact-services section.', defaultBlocks: [text('badge', 'Services and solutions'), text('heading', 'Experienced services')] },
  { key: 'impactFooter', name: 'Impact Footer', category: 'Headers', description: 'Supporting impact-section content.', defaultBlocks: [text('note', 'Delivery designed for lasting outcomes.')] },
  { key: 'homeStackHeader', name: 'Homepage Stack Header', category: 'Headers', description: 'Heading for the home stack cards.', defaultBlocks: [text('eyebrow', 'Our approach'), text('heading', 'Solutions that stack up')] },
]

export const SECTION_TEMPLATES = [...CORE_SECTION_TEMPLATES, ...COMPLETE_SECTION_TEMPLATES]

const TEMPLATE_ALIASES = {
  content: 'contentSection',
  introSection: 'contentSection',
  ctaBanner: 'cta',
}

export function getSectionTemplate(key) {
  const normalized = TEMPLATE_ALIASES[key] ?? key
  return SECTION_TEMPLATES.find((tpl) => tpl.key === normalized) ?? null
}
