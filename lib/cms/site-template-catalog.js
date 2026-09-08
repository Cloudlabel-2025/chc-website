/**
 * The reusable CHC page-layout catalogue.
 *
 * A template describes section structure only. It can be applied to any CMS
 * page and deliberately uses merge semantics: existing editor content is not
 * overwritten. The section editor remains the single place to tailor copy,
 * images and repeatable carousel items afterwards.
 */

const text = (fieldKey, textValue = '') => ({ fieldKey, blockType: 'TEXT', textValue })
const image = (fieldKey, textValue = '') => ({ fieldKey, blockType: 'IMAGE', textValue })
const url = (fieldKey, textValue = '') => ({ fieldKey, blockType: 'URL', textValue })
const section = (sectionKey, blocks = [], items = []) => ({ sectionKey, blocks, items })

const standardHero = () => section('innerPageHero', [
  image('backgroundImage', '/images/demo-business-banner-bg.jpg'),
  text('heading', 'Page title'),
  text('subtitle', 'A short introduction to this page.'),
])

const serviceItems = () => [
  { key: 'service-1', fields: [image('image', '/images/config.png'), text('title', 'Service title'), text('description', 'Describe the service and its outcome.'), url('href', '/services')] },
  { key: 'service-2', fields: [image('image', '/images/testing.jpg'), text('title', 'Another service'), text('description', 'Add a second service card for a complete carousel.'), url('href', '/services')] },
]

