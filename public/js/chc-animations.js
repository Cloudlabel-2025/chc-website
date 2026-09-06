/*
 * Lightweight, dependency-free reveal animations for CMS and public content.
 * This deliberately replaces the legacy theme animation layer, whose API no
 * longer matches the bundled Anime.js version.
 */
(function () {
  'use strict'

  function initialise() {
    const elements = Array.from(document.querySelectorAll('[data-chc-animate]'))
    if (!elements.length) return

    document.body.classList.add('chc-native-animations')

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('chc-revealed'))
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('chc-revealed')
        observer.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })

    elements.forEach((element, index) => {
      element.classList.add('chc-reveal')
      // Small stagger avoids a single, abrupt wall of content appearing.
      element.style.setProperty('--chc-reveal-delay', `${Math.min(index % 5, 4) * 70}ms`)
      observer.observe(element)
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialise, { once: true })
  } else {
    initialise()
  }
})()
