'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import CountrySelector from '../../../utils/countrySelector'
import Footer from '../components/Footer'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { fetchAndUpdateUserData } from '../../../utils/userUtils'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const SignupPage = () => {
  const [step, setStep] = useState(1)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [txnPin, setTxnPin] = useState(['', '', '', ''])
  const [confirmTxnPin, setConfirmTxnPin] = useState(['', '', '', ''])
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [canResendOtp, setCanResendOtp] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const [isStep1Valid, setIsStep1Valid] = useState(false)
  const [isStep2Valid, setIsStep2Valid] = useState(false)
  const [isStep3Valid, setIsStep3Valid] = useState(false)
  const [isTxnPinValid, setIsTxnPinValid] = useState(false)
  const [isLoadingStep1, setIsLoadingStep1] = useState(false)
  const [isLoadingStep2, setIsLoadingStep2] = useState(false)
  const [isLoadingStep3, setIsLoadingStep3] = useState(false)
  const [isLoadingPin, setIsLoadingPin] = useState(false)

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

  useEffect(() => {
    let timer
    if (!canResendOtp && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    } else if (countdown === 0) {
      setCanResendOtp(true)
    }
    return () => clearInterval(timer)
  }, [canResendOtp, countdown])

  const validateStep1 = () => {
    setIsStep1Valid(true)
    const newErrors = {}
    console.log('errororrs', newErrors)
    if (!email && !phoneNumber) {
      newErrors.contact = 'Email or Phone number is required'
    }
    if (phoneNumber && !/^\d+$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be numeric'
    }
    setErrors(newErrors)
    const isValid = Object.keys(newErrors).length === 0
    setIsStep1Valid(isValid)
    return isValid
  }

  const handleStep1Submit = async e => {
    e.preventDefault()
    if (!validateStep1()) return

    setIsLoadingStep1(true)
    const loadingToast = toast.loading('Sending OTP...')

    const signupData = {
      email,
      phone_number: `${phoneNumber ? selectedCountry.code + phoneNumber : ''}`
    }

    try {
      const response = await fetch(
        `${
          BASE_URL
            ? `${BASE_URL}/users/get-otp/`
            : 'https://swiftconnect-backend.onrender.com/users/get-otp/'
        }`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(signupData)
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        const fieldErrors = errorData.errors || {}
        setErrors(fieldErrors)
        toast.update(loadingToast, {
          render: fieldErrors.contact || 'Failed to send OTP',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })
        throw new Error('Failed to send OTP')
      }

      toast.update(loadingToast, {
        render: 'OTP sent successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })
      setStep(2)
      setCanResendOtp(false)
      setCountdown(30)
    } catch (error) {
      console.error('Error during signup:', error)
      toast.error('An error occurred during signup. Please try again.')
    } finally {
      setIsLoadingStep1(false)
    }
  }

  const validateStep2 = () => {
    const newErrors = {}
    if (!otp) {
      newErrors.otp = 'OTP is required'
    }
    setErrors(newErrors)
    const isValid = Object.keys(newErrors).length === 0
    setIsStep2Valid(isValid)
    return isValid
  }

  const handleStep2Submit = async e => {
    e.preventDefault()
    if (!validateStep2()) return

    setIsLoadingStep2(true)
    const loadingToast = toast.loading('Verifying OTP...')

    const otpData = {
      email: email || `${selectedCountry.code}${phoneNumber}`,
      otp
    }

    try {
      const response = await fetch(
        BASE_URL
          ? `${BASE_URL}/users/verify-otp/`
          : 'https://swiftconnect-backend.onrender.com/users/verify-otp/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(otpData)
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        const fieldErrors = errorData.error || {}
        setErrors(fieldErrors)
        toast.update(loadingToast, {
          render: fieldErrors || 'OTP verification failed',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })
        throw new Error('OTP verification failed')
      }

      const userData = await response.json()
      localStorage.setItem('user', JSON.stringify(userData.user))
      toast.update(loadingToast, {
        render: 'OTP verified successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })
      setStep(3)
    } catch (error) {
      console.error('Error during OTP verification:', error)
      toast.error(
        'An error occurred during OTP verification. Please try again.'
      )
    } finally {
      setIsLoadingStep2(false)
    }
  }

  const resendOtp = async () => {
    if (!canResendOtp) return

    const signupData = {
      email,
      phone_number: `${selectedCountry.code}${phoneNumber}`,
      referral_code: referralCode
    }

    try {
      const response = await fetch(
        `${
          BASE_URL
            ? `${BASE_URL}/users/get-otp/`
            : ' https://swiftconnect-backend.onrender.com/users/get-otp/'
        }`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(signupData)
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        const fieldErrors = errorData.errors || {}
        setErrors(fieldErrors)
        toast.error(fieldErrors.contact || 'Failed to resend OTP')
        throw new Error('Failed to resend OTP')
      }

      toast.success('OTP resent successfully!')
      setCanResendOtp(false)
      setCountdown(30) // Reset countdown
    } catch (error) {
      console.error('Error during OTP resend:', error)
      toast.error('An error occurred while resending OTP. Please try again.')
    }
  }

  const validateStep3 = () => {
    const newErrors = {}
    if (!username) {
      newErrors.username = 'Username is required'
    }
    if (!password) {
      newErrors.password = 'Password is required'
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    const isValid = Object.keys(newErrors).length === 0
    setIsStep3Valid(isValid)
    return isValid
  }

  const handleStep3Submit = async e => {
    e.preventDefault()
    if (!validateStep3()) return

    setIsLoadingStep3(true)
    const loadingToast = toast.loading('Setting up your profile...')

    const user = JSON.parse(localStorage.getItem('user'))
    const user_id = user?.id

    const completeProfileData = {
      username,
      password,
      email: user?.email,
      referral_code: referralCode
    }

    try {
      const response = await fetch(
        `https://swiftconnect-backend.onrender.com/users/complete-profile/${user_id}/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(completeProfileData)
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        const fieldErrors = errorData.errors || {}
        setErrors(fieldErrors)
        toast.update(loadingToast, {
          render: fieldErrors.username || 'Profile completion failed',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })
        throw new Error('Profile completion failed')
      }

      const data = await response.json()
      localStorage.setItem('access_token', data.access_token)

      // Fetch fresh user data from server
      try {
        const userData = await fetchAndUpdateUserData()
        console.log('Fresh user data fetched after signup:', userData)
      } catch (userError) {
        console.error('Error fetching fresh user data:', userError)
      }

      toast.update(loadingToast, {
        render: 'Profile completed successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })
      setStep(4)
    } catch (error) {
      console.error('Error during profile completion:', error)
      toast.error(
        'An error occurred during profile completion. Please try again.'
      )
    } finally {
      setIsLoadingStep3(false)
    }
  }

  const handlePinChange = (index, value, isConfirm = false) => {
    const newPin = isConfirm ? [...confirmTxnPin] : [...txnPin]

    // Handle pasting
    if (value.length > 1) {
      const digits = value.slice(0, 4).split('')
      for (let i = 0; i < 4; i++) {
        newPin[i] = digits[i] || ''
      }
      if (!isConfirm) setTxnPin(newPin)
      else setConfirmTxnPin(newPin)
      return
    }

    newPin[index] = value.slice(-1) // Only keep the last character (digit)
    if (!isConfirm) {
      setTxnPin(newPin)
      // Move to the next input if the current one is filled
      if (value && index < 3) {
        document.getElementById(`pin-input-${index + 1}`).focus() // Move to next input
      } else if (value && index === 3) {
        // If the last digit is filled, move to the first confirm PIN input
        document.getElementById(`confirm-pin-input-0`).focus()
      }
    } else {
      setConfirmTxnPin(newPin)
      // Move to the next input if the current one is filled
      if (value && index < 3) {
        document.getElementById(`confirm-pin-input-${index + 1}`).focus()
      } else if (!value && index > 0) {
        document.getElementById(`confirm-pin-input-${index - 1}`).focus()
      }
    }
  }

  useEffect(() => {
    if (confirmTxnPin.length == 4) {
      validateTxnPins(txnPin, true)
    } else {
      return
    }
  }, [confirmTxnPin, txnPin])

  useEffect(() => {
    validateStep1()
  }, [email, phoneNumber])

  useEffect(() => {
    validateStep2()
  }, [otp])

  useEffect(() => {
    validateStep3()
  }, [username, password, confirmPassword])

  const validateTxnPins = (currentPin, isConfirm) => {
    const pin = isConfirm ? confirmTxnPin : txnPin
    const isValid =
      currentPin.every(digit => digit !== '') &&
      txnPin.join('') === confirmTxnPin.join('')
    setIsTxnPinValid(isValid)

    if (!isValid && txnPin.join('') !== confirmTxnPin.join('')) {
      setErrors({ txnPin: 'Transaction PINs do not match' })
    } else {
      setErrors({})
    }
  }

  const handleTxnPinSubmit = async e => {
    e.preventDefault()

    setIsLoadingPin(true)
    const loadingToast = toast.loading('Creating your PIN...')

    const pinString = txnPin.join('')

    try {
      const response = await fetch(
        `${
          BASE_URL
            ? `${BASE_URL}/users/create-transaction-pin/`
            : 'https://swiftconnect-backend.onrender.com/users/create-transaction-pin/'
        }`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          },
          body: JSON.stringify({ pin: pinString })
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        toast.update(loadingToast, {
          render: errorData.error || 'Failed to create transaction PIN',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })
        throw new Error('Failed to create transaction PIN')
      }

      toast.update(loadingToast, {
        render: 'Transaction PIN created successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })
      window.location.href = '/account/login'
    } catch (error) {
      console.error('Error during transaction PIN creation:', error)
      toast.error(
        'An error occurred while creating the transaction PIN. Please try again.'
      )
    } finally {
      setIsLoadingPin(false)
    }
  }

  return (
    <div className='flex min-h-[80vh] flex-col items-center justify-center align-baseline bg-white gap-16 px-4'>
      <ToastContainer />
      <div className='w-full max-w-md bg-white rounded-2xl p-8 shadow-sm border border-gray-100'>
        {step === 1 && (
          <>
            <h1 className='text-2xl font-semibold text-gray-900 mb-2'>
              Sign Up
            </h1>
            <p className='text-gray-600 mb-6'>
              Input your details to Register.
            </p>
            <form onSubmit={handleStep1Submit} className='space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Email Address
                </label>
                <input
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={`w-full border border-gray-300 rounded-lg p-3 focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none ${
                    errors.contact ? 'border-red-500' : ''
                  }`}
                  placeholder='Input your email address'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Mobile number
                </label>
                <div
                  className={`flex items-center relative border p-1 rounded-lg focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600 ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {selectedCountry && (
                    <div className='flex h-full'>
                      <CountrySelector
                        selectedCountry={selectedCountry}
                        onSelect={setSelectedCountry}
                      />
                    </div>
                  )}
                  <input
                    type='tel'
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className={`flex border-0 p-3 focus:ring-0 rounded-xl focus:outline-none w-full ${
                      errors.phoneNumber ? 'border-red-500' : ''
                    }`}
                    placeholder='Enter phone number'
                  />
                </div>
                {errors.phoneNumber && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Referral Code (Optional)
                </label>
                <input
                  type='text'
                  value={referralCode}
                  onChange={e => setReferralCode(e.target.value)}
                  className='w-full border border-gray-300 rounded-lg p-3 focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none'
                  placeholder='Enter Referral Code'
                />
              </div>
              <div className='flex gap-4'>
                <button
                  type='submit'
                  disabled={!isStep1Valid || isLoadingStep1}
                  className={`flex-1 bg-[#0E1318] text-[#FAFAFA] py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors ${
                    !isStep1Valid || isLoadingStep1
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {isLoadingStep1 ? 'Sending OTP...' : 'Continue'}
                </button>
              </div>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className='text-2xl font-semibold text-gray-900 mb-2'>
              Enter OTP
            </h1>
            <p className='text-black font-bold mb-6'>
              Enter the 6-digit code sent to{' '}
              <span className='text-[#9CA3AF] '></span>{' '}
              {email || `+${selectedCountry.code}${phoneNumber}`}
            </p>
            <p
              className='text-[#00613A] cursor-pointer'
              onClick={() => setStep(1)}
            >
              Wrong {email ? 'email' : 'phoneNumber'}?{' '}
            </p>
            <form onSubmit={handleStep2Submit} className='space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Input Code
                </label>
                <input
                  type='text'
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className={`w-full border border-gray-300 rounded-lg p-3 focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none ${
                    errors.otp ? 'border-red-500' : ''
                  }`}
                  placeholder='Input your code'
                />
                {errors.otp && (
                  <p className='text-red-500 text-sm mt-1'>{errors.otp}</p>
                )}
                <p className=''>
                  Didn't get OTP?{' '}
                  <span
                    className='text-[#00613A]'
                    onClick={resendOtp}
                    style={{ cursor: canResendOtp ? 'pointer' : 'not-allowed' }}
                  >
                    {canResendOtp ? 'Resend' : `Resend in ${countdown}s`}
                  </span>
                </p>
              </div>
              <div className='flex gap-4'>
                <button
                  type='submit'
                  disabled={!isStep2Valid || isLoadingStep2}
                  className={`flex-1 bg-[#0E1318] text-[#FAFAFA] py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors ${
                    !isStep2Valid || isLoadingStep2
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {isLoadingStep2 ? 'Verifying...' : 'Continue'}
                </button>
              </div>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className='text-2xl font-semibold text-gray-900 mb-2'>
              Setup Password
            </h1>
            <form onSubmit={handleStep3Submit} className='space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Username
                </label>
                <input
                  type='text'
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className={`w-full border border-gray-300 rounded-lg p-3 focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none ${
                    errors.username ? 'border-red-500' : ''
                  }`}
                  placeholder='Input your Username'
                />
                {errors.username && (
                  <p className='text-red-500 text-sm mt-1'>{errors.username}</p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Password
                </label>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={`w-full border border-gray-300 rounded-lg p-3 focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-3'
                  >
                    {showPassword ? (
                      <FaEyeSlash className='h-5 w-5 text-gray-500' />
                    ) : (
                      <FaEye className='h-5 w-5 text-gray-500' />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className='text-red-500 text-sm'>{errors.password}</p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Confirm Password
                </label>
                <div className='relative'>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className={`w-full border border-gray-300 rounded-lg p-3 focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none ${
                      errors.confirmPassword ? 'border-red-500' : ''
                    }`}
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute right-3 top-3'
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className='h-5 w-5 text-gray-500' />
                    ) : (
                      <FaEye className='h-5 w-5 text-gray-500' />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className='text-red-500 text-sm'>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              <div className='flex gap-4'>
                <button
                  type='submit'
                  disabled={!isStep3Valid || isLoadingStep3}
                  className={`flex-1 bg-[#0E1318] text-[#FAFAFA] py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors ${
                    !isStep3Valid || isLoadingStep3
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {isLoadingStep3 ? 'Setting up...' : 'Continue'}
                </button>
              </div>
            </form>
          </>
        )}

        {step === 4 && (
          <div className='items-center justify-center flex flex-col'>
            <h1 className='text-2xl font-semibold text-gray-900 mb-4'>
              Create PIN
            </h1>
            <Image
              src={'/lockicon.svg'}
              height={30}
              width={50}
              alt='lockicon'
            />
            <p className='text-[#9CA3AF] mb-6 text-center justify-center m-auto'>
              Your PIN adds extra security to your Swift Connect account.
            </p>
            <form
              onSubmit={handleTxnPinSubmit}
              className='space-y-6 w-full max-w-sm'
            >
              <div className='flex justify-between flex-col items-center text-center gap-4'>
                <p className='text-sm font-[400] text-[#525252] '>
                  Create your PIN
                </p>
                <div className='flex gap-8 items-center justify-center'>
                  {txnPin.map((digit, index) => (
                    <input
                      key={index}
                      id={`pin-input-${index}`}
                      type='password'
                      value={digit}
                      onChange={e => handlePinChange(index, e.target.value)}
                      className='w-12 h-12 border border-[#9CA3AF] rounded-lg text-center text-2xl focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none'
                      maxLength={1}
                      inputMode='numeric'
                      pattern='[0-9]*'
                    />
                  ))}
                </div>
              </div>
              <div className='flex justify-between flex-col items-center text-center gap-4'>
                <label className='text-sm font-[400] text-[#525252] '>
                  Confirm your PIN
                </label>
                <div className='flex gap-8 items-center justify-center'>
                  {confirmTxnPin.map((digit, index) => (
                    <input
                      key={index}
                      id={`confirm-pin-input-${index}`}
                      type='password'
                      value={digit}
                      onChange={e =>
                        handlePinChange(index, e.target.value, true)
                      }
                      className='w-12 h-12 border border-[#9CA3AF] rounded-lg text-center text-2xl focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none'
                      maxLength={1}
                      inputMode='numeric'
                      pattern='[0-9]*'
                    />
                  ))}
                </div>
              </div>
              {errors.txnPin && (
                <p className='text-red-500 text-center'>{errors.txnPin}</p>
              )}
              <div className='flex pt-8'>
                <button
                  type='submit'
                  disabled={!isTxnPinValid || isLoadingPin}
                  className={`flex-1 bg-[#0E1318] text-[#FAFAFA] py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors ${
                    !isTxnPinValid || isLoadingPin
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {isLoadingPin ? 'Creating PIN...' : 'Create PIN'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default SignupPage
