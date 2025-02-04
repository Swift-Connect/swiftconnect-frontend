'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import CountrySelector from '../../../utils/countrySelector'
import KYCForm from '../components/kycForm'
import Footer from '../components/Footer'
import { toast, ToastContainer } from 'react-toastify'

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
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateInputs()) return

    const loginData = {
      [authMode === 'mobile' ? 'phone_number' : 'email']: authMode === 'mobile' ? `${selectedCountry.code}${phoneNumber}` : email,
      password,
    };

    // Set loading state and show loading toast
    setIsLoading(true)
    const loadingToast = toast.loading('Logging in...')

    try {
      const response = await fetch(`https://swiftconnect-backend.onrender.com/users/signin/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData)
        const errorMessage = errorData.error || 'Unknown error occurred';
        setErrors({});
        // Update loading toast to error
        toast.update(loadingToast, {
          render: 'Login failed: ' + errorMessage,
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);
      
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('access_token', data.access_token);
      // Update loading toast to success
      toast.update(loadingToast, {
        render: 'Login successful!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      window.location.href='/dashboard'
      
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setIsLoading(false)
    }
  }

  console.log(position)
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center align-baseline bg-white gap-16 px-4">
      <ToastContainer />
      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Log in</h1>
        <p className="text-gray-600 mb-6">Enter your {authMode === 'mobile' ? 'phone number' : 'email'}.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor={authMode === 'mobile' ? "phone" : "email"} className="block text-sm font-medium text-gray-700 mb-2">
              {authMode === 'mobile' ? 'Mobile number' : 'Email'}
            </label>

            <div className={`flex items-center relative border p-1  rounded-lg focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600 ${errors.phoneNumber || errors.email ? 'border-red-500': 'border-gray-300'}`}>
              {authMode === 'mobile' && selectedCountry && (
                <div className="flex h-full ">
                  <CountrySelector 
                    selectedCountry={selectedCountry} 
                    onSelect={setSelectedCountry} 
                  />
                </div>
              )}
              {authMode === 'mobile' ? (
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`flex border-0 p-3 focus:ring-0 rounded-xl focus:outline-none w-full ${errors.phoneNumber ? 'border-red-500' : ''}`}
                  placeholder="Enter phone number"
                />
              ) : (
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`flex-1 border-0 p-3 focus:ring-0 rounded-xl focus:outline-none w-fit ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter email"
                />
              )}
            </div>
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
              className={`w-full border border-gray-300 rounded-lg p-3 focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setAuthMode(authMode === 'mobile' ? 'email' : 'mobile')}
              disabled={isLoading}
              className="flex-1 bg-[#0E131833] text-[#3d3d3d] py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authMode === 'mobile' ? 'Use email' : 'Use mobile'}
            </button>
            <button
              type="submit"
              disabled={isLoading || Object.keys(errors).length > 0}
              className="flex-1 bg-[#0E1318] text-[#FAFAFA] py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default Page