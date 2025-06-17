'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
const MenuItems = {
  user: [
    { label: 'Dashboard', icon: 'home.svg' },
    { label: 'Pay Bills', icon: 'Pay.svg' },
    { label: 'Cards', icon: 'Card.svg' },
    { label: 'Reward', icon: 'Gift.svg' },
    { label: 'Settings', icon: 'settings.svg' },
    { label: 'Developer API', icon: 'code-tags.svg' }
  ],
  admin: [
    { label: 'Dashboard', icon: 'home.svg' },
    { label: 'User Management', icon: 'home.svg' },
    { label: 'Role-Based Access Control', icon: 'home.svg' },
    { label: 'Transaction Management', icon: 'home.svg' },
    // { label: "Banking Services", icon: "home.svg" },
    { label: 'Payment Gateway Integration', icon: 'home.svg' },
    // { label: "Virtual Card Management", icon: "home.svg" },
    { label: 'Reseller Management', icon: 'home.svg' },
    { label: 'Service Management API', icon: 'home.svg' },
    { label: 'Referral System', icon: 'home.svg' },
    // { label: "Marketing Tools", icon: "home.svg" },
    // { label: "Notification System", icon: "home.svg" },
    { label: 'Reports and Analytics', icon: 'home.svg' },
    // { label: "System Monitoring", icon: "home.svg" },
    // { label: "API Management", icon: "home.svg" },
    // { label: "Audit Logs", icon: "home.svg" },
    { label: 'Settings', icon: 'home.svg' }
    // { label: "Customer Support", icon: "home.svg" },
  ]
}
export default function Sidebar ({
  setActiveSidebar,
  setHideSideMenu,
  hideSideMenu,
  data,
  user,
  role
}) {
  const [active, setActive] = useState('Dashboard')

  // const handleHideSideMenu = () => {
  //   setHideSideMenu(true);
  // };

  const menuList = MenuItems[role] || []
  return (
    <aside
      className={`${
        role === 'admin' ? 'w-[280px]' : 'w-[240px]'
      } bg-white shadow-md h-screen flex flex-col justify-between transition-all duration-300 ${
        hideSideMenu
          ? 'max-md:hidden'
          : 'max-md:fixed max-md:inset-0 max-md:z-50 max-md:w-full max-md:bg-black/50'
      }`}
    >
      <div className='flex items-center justify-between p-4 border-b'>
        <img src='/logo.svg' alt='Logo' className='w-32' />
        <button
          onClick={() => setHideSideMenu(true)}
          className='hidden max-md:block text-white'
        >
          <X className='w-6 h-6' />
        </button>
      </div>
      <div className='flex-1 overflow-y-auto custom-scroll'>
        <nav className='py-4'>
          {menuList.map(({ label, icon }, index) => (
            <React.Fragment key={label}>
              <button
                onClick={() => {
                  setActive(label)
                  setActiveSidebar(label)
                }}
                className={`flex items-center gap-3 px-4 py-3 text-[15px] text-gray-600 hover:bg-gray-50 w-full transition-colors ${
                  active === label ? 'bg-[#0E1318] text-white' : ''
                }`}
              >
                <Image
                  src={
                    active === label
                      ? `sidebar/white/${icon}`
                      : `sidebar/gray/${icon}`
                  }
                  width={24}
                  height={24}
                  className={`w-5 h-5 ${
                    active === label ? 'text-white' : 'text-gray-600'
                  }`}
                  alt={`${label} icon`}
                />
                <span className='font-medium'>{label}</span>
              </button>
              {role === 'admin' &&
                (index === 2 ||
                  index === 6 ||
                  index === 8 ||
                  index === 11 ||
                  index === 13 ||
                  label === 'Settings') && (
                  <hr className='border-t border-gray-100 my-2' />
                )}
            </React.Fragment>
          ))}
        </nav>
      </div>
      {role === 'admin' && (
        <div className='p-4 border-t'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
              <span className='text-gray-600 font-medium'>
                {user?.username?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <p className='text-sm font-medium text-gray-900'>
                {user?.username || 'Admin User'}
              </p>
              <p className='text-xs text-gray-500'>Administrator</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
