export default function AdminSidebar() {
  const sections = [
    {
      label: 'Content',
      links: [
        { href: '/admin/dashboard', label: 'Dashboard', icon: HomeIcon },
        { href: '/admin/pages', label: 'Pages', icon: PagesIcon },
        { href: '/admin/navigation', label: 'Navigation', icon: NavIcon },
        { href: '/admin/footer', label: 'Footer', icon: FooterIcon },
      ],
    },
    {
      label: 'Media',
      links: [
        { href: '/admin/media', label: 'Media Library', icon: MediaIcon },
      ],
    },
    {
      label: 'Forms',
      links: [
        { href: '/admin/forms', label: 'Forms', icon: FormIcon },
        { href: '/admin/submissions', label: 'Submissions', icon: FormIcon },
      ],
    },
    {
      label: 'Settings',
      links: [
        { href: '/admin/seo', label: 'SEO', icon: SeoIcon },
        { href: '/admin/templates', label: 'Templates', icon: PagesIcon },
        { href: '/admin/settings', label: 'Settings', icon: SettingsIcon },
      ],
    },
  ]

  return (
    <aside className="admin-sidebar">
      {sections.map((section) => (
        <div key={section.label} className="admin-nav-section">
          <p className="admin-nav-label">{section.label}</p>
          {section.links.map(({ href, label, icon: Icon }) => (
            <a key={href} href={href} className="admin-nav-link">
              <Icon />
              {label}
            </a>
          ))}
        </div>
      ))}
    </aside>
  )
}

// Inline SVG icons — no external icon library dependency in admin
function HomeIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 6.5L8 2l6 4.5V14a.5.5 0 01-.5.5h-4V10H6.5v4.5h-4A.5.5 0 012 14V6.5z" />
    </svg>
  )
}

function PagesIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="1.5" width="9" height="12" rx=".5" />
      <path d="M5 1.5V14M11 4.5h2.5a.5.5 0 01.5.5v9a.5.5 0 01-.5.5H7" />
    </svg>
  )
}

function NavIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 4h12M2 8h8M2 12h10" strokeLinecap="round" />
    </svg>
  )
}

function FooterIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1.5" y="1.5" width="13" height="13" rx="1" />
      <path d="M1.5 11.5h13" />
    </svg>
  )
}

function MediaIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1.5" y="3" width="13" height="10" rx="1" />
      <circle cx="5.5" cy="6.5" r="1" />
      <path d="M1.5 11l3.5-3 2.5 2.5 2-2 4 4" />
    </svg>
  )
}

function FormIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 2.5h12M2 5.5h8M2 8.5h10M2 11.5h6" strokeLinecap="round" />
    </svg>
  )
}

function SeoIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5l3 3" strokeLinecap="round" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="2" />
      <path d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.4 3.4l.7.7M11.9 11.9l.7.7M3.4 12.6l.7-.7M11.9 4.1l.7-.7" strokeLinecap="round" />
    </svg>
  )
}
