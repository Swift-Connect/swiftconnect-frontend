'use client'
import React, { createContext, useContext, useEffect } from 'react'
import { useUser } from '../hooks/useUser'

const UserContext = createContext()

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const userData = useUser()

  // Set up periodic refresh of user data (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      if (userData.user) {
        userData.refreshUserData().catch(err => {
          console.warn('Periodic user data refresh failed:', err)
        })
      }
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [userData.user, userData.refreshUserData])

  return (
    <UserContext.Provider value={userData}>{children}</UserContext.Provider>
  )
}
