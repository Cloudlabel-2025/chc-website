'use client'

import { useEffect, useRef } from 'react'
import SlideLink from '@/components/SlideLink'

/** Infinite native-scroll carousel with link-safe pointer dragging. */
export default function ImpactServicesCarousel({ services = [] }) {
  const viewportRef = useRef(null)
  const gestureRef = useRef({ active: false, dragging: false, pointerId: null, startX: 0, startY: 0, startScrollLeft: 0 })
  const wrappingRef = useRef(false)

  useEffect(() => {
    const viewport = viewportRef.current
    const track = viewport?.firstElementChild
    if (!viewport || !track || services.length === 0) return undefined

    const cycleWidth = () => track.scrollWidth / 3
    const centerOnMiddleCopy = () => {
      const width = cycleWidth()
      if (width > 0) viewport.scrollLeft = width
    }
    const wrapScrollPosition = () => {
      if (wrappingRef.current) return
      const width = cycleWidth()
      if (!width) return
      let next = null
      if (viewport.scrollLeft < width * 0.25) next = viewport.scrollLeft + width
      if (viewport.scrollLeft > width * 1.75) next = viewport.scrollLeft - width
      if (next === null) return
      wrappingRef.current = true
      viewport.scrollLeft = next
      requestAnimationFrame(() => { wrappingRef.current = false })
    }

    const frame = requestAnimationFrame(centerOnMiddleCopy)
    viewport.addEventListener('scroll', wrapScrollPosition, { passive: true })
    window.addEventListener('resize', centerOnMiddleCopy)
    return () => {
      cancelAnimationFrame(frame)
      viewport.removeEventListener('scroll', wrapScrollPosition)
      window.removeEventListener('resize', centerOnMiddleCopy)
    }
  }, [services.length])

  const startDrag = (event) => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return
    const viewport = viewportRef.current
    if (!viewport) return
    gestureRef.current = {
      active: true,
      dragging: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScrollLeft: viewport.scrollLeft,
    }
  }

  const drag = (event) => {
    const viewport = viewportRef.current
    const state = gestureRef.current
    if (!viewport || !state.active || event.pointerId !== state.pointerId) return
    const deltaX = event.clientX - state.startX
    const deltaY = event.clientY - state.startY
    if (!state.dragging) {
      if (Math.abs(deltaX) < 6 || Math.abs(deltaX) <= Math.abs(deltaY)) return
      state.dragging = true
      viewport.classList.add('is-dragging')
      viewport.setPointerCapture(event.pointerId)
    }
    viewport.scrollLeft = state.startScrollLeft - deltaX
    event.preventDefault()
  }

  const endDrag = (event) => {
    const viewport = viewportRef.current
    const state = gestureRef.current
    if (!viewport || !state.active || event.pointerId !== state.pointerId) return
    state.active = false
    viewport.classList.remove('is-dragging')
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId)
    if (state.dragging) setTimeout(() => { state.dragging = false }, 0)
  }

  const preventDraggedLinkClick = (event) => {
    if (!gestureRef.current.dragging) return
    event.preventDefault()
    event.stopPropagation()
  }

  const loopedServices = [...services, ...services, ...services]

  return (
    <div
      ref={viewportRef}
      className="chc-impact-services-carousel magic-cursor base-color drag-cursor"
      role="region"
      aria-roledescription="carousel"
      aria-label="Experienced services"
      tabIndex={0}
      onPointerDown={startDrag}
      onPointerMove={drag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={preventDraggedLinkClick}
    >
      <div className="chc-impact-services-track" role="list">
        {loopedServices.map((service, index) => (
          <article
            className="chc-impact-service-card"
            key={`${service.title}-${index}`}
            role="listitem"
            aria-hidden={index < services.length || index >= services.length * 2}
          >
            <SlideLink href={service.href} className="chc-impact-service-image force-magic-cursor">
              <img src={service.img} alt="" loading="lazy" draggable="false" />
            </SlideLink>
            <div className="chc-impact-service-content">
              <SlideLink href={service.href} className="chc-impact-service-title force-magic-cursor">{service.title}</SlideLink>
              <p>{service.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
