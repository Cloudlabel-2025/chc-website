#!/usr/bin/env python
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import datetime

doc = Document()
style = doc.styles['Normal']
style.font.name = 'Calibri'
style.font.size = Pt(9)
style.paragraph_format.space_after = Pt(4)
style.paragraph_format.line_spacing = 1.05

# -- helpers
def add_heading(text, level=1, color="1F2A44"):
    h = doc.add_heading(level=level)
    run = h.add_run(text)
    run.bold = True
    run.font.color.rgb = RGBColor.from_string(color)
    if level==1:
        run.font.size = Pt(18)
        h.paragraph_format.space_before = Pt(18)
    elif level==2:
        run.font.size = Pt(13)
        h.paragraph_format.space_before = Pt(14)
    else:
        run.font.size = Pt(10)
    h.paragraph_format.space_after = Pt(6)
    # bottom border for L1
    if level==1:
        pPr = h._p.get_or_add_pPr()
        pBdr = OxmlElement('w:pBdr')
        bottom = OxmlElement('w:bottom')
        bottom.set(qn('w:val'), 'single')
        bottom.set(qn('w:sz'), '6')
        bottom.set(qn('w:space'), '1')
        bottom.set(qn('w:color'), 'C9A86A')
        pBdr.append(bottom)
        pPr.append(pBdr)
    return h

def add_para(text, bold=False, italic=False, size=9, color=None, bullet=False, align=None):
    p = doc.add_paragraph(style='List Bullet' if bullet else 'Normal')
    run = p.add_run(text)
    run.bold = bold
    run.italic = italic
    run.font.size = Pt(size)
    if color: run.font.color.rgb = RGBColor.from_string(color)
    if align: p.alignment = align
    return p

def add_code_para(text, size=7.5):
    p = doc.add_paragraph()
    pPr = p._p.get_or_add_pPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), 'F2F2F2')
    pPr.append(shd)
    run = p.add_run(text)
    run.font.name = 'Consolas'
    run.font.size = Pt(size)
    run.font.color.rgb = RGBColor.from_string("333333")
    p.paragraph_format.space_after = Pt(2)
    return p

def set_cell_shading(cell, color):
    tblCell = cell._tc
    tblCellProperties = tblCell.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), color)
    tblCellProperties.append(shd)

def add_table(headers, rows, col_widths=None, header_color="1F2A44"):
    table = doc.add_table(rows=1, cols=len(headers))
    table.style = 'Light Grid Accent 1'
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    if col_widths:
        for i, w in enumerate(col_widths):
            for cell in table.columns[i].cells:
                cell.width = Inches(w)
    hdr = table.rows[0].cells
    for i, h in enumerate(headers):
        hdr[i].text = h
        for p in hdr[i].paragraphs:
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for r in p.runs:
                r.bold = True
                r.font.size = Pt(7.5)
                r.font.color.rgb = RGBColor.from_string("FFFFFF")
        set_cell_shading(hdr[i], header_color)
        hdr[i].vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
    for row in rows:
        cells = table.add_row().cells
        for i, val in enumerate(row):
            cells[i].text = str(val)
            for p in cells[i].paragraphs:
                for r in p.runs:
                    r.font.size = Pt(7)
                    r.font.name = 'Calibri'
            cells[i].vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return table

def add_key_value_table(d):
    rows = [[k, v] for k,v in d.items()]
    return add_table(["Property","Value"], rows, col_widths=[2.2,4.3], header_color="2D2247")

# =========================================================
# COVER
# =========================================================
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("CLOUDHEARD CONSULTANCY")
r.bold = True
r.font.size = Pt(10)
r.font.color.rgb = RGBColor.from_string("8B5CF6")
r.letter_spacing = Pt(2)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("CHC Website — Technical Documentation")
r.bold = True
r.font.size = Pt(26)
r.font.color.rgb = RGBColor.from_string("1F2A44")
p.paragraph_format.space_after = Pt(6)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("Every Module · Every Section · Every Content Element · Verbatim")
r.italic = True
r.font.size = Pt(10)
r.font.color.rgb = RGBColor.from_string("716D7A")

# cover meta table
add_key_value_table({
    "Project": "chc-nextjs 1.0.0 (private)",
    "Stack": "Next.js 14.2.35 · React 18.3.1 · nodemailer 6.10.1 · Crafto v4.0 template",
    "Branch": "karun (origin/karun, origin/main)",
    "Root": "D:\\CHC-Website\\chc-website",
    "Date": datetime.date.today().isoformat() + " · Build 16/16 87.4 kB First Load",
    "Config": "next.config.js images.unoptimized:true output:standalone · jsconfig @/*",
    "Live CSS": "public/page-styles.css 1142L (link) — app/page-styles.css 1113L dead",
    "Audience": "Developers — for Claude dynamic admin panel handoff",
})

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("Prepared for admin-panel build — all photos & contents to become dynamic")
r.font.size = Pt(8)
r.font.color.rgb = RGBColor.from_string("8B5CF6")
r.italic = True

# TOC placeholder
add_heading("Table of Contents", level=1)
toc_items = [
    "1  Executive Summary",
    "2  Architecture & File Index (1388 files)",
    "3  Global Shell — layout, Header, Footer, RouteReload",
    "4  Sitemap & Routing (13 endpoints)",
    "5  Per-Page Verbatim — 10 Pages in Render Order",
    "6  Shared Components Deep Dive",
    "7  Forms & APIs (3 stubs)",
    "8  Styling System (Crafto + CHC overrides, 110 breakpoints)",
    "9  Assets Inventory (1307 images, fonts, JS vendors)",
    "10 Arrangement Diagrams — Layout → Header → Main → Footer",
    "11 Issues & Technical Debt",
    "12 Handoff Spec — What to Dynamize for Claude Panel",
    "A  Appendix — Absolute File Index & Glossary",
]
for t in toc_items:
    add_para(t, size=9, color="2D2247")
add_para("Word Table of Contents: Insert → Table of Contents → Automatic after opening (field update).", italic=True, size=7, color="716D7A")

# =========================================================
# 1 EXECUTIVE SUMMARY
# =========================================================
add_heading("1  Executive Summary", level=1)
add_para("CHC Website delivers Technology delivery with a social conscience via senior-led Oracle HCM, application development and productised tech services. It is a brochure + lead-gen site with 10 content pages, 3 lead forms, and a template-heavy front end (Crafto multipurpose HTML5 v4.0 on Bootstrap 5). Today every textual change, image swap or section reorder requires a code deploy — ~100% of copy and 100% of image URLs are hardcoded literals in JSX. There is no database, CMS, or object storage. The goal of the separate panel is to make everything dynamic without rewriting the public site.", size=9)
add_key_value_table({
    "Current state": "Fully static, 9417 files inc. node_modules, 1388 project files, .next cache, no .env, lib/ empty, 3 API stubs only console.log",
    "Performance risk": "chc-logo.png 6.3 MB + chc-spinner.png 6.2 MB unoptimized, 400+ demo-* template images bloat, images.unoptimized:true",
    "UX risk": "Forms POST to JSON page (form-results d-none never toggled), RouteReload forces window.location.reload() on every SPA nav, Footer bg demo-modern-business-footer-bg.jpg missing",
    "Build": "next build 16/16 static, First Load 87.3 kB shared (117 31.7 kB + fd9d1056 53.6 kB), standalone output but no Dockerfile",
    "Git": "2 commits (Initial, responsive,stick-header), 8 modified + 2 untracked (public/page-styles.css, .well-known), branch karun",
})

