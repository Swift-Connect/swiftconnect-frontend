import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const Sidepane = () => {
  const [user, setUser] = useState(null) // State to store user data
  const [isOpen, setIsOpen] = useState(true) // For mobile toggle
  const pathname = usePathname()

  useEffect(() => {
    // Retrieve and parse user data from localStorage
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  // Close on outside click (mobile only)
  useEffect(() => {
    if (!isOpen) return
    const handleClick = e => {
      if (window.innerWidth > 768) return // Only mobile
      if (!e.target.closest('.sidepane-modal')) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Pay Bills', path: '/pay-bills' },
    { name: 'Cards', path: '/cards' },
    { name: 'Reward', path: '/reward' },
    { name: 'Settings', path: '/settings' },
    { name: 'Developer API', path: '/developer-api' }
  ]

  // Hide on mobile if closed
  if (!isOpen && typeof window !== 'undefined' && window.innerWidth <= 768) {
    return null
  }

  return (
    <div className='sidepane-modal w-64 bg-white backdrop-blur-md shadow-lg fixed flex flex-col justify-between z-40 transition-all duration-300 overflow-y-auto' style={{background: 'rgba(255,255,255,0.6)'}}>
      {/* Header */}
      <div>
        <h2 className='text-2xl font-bold text-[#0E1318] p-6'>Dashboard</h2>
        <ul className='mt-4'>
          {menuItems.map(item => (
            <li key={item.name} className='my-2'>
              <Link
                href={item.path}
                className={`block px-4 py-3 transition duration-200 ${
                  pathname.includes(item.path)
                    ? 'bg-[#0E1318] text-white'
                    : 'text-[#0E1318] hover:bg-[#00613a48] hover:text-[#000e08]'
                }`}
                onClick={() => {
                  if (window.innerWidth <= 768) setIsOpen(false)
                }}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* User Info Box */}
      <div className='p-3 sm:p-6 rounded-lg shadow-md mx-2 sm:mx-4'>
        {user ? (
          <div>
            <div className='flex items-center mt-2 sm:mt-4'>
              <img
                src={user?.profileimage}
                alt='User Avatar'
                className='w-8 h-8 sm:w-12 sm:h-12 rounded-full mr-2 sm:mr-3 border-2 border-gray-300'
                onError={e => (e.target.src = '/path/to/default-avatar.jpg')} // Fallback
              />
              <div className='flex flex-col'>
                <span className='text-xs sm:text-sm text-[#0E1318]'>
                  {user?.username || '--'}
                </span>
                <span className='text-[10px] sm:text-xs text-[#9CA3AF]'>
                  {user?.kyc_verified ? 'KYC Verified' : 'KYC Not Verified'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className='text-xs sm:text-sm text-[#6B7280]'>Loading user details...</p>
        )}
      </div>

      {/* Mobile close button */}
      <button
        className='absolute top-2 right-2 md:hidden bg-white/80 rounded-full p-1 shadow hover:bg-white z-50'
        onClick={() => setIsOpen(false)}
        aria-label='Close sidepane'
      >
        <span className='text-xl'>&times;</span>
      </button>
    </div>
  )
}

export default Sidepane
