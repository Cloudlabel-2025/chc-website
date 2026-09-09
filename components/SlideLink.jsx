export default function SlideLink({ href, className = '', children, ...props }) {
  const url = typeof href === 'string' ? href.trim() : ''
  if (!url || url === '#') {
    const textClasses = className.split(/\s+/).filter((name) => name && !/^btn(?:-|$)/.test(name) && !['force-magic-cursor', 'text-decoration-line-bottom'].includes(name)).join(' ')
    return <span className={textClasses} title={props.title} style={{ cursor: 'default', textDecoration: 'none' }}>{children}</span>
  }
  return <a {...props} href={url} className={className}>{children}</a>
}
