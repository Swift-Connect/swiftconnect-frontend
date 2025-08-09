'use client'
import React, { useEffect, useState } from 'react'
import { FaDollarSign } from 'react-icons/fa'
import { HiOutlineDocumentText } from 'react-icons/hi'
import { IoIosStats } from 'react-icons/io'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import Card from '../../components/card'
import { fetchWithAuth } from '@/utils/api'

const COLORS = ['#4F46E5', '#22D3EE']

// Expected API response shape (example):
// {
//   stats: { total_revenue, total_users, inactive_users, pending_kyc, total_agents },
//   income: [{ name, transactions, utility, agents }],
//   traffic: [{ name, visitors }],
//   user_breakdown: [{ name, value }]
// }

export default function DashboardOverview ({ analytics }) {
  const [stats, setStats] = useState([
    {
      title: 'Total Revenue',
      value: '-',
      icon: <FaDollarSign className='text-blue-600 text-lg' />,
      bgColor: 'bg-blue-600 text-white',
      textColor: 'text-white'
    },
    {
      title: 'Total Users',
      value: '-',
      icon: <IoIosStats className='text-blue-600 text-lg' />,
      bgColor: 'bg-white',
      textColor: 'text-gray-900'
    },
    {
      title: 'Inactive Users',
      value: '-',
      icon: <IoIosStats className='text-blue-600 text-lg' />,
      bgColor: 'bg-white',
      textColor: 'text-gray-900'
    },
    {
      title: 'Users Pending KYC',
      value: '-',
      icon: <IoIosStats className='text-blue-600 text-lg' />,
      bgColor: 'bg-white',
      textColor: 'text-gray-900'
    },
    {
      title: 'Total Agents',
      value: '-',
      icon: <HiOutlineDocumentText className='text-blue-600 text-lg' />,
      bgColor: 'bg-white',
      textColor: 'text-gray-900'
    }
  ])
  const [incomeData, setIncomeData] = useState([])
  const [trafficData, setTrafficData] = useState([])
  const [userData, setUserData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!analytics) return
    setLoading(true)
    try {
      // Map provided DS to cards and charts
      const totalUsers = analytics?.users?.total_users ?? '-'
      const inactiveUsers = (analytics?.users?.total_users ?? 0) - ((analytics?.users?.active_users_30d ?? 0))
      const pendingKyc = analytics?.users?.pending_kyc ?? '-'
      const totalAgents = analytics?.users?.total_agents ?? analytics?.services?.all_time?.total_wallets ?? '-'

      setStats([
        {
          title: 'Total Revenue',
          value: analytics?.transactions?.all_time?.total_volume ?? '-',
          icon: <FaDollarSign className='text-blue-600 text-lg' />,
          bgColor: 'bg-blue-600 text-white',
          textColor: 'text-white'
        },
        {
          title: 'Total Users',
          value: totalUsers,
          icon: <IoIosStats className='text-blue-600 text-lg' />,
          bgColor: 'bg-white',
          textColor: 'text-gray-900'
        },
        {
          title: 'Inactive Users',
          value: inactiveUsers,
          icon: <IoIosStats className='text-blue-600 text-lg' />,
          bgColor: 'bg-white',
          textColor: 'text-gray-900'
        },
        {
          title: 'Users Pending KYC',
          value: pendingKyc,
          icon: <IoIosStats className='text-blue-600 text-lg' />,
          bgColor: 'bg-white',
          textColor: 'text-gray-900'
        },
        {
          title: 'Total Agents',
          value: totalAgents,
          icon: <HiOutlineDocumentText className='text-blue-600 text-lg' />,
          bgColor: 'bg-white',
          textColor: 'text-gray-900'
        }
      ])

      // Compose simple series for charts from DS
      setIncomeData([
        { name: '24h', transactions: analytics?.transactions?.last_24h?.total_transactions ?? 0, utility: analytics?.services?.last_24h?.total_wallets ?? 0, agents: analytics?.errors?.last_24h?.total_errors ?? 0 },
        { name: '7d', transactions: analytics?.transactions?.last_7d?.total_transactions ?? 0, utility: analytics?.services?.last_7d?.total_wallets ?? 0, agents: analytics?.errors?.last_7d?.total_errors ?? 0 },
        { name: '30d', transactions: analytics?.transactions?.last_30d?.total_transactions ?? 0, utility: analytics?.services?.last_30d?.total_wallets ?? 0, agents: analytics?.errors?.last_30d?.total_errors ?? 0 },
        { name: 'All', transactions: analytics?.transactions?.all_time?.total_transactions ?? 0, utility: analytics?.services?.all_time?.total_wallets ?? 0, agents: analytics?.errors?.all_time?.total_errors ?? 0 }
      ])

      setTrafficData([
        { name: '24h', visitors: analytics?.users?.active_users_24h ?? 0 },
        { name: '7d', visitors: analytics?.users?.active_users_7d ?? 0 },
        { name: '30d', visitors: analytics?.users?.active_users_30d ?? 0 }
      ])

      setUserData([
        { name: 'Active (30d)', value: analytics?.users?.active_users_30d ?? 0 },
        { name: 'Inactive', value: Math.max((analytics?.users?.total_users ?? 0) - (analytics?.users?.active_users_30d ?? 0), 0) }
      ])
    } catch (err) {
      console.error('Failed to map analytics:', err)
      setError('Failed to map analytics data')
    } finally {
      setLoading(false)
    }
  }, [analytics])

  if (loading) {
    return <div className='p-6 text-center'>Loading analytics...</div>
  }
  if (error) {
    return <div className='p-6 text-center text-red-500'>{error}</div>
  }

  return (
    <div className='bg-[#F5FBF7] min-h-screen p-6 space-y-6'>
      {/* Stat Cards */}
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
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

      {/* Charts */}
      <div className='py-6 bg-gray-50 flex gap-6'>
        {/* Income Chart */}
        <div className='bg-white p-4 rounded-lg shadow w-1/3'>
          <p className='text-gray-500 text-sm'>This Week ▼</p>
          <h2 className='text-2xl font-bold'>{stats[0]?.value}</h2>
          <p className='text-green-500 text-sm'>Total Income</p>

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
            {trafficData.reduce((sum, item) => sum + (item.visitors || 0), 0)}{' '}
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
              <span className='w-3 h-3 bg-blue-700 rounded-full mr-2'></span>{' '}
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
              <span className='w-3 h-3 bg-blue-400 rounded-full mr-2'></span>{' '}
              Inactive User
            </div>
            <p>
              {userData[1]?.value
                ? `${Math.round(
                    (userData[1].value /
                      ((userData[0]?.value || 0) + userData[1].value)) *
                      100
                  )}%`
                : '0%'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
