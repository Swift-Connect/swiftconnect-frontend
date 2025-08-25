'use client'
import React, { useEffect, useState } from 'react'
import { FaDollarSign, FaUsers, FaCreditCard, FaExchangeAlt } from 'react-icons/fa'
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
import { useAnalytics } from '@/hooks/useAnalytics'

const COLORS = ['#4F46E5', '#22D3EE']

// Expected API response shape (example):
// {
//   stats: { total_revenue, total_users, inactive_users, pending_kyc, total_agents },
//   income: [{ name, transactions, utility, agents }],
//   traffic: [{ name, visitors }],
//   user_breakdown: [{ name, value }]
// }

export default function DashboardOverview () {
  const {
    analytics,
    loading,
    error,
    getStatsCards,
    getTransactionData,
    getUserActivityData,
    getUserBreakdownData,
    getServiceData,
    getErrorData,
    getTrafficData,
    formatCurrency
  } = useAnalytics();

  const getIconForStat = (iconType) => {
    switch (iconType) {
      case 'users':
        return <FaUsers className='text-blue-600 text-lg' />;
      case 'active-users':
        return <FaUsers className='text-blue-600 text-lg' />;
      case 'revenue':
        return <FaDollarSign className='text-blue-600 text-lg' />;
      case 'transactions':
        return <FaExchangeAlt className='text-blue-600 text-lg' />;
      case 'kyc':
        return <HiOutlineDocumentText className='text-blue-600 text-lg' />;
      case 'wallets':
        return <FaCreditCard className='text-blue-600 text-lg' />;
      default:
        return <IoIosStats className='text-blue-600 text-lg' />;
    }
  };

  if (loading) {
    return <div className='p-6 text-center'>Loading analytics...</div>
  }
  if (error) {
    return <div className='p-6 text-center text-red-500'>{error}</div>
  }

  return (
    <div className='bg-[#F5FBF7] min-h-screen p-6 space-y-6'>
      {/* Stat Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 w-full p-4 lg:grid-cols-3 xl:grid-cols-6 gap-4'>
        {getStatsCards().map((stat, index) => (
          <Card
            key={index}
            title={stat.title}
            value={stat.value}
            icon={getIconForStat(stat.icon)}
            bgColor={stat.bgColor}
            textColor={stat.textColor}
          />
        ))}
      </div>

      {/* Charts */}
      <div className='py-6 bg-gray-50 flex gap-6'>
        {/* Transaction Volume Chart */}
        <div className='bg-white p-4 rounded-lg shadow w-1/3'>
          <p className='text-gray-500 text-sm'>Transaction Volume ▼</p>
          <h2 className='text-2xl font-bold'>{formatCurrency(getTransactionData().reduce((sum, item) => sum + item.volume, 0))}</h2>
          <p className='text-green-500 text-sm'>Total Volume</p>

          <ResponsiveContainer width='100%' height={200}>
            <LineChart data={getTransactionData()}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Line
                type='monotone'
                dataKey='volume'
                stroke='#1D4ED8'
                strokeWidth={2}
              />
              <Line
                type='monotone'
                dataKey='transactions'
                stroke='#60A5FA'
                strokeWidth={2}
              />
              <Line
                type='monotone'
                dataKey='successful'
                stroke='#10B981'
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className='flex justify-between text-sm mt-4'>
            <p className='text-blue-700'>● Volume</p>
            <p className='text-blue-400'>● Transactions</p>
            <p className='text-green-500'>● Successful</p>
          </div>
        </div>

        {/* User Activity Chart */}
        <div className='bg-white p-4 rounded-lg shadow w-1/3'>
          <p className='text-gray-500 text-sm'>User Activity</p>
          <h2 className='text-2xl font-bold'>
            {getUserActivityData().reduce((sum, item) => sum + (item.active || 0), 0)}{' '}
            Active Users
          </h2>
          <p className='text-green-500 text-sm'>Active Users</p>

          <ResponsiveContainer width='100%' height={200}>
            <BarChart data={getUserActivityData()}>
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Bar dataKey='active' fill='url(#gradient)' barSize={30} />
              <defs>
                <linearGradient id='gradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor='#10B981' stopOpacity={1} />
                  <stop offset='100%' stopColor='#34D399' stopOpacity={1} />
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
                data={getUserBreakdownData()}
                cx='50%'
                cy='50%'
                outerRadius={80}
                fill='#8884d8'
                dataKey='value'
              >
                {getUserBreakdownData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend verticalAlign='bottom' height={36} />
            </PieChart>
          </ResponsiveContainer>

          <div className='space-y-2 mt-4'>
            {getUserBreakdownData().map((item, index) => (
              <div key={item.name} className='flex justify-between text-sm'>
                <div className='flex items-center'>
                  <span 
                    className='w-3 h-3 rounded-full mr-2'
                    style={{ backgroundColor: item.color }}
                  ></span>
                  {item.name}
                </div>
                <p>
                  {item.value > 0
                    ? `${Math.round(
                        (item.value /
                          getUserBreakdownData().reduce((sum, i) => sum + i.value, 0)) *
                        100
                      )}%`
                    : '0%'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