export const SITE_TEMPLATES = [
  {
    name: 'CHC — Home page',
    description: 'Homepage with hero, two-image introduction, services and value-proposition sections.',
    content: { version: 1, sections: [
      section('hero', [
        image('backgroundImage', '/images/Oracle-hcm-hero.png'), text('badge', 'CHC'),
        text('heading', 'Technology delivery with a social conscience'),
        text('paragraph', 'Senior-led technology delivery and meaningful opportunities for emerging talent.'),
        text('cta1Label', 'Explore services'), url('cta1Href', '/services'), text('cta2Label', 'Contact us'), url('cta2Href', '/contact'),
      ]),
      section('intro', [image('leftImage', '/images/home-intro-01.jpg'), image('rightImage', '/images/home-intro-02.jpg'), text('badge', 'About CHC'), text('heading', 'Practical delivery for real outcomes'), text('paragraph', 'Introduce your company, delivery approach and purpose here.')]),
      section('whatWeDo', [text('sectionHeading', 'What we do')]),
      section('whyChc', [text('sectionHeading', 'Why choose CHC?')]),
    ] },
  },
  {
    name: 'CHC — Standard content page',
    description: 'Inner-page hero followed by a flexible two-column content section and call to action.',
    content: { version: 1, sections: [
      standardHero(),
      section('contentSection', [image('leftImage', '/images/Oracle-hcm-content.jpg'), image('rightImage', '/images/Oracle-hcm-content-02.jpg'), text('badge', 'Our capability'), text('heading', 'A clear, outcome-focused heading'), text('paragraph', 'Use this section to introduce the page topic with imagery and supporting copy.')]),
      section('ctaBanner', [text('heading', 'Ready to discuss your requirements?'), text('paragraph', 'Speak with the CHC team.'), text('buttonLabel', 'Contact us'), url('buttonHref', '/contact')]),
    ] },
  },
  {
    name: 'CHC — Oracle HCM services',
    description: 'Oracle HCM layout with icon ticker, delivery-capacity carousel and productised services.',
    content: { version: 1, sections: [
      standardHero(),
      section('oracleHeadings', [text('capabilitiesHeading', 'Core capabilities'), text('servicesEyebrow', 'Oracle HCM'), text('servicesHeading', 'Productised Oracle services'), text('exploreLabel', 'Explore services')]),
      section('capabilityItem', [text('sectionHeading', 'Core capabilities')], [
        { key: 'capability-1', fields: [image('icon', '/images/core-hr-vec.png'), text('label', 'Core HR')] },
        { key: 'capability-2', fields: [image('icon', '/images/wfs.png'), text('label', 'Workforce structure')] },
      ]),
      section('deliveryCapacity', [text('heading', 'Looking for Oracle Delivery Capacity?'), text('paragraph', 'Introduce your Oracle delivery capability and engagement model.')]),
      section('serviceCarouselItem', [text('sectionHeading', 'Oracle delivery services')], serviceItems()),
      section('productisedService', [text('sectionHeading', 'Productised Oracle services')], [
        { key: 'product-1', fields: [image('image', '/images/healthcheck.jpg'), text('title', 'Oracle HCM Health Check'), text('ctaText', 'Request a health check'), text('hoverDescription', 'Describe this productised service.')] },
      ]),
    ] },
  },
  {
    name: 'CHC — Services carousel page',
    description: 'A reusable hero, introduction and equal-size, drag-enabled service carousel.',
    content: { version: 1, sections: [
      standardHero(),
      section('contentSection', [image('leftImage', '/images/Oracle-hcm-content.jpg'), image('rightImage', '/images/Oracle-hcm-content-02.jpg'), text('badge', 'Services'), text('heading', 'Experienced services'), text('paragraph', 'Explain the services featured below.')]),
      section('impactHeader', [text('badge', 'Services and solutions'), text('heading', 'Experienced services')]),
      section('serviceSlide', [text('sectionBadge', 'Services and solutions'), text('sectionHeading', 'Experienced services')], serviceItems()),
      section('impactFooter', [text('note', 'Add a concise service statement here.')]),
    ] },
  },
  {
    name: 'CHC — People carousel page',
    description: 'People page with hero and repeatable team-member carousel cards.',
    content: { version: 1, sections: [
      standardHero(),
      section('peopleHeader', [text('badge', 'Meet our people'), text('heading', 'Leading experts')]),
      section('teamMember', [text('sectionHeading', 'Leading experts')], [
        { key: 'person-1', fields: [image('photo', '/images/healthcheck.jpg'), text('name', 'Team member'), text('role', 'Role'), text('capability', 'Add a capability area or speciality.'), text('learningFocus', 'Add a short professional profile.')] },
        { key: 'person-2', fields: [image('photo', '/images/oracle-tech-pod.jpg'), text('name', 'Team member'), text('role', 'Role'), text('capability', 'Add a capability area or speciality.'), text('learningFocus', 'Add a short professional profile.')] },
      ]),
    ] },
  },
  {
    name: 'CHC — Delivery model and FAQ',
    description: 'Process steps and FAQ sections for delivery model, implementation or support pages.',
    content: { version: 1, sections: [
      standardHero(),
      section('processHeader2', [text('heading', 'Our delivery process')]),
      section('processSteps1', [text('sectionHeading', 'Our delivery process')], [{ key: 'step-1', fields: [text('icon', 'line-icon-Idea-5'), text('label', 'Discover'), text('description', 'Describe the first delivery step.')] }]),
      section('processSteps2', [text('sectionHeading', 'Delivery steps')], [{ key: 'step-2', fields: [text('icon', 'line-icon-Rocket'), text('label', 'Deliver'), text('description', 'Describe the next delivery step.')] }]),
      section('faqHeader', [text('eyebrow', 'Questions answered'), text('heading', 'Frequently asked questions')]),
      section('faqItem', [text('sectionBadge', 'Frequently asked questions'), text('sectionHeading', 'Frequently asked questions')], [{ key: 'faq-1', fields: [text('question', 'Frequently asked question'), text('answer', 'Add a clear, helpful answer.')] }]),
    ] },
  },
  {
    name: 'CHC — Contact and enquiry page',
    description: 'Contact information, map details and contact-form section.',
    content: { version: 1, sections: [
      standardHero(),
      section('contact', [text('officeLabel', 'Office'), text('officeAddress', 'Add your office address'), text('phoneLabel', 'Phone'), text('phone', ''), text('emailLabel', 'Email'), text('email1', ''), text('mapLat', ''), text('mapLng', ''), text('mapPopupHtml', '')]),
      section('contactForm', [text('heading', 'Talk to our team'), text('submitLabel', 'Send enquiry')]),
    ] },
  },
]

export function getSiteTemplate(name) {
  return SITE_TEMPLATES.find((template) => template.name === name) ?? null
}
