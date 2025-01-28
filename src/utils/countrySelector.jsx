'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

export default function CountrySelector({ selectedCountry, onSelect }) {
  const [countries, setCountries] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef(null)


  const handleStuff = ()=>{
    setIsOpen(!isOpen)
  }
  
  
  
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
        // position('relative')
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

  const handleKeyPress = (event) => {
    setSearchQuery(event.target.value);
  }

  return (
    <div className="flex w-full">
      <button
        type="button"
        onClick={handleStuff}
        className="flex w-full focus:outline-none"
      >
        {selectedCountry && (
          <div className='w-full flex items-center gap-2'>
            <Image
              src={selectedCountry.flag}
              alt={`${selectedCountry.name} flag`}
              width={30}
              height={30}
            />
            <span className="text-gray-600">{selectedCountry.code}</span>
            <Image
              src={'/chevron-down.svg'}
              alt={`dropdown`}
              width={20}
              height={20}
              className=''
            />
          </div>
        )}
  
      </button>

      {isOpen && (
        

          <div ref={dropdownRef} className=" flex flex-col  bg-white overflow-y-scroll scrollbar-hide p-2 max-w-64 border shadow-lg rounded-lg absolute max-h-64">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleKeyPress}
              className="p-2 border rounded mb-2"
            />
            {filteredCountries.map((country) => (
              <div
                key={country.code+country.name}
                onClick={() => {
                  onSelect(country)
                  setIsOpen(false)
                  setSearchQuery('')
                }}
                className="hover:bg-gray-200 flex items-center text-center py-2 cursor-pointer"
              >
                
                  <Image
                    src={country.flag}
                    alt={`${country.name} flag`}
                    width={20}
                    height={20}
                    // className="rounded-sm"
                  />
                
                <span className="text-gray-600 ml-2">{country.code}</span>
                <span className="text-sm text-gray-500 ml-2">{country.name}</span>
              </div>
            ))}
          </div>
        
      )}
    </div>
  )
}

