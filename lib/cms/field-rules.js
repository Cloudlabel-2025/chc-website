/**
 * CHC CMS — Field Rules Config
 *
 * Single source of truth for:
 *   - Which fields are editable and how (editability class A–E)
 *   - Validation constraints (used to generate Zod schemas server-side)
 *   - Admin UI hints (labels, counters, locked indicators)
 *
 * Editability classes:
 *   A = Image-only editable (text/layout locked)
 *   B = Content-only editable (text editable, image locked)
 *   C = Image + content editable (both editable, layout locked)
 *   D = Fully repeatable (create/edit/delete/reorder)
 *   E = Fixed structure, controlled fields (specific fields editable; section can't be created/deleted)
 *
 * Dimension notes:
 *   - "recommended" = derived from actual CSS container widths found in Phase 0
 *   - "minimum" = hard floor below which quality degrades visibly
 *   - "flexible" = no hard constraint found in CSS; use reasonable defaults
 *   Where a real constraint was not found in the source CSS, it is marked explicitly.
 */

const MB = 1024 * 1024

// ─── Shared constraint sets ───────────────────────────────────────────────────

const HERO_IMAGE = {
  type: 'image',
  required: true,
  // Full-screen cover-background, CSS: full-screen class, md-h-750px, sm-h-650px
  // Container is 100vw. Recommended for full-bleed hero at 1920px wide.
  minWidth: 1280,   // minimum — below this looks poor on desktop
  minHeight: 600,   // minimum
  recommendedWidth: 1920,
  recommendedHeight: 900,
  maxFileSize: 5 * MB,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  note: 'recommended 1920×900px or larger, max 5MB. Current file (Oracle-hcm-hero.png) is 6.2MB — must be re-encoded before upload.',
}

const CONTENT_SECTION_IMAGE = {
  type: 'image',
  required: true,
  // w-70 lg-w-80 container inside col-xxl-7 col-lg-6 — flexible width
  // Aspect ratio not enforced by CSS; border-radius-10px applied
  minWidth: 400,    // minimum
  minHeight: 300,   // minimum
  recommendedWidth: 800,  // flexible — no hard CSS constraint found
  recommendedHeight: 600, // flexible
  maxFileSize: 3 * MB,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  note: 'flexible dimensions — no hard CSS constraint; recommended 800×600px',
}

const STACK_CARD_IMAGE = {
  type: 'image',
  required: true,
  // aspectRatio: '674/452' enforced inline in JSX
  minWidth: 674,
  minHeight: 452,
  recommendedWidth: 1348,  // 2× for retina
  recommendedHeight: 904,
  maxFileSize: 3 * MB,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  note: 'aspect ratio 674:452 (≈3:2) enforced by inline style in JSX',
}

const TEAM_CARD_IMAGE = {
  type: 'image',
  required: true,
  // placehold.co/600x756 used in JSX — portrait aspect ratio
  minWidth: 400,
  minHeight: 504,  // maintains ~600:756 ratio at minimum
  recommendedWidth: 600,
  recommendedHeight: 756,
  maxFileSize: 2 * MB,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  note: 'portrait aspect ratio ~600:756 (≈4:5) from JSX placeholder dimensions',
}

const SERVICE_CARD_IMAGE = {
  type: 'image',
  required: true,
  // team-style-05 cards, no explicit aspect ratio in CSS found — flexible
  minWidth: 300,   // minimum
  minHeight: 200,  // minimum
  recommendedWidth: 600,  // flexible
  recommendedHeight: 400, // flexible
  maxFileSize: 2 * MB,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  note: 'flexible — no hard CSS aspect ratio constraint found in source',
}

const CAPABILITY_ICON = {
  type: 'image',
  required: true,
  // h-75px class applied in JSX — icon/vector image
  minWidth: 75,
  minHeight: 75,
  recommendedWidth: 150,
  recommendedHeight: 150,
  maxFileSize: 512 * 1024, // 512KB — these are small vector/icon images
  allowedMimeTypes: ['image/png', 'image/svg+xml', 'image/webp'],
  note: 'h-75px display height; SVG preferred for scalability',
}

