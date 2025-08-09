'use client'
import React, { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'
import { fetchWithAuth } from '@/utils/api'

export default function SalesReport ({ analytics }) {
  const [filter, setFilter] = useState('Weekly')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    try {
      // Build series from analytics.transactions volumes by period
      const series = [
        { name: '24h', value: analytics?.transactions?.last_24h?.total_volume ?? 0 },
        { name: '7d', value: analytics?.transactions?.last_7d?.total_volume ?? 0 },
        { name: '30d', value: analytics?.transactions?.last_30d?.total_volume ?? 0 },
        { name: 'All', value: analytics?.transactions?.all_time?.total_volume ?? 0 }
      ]
      setData(series)
    } catch (err) {
      setError('Failed to load sales metrics')
    } finally {
      setLoading(false)
    }
  }, [analytics, filter])

  if (loading) {
    return <div className='p-6 text-center'>Loading sales report...</div>
  }
  if (error) {
    return <div className='p-6 text-center text-red-500'>{error}</div>
  }

  return (
    <div className='bg-white rounded-2xl shadow-md p-6 w-full'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold text-gray-800'>Sales Report</h2>
        <select
          className='border border-gray-300 text-gray-600 rounded-md px-3 py-1 text-sm'
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option>Weekly</option>
          <option>Monthly</option>
          <option>Yearly</option>
        </select>
      </div>

      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray='3 3' vertical={false} />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Line
            type='monotone'
            dataKey='value'
            stroke='#3B82F6'
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            fill='#93C5FD'
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
