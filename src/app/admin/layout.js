'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RootLayout({ children }) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(null) // null = loading

  useEffect(() => {
    const checkAdmin = async () => {
      const accessToken = localStorage.getItem('access_token')
      if (!accessToken) {
        router.push('/account/login')
        return
      }

      try {
        const res = await fetch(
          `https://aesthetic-mandi-swiftconnect-a9332357.koyeb.app/users/admin-access-check/`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        const data = await res.json()
        const hasAccess = !!(data && (data.has_admin_access === true || data.isAdmin === true))
        if (!hasAccess) {
          setAuthorized(false)
          router.push('/')
          return
        }
        setAuthorized(true)
      } catch (error) {
        setAuthorized(false)
        router.push('/')
      }
    }

    checkAdmin()
  }, [router])

  if (authorized !== true) return null // block render until explicitly authorized

  // Important: nested layouts should not render <html>/<body>. Use a fragment instead
  return <>{children}</>
}
