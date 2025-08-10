'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Footer from '../components/Footer'
import { useRouter } from 'next/navigation'

const Page = () => {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState('')
  const [notificationType, setNotificationType] = useState('info')
  const [isSuccess, setIsSuccess] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      router.push('/dashboard')
    }
  }, [router])

  const validateInputs = () => {
    const newErrors = {}
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid'
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
    setNotification('Sending reset link...')
    setNotificationType('loading')

    try {
      const response = await fetch(
        `https://aesthetic-mandi-swiftconnect-a9332357.koyeb.app/users/request-password-reset/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        let errorMessage = ''
        if (data.error && data.message) {
          errorMessage = `${data.error}`
        } else if (data.error) {
          errorMessage = data.error
        } else if (data.message) {
          errorMessage = data.message
        } else {
          errorMessage = 'Failed to send reset link. Please try again.'
        }
        setErrors({})
        setNotification(errorMessage)
        setNotificationType('error')
        throw new Error('Password reset request failed')
      }

      setNotification('Password reset link sent! Check your email.')
      setNotificationType('success')
      setIsSuccess(true)
    } catch (error) {
      setNotification(prev => prev || 'Failed to send reset link. Please try again.')
      setNotificationType('error')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className='flex min-h-screen flex-col w-full items-center justify-center px-2 sm:px-4 bg-[#f8fafc]'>
        <div className='flex flex-col items-center w-fit gap-8 sm:gap-4 pt-12 sm:pt-0'>
          <Image
            src='/logo.svg'
            alt='Swift Connect'
            width={280}
            height={100}
          />
          <div className='w-full bg-white rounded-3xl sm:rounded-2xl p-8 sm:p-8 shadow-lg sm:shadow-md border border-gray-100'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-8 h-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
              </div>
              <h1 className='text-3xl sm:text-2xl font-bold text-gray-900 mb-4'>Check Your Email</h1>
              <p className='text-gray-600 mb-6 text-lg sm:text-base'>
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className='text-gray-500 mb-6 text-base sm:text-sm'>
                Click the link in your email to reset your password. The link will expire in 1 hour.
              </p>
              <div className='space-y-4'>
                <button
                  onClick={() => {
                    setIsSuccess(false)
                    setEmail('')
                    setNotification('')
                  }}
                  className='w-full bg-[#0E1318] text-[#FAFAFA] py-4 sm:py-3 px-4 sm:px-4 rounded-xl sm:rounded-lg hover:bg-gray-800 transition-colors text-lg sm:text-base font-medium'
                >
                  Send Another Link
                </button>
                <Link
                  href='/account/login'
                  className='block w-full bg-[#0E131833] text-[#3d3d3d] py-4 sm:py-3 px-4 sm:px-4 rounded-xl sm:rounded-lg hover:bg-gray-300 transition-colors text-lg sm:text-base font-medium text-center'
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen flex-col w-full items-center justify-center px-2 sm:px-4 bg-[#f8fafc]'>
      <div className='flex flex-col items-center w-fit gap-8 sm:gap-4 pt-12 sm:pt-0'>
        <Image
          src='/logo.svg'
          alt='Swift Connect'
          width={280}
          height={100}
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
          <h1 className='text-3xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-2 text-center'>Forgot Password</h1>
          <p className='text-gray-600 mb-6 sm:mb-6 text-xl sm:text-base text-center'>
            Enter your email address and we'll send you a link to reset your password.
          </p>
          <form onSubmit={handleSubmit} className='space-y-8 sm:space-y-6'>
            <div>
              <label
                htmlFor='email'
                className='block text-xl sm:text-sm font-medium text-gray-700 mb-3 sm:mb-2'
              >
                Email Address
              </label>
              <input
                type='email'
                id='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={`w-full border-2 sm:border rounded-xl sm:rounded-lg p-4 sm:p-3 focus:border-green-600 focus:ring-2 sm:focus:ring-1 focus:ring-green-600 focus:outline-none text-lg sm:text-base ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder='Enter your email address'
              />
              {errors.email && (
                <p className='text-red-500 text-xl sm:text-sm mt-3'>{errors.email}</p>
              )}
            </div>
            <div className='flex gap-4 sm:gap-4'>
              <Link
                href='/account/login'
                className='flex-1 bg-[#0E131833] text-[#3d3d3d] py-4 sm:py-3 px-4 sm:px-4 rounded-xl sm:rounded-lg hover:bg-gray-300 transition-colors text-lg sm:text-base font-medium text-center'
              >
                Back to Login
              </Link>
              <button
                type='submit'
                disabled={isLoading || Object.keys(errors).length > 0}
                className='flex-1 bg-[#0E1318] text-[#FAFAFA] py-4 sm:py-3 px-4 sm:px-4 rounded-xl sm:rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg sm:text-base font-medium'
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
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
