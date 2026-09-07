'use client'

import { useEffect, useRef } from 'react'
import Swiper from 'swiper/bundle'

const AUTOPLAY_DELAY_MS = 5000
const PLACEHOLDER_GALLERY = [
  '/images/healthcheck.jpg',
  '/images/oracle-tech-pod.jpg',
  '/images/rapid-response.jpg',
  '/images/release-assurance.jpg',
]

/**
 * /our-people carousel: a continuously looping, centre-focused gallery.
 * Swiper moves a side card to the enlarged centre position via controls or
 * drag while the hover overlay reveals that person's details.
 */
export default function LeadingExpertsCarousel({ people = [] }) {
  const rootRef = useRef(null)
  const previousRef = useRef(null)
  const nextRef = useRef(null)
  // Swiper needs at least three slides for a stable centred loop. Do not alter
  // CMS data; only repeat the available visual cards when the data is sparse.
  const carouselPeople = people.length > 0 && people.length < 3 ? [...people, ...people, ...people] : people

  useEffect(() => {
    const root = rootRef.current
    if (!root || carouselPeople.length === 0) return undefined

    const count = root.querySelectorAll(':scope > .swiper-wrapper > .swiper-slide').length
    if (count === 0) return undefined

    let swiper
    try {
      swiper = new Swiper(root, {
        slidesPerView: 3,
        spaceBetween: 30,
        loop: count > 2,
        centeredSlides: count > 1,
        speed: 760,
        grabCursor: true,
        watchSlidesProgress: true,
        effect: 'coverflow',
        coverflowEffect: { rotate: 0, stretch: 0, depth: 100, modifier: 2, slideShadows: true },
        autoplay: count > 1 ? {
          delay: AUTOPLAY_DELAY_MS,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
          waitForTransition: false,
        } : false,
        navigation: {
          prevEl: previousRef.current,
          nextEl: nextRef.current,
        },
        on: {
          beforeInit(instance) {
            if (instance.params.navigation) {
              instance.params.navigation.prevEl = previousRef.current
              instance.params.navigation.nextEl = nextRef.current
            }
          },
          init(instance) {
            if (instance.navigation) instance.navigation.update()
          },
        },
        keyboard: { enabled: true, onlyInViewport: true },
        a11y: { enabled: true },
        observer: true,
        observeParents: true,
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
    const refresh = () => swiper && !swiper.destroyed && swiper.update()
    window.addEventListener('load', refresh, { once: true })

    return () => {
      window.removeEventListener('load', refresh)
      try {
        if (swiper && !swiper.destroyed) swiper.destroy(true, true)
      } catch {
        // Ignore cleanup after a partial initialization.
      }
    }
  }, [carouselPeople.length])

  return (
    <div className="chc-people-carousel-shell">
      <div
        ref={rootRef}
        className="swiper team-people-carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label="Leading experts"
      >
        <div className="swiper-wrapper">
          {carouselPeople.map((person, index) => {
            const photo = person.photo?.includes('placehold.co')
              ? PLACEHOLDER_GALLERY[index % PLACEHOLDER_GALLERY.length]
              : person.photo

            return (
            <div className="swiper-slide" key={person.name ? `${person.name}-${index}` : index}>
              <article className="chc-person-card">
                <div className="chc-person-media">
                  <img src={photo} alt={person.name || 'CHC team member'} loading="lazy" />
                  <div className="chc-person-details">
                    <span className="chc-person-name">{person.name}</span>
                    {person.role && <span className="chc-person-role">{person.role}</span>}
                    {person.capability && <span className="chc-person-meta">{person.capability}</span>}
                    {person.learningFocus && <span className="chc-person-meta">{person.learningFocus}</span>}
                  </div>
                </div>
              </article>
            </div>
            )
          })}
        </div>
      </div>

      <div className="chc-people-carousel-controls" aria-label="People carousel controls">
        <button ref={previousRef} type="button" className="chc-people-carousel-arrow" aria-label="Show previous person">
          <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
        </button>
        <button ref={nextRef} type="button" className="chc-people-carousel-arrow" aria-label="Show next person">
          <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  )
}
