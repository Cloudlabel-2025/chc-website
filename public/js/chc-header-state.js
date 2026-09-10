(function () {
  function updateHeaderState(event) {
    var header = document.querySelector('.chc-site-header')
    if (!header) return

    var targetScroll = event && event.target && event.target.scrollTop ? event.target.scrollTop : 0
    var scrollTop = Math.max(
      window.pageYOffset || 0,
      document.documentElement.scrollTop || 0,
      document.body.scrollTop || 0,
      targetScroll
    )

    var isScrolled = scrollTop > 16
    header.classList.toggle('chc-header-scrolled', isScrolled)
    document.body.classList.toggle('chc-page-scrolled', isScrolled)
    // Visuals are owned by page-styles.css (transparent desktop origin,
    // opaque violet once .chc-header-scrolled applies). Do not set inline
    // backgrounds here — they would override the CSS state on every scroll.
  }

  function start() {
    updateHeaderState()
    window.addEventListener('scroll', updateHeaderState, { passive: true })
    document.addEventListener('scroll', updateHeaderState, { capture: true, passive: true })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true })
  } else {
    start()
  }
})()
