'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function RouteReload() {
  const pathname = usePathname()

  useEffect(() => {
    const firstPath = document.body.getAttribute('data-chc-route')

    if (firstPath === null) {
      document.body.setAttribute('data-chc-route', pathname)
      return
    }

    if (firstPath !== pathname) {
      document.body.setAttribute('data-chc-route', pathname)
      window.location.reload()
    }
  }, [pathname])

  return null
}
