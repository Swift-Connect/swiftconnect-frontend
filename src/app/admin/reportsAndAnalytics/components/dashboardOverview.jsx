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

export default function DashboardOverview () {
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
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch main analytics
        const analytics = await fetchWithAuth("/api/analytics/");
        

        // Try fetching optional metrics
        let metrics = [];
        try {
          metrics = await fetchWithAuth("/api/analytics/metrics/");
        } catch (err) {
          console.warn("Metrics fetch failed:", err.message);
        }

        // Set analytics summary cards
        setStats([
          {
            title: "Total Revenue",
            value: analytics?.total_revenue ?? "-",
            icon: <FaDollarSign className="text-blue-600 text-lg" />,
            bgColor: "bg-blue-600 text-white",
            textColor: "text-white",
          },
          {
            title: "Total Users",
            value: analytics?.total_users ?? "-",
            icon: <IoIosStats className="text-blue-600 text-lg" />,
            bgColor: "bg-white",
            textColor: "text-gray-900",
          },
          {
            title: "Inactive Users",
            value: analytics?.inactive_users ?? "-",
            icon: <IoIosStats className="text-blue-600 text-lg" />,
            bgColor: "bg-white",
            textColor: "text-gray-900",
          },
          {
            title: "Users Pending KYC",
            value: analytics?.pending_kyc ?? "-",
            icon: <IoIosStats className="text-blue-600 text-lg" />,
            bgColor: "bg-white",
            textColor: "text-gray-900",
          },
          {
            title: "Total Agents",
            value: analytics?.total_agents ?? "-",
            icon: <HiOutlineDocumentText className="text-blue-600 text-lg" />,
            bgColor: "bg-white",
            textColor: "text-gray-900",
          },
        ]);

        // Set additional data
        setIncomeData(analytics?.income ?? []);
        setTrafficData(analytics?.traffic ?? []);
        setUserData(analytics?.user_breakdown ?? []);
      } catch (err) {
        console.error("Failed to load analytics data:", err);
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

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
