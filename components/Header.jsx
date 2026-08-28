'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/oracle-hcm', label: 'Oracle HCM' },
  { href: '/applications', label: 'Applications' },
  { href: '/services', label: 'Services', badge: 'Hot' },
  { href: '/give-one-hour', label: 'Give One Hour' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const whatWeDoItems = [
  {
    href: '/our-delivery-model',
    icon: 'bi bi-card-text',
    label: 'Our Delivery Model',
    description: 'Telling your story with impact.',
  },
  {
    href: '/our-impact',
    icon: 'bi bi-send',
    label: 'Our Impact',
    description: 'Strategies for lasting impact.',
  },
  {
    href: '/our-people',
    icon: 'bi bi-briefcase',
    label: 'Our People',
    description: 'Turning concepts into products.',
  },
]

export default function Header() {
  const pathname = usePathname()
  const navRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [whatWeDoOpen, setWhatWeDoOpen] = useState(false)

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

  const isActive = (href) => pathname === href
  const isWhatWeDoActive = whatWeDoItems.some((item) => isActive(item.href))

  return (
    <header className="header-with-topbar chc-site-header">
      <nav ref={navRef} className="navbar navbar-expand-lg header-light bg-transparent sticky-header" aria-label="Primary navigation">
        <div className="container-fluid chc-header-inner">
          <div className="chc-brand-column">
            <a className="navbar-brand" href="/" aria-label="CHC home" onClick={closeNavigation}>
              <img src="/images/chc-logo.png" alt="CHC" className="default-logo" />
            </a>
          </div>

          <div className="chc-menu-column menu-order">
            <button
              className={`navbar-toggler chc-menu-toggle${menuOpen ? ' is-open' : ''}`}
              type="button"
              aria-controls="navbarNav"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="navbar-toggler-line"></span>
              <span className="navbar-toggler-line"></span>
              <span className="navbar-toggler-line"></span>
              <span className="navbar-toggler-line"></span>
            </button>

            <div className={`navbar-collapse chc-navbar-collapse${menuOpen ? ' show' : ''}`} id="navbarNav">
              <ul className="navbar-nav">
                {navItems.slice(0, 4).map((item) => (
                  <li className={`nav-item${isActive(item.href) ? ' active' : ''}`} key={item.href}>
                    <a href={item.href} className="nav-link" aria-current={isActive(item.href) ? 'page' : undefined} onClick={closeNavigation}>
                      {item.label}
                      {item.badge && <span className="label border-radius-100px bg-light-medium-gray fw-700 alt-font text-base-color text-uppercase">{item.badge}</span>}
                    </a>
                  </li>
                ))}

                <li className={`nav-item dropdown dropdown-with-icon chc-what-we-do${whatWeDoOpen ? ' is-open' : ''}${isWhatWeDoActive ? ' active' : ''}`}>
                  <button
                    type="button"
                    className="chc-nav-parent"
                    aria-expanded={whatWeDoOpen}
                    aria-controls="what-we-do-menu"
                    onClick={() => setWhatWeDoOpen((open) => !open)}
                  >
                    <span>What we do</span>
                    <i className="fa-solid fa-angle-down" aria-hidden="true"></i>
                  </button>
                  <ul className="dropdown-menu" id="what-we-do-menu">
                    {whatWeDoItems.map((item) => (
                      <li key={item.href}>
                        <a href={item.href} aria-current={isActive(item.href) ? 'page' : undefined} onClick={closeNavigation}>
                          <i className={item.icon} aria-hidden="true"></i>
                          <span className="submenu-icon-content">
                            <span>{item.label}</span>
                            <span className="chc-submenu-description">{item.description}</span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>

                {navItems.slice(4).map((item) => (
                  <li className={`nav-item${isActive(item.href) ? ' active' : ''}`} key={item.href}>
                    <a href={item.href} className="nav-link" aria-current={isActive(item.href) ? 'page' : undefined} onClick={closeNavigation}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="chc-search-column text-end d-none d-lg-flex">
            <div className="header-icon">
              <div className="header-search-icon icon">
                <a href="#" className="search-form-icon header-search-form h-45px w-45px d-flex align-items-center justify-content-center border border-color-extra-medium-gray text-center rounded-circle" aria-label="Open search">
                  <i className="feather icon-feather-search text-base-color" aria-hidden="true"></i>
                </a>
                <div className="search-form-wrapper">
                  <button title="Close" type="button" className="search-close"></button>
                  <form id="search-form" role="search" method="get" className="search-form text-left" action="#" onSubmit={(event) => event.preventDefault()}>
                    <div className="search-form-box">
                      <h2 className="text-dark-gray text-center fw-600 mb-4 ls-minus-2px">What are you looking for?</h2>
                      <input className="search-input" id="search-form-input" placeholder="Enter your keywords..." name="s" defaultValue="" type="search" autoComplete="off" />
                      <button type="submit" className="search-button" aria-label="Search">
                        <i className="feather icon-feather-search" aria-hidden="true"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
