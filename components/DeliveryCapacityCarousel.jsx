'use client'

import { useEffect, useRef } from 'react'

/**
 * A native scroll track keeps the final drag position intact. Links remain
 * clickable; a click is only suppressed when the pointer actually moves far
 * enough to be considered a drag.
 */
export default function DeliveryCapacityCarousel({ children }) {
  const viewportRef = useRef(null)
  const gestureRef = useRef({ active: false, dragging: false, pointerId: null, startX: 0, startY: 0, startScrollLeft: 0 })
  const wrappingRef = useRef(false)

  useEffect(() => {
    const viewport = viewportRef.current
    const track = viewport?.firstElementChild
    if (!viewport || !track) return undefined

    const cycleWidth = () => track.scrollWidth / 3
    const centerOnMiddleCopy = () => {
      const width = cycleWidth()
      if (width > 0) viewport.scrollLeft = width
    }
    const wrapScrollPosition = () => {
      if (wrappingRef.current) return
      const width = cycleWidth()
      if (!width) return

      // The first and third copies are visual buffers around the interactive
      // middle copy. Shift by exactly one cycle before reaching either edge.
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
  }, [])

  function onPointerDown(event) {
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

  function onPointerMove(event) {
    const viewport = viewportRef.current
    const gesture = gestureRef.current
    if (!viewport || !gesture.active || event.pointerId !== gesture.pointerId) return

    const deltaX = event.clientX - gesture.startX
    const deltaY = event.clientY - gesture.startY
    if (!gesture.dragging) {
      if (Math.abs(deltaX) < 6 || Math.abs(deltaX) <= Math.abs(deltaY)) return
      gesture.dragging = true
      viewport.classList.add('is-dragging')
      viewport.setPointerCapture(event.pointerId)
    }

    viewport.scrollLeft = gesture.startScrollLeft - deltaX
    event.preventDefault()
  }

  function onPointerEnd(event) {
    const viewport = viewportRef.current
    const gesture = gestureRef.current
    if (!viewport || !gesture.active || event.pointerId !== gesture.pointerId) return

    gesture.active = false
    viewport.classList.remove('is-dragging')
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId)
    // The browser dispatches click immediately after pointerup. Keeping this
    // flag for the current event cycle protects links only after a real drag.
    if (gesture.dragging) setTimeout(() => { gesture.dragging = false }, 0)
  }

  function onClickCapture(event) {
    if (!gestureRef.current.dragging) return
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <div
      ref={viewportRef}
      className="chc-delivery-carousel magic-cursor base-color drag-cursor"
      role="region"
      aria-label="Oracle delivery services carousel"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onClickCapture={onClickCapture}
    >
      {children}
    </div>
  )
}
