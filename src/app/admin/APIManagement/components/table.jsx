import React, { useState, useEffect } from 'react'
import { Edit, Trash2, AlertCircle, Loader2, Power } from 'lucide-react'
import { toast } from 'react-toastify'
import api from '@/utils/api'
import CreateNewKey from './createNewKey'

// Skeleton loader component
const TableSkeleton = () => (
  <div className='animate-pulse'>
    <div className='h-10 bg-gray-200 rounded-lg mb-4'></div>
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i} className='h-16 bg-gray-100 rounded-lg mb-2'></div>
    ))}
  </div>
)

export default function APIManagementTable () {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchConfigs = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/payments/payment-configs/')
      setData(response.data)
    } catch (err) {
      setError('Failed to load payment configurations. Please try again later.')
      toast.error('Failed to load payment configurations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfigs()
  }, [])

  const handleCreate = async formData => {
    try {
      setIsSubmitting(true)
      // If the new gateway is active, deactivate all others
      if (formData.is_active) {
        await Promise.all(
          data.map(config =>
            api.put(`/payments/payment-configs/${config.id}/`, {
              ...config,
              gateway_info: {
                ...config.gateway_info,
                [formData.active_gateway]: {
                  ...config.gateway_info[formData.active_gateway],
                  is_active: true
                }
              }
            })
          )
        )
      }
      await api.post('/payments/payment-configs/', formData)
      toast.success('Payment gateway configured successfully')
      setShowModal(false)
      fetchConfigs()
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to configure payment gateway'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async formData => {
    try {
      setIsSubmitting(true)
      // If this gateway is being activated, deactivate all others
      if (formData.is_active) {
        await Promise.all(
          data
            .filter(config => config.id !== editData.id)
            .map(config =>
              api.put(`/payments/payment-configs/${config.id}/`, {
                ...config,
                gateway_info: {
                  ...config.gateway_info,
                  [formData.active_gateway]: {
                    ...config.gateway_info[formData.active_gateway],
                    is_active: true
                  }
                }
              })
            )
        )
      }
      await api.put(`/payments/payment-configs/${editData.id}/`, formData)
      toast.success('Payment gateway updated successfully')
      setShowModal(false)
      setEditData(null)
      fetchConfigs()
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to update payment gateway'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this configuration?'))
      return

    try {
      setIsSubmitting(true)
      await api.delete(`/payments/payment-configs/${id}/`)
      toast.success('Payment gateway deleted successfully')
      fetchConfigs()
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to delete payment gateway'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const getGatewayIcon = gateway => {
    switch (gateway.toLowerCase()) {
      case 'flutterwave':
        return '💳'
      case 'paystack':
        return '💸'
      case 'monify':
        return '💰'
      default:
        return '🔑'
    }
  }

  const getStatusBadge = isActive => (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )

  // Transform data to show all gateways
  const transformedData = data.flatMap(config =>
    Object.entries(config.gateway_info)
      .map(([key, info]) => ({
        id: config.id,
        gateway: key,
        ...info,
        config_updated_at: config.updated_at
      }))
      .sort((a, b) => {
        // Sort by active status first (active gateways come first)
        if (a.is_active && !b.is_active) return -1
        if (!a.is_active && b.is_active) return 1
        // If both have same active status, sort by name
        return a.name.localeCompare(b.name)
      })
  )

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = transformedData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(transformedData.length / itemsPerPage)

  const handleToggleGateway = async item => {
    setIsSubmitting(true)
    const loadingToast = toast.loading(
      `${item.is_active ? 'Deactivating' : 'Activating'} ${item.name}...`
    )

    try {
      const updatedGatewayInfo = {
        ...data[0].gateway_info,
        [item.gateway]: {
          ...item,
          is_active: !item.is_active,
          updated_at: new Date().toISOString()
        }
      }

      // Deactivate other gateways if activating this one
      if (!item.is_active) {
        Object.keys(updatedGatewayInfo).forEach(key => {
          if (key !== item.gateway) {
            updatedGatewayInfo[key] = {
              ...updatedGatewayInfo[key],
              is_active: false
            }
          }
        })
      }

      const response = await api.put(`/payments/payment-configs/${item.id}/`, {
        active_gateway: !item.is_active ? item.gateway : null,
        gateway_info: updatedGatewayInfo
      })

      if (response.status === 200) {
        // Fetch fresh data immediately after successful update
        await fetchConfigs()

        toast.update(loadingToast, {
          render: `${item.name} ${
            item.is_active ? 'deactivated' : 'activated'
          } successfully!`,
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
      } else {
        throw new Error('Failed to update gateway status')
      }
    } catch (error) {
      // Even on error, try to fetch fresh data to ensure UI is in sync
      await fetchConfigs()

      toast.update(loadingToast, {
        render: error.message || 'Failed to update gateway status',
        type: 'error',
        isLoading: false,
        autoClose: 4000
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <TableSkeleton />
  }

  if (error) {
    return (
      <div className='text-center py-8'>
        <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
        <h3 className='text-lg font-medium text-gray-900 mb-2'>
          Error Loading Data
        </h3>
        <p className='text-gray-500 mb-4'>{error}</p>
        <button
          onClick={fetchConfigs}
          className='px-4 py-2 bg-[#00613A] text-white rounded-lg hover:bg-[#004d2e]'
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className='bg-white rounded-lg shadow'>
      <div className='p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-semibold'>
            Payment Gateway Configurations
          </h2>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Gateway
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Last Updated
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {currentItems.map(item => (
                <tr key={`${item.id}-${item.gateway}`}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <span className='text-2xl mr-2'>
                        {getGatewayIcon(item.gateway)}
                      </span>
                      <div>
                        <div className='text-sm font-medium text-gray-900'>
                          {item.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {getStatusBadge(item.is_active)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {item.updated_at
                      ? new Date(item.updated_at).toLocaleDateString()
                      : 'Never'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <button
                      onClick={() => handleToggleGateway(item)}
                      className={`px-3 py-1 rounded-lg flex items-center space-x-2 ${
                        item.is_active
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className='w-4 h-4 animate-spin' />
                      ) : (
                        <Power className='w-4 h-4' />
                      )}
                      <span>{item.is_active ? 'Deactivate' : 'Activate'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex justify-between items-center mt-4'>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className='px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50'
            >
              Previous
            </button>
            <span className='text-sm text-gray-700'>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50'
            >
              Next
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <CreateNewKey
          onClose={() => {
            setShowModal(false)
            setEditData(null)
          }}
          onSubmit={editData ? handleUpdate : handleCreate}
          editData={editData}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}
