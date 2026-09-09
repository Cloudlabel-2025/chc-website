'use client'

import SlideLink from '@/components/SlideLink'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

const NAV_FALLBACK = [
  { id: '1', href: '/',              label: 'Home',          badge: null },
  { id: '2', href: '/oracle-hcm',    label: 'Oracle HCM',    badge: null },
  { id: '3', href: '/applications',  label: 'Applications',  badge: null },
  { id: '4', href: '/services',      label: 'Services',      badge: 'Hot' },
  { id: '5', href: '/give-one-hour', label: 'Give One Hour', badge: null },
  { id: '6', href: '/about',         label: 'About',         badge: null },
  { id: '7', href: '/contact',       label: 'Contact',       badge: null },
]

const WHAT_WE_DO_FALLBACK = [
  { id: 'a', href: '/our-delivery-model', icon: 'bi bi-card-text', label: 'Our Delivery Model', description: 'Telling your story with impact.' },
  { id: 'b', href: '/our-impact',         icon: 'bi bi-send',       label: 'Our Impact',         description: 'Strategies for lasting impact.' },
  { id: 'c', href: '/our-people',         icon: 'bi bi-briefcase',  label: 'Our People',         description: 'Turning concepts into products.' },
]

export default function Header({ navItems = NAV_FALLBACK, whatWeDoItems = WHAT_WE_DO_FALLBACK }) {
  const pathname = usePathname()
  const navRef = useRef(null)
  const headerRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [whatWeDoOpen, setWhatWeDoOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  const closeNavigation = () => {
    setMenuOpen(false)
    setWhatWeDoOpen(false)
  }

  useEffect(() => {
    closeNavigation()
  }, [pathname])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeNavigation()
    }

    const handlePointerDown = (event) => {
      if ((menuOpen || whatWeDoOpen) && navRef.current && !navRef.current.contains(event.target)) {
        closeNavigation()
      }
    }

    const handleResize = () => {
      if (window.innerWidth >= 992) setMenuOpen(false)
    }

    document.documentElement.classList.toggle('chc-mobile-menu-open', menuOpen)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('resize', handleResize)

    return () => {
      document.documentElement.classList.remove('chc-mobile-menu-open')
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [menuOpen, whatWeDoOpen])

  useEffect(() => {
    const setHeaderState = (scrolled) => {
      headerRef.current?.classList.toggle('chc-header-scrolled', scrolled)
      setHasScrolled(scrolled)
    }
    const updateHeaderState = () => {
      const scrollPosition = Math.max(window.scrollY, document.documentElement.scrollTop, document.body.scrollTop)
      setHeaderState(scrollPosition > 24)
    }
    const sentinel = document.getElementById('chc-header-scroll-sentinel')
    const observer = sentinel && 'IntersectionObserver' in window
      ? new IntersectionObserver(([entry]) => setHeaderState(!entry.isIntersecting), { threshold: 0 })
      : null

    updateHeaderState()
    observer?.observe(sentinel)
    window.addEventListener('scroll', updateHeaderState, { passive: true })
    document.addEventListener('scroll', updateHeaderState, { capture: true, passive: true })
    return () => {
      window.removeEventListener('scroll', updateHeaderState)
      document.removeEventListener('scroll', updateHeaderState, { capture: true })
      observer?.disconnect()
    }
  }, [])

  const isActive = (href) => pathname === href
  const isWhatWeDoActive = whatWeDoItems.some((item) => isActive(item.href))

  return (
    <header ref={headerRef} className={`header-with-topbar chc-site-header${hasScrolled ? ' chc-header-scrolled' : ''}`}>
      <nav ref={navRef} className="navbar navbar-expand-lg header-light bg-transparent sticky-header" aria-label="Primary navigation">
        <div className="container-fluid chc-header-inner">
          <div className="chc-brand-column">
            <a className="navbar-brand" href="/" aria-label="CHC home" onClick={closeNavigation}>
              <img src="/images/chc-logo.png" alt="CHC" data-no-retina className="default-logo" />
            </a>
          </div>

          <div className="chc-menu-column menu-order">
            <input
              id="chc-mobile-menu-toggle"
              className="chc-menu-toggle-state"
              type="checkbox"
              checked={menuOpen}
              onChange={(event) => setMenuOpen(event.target.checked)}
              aria-controls="navbarNav"
              aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            />
            <label
              htmlFor="chc-mobile-menu-toggle"
              className={`navbar-toggler chc-menu-toggle${menuOpen ? ' is-open' : ''}`}
              aria-hidden="true"
            >
              <span className="navbar-toggler-line"></span>
              <span className="navbar-toggler-line"></span>
              <span className="navbar-toggler-line"></span>
              <span className="navbar-toggler-line"></span>
            </label>

            <div className={`navbar-collapse chc-navbar-collapse${menuOpen ? ' show' : ''}`} id="navbarNav">
              <ul className="navbar-nav">
                {navItems.slice(0, 4).map((item) => (
                  <li className={`nav-item${isActive(item.href) ? ' active' : ''}`} key={item.href}>
                    <SlideLink href={item.href} className="nav-link" aria-current={isActive(item.href) ? 'page' : undefined} onClick={closeNavigation}>
                      {item.label}
                      {item.badge && <span className="label border-radius-100px bg-light-medium-gray fw-700 alt-font text-base-color text-uppercase">{item.badge}</span>}
                    </SlideLink>
                  </li>
                ))}

                <li className={`nav-item dropdown dropdown-with-icon chc-what-we-do${whatWeDoOpen ? ' is-open' : ''}${isWhatWeDoActive ? ' active' : ''}`}>
                  <input
                    id="chc-what-we-do-toggle"
                    className="chc-what-we-do-state"
                    type="checkbox"
                    checked={whatWeDoOpen}
                    onChange={(event) => setWhatWeDoOpen(event.target.checked)}
                    aria-controls="what-we-do-menu"
                    aria-label={whatWeDoOpen ? 'Close What we do menu' : 'Open What we do menu'}
                  />
                  <label
                    htmlFor="chc-what-we-do-toggle"
                    className="chc-nav-parent"
                    aria-hidden="true"
                  >
                    <span>What we do</span>
                    <i className="fa-solid fa-angle-down" aria-hidden="true"></i>
                  </label>
                  <ul className="dropdown-menu" id="what-we-do-menu">
                    {whatWeDoItems.map((item) => (
                      <li key={item.href}>
                        <SlideLink href={item.href} aria-current={isActive(item.href) ? 'page' : undefined} onClick={closeNavigation}>
        <i className={item.icon} aria-hidden="true"></i>
        <span className="submenu-icon-content">
          <span>{item.label}</span>
        </span>
      </SlideLink>
                      </li>
                    ))}
                  </ul>
                </li>

                {navItems.slice(4).map((item) => (
                  <li className={`nav-item${isActive(item.href) ? ' active' : ''}`} key={item.href}>
                    <SlideLink href={item.href} className="nav-link" aria-current={isActive(item.href) ? 'page' : undefined} onClick={closeNavigation}>{item.label}</SlideLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </nav>
    </header>
  )
}
