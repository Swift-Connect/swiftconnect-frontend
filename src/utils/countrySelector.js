'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

export default function CountrySelector({ selectedCountry, onSelect }) {
  const [countries, setCountries] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef(null)

  useEffect(() => {
    // Fetch countries data from REST Countries API
    fetch('https://restcountries.com/v3.1/all?fields=name,flags,idd')
      .then(res => res.json())
      .then(data => {
        const formattedCountries = data
          .filter(country => country.idd.root) // Filter out countries without calling codes
          .map(country => ({
            name: country.name.common,
            code: country.idd.root + (country.idd.suffixes?.[0] || ''),
            flag: country.flags.svg
          }))
          .sort((a, b) => a.name.localeCompare(b.name))
        setCountries(formattedCountries)
      })
      .catch(error => console.error('Error fetching countries:', error))
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.includes(searchQuery)
  )

  return (
    <div className="bg-red-700v flex relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        {selectedCountry && (
          <>
            <div className="w-6 h-4 relative">
              <Image
                src={selectedCountry.flag}
                alt={`${selectedCountry.name} flag`}
                width={25}
                height={25}
                className="rounded-sm"
              />
            </div>
            <span className="text-gray-600">{selectedCountry.code}</span>
          </>
        )}
        {/* <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg> */}
      </button>

      {isOpen && (
        <div className=" w-72 bg-red-300 rounded-lg shadow-lg border border-gray-100">

          <div className="bg-blue-500 max-h-6 flex flex-col">
            {filteredCountries.map((country) => (
              <button
                key={country.code+country.name}
                onClick={() => {
                  onSelect(country)
                  setIsOpen(false)
                  setSearchQuery('')
                }}
                // className=" px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
              >
                <div className="w-6 h-4 relative">
                  <Image
                    src={country.flag}
                    alt={`${country.name} flag`}
                    width={20}
                    height={20}
                    className="rounded-sm"
                  />
                </div>
                <span className="text-gray-600">{country.code}</span>
                <span className="text-sm text-gray-500">{country.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

