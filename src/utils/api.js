import axios from 'axios'

const api = axios.create({
  baseURL: 'https://aesthetic-mandi-swiftconnect-a9332357.koyeb.app/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${
      typeof window !== 'undefined' ? localStorage.getItem('access_token') : ''
    }`
  }
})

export const fetchWithAuth = async url => {
  try {
    const response = await api.get(url)
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw {
      message:
        error?.response?.data?.error || error?.message || 'Unknown error',
      status: error?.response?.status,
      raw: error
    }
  }
}

export const postWithAuth = async (url, data) => {
  try {
    const response = await api.post(url, data)
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    // Throw a custom error with message from backend if available
    throw {
      message:
        error?.response?.data?.error || error?.message || 'Unknown error',
      status: error?.response?.status,
      raw: error
    }
  }
}

export default api
