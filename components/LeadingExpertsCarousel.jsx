'use client'

import { useEffect, useRef } from 'react'
import Swiper from 'swiper/bundle'

// Leading Experts carousel for /our-people. Scoped and self-contained: it owns
// its own markup and initialises Swiper against its own root ref on mount, so
// it never depends on the legacy vendors.min.js globals, imagesLoaded timing,
// data-slider-options JSON parsing, or any global initializer.
// Design spec (coverflow, autoplay 5s, breakpoints) mirrors the original theme.
const AUTOPLAY_DELAY_MS = 5000

export default function LeadingExpertsCarousel({ people = [] }) {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const count = root.querySelectorAll(':scope > .swiper-wrapper > .swiper-slide').length
    if (count === 0) return undefined

    let swiper
    try {
      swiper = new Swiper(root, {
        slidesPerView: 3,
        spaceBetween: 30,
        loop: count > 2,
        centeredSlides: count > 1,
        effect: 'coverflow',
        coverflowEffect: { rotate: 0, stretch: 0, depth: 100, modifier: 2, slideShadows: false },
        autoplay: count > 1 ? { delay: AUTOPLAY_DELAY_MS, disableOnInteraction: false } : false,
        observer: true,
        observeParents: true,
        watchSlidesProgress: true,
        keyboard: { enabled: true, onlyInViewport: true },
        a11y: { enabled: true },
        breakpoints: {
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
          1200: { slidesPerView: 3 },
        },
      })
    } catch (error) {
      console.warn('[LeadingExpertsCarousel] Swiper initialization failed.', error)
      return undefined
    }

    root.classList.add('chc-carousel-ready')

    const handleLoad = () => {
      try {
        if (swiper && !swiper.destroyed) swiper.update()
      } catch {
        // Ignore post-load measurement errors.
      }
    }
    window.addEventListener('load', handleLoad, { once: true })

    return () => {
      window.removeEventListener('load', handleLoad)
      try {
        if (swiper && !swiper.destroyed) swiper.destroy(true, true)
      } catch {
        // Ignore destroy errors during unmount.
      }
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className="swiper team-people-carousel magic-cursor"
      role="region"
      aria-roledescription="carousel"
      aria-label="Leading experts"
    >
      <div className="swiper-wrapper">
        {people.map((person, i) => (
          <div className="swiper-slide" key={person.name ? `${person.name}-${i}` : i}>
            <div className="text-center team-style-05">
              <div className="position-relative border-radius-4px overflow-hidden mb-30px last-paragraph-no-margin">
                <img src={person.photo} alt={person.name} loading="lazy" />
                <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center p-40px lg-p-30px team-content bg-gradient-dark-orange-transparent">
                  <div className="social-icon fs-20">
                    <p className="text-white">{person.name}</p>
                    <p className="text-white">{person.role}</p>
                    {person.capability    && <p className="text-white">{person.capability}</p>}
                    {person.learningFocus && <p className="text-white">{person.learningFocus}</p>}
                  </div>
                </div>
              </div>
              <div className="alt-font fw-600 text-dark-gray lh-22 fs-18">{person.name}</div>
              <span>{person.role}</span>
              <div className="chc-carousel-link-row mt-20px"><a href="/services" className="chc-carousel-service-link">Explore services <i className="fa-solid fa-arrow-right" aria-hidden="true"></i></a></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
