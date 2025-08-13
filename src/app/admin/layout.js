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

        const isAdmin = await res.json()
        if (!isAdmin) {
          router.push('/')
        } else {
          setAuthorized(true)
        }
      } catch (error) {
        router.push('/')
      }
    }

    checkAdmin()
  }, [router])

  if (authorized === null) return null // or a spinner/skeleton if you prefer

  // Important: nested layouts should not render <html>/<body>. Use a fragment instead
  return <>{children}</>
}
