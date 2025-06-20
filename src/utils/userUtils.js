import api from './api'

/**
 * Fetch current user data from the server and update localStorage
 * @returns {Promise<Object>} The updated user data
 */
export const fetchAndUpdateUserData = async () => {
  try {
    const response = await api.get('/users/me/')
    const userData = response.data

    // Update localStorage with fresh user data
    localStorage.setItem('user', JSON.stringify(userData))

    return userData
  } catch (error) {
    console.error('Error fetching user data:', error)
    throw error
  }
}

/**
 * Get user data from localStorage
 * @returns {Object|null} User data or null if not found
 */
export const getUserFromStorage = () => {
  if (typeof window === 'undefined') return null

  try {
    const userData = localStorage.getItem('user')
    return userData ? JSON.parse(userData) : null
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error)
    return null
  }
}

/**
 * Update user data in localStorage
 * @param {Object} userData - The user data to store
 */
export const updateUserInStorage = userData => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem('user', JSON.stringify(userData))
  } catch (error) {
    console.error('Error updating user data in localStorage:', error)
  }
}

/**
 * Clear user data from localStorage
 */
export const clearUserFromStorage = () => {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
  } catch (error) {
    console.error('Error clearing user data from localStorage:', error)
  }
}

/**
 * Check if user's KYC is approved
 * @param {Object} user - User object
 * @returns {boolean} True if KYC is approved, false otherwise
 */
export const isKycApproved = user => {
  return user?.kyc?.approved === true
}

/**
 * Get KYC status as a string
 * @param {Object} user - User object
 * @returns {string} KYC status string
 */
export const getKycStatus = user => {
  if (!user?.kyc) return 'Not Submitted'
  return user.kyc.approved ? 'Approved' : 'Pending'
}
