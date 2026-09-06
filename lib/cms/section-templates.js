/**
 * CHC CMS — Section Template Catalog
 *
 * Pre-configured section templates that can be inserted into any page.
 * Each template includes default blocks and field definitions.
 */

export const SECTION_TEMPLATES = [
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
  },
  {
    key: 'whyChc',
    name: 'Stack Cards / Value Propositions',
    category: 'Features',
    description: 'Stacked cards highlighting core differentiators, methodology, and value pillars.',
    defaultBlocks: [
      { fieldKey: 'sectionHeading', blockType: 'TEXT', textValue: 'Why Choose Us?' },
    ],
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
      { fieldKey: 'content', blockType: 'RICH_TEXT', textValue: '<p>Write your section content here...</p>' },
    ],
  },
]

const TEMPLATE_ALIASES = {
  intro: 'contentSection',
  content: 'contentSection',
  introSection: 'contentSection',
}

export function getSectionTemplate(key) {
  const normalized = TEMPLATE_ALIASES[key] ?? key
  return SECTION_TEMPLATES.find((tpl) => tpl.key === normalized) ?? null
}
