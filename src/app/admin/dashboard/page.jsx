'use client'
import React, { useEffect, useState } from 'react'
import { FaDollarSign } from 'react-icons/fa'
import { IoIosStats } from 'react-icons/io'
import { HiOutlineDocumentText } from 'react-icons/hi'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { BarChart, Bar } from 'recharts'
import { PieChart, Pie, Cell, Legend } from 'recharts'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import api from '@/utils/api'
import UsersTable from './components/userTable'
import TransactionsTable from './components/TransactionsTable'
import TableTabs from '../components/tableTabs'
import Card from '../components/card'
import Pagination from '../components/pagination'
import { STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR } from 'next/dist/lib/constants'

const COLORS = ['#1D4ED8', '#60A5FA']

const Dashboard = () => {
  const router = useRouter()
  const [token, setToken] = useState(null)
  const [activeTabPending, setActiveTabPending] = useState('Approve KYC')
  const [activeTabTransactions, setActiveTabTransactions] =
    useState('All Transactions')
  const [incomeData, setIncomeData] = useState([])
  const [trafficData, setTrafficData] = useState([])
  const [userData, setUserData] = useState([])
  const [userssData, setUserssData] = useState([])
  const [stats, setStats] = useState([])
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [isLoadingKYC, setIsLoadingKYC] = useState(true)
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true)
  const [allTransactionData, setAllTransaactionData] = useState([])
  const [transactionFilter, setTransactionFilter] = useState('All')
  const [actionItem, setActionItem] = useState(null)
  const [usersKYCPendingData, setUsersKYCPendingData] = useState([])
  // Filtered transaction data based on the selected filter
  // console.log("Clicked Filtered Optiom", transactionFilter);
  // console.log("Clicked Action PopUP", actionItem);

  const filteredTransactionData = allTransactionData.filter(tx => {
    if (transactionFilter === 'All') return true
    if (transactionFilter === 'Success')
      return tx.status.toLowerCase() === 'completed'
    return tx.status.toLowerCase() === transactionFilter.toLowerCase()
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('access_token')
      setToken(accessToken)

      if (!accessToken) {
        router.push('/account/login')
      }
    }
  }, [])

  useEffect(() => {
    if (!token) return

    // Fetch users
    const fetchUsers = async () => {
      setIsLoadingUsers(true)
      try {
        const usersData = await fetchAllPages('/users/list-users/')
        const validUsers = usersData.filter(user => user?.id)
        const processedData = validUsers.map(user => ({
          id: user?.id,
          username: user?.username,
          account_id: user?.account_id || 'null',
          created_at: user?.created_at || 'null',
          api_response: user?.api_response || 'N/A',
          status: user?.status || 'Not Approved'
        }))
        setUserssData(processedData)
      } catch (error) {
        toast.error('Failed to fetch users')
      } finally {
        setIsLoadingUsers(false)
      }
    }

    // Fetch pending KYC requests
    const fetchKYC = async () => {
      setIsLoadingKYC(true)
      try {
        const pendingKycData = await fetchAllPages('/users/pending-kyc-requests/')
        const processedUserKYCData = pendingKycData.map(item => ({
          id: item?.id,
          username: item?.user?.fullname,
          account_id: item?.user?.id || 'null',
          created_at: item?.user?.created_at || 'null',
          api_response: item?.user?.api_response || 'N/A',
          status: item?.approved ? 'Approved' : 'Not Approved'
        }))
        setUsersKYCPendingData(processedUserKYCData)
      } catch (error) {
        toast.error('Failed to fetch KYC data')
      } finally {
        setIsLoadingKYC(false)
      }
    }

    // Fetch all transactions
    const fetchTransactions = async () => {
      setIsLoadingTransactions(true)
      try {
        const transactionEndpoints = [
          '/payments/transactions/',
          '/services/airtime-topups-transactions/',
          '/services/data-plan-transactions/',
          '/services/cable-recharges-transactions/',
          '/services/education-transactions/',
          '/services/electricity-transactions/',
          '/services/bulk-sms-transactions/'
        ]
        const transactionPromises = transactionEndpoints.map(async endpoint => {
          try {
            return await fetchAllPages(endpoint)
          } catch (error) {
            toast.error(`Error fetching ${endpoint}`)
            return []
          }
        })
        const transactionResults = await Promise.all(transactionPromises)
        const allTransactions = transactionResults.flat()
        const processedDataTrx = allTransactions.map(tx => ({
          id: tx.id,
          product: getProductName(tx),
          amount: formatCurrency(tx.amount, tx.currency),
          date: new Date(tx.created_at).toLocaleDateString('en-GB'),
          status: tx.status ? capitalizeFirstLetter(tx.status) : 'Completed'
        }))
        setAllTransaactionData(processedDataTrx)
      } catch (error) {
        toast.error('Failed to fetch transactions')
      } finally {
        setIsLoadingTransactions(false)
      }
    }

    // Fetch stats, income, traffic, user breakdown
    const fetchStats = async () => {
      setIsLoadingStats(true)
      try {
        // You can use the already fetched users and transactions if needed
        // For now, just set dummy data or refetch as needed
        // ...
        // setStats(...)
        // setIncomeData(...)
        // setTrafficData(...)
        // setUserData(...)
      } catch (error) {
        toast.error('Failed to fetch stats')
      } finally {
        setIsLoadingStats(false)
      }
    }

    fetchUsers()
    fetchKYC()
    fetchTransactions()
    fetchStats()
  }, [token])

  const fetchAllPages = async (endpoint, maxPages = 50) => {
    let allData = []
    let nextPage = endpoint
    let pageCount = 0

    try {
      while (nextPage && pageCount < maxPages) {
        const res = await api.get(nextPage)
        allData = allData.concat(res.data.results || res.data)
        nextPage = res.data.next || null
        pageCount++
      }

      if (pageCount >= maxPages) {
        console.warn(`Reached max page limit (${maxPages}) for ${endpoint}`)
      }
    } catch (error) {
      toast.error(`Error fetching data from ${endpoint}`)
      console.error(`Error fetching ${endpoint}:`, error)
    }

    return allData
  }

  const formatCurrency = (amount, currency = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const getProductName = transaction => {
    if (transaction.reason) return transaction.reason
    if (transaction.network) return `${transaction.network} Airtime`
    if (transaction.cable_name) return `${transaction.cable_name} Cable`
    return 'Service Transaction'
  }

  const capitalizeFirstLetter = str => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  // console.log("the users data", userssData);

  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const [currentPageTrx, setCurrentPageTrx] = useState(1)
  const totalPages = Math.ceil(usersKYCPendingData.length / itemsPerPage)

  useEffect(() => {
    setCurrentPageTrx(1)
  }, [transactionFilter])

  return (
    <div className='overflow-hidden'>
      <div className='overflow-x-auto'>
        {isLoadingStats ? (
          <div className='text-center py-8'>
            Loading dashboard stats, please wait...
          </div>
        ) : (
          <div className='flex gap-4 justify-between'>
            {stats.map((stat, index) => (
              <Card
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                bgColor={stat.bgColor}
                textColor={stat.textColor}
              />
            ))}
          </div>
        )}
      </div>
      {!isLoadingStats && (
        <div className='py-6 bg-gray-50 flex gap-6'>
          {/* Income Chart */}
          <div className='bg-white p-4 rounded-lg shadow w-1/3'>
            <p className='text-gray-500 text-sm'>This Week ▼</p>
            <h2 className='text-2xl font-bold'>
              {formatCurrency(
                incomeData.reduce((sum, item) => sum + item.transactions, 0)
              )}
            </h2>
            <p className='text-green-500 text-sm'>Total Income +2.45%</p>

            <ResponsiveContainer width='100%' height={200}>
              <LineChart data={incomeData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Line
                  type='monotone'
                  dataKey='transactions'
                  stroke='#1D4ED8'
                  strokeWidth={2}
                />
                <Line
                  type='monotone'
                  dataKey='utility'
                  stroke='#60A5FA'
                  strokeWidth={2}
                />
                <Line
                  type='monotone'
                  dataKey='agents'
                  stroke='#FB923C'
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className='flex justify-between text-sm mt-4'>
              <p className='text-blue-700'>● Transactions</p>
              <p className='text-blue-400'>● Utility Bills</p>
              <p className='text-orange-500'>● Agent Subscription</p>
            </div>
          </div>

          {/* Traffic Chart */}
          <div className='bg-white p-4 rounded-lg shadow w-1/3'>
            <p className='text-gray-500 text-sm'>Daily Traffic</p>
            <h2 className='text-2xl font-bold'>
              {trafficData.reduce((sum, item) => sum + item.visitors, 0)}{' '}
              Visitors
            </h2>
            <p className='text-green-500 text-sm'>+2.45%</p>

            <ResponsiveContainer width='100%' height={200}>
              <BarChart data={trafficData}>
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='visitors' fill='url(#gradient)' barSize={30} />
                <defs>
                  <linearGradient id='gradient' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='0%' stopColor='#1D4ED8' stopOpacity={1} />
                    <stop offset='100%' stopColor='#60A5FA' stopOpacity={1} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* User Breakdown */}
          <div className='bg-white p-4 rounded-lg shadow w-1/3'>
            <p className='text-gray-500 text-sm'>Users Breakdown</p>

            <ResponsiveContainer width='100%' height={200}>
              <PieChart>
                <Pie
                  data={userData}
                  cx='50%'
                  cy='50%'
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {userData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Legend verticalAlign='bottom' height={36} />
              </PieChart>
            </ResponsiveContainer>

            <div className='flex justify-between text-sm mt-4'>
              <div className='flex items-center'>
                <span className='w-3 h-3 bg-blue-700 rounded-full mr-2'></span>
                Active User
              </div>
              <p>
                {userData[0]?.value
                  ? `${Math.round(
                      (userData[0].value /
                        (userData[0].value + (userData[1]?.value || 0))) *
                        100
                    )}%`
                  : '0%'}
              </p>
            </div>
            <div className='flex justify-between text-sm'>
              <div className='flex items-center'>
                <span className='w-3 h-3 bg-blue-400 rounded-full mr-2'></span>
                Inactive User
              </div>
              <p>
                {userData[1]?.value
                  ? `${Math.round(
                      (userData[1].value /
                        (userData[0]?.value + userData[1].value)) *
                        100
                    )}%`
                  : '0%'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className='pt-8 max-md-[400px]:hidden'>
        <TableTabs
          header={'Pending Tasks'}
          setActiveTab={setActiveTabPending}
          activeTab={activeTabPending}
          tabs={['Approve KYC']}
          from='dashboard'
          // filterOptions={[
          //   { label: "MTN", value: "MTN" },
          //   { label: "Airtel", value: "Airtel" },
          //   { label: "Glo", value: "Glo" },
          //   { label: "9mobile", value: "9mobile" },
          // ]}
        />
        <div className='rounded-t-[1em] overflow-hidde border border-gray-200 '>
          <UsersTable
            userssData={usersKYCPendingData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            isLoading={isLoadingKYC}
            actionItem={actionItem}
            setActionItem={setActionItem}
          />
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <div className='pt-8 max-md-[400px]:hidden'>
        <TableTabs
          header={'Recent Transactions'}
          setActiveTab={setActiveTabTransactions}
          activeTab={activeTabTransactions}
          tabs={['All Transactions', 'Credit', 'Debit']}
          from='dashboard'
          filterOptions={[
            { label: 'Success', value: 'Success' },
            { label: 'Failed', value: 'Failed' },
            { label: 'Refunded', value: 'Refunded' },
            { label: 'Pending', value: 'Pending' }
          ]}
          onFilterChange={filter => setTransactionFilter(filter)}
        />
        <div className='rounded-t-[1em] overflow-hidden border border-gray-200'>
          <TransactionsTable
            data={filteredTransactionData}
            currentPage={currentPageTrx}
            itemsPerPage={itemsPerPage}
            isLoading={isLoadingTransactions}
            activeTabTransactions={activeTabTransactions}
          />
        </div>
        <Pagination
          currentPage={currentPageTrx}
          totalPages={Math.ceil(filteredTransactionData.length / itemsPerPage)}
          onPageChange={setCurrentPageTrx}
        />
      </div>
    </div>
  )
}

export default Dashboard
