'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { useUserContext } from '../../../contexts/UserContext'

const MenuItems = {
  user: [
    { label: 'Dashboard', icon: 'home.svg', path: '/dashboard' },
    { label: 'Pay Bills', icon: 'Pay.svg', path: '/pay-bills' },
    { label: 'Cards', icon: 'Card.svg', path: '/cards' },
    { label: 'Reward', icon: 'Gift.svg', path: '/reward' },
    { label: 'Settings', icon: 'settings.svg', path: '/settings' },
    { label: 'Developer API', icon: 'code-tags.svg', path: '/developer-api' }
  ],
  admin: [
    { label: 'Dashboard', icon: 'home.svg', path: '/admin/dashboard' },
    {
      label: 'User Management',
      icon: 'home.svg',
      path: '/admin/user-management'
    },
    {
      label: 'Role-Based Access Control',
      icon: 'home.svg',
      path: '/admin/role-based-access-control'
    },
    {
      label: 'Transaction Management',
      icon: 'home.svg',
      path: '/admin/transaction-management'
    },
    {
      label: 'Payment Gateway Integration',
      icon: 'home.svg',
      path: '/admin/payment-gateway-integration'
    },
    {
      label: 'Reseller Management',
      icon: 'home.svg',
      path: '/admin/reseller-management'
    },
    {
      label: 'Service Management API',
      icon: 'home.svg',
      path: '/admin/service-management-api'
    },
    {
      label: 'Referral System',
      icon: 'home.svg',
      path: '/admin/referral-system'
    },
    {
      label: 'Reports and Analytics',
      icon: 'home.svg',
      path: '/admin/reports-and-analytics'
    },
    { label: 'Settings', icon: 'home.svg', path: '/admin/settings' }
  ]
}

export default function Sidebar ({
  setActiveSidebar,
  setHideSideMenu,
  hideSideMenu,
  data,
  role,
  activeSidebar
}) {
  const { user } = useUserContext()
  const menuList = MenuItems[role] || []

  return (
    <>
      {/* Overlay for mobile, only when sidebar is open */}
      {!hideSideMenu && (
        <div
          className='fixed inset-0 bg-black bg-opacity-30 z-10 max-md-[400px]:block hidden'
          onClick={() => setHideSideMenu(true)}
        />
      )}
      <aside
        className={`
          ${role === 'admin' ? 'w-[25%]' : 'w-[18%]'}
          bg-white shadow-md h-screen flex flex-col justify-between overflow-y-auto
          ${
            hideSideMenu
              ? 'max-md-[400px]:hidden'
              : 'max-md-[400px]:absolute max-md-[400px]:w-[70%] max-md-[400px]:z-20'
          }
        `}
        aria-label="Sidebar navigation"
      >
        <div className='flex items-center justify-between p-4 gap-4'>
          <img src='/logo.svg' alt='Logo' className='w-30' />
          <p
            onClick={() => {
              setHideSideMenu(true)
            }}
          >
            <X className='max-md-[400px]:block hidden cursor-pointer' />
          </p>
        </div>
        <div className='flex-1 flex flex-col justify-between'>
          <div>
            <nav className='mt-4 flex flex-col gap-5'>
              {menuList.map(({ label, icon }, index) => (
                <React.Fragment key={label}>
                  <button
                    onClick={() => {
                      setActiveSidebar(label)
                      if (window.innerWidth <= 768) setHideSideMenu(true)
                    }}
                    className={`flex px-4 py-2 text-[16px] items-center gap-4 w-full rounded-r-md transition-all duration-150
                      ${activeSidebar === label ? 'bg-[#F6FCF5] text-[#00613A] font-bold border-l-4 border-[#00613A] shadow-sm' : 'text-gray-600 hover:bg-[#000000c0] hover:text-white'}
                    `}
                    style={{ outline: 'none' }}
                    tabIndex={0}
                    aria-label={label}
                    role="menuitem"
                    aria-current={activeSidebar === label ? 'page' : undefined}
                  >
                    <Image
                      src={
                        activeSidebar === label
                          ? `sidebar/black/${icon}`
                          : `sidebar/gray/${icon}`
                      }
                      width={100}
                      height={100}
                      className={`w-[1.6em] transition-all duration-150 ${activeSidebar === label ? 'opacity-100' : 'opacity-70'}`}
                      alt={`${label} icon`}
                    />
                    {label}
                  </button>
                  {role === 'admin'
                    ? (index === 2 ||
                        index === 6 ||
                        index === 8 ||
                        index === 11 ||
                        index === 13 ||
                        label === 'Settings') && (
                        <hr className='border-t border-gray-300 my-8 w-[90%] mx-auto' />
                      )
                    : ''}
                </React.Fragment>
              ))}
            </nav>
            {role === 'admin' ? (
              ''
            ) : (
              <div className='p-1 '>
                <div className='bg-secondary p-4 rounded-lg text-[#00613A] bg-[#F6FCF5]'>
                  <h1 className='text-[16px] font-semibold mb-1'>
                    Pay Your Bills in Seconds
                  </h1>
                  <p className='text-[12px]'>
                    Set up your utility, phone, and internet bill payments
                    through our app, and earn loyalty points with every payment.
                  </p>
                  <div className='w-full py-5 flex items-center justify-center'>
                    <Image
                      src={'/avatar.svg'}
                      alt='avatar'
                      width={100}
                      height={100}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className='p-2 flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <div>
                <Image
                  src={
                    user?.profileimage ||
                    'https://plus.unsplash.com/premium_photo-1689977927774-401b12d137d6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                  }
                  alt='DP'
                  width={100}
                  height={100}
                  className='w-8 h-8 sm:w-[3em] sm:h-[3em] rounded-full object-cover'
                />
              </div>
              <div>
                <p className='text-xs sm:text-sm font-bold text-[#525252]'>
                  {user?.fullname || 'User'}
                </p>
                <p className='text-[10px] sm:text-xs text-gray-500'>
                  Agent | ₦{data?.balance}
                </p>
              </div>
            </div>
            <div
              className='cursor-pointer hover:bg-red-300 rounded-lg'
              onClick={() => {
                localStorage.removeItem('access_token')
                window.location.href = '/'
              }}
            >
              <Image
                src={'/logout.svg'}
                alt='logout'
                width={100}
                height={100}
                className='w-6 sm:w-[2em]'
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