# =========================================================
# 2 ARCHITECTURE & FILE INDEX
# =========================================================
add_heading("2  Architecture & File Index", level=1)
add_para("Absolute root D:\\CHC-Website\\chc-website — Next.js App Router (app/ only, no pages/ or src/).", bold=True, size=9)
add_table(["Path","Type / Notes","Live?"], [
    ["package.json (316 B)","deps next^14.2, react^18.3, react-dom^18.3, nodemailer^6.9 — scripts dev/build/start/lint","yes"],
    ["package-lock.json (14 KB)","lockfileVersion 3, 9417 entries","yes"],
    ["next.config.js (157 B)","images.unoptimized:true output:standalone","yes"],
    ["jsconfig.json (93 B)",'baseUrl:. paths @/* → ./*',"yes"],
    [".gitignore (244 B)","ignores node_modules .next out build .DS_Store *.pem .env*.local .vercel","yes"],
    ["app/layout.js (50L)","Root layout — see §3","yes"],
    ["app/globals.css (18L)","html,body overflow-x:clip + vertical-line-bg.svg + critical 991px header bg","yes (bundled)"],
    ["app/page-styles.css (1113L)","CHC overrides — DEAD file, never imported","NO — stray"],
    ["public/page-styles.css (1142L)","Same header but LIVE via <link href=/page-styles.css> — last stylesheet, +29L drift","YES — canonical"],
    ["app/page.js (246L)","/ Home","yes"],
    ["app/about|services|applications|oracle-hcm|our-*|contact|give-one-hour/page.js","10 pages (see §5)","yes"],
    ["app/api/contact|subscribe|give-one-hour/route.js","3 POST stubs","yes"],
    ["components/Header.jsx 179L, Footer.jsx 55L, RouteReload 24L, ContentSection 26L","4 components, lib/ empty","yes"],
    ["public/css 12 files","vendors/icon/style/responsive + .min + .map 278–468 KB each","yes (min)"],
    ["public/js 31 files","jquery 87KB, vendors 636KB, main 219KB + 27 vendors (swiper 359KB, gsap, anime…)","yes"],
    ["public/images ~1307","1063 main +244 flags, 6 MB logos, demo-* bloat","yes"],
    ["public/fonts 15","bootstrap-icons, fa-*, feather, icomoon, themify","yes"],
    ["public/demos/modern-business.css","theme vars --base-color #5114D6 --dark-gray #2D2247","yes"],
], col_widths=[2.0,3.0,0.7])
add_heading("2.1  Live vs Dead CSS — critical for panel", level=3)
add_para("app/page-styles.css is never imported (grep import.*page-styles = 0). app/layout.js:30 uses <link href=/page-styles.css> → public/page-styles.css. Drift 29L: public has nth-child hamburger tops, !important header bg, navbar-nav 18→0 + last-child border0, chc-hero-ctas wrapper compact (13px/36px). Keep public as canonical; delete/sync app copy.", size=8, italic=True)
add_heading("2.2  Build output", level=3)
add_para(".next static: app-build-manifest, build-manifest (polyfills, webpack, main-app), static/chunks, static/css/app/layout.css (only globals.css — page-styles not bundled), server/app, .next/standalone missing despite config → Docker will fail without rebuild.", size=8)

# =========================================================
# 3 GLOBAL SHELL
# =========================================================
add_heading("3  Global Shell — layout, Header, Footer, RouteReload", level=1)
add_heading("3.1  app/layout.js — Root Layout (50L)", level=2)
add_code_para("import './globals.css'  // only bundled CSS\nimport Header, Footer, RouteReload  // @/components/*\nexport metadata { title: 'CHC - Technology Delivery with a Social Conscience' }  // description senior-led Oracle HCM\n<html lang='en' class='no-js'><head> charset, X-UA-Compatible, viewport, favicon /images/chc-logo.png, apple-touch 57/72/114, preconnect fonts.googleapis+gstatic, <link> vendors.min.css → icon.min.css → style.min.css → responsive.min.css → demos/modern-business.css → /page-styles.css(public) </head>\n<body data-mobile-nav-style='classic' class='background-position-center-top'> <RouteReload/> <a skip-link href='#main-content'> <div.box-layout><Header/></div> <main#main-content.chc-page-content>{children}</main> <Footer/> <div.crafto-progressive-blur> <Script jquery/vendors beforeInteractive, disable-retina beforeInteractive (Retina.isRetina→false), main afterInteractive")
add_heading("3.2  components/Header.jsx — Nav (179L, 'use client')", level=2)
add_table(["Field","Hardcoded Value","Dynamic Need"], [
    ["navItems[7]","/ Home, /oracle-hcm, /applications, /services +Hot badge, /give-one-hour, /about, /contact","CMS Navigation (CRUD, reorder, badge, href)"],
    ["whatWeDoItems[3]","/our-delivery-model bi-card-text 'Telling your story' | /our-impact bi-send 'Strategies…' | /our-people bi-briefcase 'Turning concepts…'","Dropdown group CMS (icon picker, desc)"],
    ["Brand","<img src=/images/chc-logo.png alt=CHC max-width 170→125 mobile>","Media field + alt"],
    ["Search","placeholder 'What are you looking for?' input 'Enter your keywords…' — action='#' preventDefault (non-functional)","CMS toggle + search backend"],
    ["States","menuOpen, whatWeDoOpen; closeNavigation(); useEffect pathname→close; keydown Escape, pointerdown outside navRef, resize ≥992 close, toggle documentElement chc-mobile-menu-open","—"],
    ["Markup","<header.header-with-topbar.chc-site-header> → <nav.navbar-expand-lg.header-light.bg-transparent.sticky-header> 3 cols brand|menu|search(d-none d-lg-flex)","—"],
], col_widths=[1.4,2.6,2.5])
add_heading("3.3  components/Footer.jsx — Footer (55L, server)", level=2)
add_table(["Block","Hardcoded (placeholder → fix)","Dynamic Need"], [
    ["Background","bgImage url(/images/demo-modern-business-footer-bg.jpg) — FILE MISSING (fallback black) + spinner chc-spin-support 98px + chc-spinner rotation","Media + fallback toggle"],
    ["Grid col 1","Logo /images/chc-logo.png","Media"],
    ["Grid col 2-3","'Crafto - Netherlands Graaf florisstraat 22A 1001' + 'Barcelona 365 Grand via 1002' — NOT CHC data","Address repeater (label, lines)"],
    ["CTA","'Interested in working with us? Looking for a job?' + link cloudheard.org href='' empty","Text + href CMS"],
    ["Newsletter","'Sign up for the newsletter' input email placeholder 'Enter your email…' hidden redirect + <div.form-results d-none> — form POST /api/subscribe native","Placeholder + action + success/error CMS"],
    ["Social","facebook/instagram/youtube/linkedin → https://www.facebook.com/ generic","Repeater platform/icon/URL"],
    ["Copyright","© 2026 Cloudheard Consultancy. + wordmark 'Cloud' large","Text CMS"],
], col_widths=[1.3,2.8,2.4])
add_heading("3.4  components/RouteReload.jsx (24L) + ContentSection.jsx (26L)", level=2)
add_para("RouteReload: usePathname → store body data-chc-route on first render → on pathname change if !== stored → window.location.reload() — forces hard reload to re-trigger vendor main.js; breaks Next.js SPA, remove after panel API. ContentSection (used in 7/10 pages about/services/oracle-hcm/applications×3/give-one-hour/our-people/our-impact/our-delivery-model): <section#down-section.chc-content-section> left collage /Oracle-hcm-content.jpg + chc-spin-support/spinner + oracle-hcm-content-02.jpg absolute + right badge bi-award 'We are modern business agency' + h2 'The leading agency for startup success.' + placeholder P — currently identical everywhere; needs to become page-specific or global block CMS (badge icon+text, heading, rich P, 3 images + alt, layout side).", size=8)

