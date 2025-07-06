import React, { useEffect, useState } from 'react'
import DashboardCard from './daasboardCard'
import WalletCard from './walletCard'
import TransactionsTable from './transactionTable'
import MobileTransaction from './mobileTRX'
import AgentKycComponent from './agentKycComponent'
import Airtime from './paybills/airtime'
import Internet from './paybills/internet'
import ElectricityPayment from './paybills/electricity'
import CableTv from './paybills/cableTv'
import { useRouter } from 'next/navigation'

const Dashboard = ({ setActiveSidebar, data, user }) => {
  const [payBillsType, setPayBillsType] = useState('dashboard')

  console.log(data)
  const router = useRouter()

  const isTokenExpired = token => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 < Date.now()
    } catch (error) {
      console.error('Error decoding token:', error)
      return true
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    if (token && !isTokenExpired(token)) {
      console.log('Token exists and is valid')

      router.push('/dashboard') // Remove this line to prevent unnecessary redirect
    } else {
      console.log('Token is missing or expired')
      localStorage.removeItem('access_token')
      router.push('/account/login')
    }
  }, [router])

  // useEffect(() => {
  //   console.log(payBillsType);
  // }, [payBillsType]);

  // const payBills = (billType) => {
  switch (payBillsType) {
    case 'Airtime':
      return <Airtime setBillType={setPayBillsType} />
    case 'Internet':
      return <Internet setBillType={setPayBillsType} />
    case 'Electricity':
      return <ElectricityPayment setBillType={setPayBillsType} />
    case 'Cable TV':
      return <CableTv setBillType={setPayBillsType} />
    case 'dashboard':
      return (
        <div className="flex flex-col overflow-hidden items-center justify-center gap-y-12 py-8">
          <div className='flex gap-8 justify-between max-md-[400px]:flex-col max-md-[400px]:w-full w-[90%]'>
            <WalletCard data={data} />
            <div className='grid grid-cols-2 gap-8 max-md-[400px]:grid-cols-2'>
              <DashboardCard
                title='Airtime'
                icon='/airtime.svg'
                bgColor='primary'
                setPayBillsType={setPayBillsType}
              />
              <DashboardCard
                title='Internet'
                icon='/internet.svg'
                bgColor='secondary'
                setPayBillsType={setPayBillsType}
              />
              <DashboardCard
                title='Electricity'
                icon='/electricity.svg'
                bgColor='red-500'
                setPayBillsType={setPayBillsType}
              />
              <DashboardCard
                title='Cable TV'
                icon='/cable-tv.svg'
                bgColor='yellow-400'
                setPayBillsType={setPayBillsType}
              />
            </div>
          </div>
          <AgentKycComponent setActiveSidebar={setActiveSidebar} />
          {/* <MobileTransaction /> */}
          <TransactionsTable />
        </div>
      )
    // }
  }
}

export default Dashboard