const CAROUSEL_SERVICE_IMAGE = {
  type: 'image',
  required: true,
  // services-box-style-03, no explicit dimensions in CSS — flexible
  minWidth: 300,
  minHeight: 200,
  recommendedWidth: 600,
  recommendedHeight: 400,
  maxFileSize: 2 * MB,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  note: 'flexible — no hard CSS constraint found; recommended 600×400px landscape',
}

// ─── Field rules by page / section / field ────────────────────────────────────

export const fieldRules = {

  // ── Global / Shared ────────────────────────────────────────────────────────

  // ContentSection component — shared across 8 inner pages
  contentSection: {
    leftImage: { ...CONTENT_SECTION_IMAGE, editClass: 'A', label: 'Left image' },
    rightImage: { ...CONTENT_SECTION_IMAGE, editClass: 'A', label: 'Right image' },
    badge: {
      type: 'text', editClass: 'B', label: 'Badge text',
      required: true, minLength: 5, maxLength: 60,
      note: 'Short uppercase label shown above heading',
    },
    heading: {
      type: 'text', editClass: 'B', label: 'Heading',
      required: true, minLength: 10, maxLength: 80,
    },
    paragraph: {
      type: 'text', editClass: 'B', label: 'Paragraph',
      required: true, minLength: 20, maxLength: 400,
    },
  },

  // ── Navigation ─────────────────────────────────────────────────────────────

  navigationItem: {
    label: {
      type: 'text', editClass: 'D', label: 'Nav label',
      required: true, minLength: 2, maxLength: 30,
    },
    href: {
      type: 'url', editClass: 'D', label: 'URL / path',
      required: true, minLength: 1, maxLength: 200,
    },
    badge: {
      type: 'text', editClass: 'D', label: 'Badge text (optional)',
      required: false, maxLength: 20,
    },
  },

  // ── Footer ─────────────────────────────────────────────────────────────────

  footer: {
    address1Label: {
      type: 'text', editClass: 'B', label: 'Address 1 — label',
      required: false, maxLength: 60,
    },
    address1Text: {
      type: 'text', editClass: 'B', label: 'Address 1 — text',
      required: false, maxLength: 200,
    },
    address2Label: {
      type: 'text', editClass: 'B', label: 'Address 2 — label',
      required: false, maxLength: 60,
    },
    address2Text: {
      type: 'text', editClass: 'B', label: 'Address 2 — text',
      required: false, maxLength: 200,
    },
    ctaText: {
      type: 'text', editClass: 'B', label: 'CTA text',
      required: false, maxLength: 100,
    },
    ctaLinkText: {
      type: 'text', editClass: 'B', label: 'CTA link label',
      required: false, maxLength: 60,
    },
    ctaLinkHref: {
      type: 'url', editClass: 'B', label: 'CTA link URL',
      required: false, maxLength: 200,
    },
    copyrightText: {
      type: 'text', editClass: 'B', label: 'Copyright text',
      required: true, minLength: 5, maxLength: 100,
    },
    facebookUrl: {
      type: 'url', editClass: 'B', label: 'Facebook URL',
      required: false, maxLength: 200,
    },
    instagramUrl: {
      type: 'url', editClass: 'B', label: 'Instagram URL',
      required: false, maxLength: 200,
    },
    youtubeUrl: {
      type: 'url', editClass: 'B', label: 'YouTube URL',
      required: false, maxLength: 200,
    },
    linkedinUrl: {
      type: 'url', editClass: 'B', label: 'LinkedIn URL',
      required: false, maxLength: 200,
    },
  },

  // ── SEO (per page) ─────────────────────────────────────────────────────────

  seo: {
    metaTitle: {
      type: 'text', editClass: 'E', label: 'Meta title',
      required: true, minLength: 10, maxLength: 70,
      recommended: { max: 60 },
      note: 'Recommended 50–60 chars; hard max 70 (Google truncates beyond ~60)',
    },
    metaDescription: {
      type: 'text', editClass: 'E', label: 'Meta description',
      required: true, minLength: 50, maxLength: 170,
      recommended: { max: 160 },
      note: 'Recommended 140–160 chars; hard max 170',
    },
    ogTitle: {
      type: 'text', editClass: 'E', label: 'OG title',
      required: false, maxLength: 95,
      note: 'Falls back to metaTitle if empty',
    },
    ogDescription: {
      type: 'text', editClass: 'E', label: 'OG description',
      required: false, maxLength: 200,
      note: 'Falls back to metaDescription if empty',
    },
    ogImage: {
      type: 'image', editClass: 'E', label: 'OG image',
      required: false,
      // Facebook/Twitter recommended: 1200×630
      minWidth: 600, minHeight: 315,
      recommendedWidth: 1200, recommendedHeight: 630,
      maxFileSize: 5 * MB,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    },
    canonical: {
      type: 'url', editClass: 'E', label: 'Canonical URL',
      required: false, maxLength: 300,
    },
    noIndex: {
      type: 'select', editClass: 'E', label: 'Search indexing',
      required: true, options: ['index', 'noindex'],
    },
  },

  // ── Home page (/): slug = "home" ───────────────────────────────────────────

  home: {
    hero: {
      backgroundImage: { ...HERO_IMAGE, editClass: 'E', label: 'Hero background image' },
      badge: {
        type: 'text', editClass: 'E', label: 'Hero badge text',
        required: true, minLength: 5, maxLength: 60,
      },
      heading: {
        type: 'text', editClass: 'E', label: 'Hero heading (h1)',
        required: true, minLength: 10, maxLength: 80,
      },
      paragraph: {
        type: 'text', editClass: 'E', label: 'Hero paragraph',
        required: true, minLength: 20, maxLength: 500,
      },
      cta1Label: {
        type: 'text', editClass: 'E', label: 'CTA 1 label',
        required: true, minLength: 2, maxLength: 30,
      },
      cta1Href: {
        type: 'url', editClass: 'E', label: 'CTA 1 URL',
        required: true, maxLength: 200,
      },
      cta2Label: {
        type: 'text', editClass: 'E', label: 'CTA 2 label',
        required: true, minLength: 2, maxLength: 30,
      },
      cta2Href: {
        type: 'url', editClass: 'E', label: 'CTA 2 URL',
        required: true, maxLength: 200,
      },
    },
    intro: {
      leftImage: { ...CONTENT_SECTION_IMAGE, editClass: 'C', label: 'Left image' },
      rightImage: { ...CONTENT_SECTION_IMAGE, editClass: 'C', label: 'Right image (overlapping)' },
      badge: {
        type: 'text', editClass: 'B', label: 'Badge text',
        required: true, minLength: 5, maxLength: 60,
      },
      heading: {
        type: 'text', editClass: 'B', label: 'Heading',
        required: true, minLength: 10, maxLength: 80,
      },
      paragraph: {
        type: 'text', editClass: 'B', label: 'Paragraph',
        required: true, minLength: 20, maxLength: 400,
      },
    },
    whatWeDo: {
      sectionHeading: {
        type: 'text', editClass: 'B', label: 'Section heading',
        required: true, minLength: 3, maxLength: 50,
      },
      // Each card is a repeatable item (Class D)
      card: {
        image: {
          // aspectRatio: '600/815' enforced inline in JSX
          type: 'image', editClass: 'D', label: 'Card image',
          required: true,
          minWidth: 600, minHeight: 815,
          recommendedWidth: 1200, recommendedHeight: 1630,
          maxFileSize: 3 * MB,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
          note: 'aspect ratio 600:815 enforced by inline style in JSX',
        },
        title: {
          type: 'text', editClass: 'D', label: 'Card title',
          required: true, minLength: 3, maxLength: 60,
        },
        description: {
          type: 'text', editClass: 'D', label: 'Card description',
          required: true, minLength: 10, maxLength: 200,
        },
        href: {
          type: 'url', editClass: 'D', label: 'Card link URL',
          required: true, maxLength: 200,
        },
      },
    },
    whyChc: {
      sectionHeading: {
        type: 'text', editClass: 'B', label: 'Section heading',
        required: true, minLength: 3, maxLength: 50,
      },
      // Each stack card is repeatable (Class D)
      card: {
        image: { ...STACK_CARD_IMAGE, editClass: 'D', label: 'Card image' },
        heading: {
          type: 'text', editClass: 'D', label: 'Card heading',
          required: true, minLength: 3, maxLength: 80,
        },
        paragraph: {
          type: 'text', editClass: 'D', label: 'Card paragraph',
          required: true, minLength: 10, maxLength: 300,
        },
      },
    },
  },

  // ── Inner page heroes (shared pattern, all 9 inner pages) ─────────────────

  innerPageHero: {
    backgroundImage: { ...HERO_IMAGE, editClass: 'A', label: 'Hero background image' },
    heading: {
      type: 'text', editClass: 'E', label: 'Page heading (h1)',
      required: true, minLength: 2, maxLength: 60,
    },
    subtitle: {
      type: 'text', editClass: 'B', label: 'Hero subtitle',
      required: false, maxLength: 200,
    },
  },

  // ── /about ─────────────────────────────────────────────────────────────────

  about: {
    // contentSection fields inherited from contentSection above
    featureCards: {
      // Class D — repeatable; currently 6 cards with placeholder content
      image: {
        type: 'image', editClass: 'D', label: 'Card icon/image',
        required: true,
        // placehold.co dimensions vary (180x150, 160x150, etc.) — flexible
        minWidth: 100, minHeight: 80,
        recommendedWidth: 200, recommendedHeight: 150,
        maxFileSize: 1 * MB,
        allowedMimeTypes: ['image/png', 'image/svg+xml', 'image/webp'],
        note: 'flexible — placeholder dimensions vary; recommended ~200×150px icon',
      },
      title: {
        type: 'text', editClass: 'D', label: 'Card title',
        required: true, minLength: 3, maxLength: 60,
      },
      paragraph: {
        type: 'text', editClass: 'D', label: 'Card paragraph',
        required: true, minLength: 10, maxLength: 300,
      },
      href: {
        type: 'url', editClass: 'D', label: 'Card link URL',
        required: true, maxLength: 200,
      },
    },
  },

  // ── /services — identical structure to /about below hero ──────────────────

  services: {
    featureCards: {
      image: {
        type: 'image', editClass: 'D', label: 'Card icon/image',
        required: true,
        minWidth: 100, minHeight: 80,
        recommendedWidth: 200, recommendedHeight: 150,
        maxFileSize: 1 * MB,
        allowedMimeTypes: ['image/png', 'image/svg+xml', 'image/webp'],
        note: 'flexible — same structure as /about feature cards',
      },
      title: {
        type: 'text', editClass: 'D', label: 'Card title',
        required: true, minLength: 3, maxLength: 60,
      },
      paragraph: {
        type: 'text', editClass: 'D', label: 'Card paragraph',
        required: true, minLength: 10, maxLength: 300,
      },
      href: {
        type: 'url', editClass: 'D', label: 'Card link URL',
        required: true, maxLength: 200,
      },
    },
  },

  // ── /applications ──────────────────────────────────────────────────────────

  applications: {
    // 3 groups, each: ContentSection + StackCardGroup (3 cards)
    // Each group's stack cards are Class D repeatable
    stackCard: {
      image: { ...STACK_CARD_IMAGE, editClass: 'D', label: 'Card image' },
      badge: {
        type: 'text', editClass: 'D', label: 'Badge label',
        required: false, maxLength: 60,
      },
      heading: {
        type: 'text', editClass: 'D', label: 'Card heading',
        required: true, minLength: 3, maxLength: 80,
      },
      paragraph: {
        type: 'text', editClass: 'D', label: 'Card paragraph',
        required: true, minLength: 10, maxLength: 300,
      },
    },
  },

  // ── /oracle-hcm ────────────────────────────────────────────────────────────

  oracleHcm: {
    capabilityItem: {
      // Class D — repeatable marquee items
      icon: { ...CAPABILITY_ICON, editClass: 'D', label: 'Capability icon' },
      label: {
        type: 'text', editClass: 'D', label: 'Capability label',
        required: true, minLength: 2, maxLength: 40,
      },
    },
    productisedService: {
      // Class D — 4 cards (can add/remove/reorder)
      image: { ...SERVICE_CARD_IMAGE, editClass: 'D', label: 'Service image' },
      title: {
        type: 'text', editClass: 'D', label: 'Service title',
        required: true, minLength: 3, maxLength: 80,
      },
      hoverDescription: {
        type: 'text', editClass: 'D', label: 'Hover description',
        required: true, minLength: 10, maxLength: 300,
      },
      ctaText: {
        type: 'text', editClass: 'D', label: 'CTA text',
        required: true, minLength: 3, maxLength: 60,
      },
    },
    deliveryCapacity: {
      // Class B — heading + paragraph (fixed structure)
      heading: {
        type: 'text', editClass: 'B', label: 'Section heading',
        required: true, minLength: 5, maxLength: 100,
      },
      paragraph: {
        type: 'text', editClass: 'B', label: 'Section paragraph',
        required: true, minLength: 20, maxLength: 500,
      },
    },
    serviceCarouselItem: {
      // Class D — 8 carousel slides (repeatable)
      image: { ...CAROUSEL_SERVICE_IMAGE, editClass: 'D', label: 'Slide image' },
      title: {
        type: 'text', editClass: 'D', label: 'Slide title',
        required: true, minLength: 3, maxLength: 60,
      },
      description: {
        type: 'text', editClass: 'D', label: 'Slide description',
        required: true, minLength: 10, maxLength: 300,
      },
    },
  },

  // ── /our-delivery-model ────────────────────────────────────────────────────

  ourDeliveryModel: {
    processStep: {
      // Class D — repeatable steps (currently Lorem ipsum)
      icon: {
        type: 'text', editClass: 'D', label: 'Icon class name',
        required: true, minLength: 3, maxLength: 80,
        note: 'Crafto line-icon-* class name, e.g. line-icon-Idea-5',
      },
      label: {
        type: 'text', editClass: 'D', label: 'Step label',
        required: true, minLength: 2, maxLength: 60,
      },
      description: {
        type: 'text', editClass: 'D', label: 'Step description',
        required: true, minLength: 5, maxLength: 200,
      },
    },
    faqItem: {
      // Class D — repeatable FAQ cards (currently Lorem ipsum)
      question: {
        type: 'text', editClass: 'D', label: 'FAQ question',
        required: true, minLength: 5, maxLength: 150,
      },
      answer: {
        type: 'text', editClass: 'D', label: 'FAQ answer',
        required: true, minLength: 10, maxLength: 500,
      },
    },
    stackCard: {
      image: { ...STACK_CARD_IMAGE, editClass: 'D', label: 'Card image' },
      badge: {
        type: 'text', editClass: 'D', label: 'Badge label',
        required: false, maxLength: 60,
      },
      heading: {
        type: 'text', editClass: 'D', label: 'Card heading',
        required: true, minLength: 3, maxLength: 80,
      },
      paragraph: {
        type: 'text', editClass: 'D', label: 'Card paragraph',
        required: true, minLength: 10, maxLength: 300,
      },
    },
  },

  // ── /our-impact ────────────────────────────────────────────────────────────

  ourImpact: {
    serviceSlide: {
      // Class D — repeatable slider items (currently placeholder)
      image: {
        type: 'image', editClass: 'D', label: 'Slide icon/image',
        required: true,
        minWidth: 100, minHeight: 80,
        recommendedWidth: 200, recommendedHeight: 150,
        maxFileSize: 1 * MB,
        allowedMimeTypes: ['image/png', 'image/svg+xml', 'image/webp'],
        note: 'flexible — currently placehold.co; recommended ~200×150px',
      },
      title: {
        type: 'text', editClass: 'D', label: 'Slide title',
        required: true, minLength: 3, maxLength: 60,
      },
      description: {
        type: 'text', editClass: 'D', label: 'Slide description',
        required: true, minLength: 10, maxLength: 300,
      },
      href: {
        type: 'url', editClass: 'D', label: 'Slide link URL',
        required: false, maxLength: 200,
      },
    },
  },

  // ── /our-people ────────────────────────────────────────────────────────────

  ourPeople: {
    teamMember: {
      // Class D — fully repeatable (currently 8 placeholder entries)
      photo: { ...TEAM_CARD_IMAGE, editClass: 'D', label: 'Team member photo' },
      name: {
        type: 'text', editClass: 'D', label: 'Name',
        required: true, minLength: 2, maxLength: 80,
      },
      role: {
        type: 'text', editClass: 'D', label: 'Role / title',
        required: true, minLength: 2, maxLength: 80,
      },
      capability: {
        type: 'text', editClass: 'D', label: 'Capability area',
        required: false, maxLength: 100,
      },
      learningFocus: {
        type: 'text', editClass: 'D', label: 'Current learning / delivery focus',
        required: false, maxLength: 150,
      },
    },
  },

  // ── /contact ───────────────────────────────────────────────────────────────

  contact: {
    officeAddress: {
      type: 'text', editClass: 'B', label: 'Office address',
      required: false, maxLength: 200,
      note: 'Currently placeholder London address',
    },
    phone: {
      type: 'text', editClass: 'B', label: 'Phone number',
      required: false, maxLength: 30,
    },
    fax: {
      type: 'text', editClass: 'B', label: 'Fax number',
      required: false, maxLength: 30,
    },
    email1: {
      type: 'text', editClass: 'B', label: 'Primary email',
      required: false, maxLength: 100,
    },
    email2: {
      type: 'text', editClass: 'B', label: 'Secondary email',
      required: false, maxLength: 100,
    },
    mapLat: {
      type: 'text', editClass: 'B', label: 'Map latitude',
      required: false, maxLength: 20,
      note: 'Currently Melbourne coordinates — placeholder',
    },
    mapLng: {
      type: 'text', editClass: 'B', label: 'Map longitude',
      required: false, maxLength: 20,
    },
    mapPopupHtml: {
      type: 'text', editClass: 'B', label: 'Map popup text',
      required: false, maxLength: 200,
    },
  },

  // ── /give-one-hour ─────────────────────────────────────────────────────────

  giveOneHour: {
    sectionHeading: {
      type: 'text', editClass: 'B', label: 'Section heading',
      required: true, minLength: 5, maxLength: 100,
    },
    sectionSubheading: {
      type: 'text', editClass: 'B', label: 'Section subheading',
      required: false, maxLength: 150,
    },
    // Form fields are fixed structure (Class E) — not CMS-editable
  },

  // ── Shared header/CTA sections (top-level keys match SECTION_LIBRARY sectionKey) ──

  oracleHcmHeadings: {
    capabilitiesHeading: {
      type: 'text', editClass: 'B', label: 'Capabilities heading',
      required: false, maxLength: 60,
    },
    servicesEyebrow: {
      type: 'text', editClass: 'B', label: 'Services eyebrow',
      required: false, maxLength: 40,
    },
    servicesHeading: {
      type: 'text', editClass: 'B', label: 'Services heading',
      required: false, maxLength: 60,
    },
    exploreLabel: {
      type: 'text', editClass: 'B', label: 'Carousel button label',
      required: false, maxLength: 30,
    },
  },

  // Alias so PageEditor's sectionKey "oracleHeadings" resolves to the same rules
  oracleHeadings: {
    capabilitiesHeading: {
      type: 'text', editClass: 'B', label: 'Capabilities heading',
      required: false, maxLength: 60,
    },
    servicesEyebrow: {
      type: 'text', editClass: 'B', label: 'Services eyebrow',
      required: false, maxLength: 40,
    },
    servicesHeading: {
      type: 'text', editClass: 'B', label: 'Services heading',
      required: false, maxLength: 60,
    },
    exploreLabel: {
      type: 'text', editClass: 'B', label: 'Carousel button label',
      required: false, maxLength: 30,
    },
  },

  ctaBanner: {
    heading: {
      type: 'text', editClass: 'B', label: 'Banner heading',
      required: false, maxLength: 100,
    },
    paragraph: {
      type: 'text', editClass: 'B', label: 'Banner text',
      required: false, maxLength: 200,
    },
    buttonLabel: {
      type: 'text', editClass: 'B', label: 'Button label',
      required: false, maxLength: 40,
    },
    buttonHref: {
      type: 'url', editClass: 'B', label: 'Button URL',
      required: false, maxLength: 200,
    },
  },

  peopleHeader: {
    badge: {
      type: 'text', editClass: 'B', label: 'Eyebrow badge',
      required: false, maxLength: 40,
    },
    heading: {
      type: 'text', editClass: 'B', label: 'Section heading',
      required: false, maxLength: 80,
    },
  },

  faqHeader: {
    eyebrow: {
      type: 'text', editClass: 'B', label: 'Eyebrow',
      required: false, maxLength: 40,
    },
    heading: {
      type: 'text', editClass: 'B', label: 'Section heading',
      required: false, maxLength: 80,
    },
  },

  faqFooter: {
    text: {
      type: 'text', editClass: 'B', label: 'Footer text',
      required: false, maxLength: 120,
    },
    label: {
      type: 'text', editClass: 'B', label: 'Link label',
      required: false, maxLength: 40,
    },
    href: {
      type: 'url', editClass: 'B', label: 'Link URL',
      required: false, maxLength: 200,
    },
  },

  processHeader2: {
    heading: {
      type: 'text', editClass: 'B', label: 'Section heading',
      required: false, maxLength: 100,
    },
  },

  homeStackHeader: {
    eyebrow: {
      type: 'text', editClass: 'B', label: 'Eyebrow',
      required: false, maxLength: 40,
    },
    heading: {
      type: 'text', editClass: 'B', label: 'Section heading',
      required: false, maxLength: 80,
    },
  },

  // Top-level aliases (matches SECTION_LIBRARY sectionKey)
  impactHeader: {
    badge: {
      type: 'text', editClass: 'B', label: 'Header badge',
      required: false, maxLength: 60,
    },
    heading: {
      type: 'text', editClass: 'B', label: 'Section heading',
      required: false, maxLength: 80,
    },
  },
  impactFooter: {
    note: {
      type: 'text', editClass: 'B', label: 'Footer note',
      required: false, maxLength: 200,
    },
  },

  richText: {
    sectionHeading: {
      type: 'text', editClass: 'B', label: 'Section heading',
      required: true, minLength: 2, maxLength: 100,
    },
    content: {
      type: 'rich_text', editClass: 'B', label: 'Content',
      required: true, minLength: 1, maxLength: 5000,
    },
  },
}

/**
 * Returns all field rules for a given dot-path, e.g. "home.hero.heading"
 * Used by Zod schema generator and admin UI.
 *
 * @param {string} path - dot-separated path into fieldRules
 * @returns {object|null}
 */
export function getFieldRule(path) {
  return path.split('.').reduce((obj, key) => obj?.[key] ?? null, fieldRules)
}

/**
 * Returns true if a field is editable (not locked) based on its editClass.
 * Classes A, B, C, D, E are all editable in some dimension.
 * This is used to determine whether to render a locked (🔒) indicator in the admin UI.
 *
 * @param {string} path - dot-separated path into fieldRules
 * @param {'text'|'image'} dimension - which dimension to check
 * @returns {boolean}
 */
export function isEditable(path, dimension) {
  const rule = getFieldRule(path)
  if (!rule) return false
  const cls = rule.editClass
  if (dimension === 'image') return ['A', 'C', 'D', 'E'].includes(cls)
  if (dimension === 'text') return ['B', 'C', 'D', 'E'].includes(cls)
  return false
}