# =========================================================
# 4 SITEMAP & ROUTING
# =========================================================
add_heading("4  Sitemap & Routing — 13 Endpoints", level=1)
add_table(["Route","File","Title metadata","Sections summary"], [
    ["/","app/page.js","CHC - Technology Delivery…","Hero (Oracle-hcm-hero.png, badge, H1, 2 CTAs chc-hero-ctas) → Intro (home-first-section.jpg…) → What We Do 3 banners → Why CHC 4 stack cards"],
    ["/about","app/about/page.js","About - CHC","Hero + ContentSection + 6 placehold.co feature boxes + CTA Got a project?"],
    ["/services","app/services/page.js","Services - CHC","Identical to /about (duplicate placeholder)"],
    ["/applications","app/applications/page.js","Applications - CHC","Hero + ContentSection×3 + StackGroup×3 (9 cards dup Excellence/Strategic/Outcome)"],
    ["/oracle-hcm","app/oracle-hcm/page.js","Oracle HCM - CHC","Hero + ContentSection + Core Capabilities 15-slide marquee + Productised 4 cards + Delivery Capacity slider 8"],
    ["/our-delivery-model","app/our-delivery-model/page.js","Our Delivery Model","Hero + ContentSection + Process grid 5 + FAQ 4 + Business Process 8 + Stack×6 dup"],
    ["/our-impact","app/our-impact/page.js","Our Impact","Hero + ContentSection + Services carousel 10 placehold slides bg demo-modern-business-services-bg-01.jpg"],
    ["/our-people","app/our-people/page.js","Our People","Hero + ContentSection + Team carousel 8 placehold.co/600x756 coverflow"],
    ["/contact","app/contact/page.js","Contact - CHC","Hero + 3 info cols (401 Broadway/Chc office, phone, email) + Map Silver Melbourne -37.8,144.96 + form 5 fields → POST /api/contact"],
    ["/give-one-hour","app/give-one-hour/page.js","Give One Hour","Hero (subtitle copy-pasted from Oracle) + ContentSection + form 9 fields → POST /api/give-one-hour"],
    ["POST /api/contact","app/api/contact/route.js","—","name*,email*,phone,subject,comment — console.log → 200 (TODO nodemailer)"],
    ["POST /api/subscribe","app/api/subscribe/route.js","—","email* — console.log → 200 (TODO Mailchimp)"],
    ["POST /api/give-one-hour","app/api/give-one-hour/route.js","—","full_name*,linkedin*,organisation*,role*,expertise*,how_to_help*,availability*,format (online/in_person/both), anything_else — console.log → 200"],
], col_widths=[1.45,1.65,1.6,1.8])
add_para("No middleware.js, not-found.js, error.js, (group) routes. All pages export metadata title/description. Navigation uses plain <a href> not next/link.", italic=True, size=7)

# =========================================================
# 5 PER-PAGE VERBATIM
# =========================================================
add_heading("5  Per-Page Verbatim — 10 Pages in Render Order", level=1)
add_para("Each row below is exactly as rendered (hardcoded literals). Replace with CMS fields to make dynamic. Images are <img src> values; placeholder means needs real CHC content.", size=8, italic=True)

# Helper to reduce repetition - function to add page tables is inlined via calls
def page_section(title, meta, hero, sections):
    add_heading(title, level=2)
    add_para(f"Metadata: title '{meta[0]}' — description '{meta[1]}'", size=7, italic=True)
    add_heading("Hero (.chc-page-hero or .chc-home-hero, full-screen)", level=3)
    add_table(["Element","Hardcoded","File/Path"], hero, col_widths=[1.2,3.0,2.3])
    for sname, rows in sections:
        add_heading(sname, level=3)
        add_table(["#","Content / Text","Image / Link / Notes"], rows, col_widths=[0.4,2.8,3.3])

