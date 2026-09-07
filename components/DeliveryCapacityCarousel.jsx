'use client'

import { useRef } from 'react'

/**
 * CSS owns the endless loop so it still moves without JavaScript. Pointer
 * events temporarily take over the track transform for a true mouse grab.
 */
export default function DeliveryCapacityCarousel({ children }) {
  const viewportRef = useRef(null)
  const dragRef = useRef({ active: false, moved: false, startX: 0, startTranslate: 0 })

  const beginDrag = (event) => {
    if (!event.isPrimary || event.button !== 0) return
    const viewport = viewportRef.current
    const track = viewport?.firstElementChild
    if (!viewport || !track) return

    const matrix = window.getComputedStyle(track).transform
    const matrixValues = matrix.match(/^matrix\((.+)\)$/)?.[1].split(',')
    const matrix3dValues = matrix.match(/^matrix3d\((.+)\)$/)?.[1].split(',')
    const translateX = matrix3dValues ? Number(matrix3dValues[12]) : matrixValues ? Number(matrixValues[4]) : 0

    dragRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startTranslate: Number.isFinite(translateX) ? translateX : 0,
    }
    viewport.classList.add('is-dragging')
    track.style.animation = 'none'
    track.style.transform = `translate3d(${dragRef.current.startTranslate}px, 0, 0)`
    viewport.setPointerCapture(event.pointerId)
  }

  const moveDrag = (event) => {
    const viewport = viewportRef.current
    const track = viewport?.firstElementChild
    const drag = dragRef.current
    if (!viewport || !track || !drag.active) return

    const distance = event.clientX - drag.startX
    if (Math.abs(distance) > 4) drag.moved = true
    track.style.transform = `translate3d(${drag.startTranslate + distance}px, 0, 0)`
  }

  const endDrag = (event) => {
    const viewport = viewportRef.current
    const track = viewport?.firstElementChild
    const drag = dragRef.current
    if (!viewport || !track || !drag.active) return

    drag.active = false
    viewport.classList.remove('is-dragging')
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId)
    // Return control to the CSS keyframes, which loop forever.
    track.style.removeProperty('animation')
    track.style.removeProperty('transform')
  }

  const preventDraggedLinkClick = (event) => {
    if (!dragRef.current.moved) return
    event.preventDefault()
    event.stopPropagation()
    dragRef.current.moved = false
  }

  return (
    <div
      ref={viewportRef}
      className="chc-delivery-carousel magic-cursor drag-cursor"
      role="region"
      aria-label="Oracle delivery services carousel"
      tabIndex={0}
      onPointerDown={beginDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={preventDraggedLinkClick}
    >
      {children}
    </div>
  )
}
