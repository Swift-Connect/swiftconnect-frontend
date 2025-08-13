import React, { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { fetchWithAuth } from '@/utils/api'

// Expected API response shape (example):
// { agents: [ { name, referrals, volume, completion } ], engagement: [ { day, active, inactive } ] }

export default function Dashboard ({ analytics }) {
  const [agents, setAgents] = useState([])
  const [engagementData, setEngagementData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    try {
      setAgents(analytics?.agents || [])
      setEngagementData(
        analytics?.engagement || [
          { day: '24h', active: analytics?.users?.active_users_24h ?? 0, inactive: Math.max((analytics?.users?.total_users ?? 0) - (analytics?.users?.active_users_24h ?? 0), 0) },
          { day: '7d', active: analytics?.users?.active_users_7d ?? 0, inactive: Math.max((analytics?.users?.total_users ?? 0) - (analytics?.users?.active_users_7d ?? 0), 0) },
          { day: '30d', active: analytics?.users?.active_users_30d ?? 0, inactive: Math.max((analytics?.users?.total_users ?? 0) - (analytics?.users?.active_users_30d ?? 0), 0) }
        ]
      )
    } catch (err) {
      setError('Failed to load agent/engagement data')
    } finally {
      setLoading(false)
    }
  }, [analytics])

  if (loading) {
    return (
      <div className='p-6 text-center'>Loading agent/engagement data...</div>
    )
  }
  if (error) {
    return <div className='p-6 text-center text-red-500'>{error}</div>
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-gray-50 min-h-screen'>
      {/* Top-performing agents */}
      <div className='bg-white rounded-2xl shadow-md p-6'>
        <h2 className='text-xl font-semibold mb-2'>Top-performing agents</h2>
        <p className='text-sm text-gray-500 mb-6'>
          Based on referrals and transaction volume
        </p>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left'>
            <thead className='text-gray-500 border-b'>
              <tr>
                <th className='py-3'>Agents</th>
                <th className='py-3'>No of Referrals</th>
                <th className='py-3'>Transaction Volume</th>
                <th className='py-3'>Completion</th>
              </tr>
            </thead>
            <tbody>
              {agents.length === 0 ? (
                <tr>
                  <td colSpan={4} className='text-center text-gray-400'>
                    No data available
                  </td>
                </tr>
              ) : (
                agents.map((agent, idx) => (
                  <tr key={idx} className='border-b'>
                    <td className='py-4 flex items-center gap-3'>
                      <div className='w-8 h-8 rounded-full bg-gray-200'></div>
                      <span className='font-medium'>{agent.name}</span>
                    </td>
                    <td className='text-blue-600 py-4'>
                      {agent.referrals?.toLocaleString?.() ??
                        agent.referrals ??
                        '-'}
                    </td>
                    <td className='py-4'>{agent.volume ?? '-'}</td>
                    <td className='py-4'>
                      <div className='flex items-center gap-2'>
                        <span>{agent.completion ?? 0}%</span>
                        <div className='relative w-24 h-2 bg-gray-200 rounded-full overflow-hidden'>
                          <div
                            className={`absolute top-0 left-0 h-full ${
                              agent.completion === 100
                                ? 'bg-green-500'
                                : 'bg-blue-600'
                            }`}
                            style={{ width: `${agent.completion ?? 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users Engagement Trends */}
      <div className='bg-white rounded-2xl shadow-md p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-semibold'>Users Engagement trends</h2>
          <span className='text-sm text-gray-500'>This Week</span>
        </div>
        <ResponsiveContainer width='100%' height={250}>
          <BarChart data={engagementData}>
            <CartesianGrid strokeDasharray='3 3' vertical={false} />
            <XAxis dataKey='day' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey='active'
              fill='#2563EB'
              name='Active'
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey='inactive'
              fill='#67E8F9'
              name='Inactive'
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
