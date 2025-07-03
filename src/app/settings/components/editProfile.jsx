'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getUserProfile, updateUserProfile } from '../../../api/index.js'
import CountrySelector from '../../../utils/countrySelector'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

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
    setLoading(true)
    setSuccess('')
    setError('')
    try {
      const payload = {}
      if (profile.name !== (user?.fullname || '')) payload.fullname = profile.name
      if (profile.username !== (user?.username || '')) payload.username = profile.username
      if (profile.email !== (user?.email || '')) payload.email = profile.email
      const formattedPhone = formatPhoneNumberForBackend(profile.phoneNumber, selectedCountry.code)
      if (formattedPhone !== (user?.phone_number || '')) {
        payload.phone_number = formattedPhone
      }
      await updateUserProfile(payload)
      setSuccess('Profile updated successfully!')
      setIsChanged(false)
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
                Your Name
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
                User Name
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
              <label className='block text-sm font-semibold text-gray-700'>
                Email
              </label>
              <input
                type='email'
                value={profile.email}
                onChange={handleInputChange('email')}
                className='mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-black focus:ring-black text-base'
              />
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700'>
                Phone Number
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
            </div>
          </div>
        </div>
      </div>
      <div className='mt-8 flex justify-end'>
        <button
          onClick={handleSave}
          className={`bg-black text-white px-4 py-2 rounded-lg shadow text-base font-semibold ${
            !isChanged || loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={!isChanged || loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
      {success && (
        <div className='text-green-600 text-base mt-4'>{success}</div>
      )}
      {error && <div className='text-red-600 text-base mt-4'>{error}</div>}
    </>
  )
}