// components/ServiceRevenue.tsx
import React, { useEffect, useState } from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { fetchWithAuth } from '@/utils/api'

// Expected API response shape (example):
// { service_revenue: [ { title, amount, icon, growth, growthText, growthPositive } ] }

export default function ServiceRevenue () {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchServiceRevenue () {
      setLoading(true)
      setError(null)
      try {
        const analytics = await fetchWithAuth('/api/analytics/')
        setServices(analytics?.service_revenue || [])
      } catch (err) {
        setError('Failed to load service revenue data')
      } finally {
        setLoading(false)
      }
    }
    fetchServiceRevenue()
  }, [])

  if (loading) {
    return <div className='p-6 text-center'>Loading service revenue...</div>
  }
  if (error) {
    return <div className='p-6 text-center text-red-500'>{error}</div>
  }

  return (
    <div className='p-6 bg-green-50'>
      <h2 className='text-2xl font-semibold text-gray-800 mb-6'>
        Service Revenue
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {services.length === 0 ? (
          <div className='col-span-4 text-center text-gray-400'>
            No data available
          </div>
        ) : (
          services.map((service, index) => (
            <div
              key={index}
              className='bg-white rounded-2xl shadow p-6 flex flex-col gap-4'
            >
              <div className='flex items-center justify-between'>
                <h3 className='text-gray-600 text-sm'>{service.title}</h3>
                <div className='bg-gray-100 p-2 rounded-full text-2xl'>
                  {service.icon}
                </div>
              </div>
              <div className='text-2xl font-bold'>{service.amount}</div>
              <div className='flex items-center text-sm'>
                {service.growthPositive ? (
                  <ArrowUpRight className='w-4 h-4 text-emerald-500 mr-1' />
                ) : (
                  <ArrowDownRight className='w-4 h-4 text-rose-500 mr-1' />
                )}
                <span
                  className={`font-medium ${
                    service.growthPositive
                      ? 'text-emerald-500'
                      : 'text-rose-500'
                  }`}
                >
                  {service.growth}
                </span>
                <span className='text-gray-500 ml-1'>{service.growthText}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