# HOME
page_section("5.1  / — Home (app/page.js 246L)", ("CHC - Technology Delivery with a Social Conscience","CHC provides cost-effective Oracle HCM… senior-led teams"), [
    ["Background","<img.chc-hero-background src=/images/Oracle-hcm-hero.png alt='' fetchPriority high> + hero-overlay-animated (pulse 5s) + SVG wave bottom shape-image-animation","app/page.js:6,13"],
    ["Badge","<span ps-25 pe-25 … bg-gradient-dark-gray-transparent d-flex w-70> bi-megaphone 'Grow your business with us'","page.js:31"],
    ["H1","'Technology delivery with a social conscience.' text-white fw-600 ls-minus-2px","page.js:32"],
    ["Paragraph","'CHC provides cost-effective Oracle HCM, application development and technology delivery services through senior-led teams. Our model combines… meaningful technology careers.' fw-300 fs-18 w-85 text-white opacity-6","page.js:33"],
    ["CTAs (.chc-hero-ctas wrapper — Option B)","About → /about btn-gradient-purple-pink btn-rounded + Contact us → /contact btn-transparent-white-light border-1 (envelope icon) — compact auto 13px/36px flex:0 0 auto","page.js:34-44"],
], [
    ("B. Intro (.chc-home-intro)", [
        ["1","Decor rotation demo-modern-business-elements-02.png absolute right-10 top-70","public/images/demo-modern-business-elements-02.png"],
        ["2","Main image home-first-section.jpg 470/566 + spinner wrap chc-spin-support 100px + chc-spinner 150px rotation","home-first-section.jpg, chc-spin-support.png, chc-spinner.png"],
        ["3","Secondary overlapping home-content-2.jpg 350/419 right-20 bottom-50 box-shadow-quadruple-large","home-content-2.jpg"],
        ["4","Badge bi-award 'We are modern business agency' + H2 'Powerful agency for corporate business.' + P 'We strive to develop real-world web solutions…' + btn 'Discuss Tech Requirement → #contact btn-dark-gray' + link 'Explore our services → /services btn-link' + tagline 'Reliable insights powered by the latest data.'","page.js:68-76"],
    ]),
    ("C. What We Do (section-what-we-do, 3 banners, grid 4-col but 3 used)", [
        ["Label","'Innovative solutions' fw-600 ls-1px fs-16 text-base-color + H2 'What we do'","page.js:88-89"],
        ["Card 1","Oracle HCM — 'Oracle HCM consulting, delivery, remediation, testing, VBCS/Redwood, reporting, integrations and managed support.' link #oracle-hcm","oracle-home-hcm.jpg 600/815"],
        ["Card 2","Application Development — 'Practical applications designed around real operational problems, including LIMS and school management solutions.' link #app-dev","app-dev-home.jpg"],
        ["Card 3","Productised Tech Services — 'Fixed-scope healthchecks, release assurance, technology support pods…' link #pts","pts-home.jpg"],
    ]),
    ("D. Why CHC? Stack Cards (.chc-why-section, 4 stack-item)", [
        ["0","SLS — img sls-home.jpg 674/452 + 'Senior-led Delivery' + 'Solutions are designed and governed by experienced enterprise technology professionals.' + bg gradient-bg-01.jpg + bg-01.png + blur object-blur-01","sls-home.jpg"],
        ["1","Cost-effective — img cost-effective.jpg + 'Cost-effective execution' + 'The right level of capability is applied to each part of delivery.'","cost-effective.jpg"],
        ["2","Capability — img cap-dev.jpg + 'Capability development' + 'Consultants progress through structured assignments…'","cap-dev.jpg"],
        ["3","Social — img social-impact.jpg + 'Social impact' + 'Each successful engagement helps create sustainable technology careers…'","social-impact.jpg"],
    ]),
])

# ABOUT / SERVICES (combined, identical)
for slug, title in [("about","About"),("services","Services")]:
    page_section(f"5.{2 if slug=='about' else 3}  /{slug} (app/{slug}/page.js)", (f"{title} - CHC","We deliver smart solutions that help your business grow successfully."), [
        ["Background","/images/Oracle-hcm-hero.png + same overlay/SVG wave","app/"+slug+"/page.js:hero"],
        ["H1","'"+title+"'","hero"],
        ["Subtitle","'We deliver smart solutions that help your business grow successfully.'","hero"],
        ["Down arrow","<a href=#down-section>","hero"],
    ], [
        (f"B. ContentSection", [["1","Identical ContentSection — bi-award 'We are modern business agency' + H2 'The leading agency for startup success.' + placeholder P + Oracle-hcm-content.jpg + oracle-hcm-content-02.jpg","components/ContentSection.jsx"]]),
        (f"C. Features Grid (6 cards, 3-col, links href='/')", [
            ["1","Development — 'From startups to enterprises, we craft adaptable web solutions that scale…'","placehold.co/180x150"],
            ["2","UX / UI design — 'We build real-world web solutions ideal for all project sizes…'","placehold.co/160x150"],
            ["3","Marketing — 'We deliver web solutions designed to meet the evolving needs of startups alike.'","placehold.co/200x150"],
            ["4","Content writing — 'From startups to enterprises, we craft adaptable web solutions…'","placehold.co/196x150"],
            ["5","Product development — 'We build flexible web solutions that grow from small startups to large-scale demands.'","placehold.co/244x150"],
            ["6","eCommerce solutions — 'Create scalable web solutions tailored for startups to enterprise-level project needs.'","placehold.co/210x150"],
            ["CTA","'Let's make something great work together. Got a project in mind? → /contact' chat icon","CTA strip"],
        ]),
    ])

# APPLICATIONS
page_section("5.4  /applications (app/applications/page.js)", ("Applications - CHC","We deliver smart solutions…"), [
    ["Background","/images/Oracle-hcm-hero.png","hero"],
    ["H1","'Applications'","hero"],
    ["Subtitle","Generic placeholder","hero"],
], [
    ("B-D. 3× Group: ContentSection + StackGroup (9 cards dup, 3 per group ×3 groups)", [
        ["Card 0×3","Outstanding speed bi-megaphone — 'Excellence framework.' + 'Our excellence framework is a strategic approach…' + btn 'Start exploring → /' (feather-edit) + img unsplash 3000px / demo-modern-business gradient","StackGroup card0"],
        ["Card 1×3","Performance playbook bi-speedometer2 — 'Strategic performance.' + same P + img placehold.co/674x452","card1"],
        ["Card 2×3","Performance power bi-vector-pen — 'Outcome accelerator.' + same P","card2"],
        ["Note","Architecture duplicated — should be one ContentSection per group + Applications as CMS repeater (badge icon+text, title, desc, CTA, media)","—"],
    ]),
])

# ORACLE-HCM
page_section("5.5  /oracle-hcm (app/oracle-hcm/page.js, 16KB)", ("Oracle HCM - CHC","CHC provides senior-led Oracle HCM delivery supported by trained functional and technical consultants."), [
    ["Background","/images/Oracle-hcm-hero.png","hero"],
    ["H1","'Oracle HCM'","hero"],
    ["Subtitle","'CHC provides senior-led Oracle HCM delivery supported by trained functional and technical consultants.'","hero"],
], [
    ("B. ContentSection", [["1","Identical ContentSection as above","—"]]),
    ("C. Core Capabilities Marquee (clients-style-08, 15 slides, h-75px)", [
        ["Heading","'Core Capabilities'","—"],
        ["Slides 15","Core HR core-hr-vec.png | Workforce Structure wfs.png | Compensation compensation-vector.png | Talent talent-vector.png | Learning learning-vector.png | Payroll payroll-vector.png | Security/AOR security-aor-vector.png | Approvals approvals-vector.png | Journey journey-vector.png | HCM Extracts hcm-extracts-vector.png | Integrations integrations-vector.png | Testing testing-vectot.png (typo) | Quarterly Releases qua-rel-vec.png | Redwood/VBCS redwood-vec.png | Technical Remediation technical-remediation-vec.png","15 vectors"],
    ]),
    ("D. Productised Oracle Services (badge Oracle, H2 'Productised Oracle Services', particles #particles-03 #b7b9be/#dd6531, 4 cards)", [
        ["1","Oracle HCM Health Check — 'Focused assessment of an existing Oracle HCM environment…' RAG + roadmap — sub 'Request a Healthcheck'","healthcheck.jpg"],
        ["2","Oracle Rapid Response — 'For broken approvals, absence issues, security problems…' — sub 'Discuss an Oracle Problem'","rapid-response.jpg"],
        ["3","Release Assurance — 'Quarterly release assessment and regression support…' — sub 'Discuss Release Support'","release-assurance.jpg"],
        ["4","Oracle Technology Pod — 'Flexible senior-led team supporting an agreed Oracle backlog…' — sub 'Discuss a Work Package'","oracle-tech-pod.jpg"],
    ]),
    ("E. Delivery Capacity Slider (bg-very-light-gray, H3 'Looking for Oracle Delivery Capacity?', 8 cards swiper 4-per-view)", [
        ["P","'CHC can operate as a specialist subcontracting and delivery partner for larger Oracle consultancies…'","—"],
        ["8 cards","Configuration config.png | Testing testing.jpg | Reporting reporting.jpg | Data data.jpg | Integrations integration.jpg | VBCS vbcs.jpg | Release Support support.jpg | Managed Support manage-support.jpg — each 'Explore services → /services'","8 services"],
    ]),
])

