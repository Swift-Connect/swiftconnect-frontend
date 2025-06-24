'use client'

import { EyeOff, Copy } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Referrals from './components/viewMyReferrals'
import ReferralModal from './components/referAFriendModal'
import { fetchWithAuth } from '@/utils/api'

export default function Rewards () {
  const [showReferrals, setShowReferrals] = useState(false)
  const [showReferralModal, setShowReferralModal] = useState(false)
  const [referralCode, setReferralCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchReferralCode = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchWithAuth('/users/referrals/my_code/')
        setReferralCode(data?.referral_code || '')
      } catch (err) {
        setError('Failed to fetch referral code')
      } finally {
        setLoading(false)
      }
    }
    fetchReferralCode()
  }, [])

  const copyToClipboard = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode)
      alert('Referral code copied!')
    }
  }

  const handleShowReferalModal = () => {
    setShowReferralModal(true)
  }

  const handleViewReferrals = () => {
    setShowReferrals(true)
  }

  return showReferrals ? (
    <Referrals onBack={() => setShowReferrals(false)} />
  ) : (
    <div className='flex flex-col lg:flex-row gap-10 min-h-screen bg-[#f7fbf6] p-4'>
      {/* Left Section */}
      <div className='w-full lg:w-[55%] flex flex-col gap-8 mx-auto'>
        {/* Referral Code Box */}
        <div className='flex flex-col items-center justify-center gap-2 bg-white rounded-xl shadow p-6 border border-[#e0e0e0] mt-4'>
          <label className='text-base font-semibold text-gray-700 mb-1'>
            Your Referral Code
          </label>
          <div className='flex items-center gap-3 bg-green-50 rounded-lg py-3 px-6'>
            {loading ? (
              <span className='font-semibold text-gray-400'>Loading...</span>
            ) : error ? (
              <span className='font-semibold text-red-500'>{error}</span>
            ) : (
              <>
                <span className='font-bold text-2xl tracking-widest text-[#00613A]'>
                  {referralCode}
                </span>
                <button
                  onClick={copyToClipboard}
                  className='text-gray-700 hover:text-black p-2 rounded-full hover:bg-green-100 transition'
                  disabled={!referralCode}
                  title='Copy referral code'
                >
                  <Copy size={22} />
                </button>
              </>
            )}
          </div>
          <span className='text-xs text-gray-500 mt-1'>
            Share this code with friends to earn rewards!
          </span>
        </div>

        {/* Reward Balance */}
        <div className='flex flex-col items-center gap-1'>
          <h2 className='text-[18px] text-[#9CA3AF] font-medium flex items-center gap-2 mb-1'>
            Reward Balance <EyeOff />
          </h2>
          <p className='text-3xl font-bold text-[#0E1318]'>₦12,880.50</p>
        </div>

        {/* View My Referrals Card */}
        <div
          className='bg-white border border-[#e0e0e0] rounded-xl flex items-center gap-6 p-6 shadow cursor-pointer hover:shadow-lg transition mb-2'
          onClick={handleViewReferrals}
        >
          <Image
            src={'User-Group.svg'}
            alt='group-icon'
            width={60}
            height={60}
            className='w-[3em] h-[3em] rounded-full bg-green-50 p-2'
          />
          <div className='flex-1'>
            <p className='text-lg text-[#0E1318] font-semibold mb-1'>
              View My Referrals
            </p>
            <p className='text-sm text-gray-500'>
              Track your growing network of referrals in one place.
            </p>
          </div>
          <button className='bg-[#00613A] text-white px-6 py-2 rounded-[2em] font-semibold shadow hover:bg-[#004d2c] transition'>
            View
          </button>
        </div>

        {/* Refer Now Section */}
        <div className='bg-[#EDF9EB] border border-[#cacaca] rounded-xl flex flex-col md:flex-row items-center justify-between p-6 gap-6'>
          <div className='flex flex-col gap-2 flex-1'>
            <p className='text-base font-medium'>
              Earn money from your referrals that become agents
            </p>
            <p className='text-3xl font-bold text-[#00613A]'>
              ₦2,000 <span className='text-lg text-[#0E1318]'>Cash</span>
            </p>
            <button
              className='bg-[#00613A] text-white w-fit px-8 py-2 rounded-[3em] font-semibold mt-2 hover:bg-[#004d2c] transition'
              onClick={handleShowReferalModal}
            >
              Refer Now
            </button>
            {showReferralModal && (
              <ReferralModal onClose={() => setShowReferralModal(false)} />
            )}
          </div>
          <Image
            src={'hand-holding-cash.svg'}
            width={120}
            height={120}
            className='w-[7em] h-[7em]'
            alt={'hand-holding-cash'}
          />
        </div>
      </div>
      {/* Right Section: Placeholder for future use or illustration */}
      <div className='hidden lg:flex flex-1 items-center justify-center'>
        {/* Optionally add an illustration or stats here */}
      </div>
    </div>
  )
}
