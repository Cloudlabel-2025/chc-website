'use client'

function IconWrap({ size = 14, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

export function MoveUp({ size = 14 }) {
  return <IconWrap size={size}><path d="M12 19V5" /><path d="M5 12l7-7 7 7" /></IconWrap>
}
export function MoveDown({ size = 14 }) {
  return <IconWrap size={size}><path d="M12 5v14" /><path d="M19 12l-7 7-7-7" /></IconWrap>
}
export function Edit({ size = 14 }) {
  return <IconWrap size={size}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></IconWrap>
}
export function Delete({ size = 14 }) {
  return <IconWrap size={size}><path d="M3 6h18" /><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" /><path d="M10 11v6M14 11v6" /></IconWrap>
}
export function Close({ size = 14 }) {
  return <IconWrap size={size}><path d="M18 6L6 18" /><path d="M6 6l12 12" /></IconWrap>
}
export function View({ size = 14 }) {
  return <IconWrap size={size}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></IconWrap>
}
export function Add({ size = 14 }) {
  return <IconWrap size={size}><path d="M12 5v14" /><path d="M5 12h14" /></IconWrap>
}
export function Check({ size = 14 }) {
  return <IconWrap size={size}><path d="M20 6L9 17l-5-5" /></IconWrap>
}
export function ChevronDown({ size = 14 }) {
  return <IconWrap size={size}><path d="M6 9l6 6 6-6" /></IconWrap>
}
