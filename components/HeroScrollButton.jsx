'use client'

import { useRef } from 'react'

export default function HeroScrollButton() {
  const anchorRef = useRef(null)

  function handleClick(event) {
    const anchor = anchorRef.current
    if (!anchor) return
    const heroSection = anchor.closest('section')
    if (!heroSection) return
    const target = document.getElementById('down-section') ?? (heroSection.nextElementSibling ?? null)
    if (!target) return
    event.preventDefault()
    const headerHeight = document.querySelector('.chc-site-header')?.offsetHeight ?? 0
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <a ref={anchorRef} href="#down-section" className="section-link" onClick={handleClick}>
      <div className="text-white"><i className="bi bi-arrow-down-short icon-very-medium animation-float"></i></div>
    </a>
  )
}