import Image from 'next/image'
import React, { useState } from 'react'
import BecomeAnAgent from './becomeAnAgent'
import { useUserContext } from '../../../contexts/UserContext'
import { isKycApproved } from '../../../utils/userUtils'

const AgentKycComponent = ({ setActiveSidebar }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useUserContext()

  // Check if KYC is approved using utility function
  const kycApproved = isKycApproved(user)

  return (
    <>
      {isOpen && <BecomeAnAgent onClose={() => setIsOpen(false)} />}
      <div className='space-y-2 pt-2 bg-gray-5 w-[90%] max-md-[400px]:w-full'>
        {/* Become an Agent Card */}
        <div
          className='flex items-center justify-between bg-white shadow-lg rounded-lg sm:rounded-xl p-2 sm:p-3 border border-gray-200'
          onClick={() => setIsOpen(true)}
        >
          <div className='flex items-start space-x-2 sm:space-x-4 w-[60%] max-md-[400px]:w-full'>
            <Image
              src='/rocket.svg'
              alt='Agent Icon'
              width={100}
              height={100}
              className='h-8 w-8 sm:h-12 sm:w-12'
            />
            <div>
              <h2 className='text-base sm:text-lg font-bold text-[#000000]'>
                Become an Agent{' '}
                <span className='hidden sm:inline'>
                  {' '}
                  — Unlock More Earnings!{' '}
                </span>
              </h2>
              <p className='text-xs sm:text-sm text-[#525252]'>
                Earn commissions, grow your network, and access exclusive tools.
                Upgrade now to maximize your potential!
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className='bg-black text-white p-2 sm:p-3 rounded-lg w-[20%] hidden sm:block hover:bg-gray-800 text-xs sm:text-sm'
          >
            Become an Agent
          </button>
        </div>

        {/* Complete KYC Card - Only show if KYC is not approved */}
        {!kycApproved && (
          <div className='flex items-center justify-between bg-white shadow-lg rounded-lg sm:rounded-xl p-2 sm:p-3 border border-gray-200'>
            <div className='flex items-start space-x-2 sm:space-x-4'>
              <Image
                src='/rounded-exclamation.svg'
                alt='Agent Icon'
                width={100}
                height={100}
                className='h-8 w-8 sm:h-12 sm:w-12'
              />
              <div>
                <h2 className='text-base sm:text-lg font-bold text-[#000000]'>
                  Complete KYC
                </h2>
                <p className='text-xs sm:text-sm text-[#525252]'>
                  Complete your KYC to receive your Swift Connect account
                  number.{' '}
                  <span
                    onClick={() => setActiveSidebar('KYC')}
                    className='text-orange-500 hover:underline'
                  >
                    Click here to complete
                  </span>
                </p>
              </div>
            </div>
            <button
              className='bg-orange-500 text-white w-[20%] rounded-lg hover:bg-orange-600 p-2 sm:p-3 hidden sm:block text-xs sm:text-sm'
              onClick={() => setActiveSidebar('KYC')}
            >
              Complete KYC
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default AgentKycComponent
