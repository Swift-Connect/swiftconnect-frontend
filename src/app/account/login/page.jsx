'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import CountrySelector from '../../../utils/countrySelector'
import KYCForm from '../components/kycForm'
import Footer from '../components/Footer'
import { useRouter } from 'next/navigation'
import { fetchAndUpdateUserData } from '../../../utils/userUtils'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const Page = () => {
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authMode, setAuthMode] = useState('mobile')
  const [position, SetPosition] = useState(null)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState('')
  const [notificationType, setNotificationType] = useState('info') // 'info', 'success', 'error', 'warning', 'loading'

  const router = useRouter()
  const phoneInputRef = useRef(null)
  const emailInputRef = useRef(null)

  const isTokenExpired = token => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 < Date.now()
    } catch (error) {
      console.error('Error decoding token:', error)
      return true
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    if (token && !isTokenExpired(token)) {
      console.log('Token exists and is valid')

      router.push('/dashboard')
    } else {
      console.log('Token is missing or expired')
      localStorage.removeItem('access_token')
      router.push('/account/login')
    }
  }, [router])

  // Set default country (Nigeria) on component mount
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/alpha/ng?fields=name,flags,idd')
      .then(res => res.json())
      .then(data => {
        setSelectedCountry({
          name: data.name.common,
          code: data.idd.root + (data.idd.suffixes?.[0] || ''),
          flag: data.flags.svg
        })
      })
      .catch(error => console.error('Error fetching default country:', error))
  }, [])

  const handleAuthModeSwitch = () => {
    if (authMode === 'mobile') {
      setAuthMode('email')
      setPhoneNumber('')
      setErrors({})
      setNotification('')
      setNotificationType('info')
      setTimeout(() => {
        if (emailInputRef.current) emailInputRef.current.focus()
      }, 0)
    } else {
      setAuthMode('mobile')
      setEmail('')
      setErrors({})
      setNotification('')
      setNotificationType('info')
      setTimeout(() => {
        if (phoneInputRef.current) phoneInputRef.current.focus()
      }, 0)
    }
  }

  const validateInputs = () => {
    const newErrors = {}
    if (authMode === 'mobile') {
      if (!phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required'
      } else if (!/^\d+$/.test(phoneNumber)) {
        newErrors.phoneNumber = 'Phone number must be numeric'
      }
    } else {
      if (!email) {
        newErrors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Email is invalid'
      }
    }
    if (!password) {
      newErrors.password = 'Password is required'
    }
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      setNotification(Object.values(newErrors)[0])
      setNotificationType('warning')
    } else {
      setNotification('')
      setNotificationType('info')
    }
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validateInputs()) return
    setIsLoading(true)
    setNotification('Signing in...')
    setNotificationType('loading')
    let loginData = { password }
    if (authMode === 'mobile') {
      // Format phone number to E.164 using libphonenumber-js
      let formatted = phoneNumber
      if (selectedCountry && phoneNumber) {
        const parsed = parsePhoneNumberFromString(phoneNumber, selectedCountry?.countryCode || 'NG')
        if (parsed && parsed.isValid()) {
          formatted = parsed.number
        } else {
          // fallback: prepend country code and remove leading zero
          let num = phoneNumber.trim()
          if (num.startsWith('0') && num.length > 1) num = num.slice(1)
          formatted = `${selectedCountry.code}${num}`
        }
      }
      loginData.phone_number = formatted
    } else {
      loginData.email = email
    }
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/users/signin/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(loginData)
        }
      )
      const data = await response.json()
      if (!response.ok) {
        // Show both backend error and message if present
        let errorMessage = ''
        if (data.error && data.message) {
          errorMessage = `${data.error}`
        } else if (data.error) {
          errorMessage = data.error
        } else if (data.message) {
          errorMessage = data.message
        } else {
          errorMessage = 'Unknown error occurred'
        }
        setErrors({})
        setNotification(errorMessage)
        setNotificationType('error')
        throw new Error('Login failed')
      }
      localStorage.setItem('access_token', data.access_token)
      try {
        const userData = await fetchAndUpdateUserData()
      } catch (userError) {
        localStorage.setItem('user', JSON.stringify(data.user))
      }
      setNotification('Login successful! Redirecting...')
      setNotificationType('success')
      window.location.href = '/dashboard'
    } catch (error) {
      // Only set notification if not already set by error handler
      setNotification(prev => prev || 'Login failed. Please try again.')
      setNotificationType('error')
    } finally {
      setIsLoading(false)
    }
  }

  console.log(position)
  return (
    <div className='flex min-h-screen flex-col w-full items-center justify-center px-2 sm:px-4 bg-[#f8fafc]'>
      <div className='flex flex-col items-center w-fit gap-8 sm:gap-4 pt-12 sm:pt-0'>
        <Image
          src='/logo.svg'
          alt='Swift Connect'
          width={280}
          height={100}
          // className='w-32 h-12 sm:w-44 sm:h-16'
          
        />
        {notification && (
          <div
            className={`w-full mb-4 px-6 py-4 rounded text-center text-lg sm:text-sm
              ${notificationType === 'error' ? 'bg-red-100 border border-red-400 text-red-800' : ''}
              ${notificationType === 'success' ? 'bg-green-100 border border-green-400 text-green-800' : ''}
              ${notificationType === 'warning' ? 'bg-yellow-100 border border-yellow-400 text-yellow-800' : ''}
              ${notificationType === 'loading' ? 'bg-blue-100 border border-blue-400 text-blue-800' : ''}
            `}
          >
            {notification}
          </div>
        )}
        <div className='w-full bg-white rounded-3xl sm:rounded-2xl p-8 sm:p-8 shadow-lg sm:shadow-md border border-gray-100'>
          <h1 className='text-3xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-2 text-center'>Log in</h1>
          <p className='text-gray-600 mb-6 sm:mb-6 text-xl sm:text-base text-center'>
            Enter your {authMode === 'mobile' ? 'phone number' : 'email'}.
          </p>
          <form onSubmit={handleSubmit} className='space-y-8 sm:space-y-6'>
            <div>
              <label
                htmlFor={authMode === 'mobile' ? 'phone' : 'email'}
                className='block text-xl sm:text-sm font-medium text-gray-700 mb-3 sm:mb-2'
              >
                {authMode === 'mobile' ? 'Mobile number' : 'Email'}
              </label>
              <div
                className={`flex items-center relative border-2 sm:border p-2 sm:p-1 rounded-xl sm:rounded-lg focus-within:border-green-600 focus-within:ring-2 sm:focus-within:ring-1 focus-within:ring-green-600 ${
                  errors.phoneNumber || errors.email
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              >
                {authMode === 'mobile' && selectedCountry && (
                  <div className='flex h-full'>
                    <CountrySelector
                      selectedCountry={selectedCountry}
                      onSelect={setSelectedCountry}
                    />
                  </div>
                )}
                {authMode === 'mobile' ? (
                  <input
                    type='tel'
                    id='phone'
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    ref={phoneInputRef}
                    className={`flex border-0 p-4 sm:p-3 focus:ring-0 rounded-xl focus:outline-none w-full text-lg sm:text-base ${
                      errors.phoneNumber ? 'border-red-500' : ''
                    }`}
                    placeholder='Enter phone number'
                  />
                ) : (
                  <input
                    type='email'
                    id='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    ref={emailInputRef}
                    className={`flex-1 border-0 p-4 sm:p-3 focus:ring-0 rounded-xl focus:outline-none w-fit text-lg sm:text-base ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                    placeholder='Enter email'
                  />
                )}
              </div>
              {errors.phoneNumber && (
                <p className='text-red-500 text-xl sm:text-sm mt-3 sm:mt-1'>{errors.phoneNumber}</p>
              )}
              {errors.email && (
                <p className='text-red-500 text-xl sm:text-sm mt-3 sm:mt-1'>{errors.email}</p>
              )}
            </div>
            <div>
              <label
                htmlFor='password'
                className='block text-xl sm:text-sm font-medium text-gray-700 mb-3 sm:mb-2'
              >
                Password
              </label>
              <input
                type='password'
                id='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`w-full border-2 sm:border rounded-xl sm:rounded-lg p-4 sm:p-3 focus:border-green-600 focus:ring-2 sm:focus:ring-1 focus:ring-green-600 focus:outline-none text-lg sm:text-base ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && (
                <p className='text-red-500 text-xl sm:text-sm mt-3'>{errors.password}</p>
              )}
              <div className='mt-3 text-right'>
                <Link
                  href='/account/forgot-password'
                  className='text-green-700 hover:text-green-800 text-lg sm:text-sm font-medium'
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
            <div className='flex gap-4 sm:gap-4'>
              <button
                type='button'
                onClick={handleAuthModeSwitch}
                disabled={isLoading}
                className='flex-1 bg-[#0E131833] text-[#3d3d3d] py-4 sm:py-3 px-4 sm:px-4 rounded-xl sm:rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg sm:text-base font-medium'
              >
                {authMode === 'mobile' ? 'Use email' : 'Use mobile'}
              </button>
              <button
                type='submit'
                disabled={isLoading || Object.keys(errors).length > 0}
                className='flex-1 bg-[#0E1318] text-[#FAFAFA] py-4 sm:py-3 px-4 sm:px-4 rounded-xl sm:rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg sm:text-base font-medium'
              >
                {isLoading ? 'Loading...' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default Page
