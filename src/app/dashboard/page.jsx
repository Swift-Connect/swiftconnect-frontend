'use client'

import { useEffect, useState } from 'react'
import Dashboard from './components/dashboard'
import Header from './components/header'
import Sidebar from './components/sidebar'
import PayBills from '../payBills/page'
import CardPage from '../card/page'
import Rewards from '../rewards/page'
import SettingsPage from '../settings/page'
import KYC from '../kyc/kyc'
import { useRouter } from 'next/navigation'
import axiosInstance from '../../utils/axiosInstance'
import { useUserContext } from '../../contexts/UserContext'
import '../globals.css'

const searchItems = [
  'Dashboard',
  'Pay Bills',
  'Cards',
  'Reward',
  'Settings',
  'KYC',
  'Developer API'
]

function DeveloperAPIComingSoon() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] w-full">
      <div className="bg-white rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center gap-4 max-w-xs w-full border-t-4 border-blue-500 animate-fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <div className="text-2xl font-bold text-gray-800">Coming Soon</div>
        <div className="text-gray-500 text-center text-sm">The Developer API feature is almost here. Stay tuned for something amazing!</div>
      </div>
    </div>
  );
}

export default function Home () {
  const [activeSidebar, setActiveSidebar] = useState('Dashboard')
  const [version, setVersion] = useState(0)
  const [hideSideMenu, setHideSideMenu] = useState(true)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [kycStatus, setKycStatus] = useState(null)
  const [kycLoading, setKycLoading] = useState(true)

  const { user, loading: userLoading, error: userError } = useUserContext()
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token')
      if (token) {
        router.push('/dashboard')
      } else {
        router.push('/account/login')
      }
    }
  }, [router])

  // Fetch wallet
  const fetchWallet = async () => {
    try {
      const response = await axiosInstance.get('/payments/wallet/')
      setData(response.data)
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchWallet()
  }, [])

  // Expose a refreshWallet function
  const refreshWallet = fetchWallet;

  // Fetch KYC status
  const fetchKycStatus = async () => {
    setKycLoading(true)
    try {
      const response = await axiosInstance.get('/users/kyc-status/me/')
      setKycStatus(response.data)
    } catch (err) {
      setKycStatus(null)
    } finally {
      setKycLoading(false)
    }
  }
  useEffect(() => {
    fetchKycStatus()
  }, [])

  // console.log(data);
 

  const handleSidebarChange = (label) => {
    setActiveSidebar(label)
    setVersion(v => v + 1)
  }

  const renderComponent = () => {
    switch (activeSidebar) {
      case 'Dashboard':
        return (
          <Dashboard
            setActiveSidebar={handleSidebarChange}
            data={data}
            user={user}
            kycStatus={kycStatus}
            kycLoading={kycLoading}
            refetchKycStatus={fetchKycStatus}
            refreshWallet={refreshWallet}
          />
        )
      case 'Pay Bills':
        return <PayBills setActiveSidebar={handleSidebarChange} />
      case 'Cards':
        return <CardPage />
      case 'Reward':
        return <Rewards />
      case 'Settings':
        return <SettingsPage user={user} />
      case 'KYC':
        return <KYC user={user} setActiveSidebar={handleSidebarChange} />
      case 'Developer API':
        return <DeveloperAPIComingSoon />
    }
  }
  return (
    <div className='flex bg-full h-full overflow-y-hidden'>
      <Sidebar
        setActiveSidebar={handleSidebarChange}
        activeSidebar={activeSidebar}
        setHideSideMenu={setHideSideMenu}
        hideSideMenu={hideSideMenu}
        data={data}
        user={user}
        role='user'
      />
      <main className='flex-1 ml-[20%] max-md:ml-0'>
        <Header
          setHideSideMenu={setHideSideMenu}
          user={user}
          setActiveSidebar={setActiveSidebar}
          searchItems={searchItems}
        />
        <section className=' px-2 w-full custom-scroll bg-[#F6FCF5] h-full overflow-y-auto'
          key={activeSidebar + '-' + version}
        >
          {renderComponent()}
        </section>
      </main>
    </div>
  )
}
