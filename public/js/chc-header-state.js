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

    var navbar = header.querySelector('.navbar')
    var background = 'linear-gradient(90deg, rgba(25, 12, 49, 0.72), rgba(53, 27, 88, 0.66))'
    var shadow = '0 8px 24px rgba(13, 5, 29, 0.26)'

    header.style.setProperty('background', background, 'important')
    header.style.setProperty('box-shadow', shadow, 'important')
    if (navbar) {
      navbar.style.setProperty('background', background, 'important')
      navbar.style.setProperty('backdrop-filter', 'blur(30px) saturate(150%)', 'important')
      navbar.style.setProperty('-webkit-backdrop-filter', 'blur(30px) saturate(150%)', 'important')
    }
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
