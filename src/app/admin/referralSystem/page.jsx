'use client'

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import Pagination from '../components/pagination'
import TableTabs from '../components/tableTabs'
import { FaChevronRight } from 'react-icons/fa'
import ReferralSystemTable from './components/referrralSystemTable'
import EditReferralSystem from './components/editReferralSystem'
import { fetchWithAuth, postWithAuth } from '@/utils/api'
import CommissionsTable from './components/commissionsTable'
import DashboardStats from './components/dashboardStats'
import SettingsTable from './components/settingsTable'
import { toast } from 'react-toastify'

const TAB_KEYS = ['Dashboard', 'Referrals', 'Commissions', 'Settings']

const ReferralSystem = () => {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [referrals, setReferrals] = useState([])
  const [commissions, setCommissions] = useState([])
  const [dashboardStats, setDashboardStats] = useState(null)
  const [settings, setSettings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(referrals.length / itemsPerPage)
  const [payingId, setPayingId] = useState(null)

  useEffect(() => {
    if (activeTab === 'Referrals') {
      setLoading(true)
      setError('')
      fetchWithAuth('/users/referrals/')
        .then(res => setReferrals(res || []))
        .catch(() => setError('Failed to fetch referrals'))
        .finally(() => setLoading(false))
    } else if (activeTab === 'Commissions') {
      setLoading(true)
      setError('')
      fetchWithAuth('/users/referral-commissions/')
        .then(res => setCommissions(res || []))
        .catch(() => setError('Failed to fetch commissions'))
        .finally(() => setLoading(false))
    } else if (activeTab === 'Dashboard') {
      setLoading(true)
      setError('')
      fetchWithAuth('/users/referral-dashboard/')
        .then(res => setDashboardStats(res || null))
        .catch(() => setError('Failed to fetch dashboard stats'))
        .finally(() => setLoading(false))
    } else if (activeTab === 'Settings') {
      setLoading(true)
      setError('')
      fetchWithAuth('/users/referral-settings/')
        .then(res => setSettings(res || []))
        .catch(() => setError('Failed to fetch settings'))
        .finally(() => setLoading(false))
    }
  }, [activeTab])

  const editReferral = false

  const handlePayCommission = async item => {
    if (!item || !item.id || item.paid) return
    setPayingId(item.id)
    try {
      const res = await postWithAuth(
        `/users/referral-commissions/${item.id}/pay/`,
        {}
      )
      toast.success('Commission paid successfully!')
      if (res && res.id) {
        setCommissions(prev =>
          prev.map(c => (c.id === res.id ? { ...c, ...res } : c))
        )
      } else {
        const updated = await fetchWithAuth('/users/referral-commissions/')
        setCommissions(updated || [])
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to pay commission')
    } finally {
      setPayingId(null)
    }
  }

  return (
    <div className='overflow-hidden'>
      <div className='max-md-[400px]:hidden'>
        <div className='flex gap-2 mb-8 border-b'>
          {TAB_KEYS.map(tab => (
            <button
              key={tab}
              className={`px-6 py-2 font-semibold border-b-2 transition-colors duration-150 focus:outline-none ${
                activeTab === tab
                  ? 'border-[#00613A] text-[#00613A] bg-green-50'
                  : 'border-transparent text-gray-500 hover:text-[#00613A]'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        {activeTab === 'Dashboard' && (
          <div className='rounded-t-[1em] overflow-auto border border-gray-200 min-h-[50vh] p-6'>
            {loading ? (
              <div className='text-center py-8 text-gray-500'>Loading...</div>
            ) : error ? (
              <div className='text-center py-8 text-red-500'>{error}</div>
            ) : (
              <>
                <DashboardStats dashboard={dashboardStats} />
                <div className='flex flex-wrap gap-4 mt-8'>
                  <button
                    className='bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-green-700 transition'
                    onClick={() => setActiveTab('Commissions')}
                  >
                    Go to Commissions
                  </button>
                  {commissions.some(c => !c.paid) && (
                    <button
                      className='bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition'
                      onClick={() => setActiveTab('Commissions')}
                    >
                      Pay Earnings
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
        {activeTab === 'Referrals' && (
          <div className='rounded-t-[1em] overflow-auto border border-gray-200 min-h-[50vh]'>
            {loading ? (
              <div className='text-center py-8 text-gray-500'>Loading...</div>
            ) : error ? (
              <div className='text-center py-8 text-red-500'>{error}</div>
            ) : (
              <ReferralSystemTable
                data={referrals}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
              />
            )}
          </div>
        )}
        {activeTab === 'Commissions' && (
          <div className='rounded-t-[1em] overflow-auto border border-gray-200 min-h-[50vh] p-6'>
            <div className='flex justify-between mb-4'>
              <button
                className='bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm font-semibold shadow transition'
                onClick={() => setActiveTab('Dashboard')}
              >
                ← Back to Dashboard
              </button>
            </div>
            {loading ? (
              <div className='text-center py-8 text-gray-500'>Loading...</div>
            ) : error ? (
              <div className='text-center py-8 text-red-500'>{error}</div>
            ) : (
              <CommissionsTable
                commissions={commissions}
                onPay={handlePayCommission}
                payingId={payingId}
              />
            )}
          </div>
        )}
        {activeTab === 'Settings' && (
          <div className='rounded-t-[1em] overflow-auto border border-gray-200 min-h-[50vh]'>
            {loading ? (
              <div className='text-center py-8 text-gray-500'>Loading...</div>
            ) : error ? (
              <div className='text-center py-8 text-red-500'>{error}</div>
            ) : (
              <SettingsTable
                settings={settings}
                onEdit={item => {
                  /* TODO: implement edit */
                }}
                onDelete={item => {
                  /* TODO: implement delete */
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ReferralSystem
