'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getUserProfile, updateUserProfile } from '../../../api/index.js'
import CountrySelector from '../../../utils/countrySelector'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { AlertTriangle, Lock } from 'lucide-react'

export default function EditProfile({ user }) {
  // Parse initial phone number
  function parsePhoneNumber(fullNumber) {
    if (!fullNumber) return { code: '+234', number: '', country: 'NG' }
    const parsed = parsePhoneNumberFromString(fullNumber)
    if (parsed && parsed.isValid()) {
      return {
        code: parsed.countryCallingCode ? `+${parsed.countryCallingCode}` : '+234',
        number: parsed.nationalNumber || '',
        country: parsed.country || 'NG'
      }
    }
    return { code: '+234', number: fullNumber.replace(/^\+?\d+/, ''), country: 'NG' }
  }

  const initial = parsePhoneNumber(user?.phone_number || '')
  const [selectedCountry, setSelectedCountry] = useState({
    name: 'Nigeria',
    code: initial.code,
    flag: 'https://flagcdn.com/ng.svg',
    countryCode: initial.country
  })
  const [profile, setProfile] = useState({
    name: user?.fullname || '',
    username: user?.username || '',
    email: user?.email || '',
    phoneNumber: initial.number
  })
  const [isChanged, setIsChanged] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [showEmailWarning, setShowEmailWarning] = useState(false)
  const [showPhoneWarning, setShowPhoneWarning] = useState(false)
  const [emailVerificationCode, setEmailVerificationCode] = useState('')
  const [phoneVerificationCode, setPhoneVerificationCode] = useState('')
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [showPhoneVerification, setShowPhoneVerification] = useState(false)

  useEffect(() => {
    if (!user) {
      getUserProfile().then(data => {
        const parsed = parsePhoneNumber(data.phone_number)
        setProfile({
          name: data.fullname || '',
          username: data.username || '',
          email: data.email || '',
          phoneNumber: parsed.number
        })
        setSelectedCountry({
          name: parsed.country === 'NG' ? 'Nigeria' : parsed.country,
          code: parsed.code,
          flag: `https://flagcdn.com/${parsed.country.toLowerCase()}.svg`,
          countryCode: parsed.country
        })
      })
    }
  }, [user])

  // Handle input change
  const handleInputChange = field => e => {
    const newValue = e.target.value
    
    // Security check for email and phone changes
    if (field === 'email' && newValue !== (user?.email || '')) {
      setShowEmailWarning(true)
      setShowEmailVerification(true)
    } else if (field === 'phoneNumber' && newValue !== initial.number) {
      setShowPhoneWarning(true)
      setShowPhoneVerification(true)
    }
    
    setProfile(prev => {
      const updatedProfile = { ...prev, [field]: newValue }
      const hasChanges =
        Object.keys(updatedProfile).some(
          key =>
            updatedProfile[key] !==
            (user ? (key === 'phoneNumber' ? initial.number : user[key]) : '')
        ) || selectedCountry.code !== initial.code
      setIsChanged(hasChanges)
      return updatedProfile
    })
    setSuccess('')
    setError('')
    if (field === 'phoneNumber') setPhoneError('')
  }

  // Validate phone number
  function validatePhoneNumber() {
    if (!profile.phoneNumber) {
      setPhoneError('Phone number is required.')
      return false
    }
    const fullNumber = `${selectedCountry.code}${profile.phoneNumber}`
    const parsed = parsePhoneNumberFromString(fullNumber, selectedCountry.countryCode)
    if (!parsed || !parsed.isValid()) {
      setPhoneError('Please enter a valid phone number for the selected country.')
      return false
    }
    setPhoneError('')
    return true
  }

  // Format phone number for backend
  function formatPhoneNumberForBackend(raw, code) {
    const fullNumber = `${code}${raw.trim()}`
    const parsed = parsePhoneNumberFromString(fullNumber, selectedCountry.countryCode)
    return parsed && parsed.isValid() ? parsed.formatInternational() : fullNumber
  }

  // Handle country selection
  const handleCountrySelect = country => {
    setSelectedCountry(country)
    setIsChanged(true)
    setPhoneError('')
    // Re-validate phone number when country changes
    if (profile.phoneNumber) {
      validatePhoneNumber()
    }
  }

  // Handle save button
  const handleSave = async () => {
    if (!validatePhoneNumber()) return
    
    // Check if email or phone verification is required
    if (showEmailVerification && !emailVerificationCode) {
      setError('Please enter email verification code.')
      return
    }
    if (showPhoneVerification && !phoneVerificationCode) {
      setError('Please enter phone verification code.')
      return
    }
    
    setLoading(true)
    setSuccess('')
    setError('')
    try {
      const payload = {}
      if (profile.name !== (user?.fullname || '')) payload.fullname = profile.name
      if (profile.username !== (user?.username || '')) payload.username = profile.username
      
      // Only allow email change if verified
      if (profile.email !== (user?.email || '')) {
        if (emailVerificationCode) {
          payload.email = profile.email
          payload.email_verification_code = emailVerificationCode
        } else {
          setError('Email verification required for email changes.')
          setLoading(false)
          return
        }
      }
      
      const formattedPhone = formatPhoneNumberForBackend(profile.phoneNumber, selectedCountry.code)
      if (formattedPhone !== (user?.phone_number || '')) {
        if (phoneVerificationCode) {
          payload.phone_number = formattedPhone
          payload.phone_verification_code = phoneVerificationCode
        } else {
          setError('Phone verification required for phone number changes.')
          setLoading(false)
          return
        }
      }
      
      await updateUserProfile(payload)
      setSuccess('Profile updated successfully!')
      setIsChanged(false)
      setShowEmailWarning(false)
      setShowPhoneWarning(false)
      setShowEmailVerification(false)
      setShowPhoneVerification(false)
      setEmailVerificationCode('')
      setPhoneVerificationCode('')
    } catch (err) {
      setError('Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className='mt-4 flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0'>
        <div className='relative w-[6em] h-[6em] mx-auto md:mx-0'>
          <Image
            src='https://plus.unsplash.com/premium_photo-1689977927774-401b12d137d6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8fA%3D%3D'
            alt='Profile'
            width={96}
            height={96}
            className='rounded-full w-[6em] h-[6em] object-cover border border-gray-300'
          />
        </div>
        <div className='flex flex-col w-full space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='block text-sm font-semibold text-gray-700'>
                Full Name
              </label>
              <input
                type='text'
                value={profile.name}
                onChange={handleInputChange('name')}
                className='mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-black focus:ring-black text-base'
              />
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700'>
                Username
              </label>
              <input
                type='text'
                value={profile.username}
                onChange={handleInputChange('username')}
                className='mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-black focus:ring-black text-base'
              />
            </div>
          </div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 flex items-center gap-2'>
                Email
                <Lock className="w-4 h-4 text-gray-500" />
              </label>
              <input
                type='email'
                value={profile.email}
                onChange={handleInputChange('email')}
                className='mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-black focus:ring-black text-base'
              />
              {showEmailWarning && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-yellow-800 font-medium">Security Notice</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Changing your email requires verification. A verification code will be sent to your new email address.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {showEmailVerification && (
                <div className="mt-2">
                  <label className='block text-sm font-semibold text-gray-700'>
                    Email Verification Code
                  </label>
                  <input
                    type='text'
                    value={emailVerificationCode}
                    onChange={(e) => setEmailVerificationCode(e.target.value)}
                    placeholder="Enter verification code"
                    className='mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-black focus:ring-black text-base'
                  />
                </div>
              )}
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700 flex items-center gap-2'>
                Phone Number
                <Lock className="w-4 h-4 text-gray-500" />
              </label>
              <div
                className={`mt-2 flex w-full py-1 border rounded-lg shadow-sm text-base ${
                  phoneError ? 'border-red-500' : 'border-gray-300'
                } focus:border-black focus:ring-black`}
              >
                <div className='w-36'>
                  <CountrySelector
                    selectedCountry={selectedCountry}
                    onSelect={handleCountrySelect}
                  />
                </div>
                <input
                  type='text'
                  value={profile.phoneNumber}
                  onChange={handleInputChange('phoneNumber')}
                  className='border-none outline-none focus:border-none focus:ring-0 active:border-none bg-transparent flex-1'
                  placeholder='Enter phone number'
                />
              </div>
              {phoneError && (
                <div className='text-red-500 text-sm mt-1'>{phoneError}</div>
              )}
              {showPhoneWarning && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-yellow-800 font-medium">Security Notice</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Changing your phone number requires verification. A verification code will be sent to your new phone number.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {showPhoneVerification && (
                <div className="mt-2">
                  <label className='block text-sm font-semibold text-gray-700'>
                    Phone Verification Code
                  </label>
                  <input
                    type='text'
                    value={phoneVerificationCode}
                    onChange={(e) => setPhoneVerificationCode(e.target.value)}
                    placeholder="Enter verification code"
                    className='mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-black focus:ring-black text-base'
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='mt-8 flex justify-end'>
        <button
          onClick={handleSave}
          disabled={!isChanged || loading}
          className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
            isChanged && !loading
              ? 'bg-[#00613A] hover:bg-[#004d2e]'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      {success && (
        <div className='mt-4 p-4 bg-green-100 border border-green-400 text-green-800 rounded-lg'>
          {success}
        </div>
      )}
      {error && (
        <div className='mt-4 p-4 bg-red-100 border border-red-400 text-red-800 rounded-lg'>
          {error}
        </div>
      )}
    </>
  )
}