# GIVE-ONE-HOUR
page_section("5.6  /give-one-hour (app/give-one-hour/page.js 95L)", ("Give One Hour - CHC","Share your expertise, shape a career. [subtitle currently copy-pasted from Oracle HCM — fix needed]"), [
    ["Background","/images/Oracle-hcm-hero.png","hero"],
    ["H1","'Give One Hour'","hero"],
    ["Subtitle","(WRONG) 'CHC provides senior-led Oracle HCM delivery…' — should be Give One Hour specific","hero — fix"],
], [
    ("B. ContentSection", [["1","Same ContentSection","—"]]),
    ("C. Form (bg-very-light-gray, badge 'Give One Hour', H2 'Share your expertise, shape a career.', action POST /api/give-one-hour, 9 fields)", [
        ["Fields","full_name* text 'Your full name*' | linkedin* url 'LinkedIn profile URL*' | organisation* | role* | expertise* | how_to_help* textarea 'How would you like to help?*' | availability* | format* select Online/In person/Both (placeholder) | anything_else textarea optional | consent 'By submitting… volunteering opportunities.' | hidden redirect | btn 'Give My One Hour' btn-gradient-purple-pink","form"],
    ]),
])

# OUR-PEOPLE
page_section("5.7  /our-people (app/our-people/page.js)", ("Our People - CHC","We deliver smart solutions…"), [
    ["Background","/images/Oracle-hcm-hero.png","hero"],
    ["H1","'Our People'","hero"],
], [
    ("B. ContentSection", [["1","Same ContentSection","—"]]),
    ("C. Team Carousel (Meet our people / Leading experts, particle, coverflow swiper loop autoplay 5000, 8 slides)", [
        ["8 people","User 1 Director | User 2 Specialist | User 3 Manager | User 4 Consultant | User 5 Architect | User 6 Lead Developer | User 7 Data Analyst | User 8 Solutions Engineer — each placehold.co/600x756, overlay 'Capability / Current learning / delivery focus' generic","8 placeholders"],
    ]),
])

# OUR-IMPACT
page_section("5.8  /our-impact (app/our-impact/page.js)", ("Our Impact - CHC","We deliver smart solutions…"), [
    ["Background","/images/Oracle-hcm-hero.png","hero"],
    ["H1","'Our Impact'","hero"],
], [
    ("B. ContentSection", [["1","Same ContentSection","—"]]),
    ("C. Services Carousel (bg demo-modern-business-services-bg-01.jpg, badge 'Services and solutions' box-seam, H2 'Experienced services', swiper 6-per-view loop autoplay delay:250000, 10 slides)", [
        ["10 slides","Development 180x150 | UX/UI 160x150 | Marketing 200x150 | Content writing 196x150 | Product design 244x150 — all duplicate placeholder texts, link '/' + footer 'Create your own website…' window-fullscreen icon","10 placeholders"],
    ]),
])

# OUR-DELIVERY-MODEL
page_section("5.9  /our-delivery-model (app/our-delivery-model/page.js 31KB — most complex)", ("Our Delivery Model - CHC","We deliver smart solutions…"), [
    ["Background","/images/Oracle-hcm-hero.png","hero"],
    ["H1","'Our Delivery Model'","hero"],
], [
    ("B. ContentSection", [["1","Same ContentSection","—"]]),
    ("C. Process Steps Grid #1 (5 cols manual)", [["Steps 5","01 Research Idea-5 | 02 Sketches Fountain-Pen | 03 Concept Loading-2 | 04 Presentation Juice | 05 Research Idea-5 — all desc 'Lorem ipsum is simply text the printing.' + 80px separator circles","—"]]),
    ("D. FAQ (bg-very-light-gray, badge 'Frequently asked questions', H2 'How can we help?')", [
        ["4 cards","Q1 'Can you help us raise money? Lorem ipsum…' | Q2 'Do we really need a business plan?' | Q3 'Will you sign a agreement?' | Q4 'Can you send us samples of work?' + link 'Didn't find response? view more → /'","—"],
    ]),
    ("E. Business Process #down-section (row-cols-4, 8 steps mapped)", [["8 steps","01 Research Idea-5 | 02 Sketches Fountain-Pen | 03 Concept Loading-2 | 04 Presentation Juice | 05 Sketches … | 06 Concept … | 07 Presentation … | 08 Research — all Lorem ipsum","—"]]),
    ("F. Stack Cards #1 & #2 (2 groups ×3 =6 cards dup of Applications)", [["6 cards","Excellence framework / Strategic performance / Outcome accelerator (same unsplash/encrypted-tbn images, same P, btn Start exploring → /) — duplication to dedupe","—"]]),
])

# CONTACT
page_section("5.10  /contact (app/contact/page.js 130L)", ("Contact - CHC","Get in touch with CHC."), [
    ["Background","/images/Oracle-hcm-hero.png","hero"],
    ["H1","'Contact'","hero"],
], [
    ("B. Contact Info Grid (#down-section, 3 cols)", [
        ["1","CHC office — '401 Broadway, 24th Floor, Orchard View, London, UK' icon Geo2-Love","—"],
        ["2","Call us — 'Phone: 1-800-222-000 tel:1800222000' + 'Fax: 1-800-222-002' icon Headset","—"],
        ["3","E-mail — 'info@yourdomain.com mailto' + 'hr@yourdomain.com' icon Mail-Read","—"],
        ["Note","London address conflicts with map Melbourne (see below) — fix needed","—"],
    ]),
    ("C. Map (#map, lat -37.805688 lng 144.962312 style Silver marker #dd6531 popup 'CHC Consulting 16122 Collins street, Melbourne, Australia')", [["Map","Demo coordinates — not CHC office","mapstyles.js"]]),
    ("D. Form (bg-very-light-gray, badge 'Feel free to get in touch!', H2 'How we can help you?', action POST /api/contact)", [
        ["Fields","name* 'Your name*' | email* 'Your email address*' | phone 'Your phone' | subject 'Your subject' | comment textarea 'Your message' | privacy 'We are committed…' | hidden redirect | btn 'send message'","form"],
    ]),
])

