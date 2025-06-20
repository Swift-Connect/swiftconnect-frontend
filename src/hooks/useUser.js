import { useState, useEffect, useCallback } from 'react'
import {
  fetchAndUpdateUserData,
  getUserFromStorage,
  updateUserInStorage,
  clearUserFromStorage
} from '../utils/userUtils'

/**
 * Custom hook to manage user data throughout the application
 * @returns {Object} User state and functions
 */
export const useUser = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch user data from server and update localStorage
  const refreshUserData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const userData = await fetchAndUpdateUserData()
      setUser(userData)
      return userData
    } catch (err) {
      setError(err.message || 'Failed to fetch user data')
      console.error('Error refreshing user data:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Get user data from localStorage
  const loadUserFromStorage = useCallback(() => {
    try {
      const userData = getUserFromStorage()
      setUser(userData)
      return userData
    } catch (err) {
      console.error('Error loading user from storage:', err)
      return null
    }
  }, [])

  // Update user data in localStorage
  const updateUser = useCallback(userData => {
    updateUserInStorage(userData)
    setUser(userData)
  }, [])

  // Clear user data
  const clearUser = useCallback(() => {
    clearUserFromStorage()
    setUser(null)
    setError(null)
  }, [])

  // Initialize user data on mount
  useEffect(() => {
    const initializeUser = async () => {
      try {
        setLoading(true)

        // First try to get from localStorage
        const storedUser = loadUserFromStorage()

        if (storedUser) {
          setUser(storedUser)

          // Then try to fetch fresh data from server
          try {
            await refreshUserData()
          } catch (err) {
            // If server fetch fails, keep the stored data
            console.warn('Failed to fetch fresh user data, using stored data')
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to initialize user data')
      } finally {
        setLoading(false)
      }
    }

    initializeUser()
  }, [loadUserFromStorage, refreshUserData])

  return {
    user,
    loading,
    error,
    refreshUserData,
    updateUser,
    clearUser,
    loadUserFromStorage
  }
}
