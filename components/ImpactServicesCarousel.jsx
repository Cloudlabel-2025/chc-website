'use client'

import { useRef } from 'react'

/** CSS owns the endless loop; pointer events temporarily take over for a true mouse grab. */
export default function ImpactServicesCarousel({ services = [] }) {
  const viewportRef = useRef(null)
  const dragRef = useRef({ active: false, moved: false, startX: 0, startTranslate: 0 })

  const startDrag = (event) => {
    if (!event.isPrimary || event.button !== 0) return
    const viewport = viewportRef.current
    const track = viewport?.firstElementChild
    if (!viewport || !track) return

    const transform = window.getComputedStyle(track).transform
    const matrix = transform.match(/^matrix\((.+)\)$/)?.[1].split(',')
    const matrix3d = transform.match(/^matrix3d\((.+)\)$/)?.[1].split(',')
    const startTranslate = matrix3d ? Number(matrix3d[12]) : matrix ? Number(matrix[4]) : 0

    dragRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startTranslate: Number.isFinite(startTranslate) ? startTranslate : 0,
    }
    viewport.classList.add('is-dragging')
    track.style.animation = 'none'
    track.style.transform = `translate3d(${dragRef.current.startTranslate}px, 0, 0)`
    viewport.setPointerCapture(event.pointerId)
  }

  const drag = (event) => {
    const viewport = viewportRef.current
    const track = viewport?.firstElementChild
    const state = dragRef.current
    if (!viewport || !track || !state.active) return

    const distance = event.clientX - state.startX
    if (Math.abs(distance) > 4) state.moved = true
    track.style.transform = `translate3d(${state.startTranslate + distance}px, 0, 0)`
  }

  const endDrag = (event) => {
    const viewport = viewportRef.current
    const track = viewport?.firstElementChild
    if (!viewport || !track || !dragRef.current.active) return

    dragRef.current.active = false
    viewport.classList.remove('is-dragging')
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId)
    track.style.removeProperty('animation')
    track.style.removeProperty('transform')
  }

  const preventDraggedLinkClick = (event) => {
    if (!dragRef.current.moved) return
    event.preventDefault()
    event.stopPropagation()
    dragRef.current.moved = false
  }

  const loopedServices = [...services, ...services, ...services]

  return (
    <div
      ref={viewportRef}
      className="chc-impact-services-carousel"
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
            <a href={service.href || '/'} className="chc-impact-service-image">
              <img src={service.img} alt="" loading="lazy" />
            </a>
            <div className="chc-impact-service-content">
              <a href={service.href || '/'} className="chc-impact-service-title">{service.title}</a>
              <p>{service.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
