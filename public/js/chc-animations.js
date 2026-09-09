/*
 * Lightweight, dependency-free reveal animations for CMS and public content.
 * This deliberately replaces the legacy theme animation layer, whose API no
 * longer matches the bundled Anime.js version.
 */
(function () {
  'use strict'

  function initialise() {
    document.body.classList.add('chc-native-animations')
    const seen = new WeakSet()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)
    const observer = reduced ? null : new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('chc-revealed')
        observer.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })

    function register(root) {
      const elements = Array.from(root.querySelectorAll('[data-chc-animate]'))
      if (root.matches?.('[data-chc-animate]')) elements.unshift(root)
      elements.forEach((element, index) => {
      if (seen.has(element)) return
      seen.add(element)
      if (reduced) { element.classList.add('chc-revealed'); return }
      element.classList.add('chc-reveal')
      // Small stagger avoids a single, abrupt wall of content appearing.
      element.style.setProperty('--chc-reveal-delay', `${Math.min(index % 5, 4) * 70}ms`)
      observer.observe(element)
      })
    }
    register(document)
    // Server-streamed and newly mounted section instances need the same
    // initialization as sections present at DOMContentLoaded.
    new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node.nodeType === 1) register(node)
      }))
    }).observe(document.body, { childList: true, subtree: true })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialise, { once: true })
  } else {
    initialise()
  }
})()
