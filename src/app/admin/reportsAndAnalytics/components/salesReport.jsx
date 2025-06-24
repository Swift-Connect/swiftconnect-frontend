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

export default function SalesReport () {
  const [filter, setFilter] = useState('Weekly')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchMetrics () {
      setLoading(true)
      setError(null)
      try {
        // If the API supports filter, add query param, else just fetch all
        let url = '/api/analytics/metrics/'
        // Example: if (filter === "Monthly") url += "?period=monthly";
        const metrics = await fetchWithAuth(url)
        // Assume metrics is an array of { name, value } for the chart
        setData(metrics || [])
      } catch (err) {
        setError('Failed to load sales metrics')
      } finally {
        setLoading(false)
      }
    }
    fetchMetrics()
  }, [filter])

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