# =========================================================
# 6 SHARED COMPONENTS DEEP DIVE
# =========================================================
add_heading("6  Shared Components Deep Dive", level=1)
add_heading("6.1  Header.jsx 179L 'use client'", level=2)
add_para("Imports useEffect,useRef,useState + usePathname. Exports default Header. navItems[7] + whatWeDoItems[3] (see §3.2). State menuOpen/whatWeDoOpen, closeNavigation(), useEffect pathname→close, Escape/pointerdown outside navRef, resize≥992 close, toggles documentElement chc-mobile-menu-open. isActive===pathname. Markup header.header-with-topbar.chc-site-header → nav.navbar-expand-lg.header-light.bg-transparent.sticky-header (3 cols brand/menu/search). Uses <a href> not next/link.", size=8)
add_heading("6.2  Footer.jsx 55L + ContentSection.jsx 26L + RouteReload.jsx 24L", level=2)
add_para("Footer: cover-background bgImage demo-modern-business-footer-bg.jpg (MISSING), spinner chc-spin-support 98px + chc-spinner rotation, 4-col grid, social generic, address placeholders Crafto, newsletter POST /api/subscribe with form-results d-none never toggled. ContentSection: #down-section chc-content-section left collage Oracle-hcm-content.jpg + spinner overlay + oracle-hcm-content-02.jpg + right badge bi-award. RouteReload: usePathname + data-chc-route → window.location.reload() on change — breaks SPA, re-triggers main.js; remove after panel.", size=8)

# =========================================================
# 7 FORMS & APIS
# =========================================================
add_heading("7  Forms & APIs — 3 Stubs (no DB, no email)", level=1)
add_table(["Route","File","Required fields","Current handler"], [
    ["POST /api/contact","app/api/contact/route.js (42L)","name*, email* (regex /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/) + phone,subject,comment optional","formData.get → 400 if missing → console.log → {success:true 200} — TODO nodemailer/Resend (dep installed but not imported)"],
    ["POST /api/subscribe","app/api/subscribe/route.js (37L)","email* (same regex)","formData email → 400 → console.log → 200 — TODO Mailchimp/SendGrid"],
    ["POST /api/give-one-hour","app/api/give-one-hour/route.js (37L)","full_name*,linkedin* (no URL regex),organisation*,role*,expertise*,how_to_help*,availability*,format (online/in_person/both), anything_else optional; no email field","same pattern → 200"],
], col_widths=[1.3,1.6,2.1,2.5])
add_para("All use NextResponse.json, formData not JSON, no GET, no rate-limit/CSRF/CAPTCHA/honeypot, no sanitization, no persistence, no env (.env missing). Client forms use native POST → browser navigates to JSON page (no fetch/preventDefault, main.js has no AJAX for form-results). Search form Header action='#' preventDefault dummy. lib/ empty — create lib/email.js, lib/db.js, lib/validations.js (zod).", size=8, italic=True)

# =========================================================
# 8 STYLING SYSTEM
# =========================================================
add_heading("8  Styling System — Crafto v4.0 + CHC Overrides", level=1)
add_table(["Sheet","Path","Size","Role"], [
    ["globals.css (live)","app/globals.css 18L","439 B","html,body overflow-x:clip + vertical-line-bg.svg + critical 991px header bg"],
    ["page-styles.css LIVE","public/page-styles.css 1142L","24.6 KB","Last <link> — highest priority CHC overrides (hero, header, footer, 110+ responsive)"],
    ["page-styles.css DEAD","app/page-styles.css 1113L","24.0 KB","Never imported — 29L drift, delete/sync"],
    ["vendors.min.css","public/css/vendors.min.css","302 KB","Bootstrap 5 grid + normalize + plugins"],
    ["icon.min.css","public/css/icon.min.css","279 KB","Feather+FontAwesome"],
    ["style.min.css","public/css/style.min.css","381 KB","Crafto base (hover, vars)"],
    ["responsive.min.css","public/css/responsive.min.css","303 KB","Crafto responsive 110 blocks"],
    ["modern-business.css","public/demos/modern-business.css 214L","5.5 KB","--base-color #5114D6 --dark-gray #2D2247 --medium-gray #716d7a"],
], col_widths=[1.4,2.2,0.9,3.0])
add_heading("8.1  Breakpoints & Vars", level=2)
add_para("Project :root — --chc-page-gutter clamp(16px,4vw,72px) →16px@575, --chc-section-space 64-120, --chc-mobile-header-height 68px, --chc-touch-target 44px. Queries: 991px nav (26 blocks) / 767px phone (28) / 575px xs (17) / 769px spinner / 992-1250px nav shrink / hover:none / prefers-reduced-motion. Vendors: min-width progressive 576/768/992/1200/1400. No Tailwind, no postcss.config, no *.module.css, no styled-components — only import './globals.css' bundled to static/css/app/layout.css.", size=8)
add_heading("8.2  Recent CHC fixes (live file)", level=2)
add_para("Hamburger nth-child tops 15/21/27, header !important (globals + page-styles), navbar-nav 18→0 + last-child border0, hero chc-hero-ctas flex gap 10 justify-start compact 13px/36px flex:0 0 auto. Previously caused white flicker + empty section after Contact + massive pills.", size=8)

# =========================================================
# 9 ASSETS INVENTORY
# =========================================================
add_heading("9  Assets Inventory — 1307 Images, Fonts, JS Vendors", level=1)
add_para("Total public ~1369 files. No optimization (images.unoptimized:true).", bold=True, size=9)
add_table(["Category","Count","Largest / Key Files","Notes"], [
    ["Images main","1063","chc-logo.png 6.3 MB ⚠, chc-spinner.png 6.2 MB ⚠, config.png 1.9 MB, Oracle-hcm-hero.png, home-first-section.jpg, oracle-home-hcm.jpg, app-dev-home.jpg, pts-home.jpg, sls-home.jpg, cost-effective.jpg, cap-dev.jpg, social-impact.jpg, 400+ demo-* template bloat (crafto-landing-page-hero, features-ico, etc.)","Prune demo-*, compress logos → WebP <200KB"],
    ["Flags","244","country-flag-16X16/Afghanistan.png … Zimbabwe.png","Subfolder"],
    ["Fonts","15","bootstrap-icons woff/woff2, fa-brands 110KB, fa-solid 115KB, icomoon 1.18MB×4, feather, themify 36KB","—"],
    ["CSS","12","style 469KB(381 min) + responsive 418KB(303 min) + vendors 372KB(302 min) + icon 357KB(279 min) + maps 362–678KB","Template"],
    ["JS main","4","jquery 87KB, vendors.min 636KB (1.3 MB src), main 219KB (4124L) — no fetch for /api/*, search dummy","—"],
    ["JS vendors","27","anime.min 115KB, swiper-bundle 359KB, bootstrap.bundle 214KB, gsap 185KB, particles 44KB, mCustomScrollbar, isotope, magnific-popup 46KB, retina.min 2.5KB (now disabled via disable-retina inline script)","—"],
    ["Missing","—","demo-modern-business-footer-bg.jpg (Footer bgImage) NOT on disk","Fallback black"],
], col_widths=[1.1,0.7,2.4,2.3])
add_para("Images served as <img> not next/image — no resizing. Retina HEAD @2x requests previously 33× 404s now disabled via layout disable-retina script + .well-known/appspecific/com.chrome.devtools.json {}. Hot-update.json 404 is stale .next HMR — restart dev clears.", size=7, italic=True)

