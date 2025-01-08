'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import CountrySelector from '@/utils/countrySelector'
import KYCForm from '../components/kycForm'

const Page= ()=> {
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authMode, setAuthMode] = useState('mobile')
  const [position, SetPosition]= useState(null)
  
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

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle login logic here
    const loginData = {
      password,
      ...(authMode === 'mobile' ? { phoneNumber: `${selectedCountry.code}${phoneNumber}` } : { email })
    };
    
    
    console.log('Submitting login data:', loginData);
    
  }

  console.log(position)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Log in</h1>
        <p className="text-gray-600 mb-6">Enter your {authMode === 'mobile' ? 'phone number' : 'email'}.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor={authMode === 'mobile' ? "phone" : "email"} className="block text-sm font-medium text-gray-700 mb-2">
              {authMode === 'mobile' ? 'Mobile number' : 'Email'}
            </label>
            <div className="flex items-center relative border border-gray-300 rounded-lg focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600">
              {authMode === 'mobile' && selectedCountry && (
                // <div className={`max-w-[80%] top-0 rounded-lg  scrollbar-hide max-h-64 ${position ? 'absolute' : 'relative'} overflow-y-scroll right-0 left-0`}>
                  <CountrySelector 
                    selectedCountry={selectedCountry} 
                    onSelect={setSelectedCountry} 
                    Onposition = {SetPosition}
                  />
                // </div>
              )}
              {authMode === 'mobile' ? (
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="ml-2 flex-1 border-0 p-3 focus:ring-0 focus:outline-none"
                  placeholder="Enter phone number"
                />
              ) : (
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ml-2 flex-1 border-0 focus:ring-0 focus:outline-none"
                  placeholder="Enter email"
                />
              )}
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setAuthMode(authMode === 'mobile' ? 'email' : 'mobile')}
              className="flex-1 bg-gray-200 text-gray-600 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              {authMode === 'mobile' ? 'Use email' : 'Use mobile'}
            </button>
            <button
              type="submit"
              className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Page