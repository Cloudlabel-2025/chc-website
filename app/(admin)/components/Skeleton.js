export function SkeletonText({ lines = 3, width }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="admin-skeleton admin-skeleton-text"
          style={{ width: i === lines - 1 ? '60%' : (width || '100%') }}
        />
      ))}
    </div>
  )
}

export function SkeletonTitle() {
  return <div className="admin-skeleton admin-skeleton-title" />
}

export function SkeletonCard({ height = 120 }) {
  return <div className="admin-skeleton admin-skeleton-card" style={{ height }} />
}

export function SkeletonRow() {
  return (
    <div className="admin-skeleton-row">
      <div className="admin-skeleton admin-skeleton-avatar" />
      <div className="admin-skeleton-lines">
        <div className="admin-skeleton admin-skeleton-text" style={{ width: '80%' }} />
        <div className="admin-skeleton admin-skeleton-text" style={{ width: '50%' }} />
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  )
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="admin-grid-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} height={160} />
      ))}
    </div>
  )
}