# =========================================================
# 10 ARRANGEMENT DIAGRAMS
# =========================================================
add_heading("10  Arrangement Diagrams — Layout → Header → Main → Footer", level=1)
add_para("Rendering order (Next.js App Router):", bold=True, size=9)
add_code_para("app/layout.js\n├─ <html no-js>\n│  ├─ <head> 6× <link> CSS (vendors→page-styles live) + favicons + preconnect\n│  └─ <body data-mobile-nav-style=classic>\n│     ├─ <RouteReload/> (reload on pathname change)\n│     ├─ <a.skip-link href=#main-content>\n│     ├─ <div.box-layout><Header.jsx> 3 cols brand|menu(7 navItems+3 dropdown)|search\n│     ├─ <main#main-content.chc-page-content>{children: app/**/page.js}</main>\n│     ├─ <Footer.jsx> 4-col grid + wordmark Cloud\n│     ├─ <div.crafto-progressive-blur bottom>\n│     └─ <Script> jquery/vendors(beforeInteractive) → disable-retina → main(afterInteractive)\n└─ PWA/Chrome probe /.well-known/appspecific/com.chrome.devtools.json 200")
add_heading("10.1  Per-page section order (dom order, top→bottom)", level=2)
add_table(["Page","Section Order (verbatim IDs/classes)"], [
    ["/",".chc-home-hero full-screen (hero) → .chc-home-intro → .section-what-we-do (3 banners) → .chc-why-section (4 stack-card)"],
    ["/about",".chc-page-hero → #down-section .chc-content-section → .row 6 feature boxes (placehold.co) → CTA Got a project?"],
    ["/services","(identical to /about)"],
    ["/applications",".chc-page-hero → [#down-section .chc-content-section + .stack-card×3] ×3 (9 cards dup)"],
    ["/oracle-hcm",".chc-page-hero → .chc-content-section → .clients-style-08 marquee 15 → #particles-03 4 cards → bg-very-light-gray slider 8"],
    ["/our-delivery-model",".chc-page-hero → .chc-content-section → Process 5 → FAQ 4 (bg-very-light-gray) → Business Process 8 → stack ×6 dup"],
    ["/our-impact",".chc-page-hero → .chc-content-section → Services carousel 10 (bg demo-modern-business-services-bg-01.jpg)"],
    ["/our-people",".chc-page-hero → .chc-content-section → team-people-carousel 8 (coverflow)"],
    ["/contact",".chc-page-hero → #down-section 3 info cols → #map Silver Melbourne → form bg-very-light-gray 5 fields"],
    ["/give-one-hour",".chc-page-hero → .chc-content-section → form bg-very-light-gray 9 fields"],
], col_widths=[1.3,5.2])
add_para("Header nav order: slice(0,4) Home→Services + dropdown What we do (Delivery/Impact/People) + slice(4) Give One Hour→Contact. Mobile: header absolute top10 + navbar blur, hamburger 44px, collapse absolute top100% max-height calc(100dvh-68px).", size=7)

# =========================================================
# 11 ISSUES & TECH DEBT
# =========================================================
add_heading("11  Issues & Technical Debt", level=1)
add_table(["Severity","Issue","Location","Fix for Panel"], [
    ["HIGH","100% copy hardcoded, Lorem ipsum/placehold.co/unsplash throughout About/Services/Applications/Delivery/Impact/People","6 pages","CMS required fields + placeholder guard"],
    ["HIGH","Background footer demo-modern-business-footer-bg.jpg missing → fallback black","Footer.jsx: bgImage","Provide real footer bg or remove ref"],
    ["HIGH","Contact info mismatch: page shows 401 Broadway London + Melbourne map (-37.8,144.96) popup 16122 Collins","contact/page.js info vs map","Unify via CMS Address+Map entity"],
    ["HIGH","Give One Hour hero subtitle copy-pasted from Oracle HCM (wrong)","give-one-hour/page.js hero","Fix CMS hero subtitle"],
    ["HIGH","Forms POST to JSON page (native), form-results d-none, no fetch, no nodemailer wiring despite dep","3 routes + 3 pages","Add fetch + lib/email + validations, Resend/Nodemailer"],
    ["MEDIUM","chc-logo 6.3MB + spinner 6.2MB unoptimized, 400 demo-* images bloat","public/images","Compress <200KB WebP, use next/image or Vercel Blob"],
    ["MEDIUM","RouteReload hard reload breaks SPA (intended to re-trigger main.js)","RouteReload.jsx","Remove after panel (replace vendor main with React)"],
    ["MEDIUM","app/page-styles.css dead + drift 29L vs public live; app duplication confusion","app vs public","Delete/sync app copy, keep public canonical"],
    ["MEDIUM","Retina @2x HEAD 404s (33 per page) now disabled via inline script; hot-update.json HMR 404 after .next clean","vendors retina + .next cache","Keep disable-retina script; restart dev after .next delete"],
    ["LOW","Duplicate About/Services identical 6 boxes — should diverge","about + services","Separate CMS entries"],
    ["LOW","Applications/Delivery duplicate stack 9/6 cards Excellence/Strategic/Outcome","applications, our-delivery-model","Dedupe into CMS repeater"],
    ["LOW","No .env, no auth, no DB — greenfield","root","Create .env.local + Prisma/Supabase"],
], col_widths=[0.7,2.1,1.6,2.1])

