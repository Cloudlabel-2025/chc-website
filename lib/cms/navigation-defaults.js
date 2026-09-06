// The menu currently represented by the public site. These defaults are used
// for public fallbacks, the offline CMS preview, and restoring an empty DB.
export const DEFAULT_NAVIGATION = [
  { key: 'home', label: 'Home', href: '/', badge: null, sortOrder: 0, children: [] },
  { key: 'oracle-hcm', label: 'Oracle HCM', href: '/oracle-hcm', badge: null, sortOrder: 1, children: [] },
  { key: 'applications', label: 'Applications', href: '/applications', badge: null, sortOrder: 2, children: [] },
  { key: 'services', label: 'Services', href: '/services', badge: 'Hot', sortOrder: 3, children: [] },
  {
    key: 'what-we-do', label: 'What we do', href: '#', badge: null, sortOrder: 4,
    children: [
      { key: 'delivery-model', label: 'Our Delivery Model', href: '/our-delivery-model', icon: 'bi bi-card-text', description: 'Telling your story with impact.', sortOrder: 0 },
      { key: 'our-impact', label: 'Our Impact', href: '/our-impact', icon: 'bi bi-send', description: 'Strategies for lasting impact.', sortOrder: 1 },
      { key: 'our-people', label: 'Our People', href: '/our-people', icon: 'bi bi-briefcase', description: 'Turning concepts into products.', sortOrder: 2 },
    ],
  },
  { key: 'give-one-hour', label: 'Give One Hour', href: '/give-one-hour', badge: null, sortOrder: 5, children: [] },
  { key: 'about', label: 'About', href: '/about', badge: null, sortOrder: 6, children: [] },
  { key: 'contact', label: 'Contact', href: '/contact', badge: null, sortOrder: 7, children: [] },
]

export function getNavigationFallback() {
  return DEFAULT_NAVIGATION.map((item) => ({
    ...item,
    id: `fallback-${item.key}`,
    isVisible: true,
    children: item.children.map((child) => ({ ...child, id: `fallback-${child.key}`, isVisible: true })),
  }))
}
