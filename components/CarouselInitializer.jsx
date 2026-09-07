'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Swiper from 'swiper/bundle'

// Generic Swiper initializer for legacy data-slider-options markup (e.g. the
// /our-impact showcase). The /our-people Leading Experts carousel is owned by
// components/LeadingExpertsCarousel.jsx and is explicitly skipped here. The
// oracle-hcm delivery strip is CSS-only (marquee keyframes) and needs no JS.
export default function CarouselInitializer() {
  const pathname = usePathname()

  useEffect(() => {
    let cancelled = false
    const pendingElements = []
    const loadListeners = []
    const fallbackTimers = []
    const swiperInstances = []

    function initialise() {
      if (cancelled) return

      const $ = window.jQuery

      document
        .querySelectorAll('[data-slider-options]:not(.instafeed-wrapper):not(.team-people-carousel)')
        .forEach((element) => {
          if (element.dataset.chcCarouselReady === 'true' || element.dataset.chcCarouselPending === 'true') return

          const slides = element.querySelectorAll(':scope > .swiper-wrapper > .swiper-slide')
          if (slides.length === 0) return

          let options
          try {
            options = JSON.parse(element.getAttribute('data-slider-options'))
          } catch (error) {
            console.warn('[CHC carousel] Invalid data-slider-options.', error)
            return
          }

          // Graceful degrade: a single slide cannot loop/autoplay/center without
          // cloning artefacts; two slides cannot loop cleanly.
          const count = slides.length
          if (count < 2) {
            options.loop = false
            if (options.autoplay) options.autoplay = false
            options.centeredSlides = false
          } else if (count === 2 && options.loop) {
            options.loop = false
          }
          // Re-measure after CMS hydration / image settle.
          options.observer = true
          options.observeParents = true

          const initSwiper = () => {
            if (cancelled || element.dataset.chcCarouselReady === 'true') return
            const timerIndex = fallbackTimers.findIndex((entry) => entry.element === element)
            if (timerIndex !== -1) {
              window.clearTimeout(fallbackTimers[timerIndex].timer)
              fallbackTimers.splice(timerIndex, 1)
            }
            try {
              const instance = new Swiper(element, options)
              swiperInstances.push(instance)
              element.dataset.chcCarouselReady = 'true'
              delete element.dataset.chcCarouselPending
              element.classList.add('chc-carousel-ready')
            } catch (error) {
              delete element.dataset.chcCarouselPending
              console.warn('[CHC carousel] Swiper initialization failed.', error)
            }
          }

          element.dataset.chcCarouselPending = 'true'
          pendingElements.push(element)
          // A blocked or slow image host must never starve initialization:
          // imagesLoaded waits for every image, so a fallback timer plus window
          // load listener guarantees initSwiper runs even when imagesLoaded
          // never fires. initSwiper is idempotent, so the first trigger wins.
          const fallbackTimer = window.setTimeout(initSwiper, 1500)
          fallbackTimers.push({ element, timer: fallbackTimer })
          const onLoad = () => initSwiper()
          loadListeners.push(onLoad)
          window.addEventListener('load', onLoad, { once: true })
          // Prefer images so the layout is measured once photos settle.
          if (typeof window.imagesLoaded === 'function') {
            window.imagesLoaded(element, initSwiper)
          } else if ($ && typeof $.fn?.imagesLoaded === 'function') {
            $(element).imagesLoaded(initSwiper)
          } else {
            window.requestAnimationFrame(initSwiper)
          }
        })
    }

    initialise()

    return () => {
      cancelled = true
      swiperInstances.splice(0).forEach((instance) => {
        try {
          if (instance && !instance.destroyed) instance.destroy(true, true)
        } catch {
          // Ignore destroy errors during unmount.
        }
      })
      fallbackTimers.splice(0).forEach((entry) => window.clearTimeout(entry.timer))
      loadListeners.splice(0).forEach((listener) => window.removeEventListener('load', listener))
      pendingElements.forEach((element) => {
        if (element.dataset.chcCarouselReady !== 'true') delete element.dataset.chcCarouselPending
      })
    }
  }, [pathname])

  return null
}
