# CHC Website — Project Status Document

**Generated:** 4 September 2026
**Framework:** Next.js 14 App Router
**Template:** Crafto v4.0 (jQuery + anime.js)
**CMS:** MongoDB via Prisma ORM (dual-source: DB-first, hardcoded fallback)
**Admin:** Custom panel (10 routes, Auth.js, S3 media, form submissions)
**Build status:** `npm run build` passes clean
**Public pages:** 10 routes (home + 9 inner pages)

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Shared Components](#shared-components)
3. [Home Page](#1-home-page)
4. [About Page](#2-about-page)
5. [Services Page](#3-services-page)
6. [Oracle HCM Page](#4-oracle-hcm-page)
7. [Applications Page](#5-applications-page)
8. [Our Impact Page](#6-our-impact-page)
9. [Our Delivery Model Page](#7-our-delivery-model-page)
10. [Our People Page](#8-our-people-page)
11. [Contact Page](#9-contact-page)
12. [Give One Hour Page](#10-give-one-hour-page)
13. [Complete Image Inventory](#complete-image-inventory)
14. [Complete Animation Inventory](#complete-animation-inventory)
15. [CMS Data Architecture](#cms-data-architecture)
16. [Known Issues / Status](#known-issues--status)

---

## Architecture Overview

| Aspect | Detail |
|---|---|
| **Framework** | Next.js 14 App Router |
| **Template** | Crafto v4.0 (jQuery + anime.js) |
| **CMS** | MongoDB via Prisma ORM, dual-source pattern (DB-first, hardcoded fallback) |
| **Admin** | Custom panel (10 routes, Auth.js, S3 media, form submissions) |
| **Build status** | `npm run build` passes clean |
| **Public pages** | 10 routes (home + 9 inner pages) |
| **Animation system** | Crafto `data-anime` attribute (anime.js) + Skrollr parallax + Swiper carousels + Atropos 3D tilt + Particles.js |
| **Key fix applied** | `[data-anime] { opacity: 1 !important }` in `globals.css` forces all content visible (Crafto sets `opacity: 0` before animating) |

---

## Shared Components

| Component | File | Used By |
|---|---|---|
| **Header** | `components/Header.jsx` | All pages (via layout) |
| **Footer** | `components/Footer.jsx` | All pages (via layout) |
| **PageHero** | `components/PageHero.jsx` | 9 inner pages |
| **ContentSection** | `components/ContentSection.jsx` | 8 inner pages |
| **RouteReload** | `components/RouteReload.jsx` | All pages (forces full reload on navigation) |

---

## 1. Home Page

**Route:** `/`
**File:** `app/page.js`
**Data functions:** `getHomeHero()`, `getHomeIntro()`, `getHomeWhatWeDo()`, `getHomeWhyChc()`

### Module 1: Hero Section

| Aspect | Detail |
|---|---|
| **Section class** | `chc-home-hero cover-background full-screen` |
| **Animation** | `data-anime` — 3D perspective entrance: `scale: [1.05, 1]`, `rotateX: [30, 0]`, `opacity: [0,1]`, duration 800ms, stagger 300ms |
| **SVG animation** | Wave path morphing `<animate attributeName="d" dur="5s">` on bottom curve |
| **CSS animation** | `.hero-overlay-animated` — `overlayPulse` 5s infinite opacity pulse |
| **Image** | `{hero.backgroundImage}` — CMS/fallback: `/images/Oracle-hcm-hero.png` |
| **Content** | Badge: "Grow your business with us", Heading: "Technology delivery with a social conscience.", Paragraph: CHC description, 2 CTAs (About / Contact us) |
| **DB section key** | `home.hero` |
| **Seed status** | Seeded with identical fallback values |

### Module 2: About/Intro Section

| Aspect | Detail |
|---|---|
| **Section class** | `chc-home-intro` |
| **Animation** | `data-anime` — Staggered child fade-in: `translateY: [30,0]`, `opacity: [0,1]`, duration 600ms |
| **Parallax** | Skrollr `data-bottom-top` / `data-top-bottom` — `translateY(+-50px)` on right image |
| **Shadow animation** | `data-shadow-animation="true"` on both images |
| **CSS animation** | `.animation-rotation` on decorative element |
| **Images** | Left: `{intro.leftImage}` fallback `/images/home-first-section.jpg`, Right: `{intro.rightImage}` fallback `/images/home-content-2.jpg`, Decorative: `/images/demo-modern-business-elements-02.png`, Spin badge: `/images/chc-spin-support.png`, Spinner: `/images/chc-spinner.png` |
| **Content** | Badge, heading, paragraph — all CMS-editable |
| **DB section key** | `home.intro` |

### Module 3: What We Do Cards (3 cards)

| Aspect | Detail |
|---|---|
| **Section class** | `section-what-we-do` |
| **Animation** | `data-anime` — Cards slide in from right: `translateX: [30,0]`, stagger 300ms |
| **3D tilt** | `data-atropos` with `perspective="1450"` — Atropos hover tilt effect (desktop only) |
| **Hover** | `.interactive-banner-style-05` — paragraph slides open, span translates up |
| **Images** | `{card.image}` — CMS per card |
| **Content** | 3 cards: Oracle HCM, Application Development, Productised Tech Services (each with title, description, href) |
| **DB section key** | `home.whatWeDo` (repeatable items) |

### Module 4: Why CHC Stack Cards (4 cards)

| Aspect | Detail |
|---|---|
| **Section class** | `chc-why-section` |
| **Animation** | `data-anime` — title fade-in |
| **Stack animation** | `data-scale="true" data-top-space="35"` — vertical stacking on scroll |
| **Parallax** | Skrollr on images — `rotate(${card.rotate})` + `blur(${card.blur})` on scroll |
| **Images** | Blur object: `/images/demo-modern-business-object-blur-01.jpg`, Background: `/images/demo-modern-business-gradient-bg-01.jpg`, Overlay: `/images/demo-modern-business-bg-01.png`, `{card.image}` per card |
| **Content** | 4 cards: Senior-led Delivery, Cost-effective execution, Capability development, Social impact |
| **DB section key** | `home.whyChc` (repeatable items) |

---

## 2. About Page

**Route:** `/about`
**File:** `app/about/page.js`
**Data functions:** `getInnerPageHero('about')`, `getContentSection('about')`, `getAboutFeatureCards()`

### Module 1: Page Hero

| Aspect | Detail |
|---|---|
| **Animation** | `data-anime` — Title child stagger: `translateY: [30,0]`, arrow slide-up |
| **SVG** | Wave path morphing on bottom |
| **CSS** | `.hero-overlay-animated` pulse, `.animation-float` on arrow |
| **Image** | `{backgroundImage}` — fallback `/images/Oracle-hcm-hero.png` |
| **Content** | Heading: "About", Subtitle: "We deliver smart solutions..." |
| **DB section key** | `about.innerPageHero` |

### Module 2: Content Section

| Aspect | Detail |
|---|---|
| **Animation** | `data-anime` — text column child stagger fade-in |
| **Parallax** | Skrollr translateY on right image |
| **Shadow animation** | `data-shadow-animation="true"` on both images |
| **CSS** | `.animation-rotation` on decorative element and spinner |
| **Images** | Left: `/images/Oracle-hcm-content.jpg`, Right: `/images/oracle-hcm-content-02.jpg`, Decorative: `/images/demo-modern-business-elements-02.png`, Spinners: `/images/chc-spin-support.png`, `/images/chc-spinner.png` |
| **Content** | Badge, heading, paragraph — all CMS-editable |
| **DB section key** | `about.contentSection` |

### Module 3: Feature Cards (6 cards, 3-column grid)

| Aspect | Detail |
|---|---|
| **Animation** | `data-anime` — Cards child stagger fade-in, CTA row stagger |
| **Hover** | `.box-shadow-double-large-hover` shadow on feature boxes |
| **Images** | `{card.img}` — CMS per card |
| **Content** | 6 cards: Development, UX/UI Design, Marketing, Content Writing, Product Development, eCommerce Solutions |
| **DB section key** | `about.featureCards` (repeatable items) |

---

## 3. Services Page

**Route:** `/services`
**File:** `app/services/page.js`
**Data functions:** `getInnerPageHero('services')`, `getContentSection('services')`, `getServicesFeatureCards()`

Identical structure to About Page — same 3 modules with same animations, images, and effects. Content seeded identically.

---

## 4. Oracle HCM Page

**Route:** `/oracle-hcm`
**File:** `app/oracle-hcm/page.js`
**Data functions:** `getInnerPageHero('oracle-hcm')`, `getContentSection('oracle-hcm')`, `getOracleCapabilities()`, `getOracleProductisedServices()`, `getOracleDeliveryCapacity()`, `getOracleServiceCarousel()`

### Module 1: Page Hero
Same as other inner pages.

### Module 2: Content Section
Same as other inner pages.

### Module 3: Core Capabilities Marquee (15 items, Swiper)

| Aspect | Detail |
|---|---|
| **Animation** | `data-anime` — opacity fade-in |
| **Carousel** | Swiper marquee — `speed: 4000`, `loop: true`, `autoplay delay: 0`, responsive breakpoints |
| **Hover** | `.clients-style-08` — image `scale(1.15)` on hover |
| **Images** | `{item.img}` — CMS per capability |
| **Content** | 15 capabilities: Core HR, Workforce Structure, Compensation, Talent, Learning, Payroll, Security/AOR, Approvals, Journey, HCM Extracts, Integrations, Testing, Quarterly Releases, Redwood/VBCS, Technical Remediation |
| **DB section key** | `oracle-hcm.capabilityItem` |

### Module 4: Productised Oracle Services (4 cards)

| Aspect | Detail |
|---|---|
| **Particles** | `data-particle="true"` — floating particle background |
| **Animation** | `data-anime` — Cards child stagger fade-in |
| **Hover** | `.team-style-05` — purple overlay on hover |
| **Images** | `{s.img}` — CMS per service |
| **Content** | 4 cards: Health Check, Rapid Response, Release Assurance, Technology Pod |
| **DB section key** | `oracle-hcm.productisedService` |

### Module 5: Delivery Capacity Section

| Aspect | Detail |
|---|---|
| **Animation** | `data-anime` — heading row child stagger fade-in |
| **Content** | Heading: "Looking for Oracle Delivery Capacity?", Paragraph about subcontracting |
| **DB section key** | `oracle-hcm.deliveryCapacity` |

### Module 6: Service Carousel (8 slides, Swiper)

| Aspect | Detail |
|---|---|
| **Animation** | `data-anime` — carousel opacity fade-in |
| **Carousel** | Swiper — `loop: true`, `autoplay delay: 4000`, responsive breakpoints |
| **Magic cursor** | `magic-cursor` class — custom cursor on carousel |
| **Hover** | `.btn-hover-animation-switch` with arrow icon transition |
| **Images** | `{service.img}` — CMS per slide |
| **Content** | 8 slides: Configuration, Testing, Reporting, Data, Integrations, VBCS, Release Support, Managed Support |
| **DB section key** | `oracle-hcm.serviceCarouselItem` |

---

## 5. Applications Page

**Route:** `/applications`
**File:** `app/applications/page.js`
**Data functions:** `getInnerPageHero('applications')`, `getContentSection('applications')` (x3), `getApplicationsStackCards()` (x3 groups)

### Module 1: Page Hero
Same as other inner pages.

### Modules 2-4: Content Section x3
Same ContentSection component, called 3 times with same data.

### Modules 5-7: Stack Card Groups x3 (3 cards each)

| Aspect | Detail |
|---|---|
| **Animation** | Stack card `data-scale="true" data-top-space="35"` — vertical stacking on scroll |
| **Parallax** | Skrollr on decorative images — rotate + blur |
| **Images** | Blur: `/images/demo-modern-business-object-blur-01.jpg`, BG: `/images/demo-modern-business-gradient-bg-01.jpg`, Overlay: `/images/demo-modern-business-bg-01.png`, `{card.img}` per card |
| **Content** | 9 cards total (3 per group): Excellence framework, Strategic performance, Outcome accelerator (repeated) |
| **DB section keys** | `applications.stackCards1`, `applications.stackCards2`, `applications.stackCards3` |

---

## 6. Our Impact Page

**Route:** `/our-impact`
**File:** `app/our-impact/page.js`
**Data functions:** `getInnerPageHero('our-impact')`, `getContentSection('our-impact')`, `getOurImpactSlides()`

### Module 1: Page Hero
Same as other inner pages.

### Module 2: Content Section
Same as other inner pages.

### Module 3: Services Carousel (10 slides, Swiper)

| Aspect | Detail |
|---|---|
| **Animation** | `data-anime` — title child stagger, slider opacity fade-in, CTA child stagger |
| **Carousel** | Swiper — `loop: true`, `autoplay delay: 250000`, responsive breakpoints (6 to 1 slides) |
| **Magic cursor** | `magic-cursor` class |
| **Cover BG** | `backgroundImage: url('/images/demo-modern-business-services-bg-01.jpg')` |
| **Images** | `{slide.img}` — CMS per slide |
| **Content** | 10 slides: Development, UX/UI Design, Marketing, Content Writing, Product Design (repeated) |
| **DB section key** | `our-impact.serviceSlide` |

---

## 7. Our Delivery Model Page

**Route:** `/our-delivery-model`
**File:** `app/our-delivery-model/page.js`
**Data functions:** `getInnerPageHero('our-delivery-model')`, `getContentSection('our-delivery-model')`, `getDeliveryModelProcessSteps()` (x2), `getDeliveryModelFaqs()`

### Module 1: Page Hero
Same as other inner pages.

### Module 2: Content Section
Same as other inner pages.

### Module 3: Process Steps Grid #1 (5 steps)

| Aspect | Detail |
|---|---|
| **Animation** | `data-anime` — Steps slide from left: `translateX: [-50,0]`, stagger 100ms |
| **Hover** | `hover-box` class |
| **Content** | 5 steps with line-icon-* CSS classes: Research, Sketches, Concept, Presentation, Research |
| **DB section key** | `our-delivery-model.processSteps1` |

### Module 4: FAQ Section (4 cards, 2-column grid)

| Aspect | Detail |
|---|---|
| **Animation** | `data-anime` — 3D perspective flip: `scale: [1.1,1]`, `rotateX: [50,0]`, `perspective: [1200,1200]`, duration 800ms |
| **Content** | 4 FAQs with Q&A pairs |
| **DB section key** | `our-delivery-model.faqItem` |

### Module 5: Process Steps Grid #2 (8 steps)

| Aspect | Detail |
|---|---|
| **Animation** | `data-anime` — Title slide from right, steps slide from left |
| **Content** | Seed: Discovery, Design, Build, Test, Deploy, Stabilise, Optimise, Handover |
| **DB section key** | `our-delivery-model.processSteps2` |

---

## 8. Our People Page

**Route:** `/our-people`
**File:** `app/our-people/page.js`
**Data functions:** `getInnerPageHero('our-people')`, `getContentSection('our-people')`, `getPeopleData()`

### Module 1: Page Hero
Same as other inner pages.

### Module 2: Content Section
Same as other inner pages.

### Module 3: Team Carousel (8 members, Swiper coverflow)

| Aspect | Detail |
|---|---|
| **Particles** | `data-particle="true"` — floating particle background |
| **Animation** | `data-anime` — title opacity fade-in |
| **Carousel** | Swiper coverflow effect — `loop: true`, `autoplay delay: 5000`, responsive breakpoints |
| **Magic cursor** | `magic-cursor` class |
| **Hover** | `.team-style-05` — grayscale filter + opacity transition, purple overlay |
| **Carousel CSS** | Active: full opacity; prev/next: partial opacity, `transform: scale(0.85)` |
| **Images** | `{person.photo}` — CMS (fallback: `placehold.co/600x756`) |
| **Content** | 8 team members with name, role, capability, learningFocus |
| **DB section key** | `our-people.teamMember` |

---

## 9. Contact Page

**Route:** `/contact`
**File:** `app/contact/page.js`
**Data functions:** `getInnerPageHero('contact')`, `getContactData()`

### Module 1: Page Hero
Same as other inner pages.

### Module 2: Contact Info Section (3 columns)

| Aspect | Detail |
|---|---|
| **Animation** | `data-anime` — child stagger: `translateY: [50,0]`, stagger 150ms |
| **Images** | None — icon-only |
| **Content** | Office address, phone, fax, email1, email2 |
| **DB section key** | `contact.contact` |

### Module 3: Map Section

| Aspect | Detail |
|---|---|
| **Animation** | `data-anime` — opacity fade-in |
| **Visual** | Interactive map via `data-map-options` — lat/lng/marker/popup |
| **Content** | Lat: -37.805688, Lng: 144.962312, Popup: CHC Consulting Melbourne |

### Module 4: Contact Form

| Aspect | Detail |
|---|---|
| **Animation** | `data-anime` — Title child stagger, form slide-up: `translateY: [100,0]` |
| **Images** | None |
| **Content** | Form fields: name, email, phone, subject, comment. POSTs to `/api/public/contact` -> stored in `FormSubmission` |

---

## 10. Give One Hour Page

**Route:** `/give-one-hour`
**File:** `app/give-one-hour/page.js`
**Data functions:** `getInnerPageHero('give-one-hour')`, `getContentSection('give-one-hour')`

### Module 1: Page Hero
Same as other inner pages.

### Module 2: Content Section
Same as other inner pages.

### Module 3: Give One Hour Form

| Aspect | Detail |
|---|---|
| **Animation** | `data-anime` — Title child stagger: `translateY: [50,0]`, form slide-up: `translateY: [100,0]` |
| **Images** | None |
| **Content** | Form fields: full_name, linkedin, organisation, role, expertise, how_to_help, availability, format (select), anything_else. POSTs to `/api/public/give-one-hour` -> stored in `FormSubmission` |

---

## Complete Image Inventory

### Static Images (referenced by path)

| Path | Used In |
|---|---|
| `/images/Oracle-hcm-hero.png` | Hero backgrounds (all pages fallback) |
| `/images/Oracle-hcm-content.jpg` | ContentSection left image (all inner pages) |
| `/images/oracle-hcm-content-02.jpg` | ContentSection right image (all inner pages) |
| `/images/home-first-section.jpg` | Home intro left image |
| `/images/home-content-2.jpg` | Home intro right image |
| `/images/demo-modern-business-elements-02.png` | Decorative spinning element (ContentSection, Home Intro) |
| `/images/chc-spin-support.png` | Spinning support badge (ContentSection, Home Intro, Footer) |
| `/images/chc-spinner.png` | Rotating spinner ring (ContentSection, Home Intro, Footer) |
| `/images/demo-modern-business-object-blur-01.jpg` | Blur object (Home Why CHC, Applications) |
| `/images/demo-modern-business-gradient-bg-01.jpg` | Card background gradient (Home Why CHC, Applications) |
| `/images/demo-modern-business-bg-01.png` | Decorative overlay (Home Why CHC, Applications) |
| `/images/demo-modern-business-services-bg-01.jpg` | Section background (Our Impact) |
| `/images/demo-modern-business-footer-bg.jpg` | Footer background |
| `/images/vertical-line-bg.svg` | Body background (globals.css) |
| `/images/chc-logo.png` | Header logo, Footer logo |

### CMS-Driven Images (dynamic per section)

| Source | Used In |
|---|---|
| `{hero.backgroundImage}` | Home Hero |
| `{intro.leftImage}`, `{intro.rightImage}` | Home Intro |
| `{card.image}` | Home What We Do, Home Why CHC |
| `{backgroundImage}` (PageHero) | All inner page heroes |
| `{leftImage}`, `{rightImage}` (ContentSection) | All inner content sections |
| `{card.img}` (FeatureCards) | About, Services |
| `{card.img}` (StackCards) | Applications (x3 groups) |
| `{item.img}` (Capabilities) | Oracle HCM capabilities |
| `{s.img}` (ProductisedServices) | Oracle HCM services |
| `{service.img}` (ServiceCarousel) | Oracle HCM carousel |
| `{slide.img}` (OurImpactSlides) | Our Impact carousel |
| `{person.photo}` (PeopleData) | Our People team |

---

## Complete Animation Inventory

### Animation Systems Active

| System | Library | Trigger | Desktop Only? |
|---|---|---|---|
| **Scroll reveal** | anime.js via `data-anime` | Scroll into view (jQuery appear) | No — stripped below 1199px |
| **Parallax** | Skrollr | Scroll position | Yes (>=1200px only) |
| **3D tilt** | Atropos | Mouse hover | Yes (>1199px only) |
| **Particles** | Particles.js | Auto on load | No |
| **Carousels** | Swiper.js | User interaction | No |
| **Stack cards** | Custom in main.js | Scroll position | No |
| **Shadow reveal** | Custom in main.js | Scroll into view | No |
| **Magic cursor** | GSAP/TweenLite | Mouse movement | Yes (desktop only) |
| **CSS rotation** | Pure CSS `@keyframes` | Always | No |
| **CSS float** | Pure CSS `@keyframes` | Always | No |
| **Overlay pulse** | Pure CSS `@keyframes` | Always | No |

### data-anime Configurations by Section

| Page | Section | Animation Type |
|---|---|---|
| Home | Hero | 3D perspective entrance (scale + rotateX) |
| Home | Intro | Staggered child fade-in (translateY) |
| Home | What We Do title | Opacity fade-in |
| Home | What We Do cards | Slide from right (translateX) |
| Home | Why CHC title | Opacity fade-in |
| All inner | PageHero title | Staggered child fade-in (translateY) |
| All inner | PageHero arrow | Slide-up (translateY) |
| All inner | ContentSection text | Staggered child fade-in (translateY) |
| All inner | Feature cards | Staggered child fade-in (translateY) |
| All inner | Feature CTA | Staggered child fade-in (translateY) |
| Contact | Info columns | Staggered child fade-in (translateY, fast) |
| Contact | Map | Opacity fade-in |
| Contact | Form title | Staggered child fade-in (translateY, fast) |
| Contact | Form | Slide-up (translateY: 100->0) |
| Delivery Model | Process steps 1 | Slide from left (translateX: -50->0) |
| Delivery Model | FAQ title | Opacity fade-in |
| Delivery Model | FAQ cards | 3D perspective flip (scale + rotateX) |
| Delivery Model | FAQ CTA | Opacity fade-in |
| Delivery Model | Steps 2 title | Slide from right (translateX: 50->0) |
| Delivery Model | Steps 2 | Slide from left (translateX: -50->0) |
| Our Impact | BG title | Staggered child fade-in (translateY) |
| Our Impact | Slider | Opacity fade-in |
| Our Impact | CTA | Staggered child fade-in (translateY) |
| Our People | Title | Opacity fade-in |
| Give One Hour | Title | Staggered child fade-in (translateY, fast) |
| Give One Hour | Form | Slide-up (translateY: 100->0) |
| Oracle HCM | Capabilities | Opacity fade-in |
| Oracle HCM | Services title | Opacity fade-in |
| Oracle HCM | Services cards | Staggered child fade-in (translateY) |
| Oracle HCM | Delivery heading | Staggered child fade-in (translateY) |
| Oracle HCM | Carousel | Opacity fade-in |

---

## CMS Data Architecture

### Content Hierarchy

```
Page (slug)
  -> Section (sectionKey, sortOrder, isVisible)
        -> ContentBlock (singleton fields: heading, paragraph, etc.)
        -> ContentBlock (repeatable parent)
              -> ContentBlock (child: title)
              -> ContentBlock (child: description)
              -> ContentBlock (child: image -> MediaAsset)
```

### Database Models

| Model | Purpose |
|---|---|
| **User** | Admin users (email, passwordHash, role) |
| **Session** | Auth sessions |
| **LoginAttempt** | Rate limiting |
| **MediaAsset** | Uploaded images (S3 storageKey, publicUrl, altText) |
| **Page** | Page entities (slug, isPublished) |
| **Section** | Named regions within pages (sectionKey, isVisible, sortOrder) |
| **ContentBlock** | Field values (fieldKey, blockType, textValue, mediaAssetId, parentId) |
| **NavigationItem** | Header nav tree (self-referential parent/child) |
| **FooterConfig** | Singleton footer content |
| **SeoMeta** | Per-page SEO metadata |
| **FormSubmission** | Public form submissions (CONTACT, GIVE_ONE_HOUR, NEWSLETTER) |
| **AuditLog** | Admin action tracking |

### Seeded Content Summary

| Page | Sections Seeded | Total Items |
|---|---|---|
| **home** | hero, intro, whatWeDo (3), whyChc (4) | 4 sections, 10 items |
| **about** | innerPageHero, contentSection, featureCards (6) | 3 sections, 8 items |
| **services** | innerPageHero, contentSection, featureCards (6) | 3 sections, 8 items |
| **oracle-hcm** | innerPageHero, contentSection, capabilities (15), productisedServices (4), deliveryCapacity, serviceCarousel (8) | 6 sections, 30 items |
| **applications** | innerPageHero, contentSection, stackCards1 (3), stackCards2 (3), stackCards3 (3) | 5 sections, 13 items |
| **our-impact** | innerPageHero, contentSection, serviceSlides (10) | 3 sections, 12 items |
| **our-delivery-model** | innerPageHero, contentSection, processSteps1 (5), faqs (4), processSteps2 (8) | 5 sections, 20 items |
| **our-people** | innerPageHero, contentSection, teamMembers (8) | 3 sections, 10 items |
| **contact** | innerPageHero, contact | 2 sections |
| **give-one-hour** | innerPageHero, contentSection | 2 sections |

Plus: Navigation (8 top-level + 3 children), Footer (1 row), system User.

---

## Known Issues / Status

| Issue | Status |
|---|---|
| Content invisible due to `data-anime` `opacity: 0` | **Fixed** — `globals.css` forces `opacity: 1` |
| Sticky header not dark violet | **Fixed** — both `page-styles.css` files updated to `rgba(45,34,71,0.95)` |
| Scripts not loading (jQuery/vendors/main.js race condition) | **Fixed** — synchronous `<script>` tags in `layout.js` |
| anime.js not loading silently | **Fixed** — defensive guard in `main.js` line 19-22 |
| Admin panel UI outdated | **Enhanced** — complete CSS overhaul, shared Modal/Toast/Skeleton, polished login/dashboard, refactored modals across 4 files |
| Build compilation | **Passes clean** — `npm run build` succeeds |
