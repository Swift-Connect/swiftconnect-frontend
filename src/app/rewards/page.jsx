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
  const [rewardBalance, setRewardBalance] = useState(null)
  const [stats, setStats] = useState(null)
  const [summary, setSummary] = useState(null)
  const [pendingCommissions, setPendingCommissions] = useState([])
  const [paidCommissions, setPaidCommissions] = useState([])
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      setError('')
      try {
        const [codeData, dashboard, statsData, summaryData, pending, paid, referralsList] = await Promise.all([
          fetchWithAuth('/users/referrals/my_code/'),
          fetchWithAuth('/users/referral-dashboard/'),
          fetchWithAuth('/users/referrals/stats/'),
          fetchWithAuth('/users/referrals/summary/'),
          fetchWithAuth('/users/referral-commissions/pending/'),
          fetchWithAuth('/users/referral-commissions/paid/'),
          fetchWithAuth('/users/referrals/')
        ])
        setReferralCode(codeData?.referral_code || '')
        console.log('dashboard:', dashboard); // Debug: log the dashboard response
        let balance = 0;
        if (typeof dashboard?.reward_balance === 'number') {
          balance = dashboard.reward_balance;
        } else if (dashboard?.reward_balance && typeof dashboard.reward_balance.amount === 'number') {
          balance = dashboard.reward_balance.amount;
        } else if (typeof dashboard?.total_commission === 'number') {
          balance = dashboard.total_commission;
        } else if (dashboard?.total_commission && typeof dashboard.total_commission.amount === 'number') {
          balance = dashboard.total_commission.amount;
        }
        setRewardBalance(balance);
        setStats(statsData || null)
        setSummary(summaryData || null)
        setPendingCommissions(pending || [])
        setPaidCommissions(paid || [])
        setReferrals(referralsList || [])
      } catch (err) {
        setError('Failed to fetch reward data')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
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

  if (showReferrals) {
    return (
      <Referrals onBack={() => setShowReferrals(false)} referrals={referrals} />
    )
  }

  return (
    <div className='min-h-screen bg-[#f7fbf6] p-4 flex flex-col gap-8 w-full'>
      {/* Top: Referral Code & Balance */}
      <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-4'>
        {/* Referral Code Box */}
        <div className='flex flex-col items-center justify-center gap-2 bg-white rounded-xl shadow p-6 border border-[#e0e0e0]'>
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
        <div className='flex flex-col items-center justify-center gap-2 bg-white rounded-xl shadow p-6 border border-[#e0e0e0]'>
          <h2 className='text-[18px] text-[#9CA3AF] font-medium flex items-center gap-2 mb-1'>
            Reward Balance <EyeOff />
          </h2>
          <p className='text-4xl font-extrabold text-[#0E1318]'>₦{rewardBalance?.toLocaleString() || '0.00'}</p>
        </div>
      </div>

      {/* Stats & Summary */}
      <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Referral Stats Card */}
        {stats && typeof stats === 'object' && !Array.isArray(stats) && (
          <div className='bg-white rounded-xl shadow p-6 border border-[#e0e0e0] flex flex-col gap-4'>
            <h3 className='text-lg font-semibold mb-2'>Referral Stats</h3>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
              {Object.entries(stats).map(([key, value]) => (
                <div key={key} className='flex flex-col items-center'>
                  <span className='text-xs text-gray-500'>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                  <span className='text-2xl font-bold text-[#00613A]'>
                    {typeof value === 'object' ? JSON.stringify(value) : value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Referral Summary Card */}
        {summary && typeof summary === 'object' && !Array.isArray(summary) && (
          <div className='bg-white rounded-xl shadow p-6 border border-[#e0e0e0] flex flex-col gap-4'>
            <h3 className='text-lg font-semibold mb-2'>Referral Summary</h3>
            {/* Show summary fields except recent_referrals and recent_commissions */}
            <div className='grid grid-cols-2 gap-4 mb-4'>
              {Object.entries(summary).filter(([key]) => key !== 'recent_referrals' && key !== 'recent_commissions').map(([key, value]) => (
                <div key={key} className='flex flex-col items-center'>
                  <span className='text-xs text-gray-500'>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                  <span className='text-lg font-bold text-[#00613A]'>
                    {key === 'active_referrals' && value && typeof value === 'object' ?
                      (Array.isArray(value)
                        ? value.length
                        : value.count !== undefined
                          ? value.count
                          : Object.keys(value).length
                      )
                      : typeof value === 'object'
                        ? '' // Hide raw JSON for other objects
                        : value}
                  </span>
                  {/* If you want to show a preview list for arrays: */}
                  {key === 'active_referrals' && Array.isArray(value) && value.length > 0 && (
                    <span className='text-xs text-gray-400 mt-1'>
                      {value.slice(0, 3).map((v, i) => v.username || v.email || v.id || v.toString()).join(', ')}
                      {value.length > 3 ? '...' : ''}
                    </span>
                  )}
                </div>
              ))}
            </div>
            {/* Recent Referrals */}
            {Array.isArray(summary.recent_referrals) && summary.recent_referrals.length > 0 && (
              <div>
                <h4 className='text-md font-semibold mb-1'>Recent Referrals</h4>
                <ul className='divide-y divide-gray-200'>
                  {summary.recent_referrals.map((ref, idx) => (
                    <li key={ref.username || idx} className='py-2 flex flex-col md:flex-row md:justify-between md:items-center'>
                      <span className='font-medium'>{ref.username}</span>
                      <span className='text-xs text-gray-500'>{ref.email}</span>
                      <span className='text-xs text-gray-500'>Joined: {ref.date_joined ? new Date(ref.date_joined).toLocaleDateString() : '-'}</span>
                      <span className='text-xs text-green-700'>₦{ref.total_commission ? Number(ref.total_commission).toLocaleString() : '0.00'}</span>
                      <span className='text-xs'>{ref.is_active ? 'Active' : 'Inactive'}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Recent Commissions */}
            {Array.isArray(summary.recent_commissions) && summary.recent_commissions.length > 0 && (
              <div>
                <h4 className='text-md font-semibold mb-1'>Recent Commissions</h4>
                <ul className='divide-y divide-gray-200'>
                  {summary.recent_commissions.map((com, idx) => (
                    <li key={com.type + idx} className='py-2 flex flex-col md:flex-row md:justify-between md:items-center'>
                      <span className='font-medium'>{com.type}</span>
                      <span className='text-xs text-gray-500'>₦{com.amount ? Number(com.amount).toLocaleString() : '0.00'}</span>
                      <span className='text-xs text-gray-500'>Status: {com.status}</span>
                      <span className='text-xs'>Paid: {com.paid_at ? new Date(com.paid_at).toLocaleDateString() : '-'}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Commissions Section */}
      <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Pending Commissions */}
        <div className='bg-white rounded-xl shadow p-6 border border-[#e0e0e0] flex flex-col gap-2'>
          <h3 className='text-lg font-semibold mb-2'>Pending Commissions</h3>
          {pendingCommissions.length === 0 ? (
            <span className='text-gray-400'>No pending commissions.</span>
          ) : (
            <ul className='divide-y divide-gray-200'>
              {pendingCommissions.map((item, idx) => (
                <li key={item.id || idx} className='py-2 flex justify-between'>
                  <span>{item.description || item.referral_name || 'Referral'}</span>
                  <span className='font-bold text-yellow-600'>₦{item.amount?.toLocaleString() || '0.00'}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Paid Commissions */}
        <div className='bg-white rounded-xl shadow p-6 border border-[#e0e0e0] flex flex-col gap-2'>
          <h3 className='text-lg font-semibold mb-2'>Paid Commissions</h3>
          {paidCommissions.length === 0 ? (
            <span className='text-gray-400'>No paid commissions yet.</span>
          ) : (
            <ul className='divide-y divide-gray-200'>
              {paidCommissions.map((item, idx) => (
                <li key={item.id || idx} className='py-2 flex justify-between'>
                  <span>{item.description || item.referral_name || 'Referral'}</span>
                  <span className='font-bold text-green-600'>₦{item.amount?.toLocaleString() || '0.00'}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* View My Referrals & Refer Now Section */}
      <div className='w-full flex flex-col md:flex-row gap-8 mt-4'>
        {/* View My Referrals Card */}
        <div
          className='bg-white border border-[#e0e0e0] rounded-xl flex items-center gap-6 p-6 shadow cursor-pointer hover:shadow-lg transition flex-1'
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
        <div className='bg-[#EDF9EB] border border-[#cacaca] rounded-xl flex flex-col md:flex-row items-center justify-between p-6 gap-6 flex-1'>
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
              <ReferralModal isOpen={showReferralModal} onClose={() => setShowReferralModal(false)} />
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
    </div>
  )
}