# =========================================================
# 12 HANDOFF SPEC — WHAT TO DYNAMIZE
# =========================================================
add_heading("12  Handoff Spec — What Claude Must Make Dynamic", level=1)
add_para("Build a separate admin panel to make every photo and content editable. Recommended stack (keep Next 14 @/*): NextAuth (credentials), Prisma + Postgres/Supabase, Vercel Blob/S3 for public/images, Resend/Nodemailer for forms, zod validations, admin route group app/(admin)/admin guarded. Seed from verbatim tables above.", size=8)
add_table(["Entity / Table","Fields (CMS)","Pages Used","Media"], [
    ["Page","slug, title, metadata.title, metadata.description, hero{title,subtitle,bgImage,alt,overlay,svgFill,downAnchor}, sections order, published","All 10","—"],
    ["PageHero","title, subtitle rich, bgImage, alt, overlay toggle/color, SVG fill, downAnchor id","All 10","bgImage"],
    ["ContentSection (block)","badgeIcon, badgeText, h2, paragraph rich, 3 images (main, secondary, decor) + alt, layout side","7 pages","3 images"],
    ["Navigation (global)","label, href, order, badge(Hot), group(WhatWeDo), icon (bi-*), active logic","Header 7+3","—"],
    ["Footer (global)","logo, bgImage, spinner toggle, 4 cols repeater (label,lines), CTA text/href, social repeater (platform,icon,url), newsletter placeholder/action, copyright, wordmark","Footer","logo, bg"],
    ["FeatureBox / ServiceBox","icon/image upload or URL, title, description rich, href, order","About/Services/Impact 6–10","image"],
    ["TeamMember","name, role, photo, capability tags repeater, focus rich, bio, social, sort, active","Our People 8","photo"],
    ["Capability","label, icon vector, href, order","Oracle 15 marquee","icon"],
    ["ProductService","title, description hover rich, image, CTA subtext+href, order","Oracle 4 cards","image"],
    ["DeliverySliderService","title, description, image, cta href, order","Oracle 8","image"],
    ["StackCard","badgeIcon+Text, heading, paragraph, CTA label/href, bgGradient, decorBlur, image + aspect, order","Home 4, Applications 9, Delivery 6","image"],
    ["ProcessStep","stepNo auto, icon (Idea-5 etc.), label, desc rich, separator bool, order","Delivery 5+8","—"],
    ["FAQ","question, answer rich, order","Delivery 4","—"],
    ["ContactInfo","title, icon, lines, phone/email links","Contact 3","—"],
    ["Map","lat,lng, style(Silver), markerColor/image, popupHtml, provider","Contact","—"],
    ["FormDefinition","slug(contact|give-one-hour|subscribe), badge, heading, fields[](name,label,placeholder,type,required,options,regex, validationMsg), consent rich, submitLabel, action, redirect, successMsg, errorMsg","Contact 5, Give 9, Subscribe 1","—"],
    ["MediaLibrary","file, alt, width, height, mime, folder, page link, compressed WebP","All ~1307","file"],
    ["SEO","per-page ogTitle, ogImage, canonical","All","ogImage"],
], col_widths=[1.6,2.4,1.6,0.9])
add_para("Seed script: parse app/**/page.js literals into Prisma seed (use tables above) → replace JSX <img src='/images/...'> with {media.url} and text with {field}. Replace <form action method=post> with client fetch + lib/validations + lib/email. Remove RouteReload reload after panel. Keep public/css static; admin uses Tailwind/shadcn isolated to (admin) group.", size=7, italic=True)
add_heading("Suggested Admin Routes", level=2)
add_para("app/(admin)/admin/page (dashboard) → /admin/pages, /admin/navigation, /admin/footer, /admin/team, /admin/capabilities, /admin/forms, /admin/media, /admin/seo, /admin/settings (SMTP env, site title). Guard with middleware.js + NextAuth.", size=8)

# =========================================================
# A APPENDIX
# =========================================================
add_heading("Appendix A — Absolute File Index (Top 50 + counts)", level=1)
add_para("Full index 1388 files — top 50 direct children + counts. .next/node_modules omitted for brevity.", size=7, italic=True)
add_table(["Absolute Path","Lines / Size","Role"], [
    ["D:\\CHC-Website\\chc-website\\package.json","316 B","deps"],
    ["…\\next.config.js","9L 157 B","standalone, unoptimized"],
    ["…\\jsconfig.json","8L 93 B","@/* alias"],
    ["…\\.gitignore","244 B","ignores"],
    ["…\\app\\layout.js","50L 2733 B","root layout"],
    ["…\\app\\globals.css","18L 439 B LIVE","clip + critical header"],
    ["…\\app\\page-styles.css","1113L 24.0 KB DEAD","never imported"],
    ["…\\public\\page-styles.css","1142L 24.6 KB LIVE","canonical last CSS"],
    ["…\\app\\page.js","246L 20.6 KB","/"],
    ["…\\app\\about\\page.js","~122L","/about"],
    ["…\\app\\services\\page.js","~122L","/services"],
    ["…\\app\\applications\\page.js","~10371 B","/applications"],
    ["…\\app\\oracle-hcm\\page.js","16.7 KB","/oracle-hcm"],
    ["…\\app\\our-delivery-model\\page.js","31.7 KB","/our-delivery-model"],
    ["…\\app\\our-impact\\page.js","7.2 KB","/our-impact"],
    ["…\\app\\our-people\\page.js","5.9 KB","/our-people"],
    ["…\\app\\contact\\page.js","~130L","/contact"],
    ["…\\app\\give-one-hour\\page.js","95L","/give-one-hour"],
    ["…\\app\\api\\contact\\route.js","42L","POST /api/contact"],
    ["…\\app\\api\\subscribe\\route.js","37L","POST /api/subscribe"],
    ["…\\app\\api\\give-one-hour\\route.js","37L","POST /api/give-one-hour"],
    ["…\\components\\Header.jsx","179L","nav"],
    ["…\\components\\Footer.jsx","55L","footer"],
    ["…\\components\\ContentSection.jsx","26L","shared section"],
    ["…\\components\\RouteReload.jsx","24L","hard reload"],
    ["…\\public\\css\\style.min.css","381 KB","Crafto"],
    ["…\\public\\css\\responsive.min.css","303 KB","Crafto"],
    ["…\\public\\.well-known\\appspecific\\com.chrome.devtools.json","{}","silences Chrome probe"],
], col_widths=[3.0,1.2,2.3])
add_para("… plus public/css 12, public/fonts 15, public/js 31 (vendors 27), public/images 1307 — see §9 table for full category counts. lib/ 0 files (empty, created 08/27).", size=7)

add_heading("Glossary", level=2)
add_para("CHC = Cloudheard Consultancy  •  Crafto = ThemeZaa multipurpose HTML5 v4.0 (Bootstrap 5)  •  SPA = single-page app (broken by RouteReload)  •  FOUC = flash of unstyled content (white flicker)  •  HMR = hot module replacement (.next hot-update.json)  •  CMS = content management system for admin panel  •  Prisma = ORM for Postgres", size=7)

add_heading("How to Use This Doc with Claude", level=2)
add_para("Copy this entire doc (or upload the .docx) into Claude with prompt: 'Build the separate admin panel described in §12 using the verbatim content in §5 and asset list in §9. Use Next.js 14 App Router, create app/(admin)/admin routes, Prisma schema from §12 table, seed from §5 literals, replace hardcoded JSX with DB fetches, media library for §9, and wire lib/email for §7 forms. Keep public/page-styles.css as live.'", size=8, italic=True, color="2D2247")

# footer
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run(f"— End of Document · Generated {datetime.date.today().isoformat()} · D:\\CHC-Website\\chc-website · Branch karun · For Claude handoff —")
r.font.size = Pt(7)
r.font.color.rgb = RGBColor.from_string("716D7A")
r.italic = True

doc.save(r"D:\CHC-Website\chc-website\docs\CHC-Website-Technical-Documentation.docx")
print("saved docx")
