'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

export default function CountrySelector({ selectedCountry, onSelect, Onposition }) {
  const [countries, setCountries] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef(null)


  const handleStuff = ()=>{
    setIsOpen(!isOpen)
  }
  
  
  useEffect(() => {
    Onposition(isOpen)
    
  
    
  }, [isOpen])
  
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
        // position('relative')
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
    <div className=" p-4 w-full z-50 top-0">
      <button
        type="button"
        onClick={handleStuff}
        className="flex items-center  focus:outline-none"
      >
        {selectedCountry && (
          <div className='w-full flex'>
            {/* <div className=""> */}
              <Image
                src={selectedCountry.flag}
                alt={`${selectedCountry.name} flag`}
                width={20}
                height={20}
                // className="rounded-sm"
              />
            {/* </div> */}
            <span className="text-gray-600 bgbl ">{selectedCountry.code}</span>
          </div>
        )}
        {/* <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg> */}
      </button>

      {isOpen && (
        

          <div className=" flex flex-col gap-4 bg-[#000] overflow-y-scroll scrollbar-hide px-3 max-w-64 border border-black absolute max-h-64">
            {filteredCountries.map((country) => (
              <div
                key={country.code+country.name}
                onClick={() => {
                  onSelect(country)
                  setIsOpen(false)
                  setSearchQuery('')
                }}
                className="hover:bg-gray-50 px-2 flex items-center text-center cursor-pointer"
              >
                
                  <Image
                    src={country.flag}
                    alt={`${country.name} flag`}
                    width={20}
                    height={20}
                    // className="rounded-sm"
                  />
                
                <span className="text-gray-600 ml-8">{country.code}</span>
                <span className="text-sm text-gray-500 ml-4">{country.name}</span>
              </div>
            ))}
          </div>
        
      )}
    </div>
  )
}

