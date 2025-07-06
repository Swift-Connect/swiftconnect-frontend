import { useState, useEffect } from 'react'
import { ClipboardCopy, Copy } from 'lucide-react'
import Image from 'next/image'
import { fetchWithAuth } from '@/utils/api'
import Modal from '../../../components/common/Modal'

export default function ReferralModal({ isOpen, onClose }) {
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='bg-white w-full max-w-lg p-8 max-sm:p-4 rounded-2xl shadow-lg text-center mx-auto'>
        <div className='flex flex-col items-center justify-center mx-[2em]'>
          {/* Gift Icon */}
          <div className='flex justify-center mb-4'>
            <Image
              src={'giftt.svg'}
              alt='confirmation icon'
              width={16}
              height={16}
              className='w-[8em]'
            />
          </div>

          {/* Title */}
          <h2 className='text-[48px]  font-bold text-gray-900'>
            Refer a Friend, Earn Rewards
          </h2>

          {/* Description */}
          <p className='text-gray-600 text-[18px] mt-2'>
            Inviting friends to SwiftConnect is easy! Share your unique link and
            earn <strong>₦4,200</strong> for every friend who joins.
          </p>

          {/* Referral Code Box */}
          <div className='flex items-center justify-center w-full gap-4 bg-green-100 rounded-md py-4 mt-4'>
            {loading ? (
              <span className='font-semibold text-gray-400'>Loading...</span>
            ) : error ? (
              <span className='font-semibold text-red-500'>{error}</span>
            ) : (
              <>
                <span className='font-semibold'>{referralCode}</span>
                <button
                  onClick={copyToClipboard}
                  className='text-gray-700 hover:text-black'
                  disabled={!referralCode}
                >
                  <Copy size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Okay Button */}
        <button
          onClick={onClose}
          className='mt-6 w-full bg-black text-white py-4 rounded-md hover:bg-gray-800'
        >
          Okay
        </button>
      </div>
    </Modal>
  )
}
