'use client'

import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Footer from '../components/Footer'
import { useRouter, useSearchParams } from 'next/navigation'

const ResetPasswordContent = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState('')
  const [notificationType, setNotificationType] = useState('info')
  const [isSuccess, setIsSuccess] = useState(false)
  const [token, setToken] = useState('')

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token')
    if (!tokenFromUrl) {
      setNotification('Invalid or missing reset token. Please request a new password reset.')
      setNotificationType('error')
    } else {
      setToken(tokenFromUrl)
    }
  }, [searchParams])

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      router.push('/dashboard')
    }
  }, [router])

  const validateInputs = () => {
    const newErrors = {}
    
    if (!password) {
      newErrors.password = 'Password is required'
    } 
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
    setNotification('Resetting password...')
    setNotificationType('loading')

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/users/reset-password/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            token: `${token}`,
            new_password: password 
          })
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
          errorMessage = 'Failed to reset password. Please try again.'
        }
        setErrors({})
        setNotification(errorMessage)
        setNotificationType('error')
        throw new Error('Password reset failed')
      }

      setNotification('Password reset successful!')
      setNotificationType('success')
      setIsSuccess(true)
    } catch (error) {
      setNotification(prev => prev || 'Failed to reset password. Please try again.')
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
              <h1 className='text-3xl sm:text-2xl font-bold text-gray-900 mb-4'>Password Reset Successful</h1>
              <p className='text-gray-600 mb-6 text-lg sm:text-base'>
                Your password has been successfully reset. You can now log in with your new password.
              </p>
              <Link
                href='/account/login'
                className='block w-full bg-[#0E1318] text-[#FAFAFA] py-4 sm:py-3 px-4 sm:px-4 rounded-xl sm:rounded-lg hover:bg-gray-800 transition-colors text-lg sm:text-base font-medium text-center'
              >
                Continue to Login
              </Link>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    )
  }

  if (!token) {
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
            <div className='w-full mb-4 px-6 py-4 rounded text-center text-lg sm:text-sm bg-red-100 border border-red-400 text-red-800'>
              {notification}
            </div>
          )}
          <div className='w-full bg-white rounded-3xl sm:rounded-2xl p-8 sm:p-8 shadow-lg sm:shadow-md border border-gray-100'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-8 h-8 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </div>
              <h1 className='text-3xl sm:text-2xl font-bold text-gray-900 mb-4'>Invalid Reset Link</h1>
              <p className='text-gray-600 mb-6 text-lg sm:text-base'>
                The password reset link is invalid or has expired. Please request a new password reset.
              </p>
              <Link
                href='/account/forgot-password'
                className='block w-full bg-[#0E1318] text-[#FAFAFA] py-4 sm:py-3 px-4 sm:px-4 rounded-xl sm:rounded-lg hover:bg-gray-800 transition-colors text-lg sm:text-base font-medium text-center'
              >
                Request New Reset Link
              </Link>
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
          <h1 className='text-3xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-2 text-center'>Reset Password</h1>
          <p className='text-gray-600 mb-6 sm:mb-6 text-xl sm:text-base text-center'>
            Enter your new password below.
          </p>
          <form onSubmit={handleSubmit} className='space-y-8 sm:space-y-6'>
            <div>
              <label
                htmlFor='password'
                className='block text-xl sm:text-sm font-medium text-gray-700 mb-3 sm:mb-2'
              >
                New Password
              </label>
              <input
                type='password'
                id='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`w-full border-2 sm:border rounded-xl sm:rounded-lg p-4 sm:p-3 focus:border-green-600 focus:ring-2 sm:focus:ring-1 focus:ring-green-600 focus:outline-none text-lg sm:text-base ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder='Enter your new password'
              />
              {errors.password && (
                <p className='text-red-500 text-xl sm:text-sm mt-3'>{errors.password}</p>
              )}
            </div>
            <div>
              <label
                htmlFor='confirmPassword'
                className='block text-xl sm:text-sm font-medium text-gray-700 mb-3 sm:mb-2'
              >
                Confirm New Password
              </label>
              <input
                type='password'
                id='confirmPassword'
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className={`w-full border-2 sm:border rounded-xl sm:rounded-lg p-4 sm:p-3 focus:border-green-600 focus:ring-2 sm:focus:ring-1 focus:ring-green-600 focus:outline-none text-lg sm:text-base ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder='Confirm your new password'
              />
              {errors.confirmPassword && (
                <p className='text-red-500 text-xl sm:text-sm mt-3'>{errors.confirmPassword}</p>
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
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  )
}

const Page = () => {
  return (
    <Suspense fallback={
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
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
              <p className='text-gray-600'>Loading...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}

export default Page
