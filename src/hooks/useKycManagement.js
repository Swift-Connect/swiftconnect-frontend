import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import {
  fetchAllKycRecords,
  fetchPendingKycRequests,
  getKycStatistics,
  searchKycRecords,
  filterKycByStatus,
  approveKyc,
  rejectKyc,
  revokeKyc,
  bulkApproveKyc,
  bulkRejectKyc,
  downloadKycCsv
} from '../utils/adminKycUtils'

/**
 * Custom hook for KYC management
 * Provides comprehensive KYC management functionality
 */
export const useKycManagement = () => {
  const [kycData, setKycData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [kycStats, setKycStats] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedItems, setSelectedItems] = useState([])
  const [error, setError] = useState(null)

  // Fetch all KYC data
  const fetchKycData = useCallback(async (type = 'all') => {
    setIsLoading(true)
    setError(null)

    try {
      let data

      switch (type) {
        case 'pending':
          data = await fetchPendingKycRequests()
          break
        case 'all':
        default:
          data = await fetchAllKycRecords()
          break
      }

      setKycData(data)
      setFilteredData(data)

      // Get statistics
      const stats = await getKycStatistics()
      setKycStats(stats)

      return data
    } catch (err) {
      console.error('Error fetching KYC data:', err)
      setError(err.message || 'Failed to fetch KYC data')
      toast.error('Failed to fetch KYC data')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Search KYC records
  const searchKyc = useCallback(
    async term => {
      if (!term.trim()) {
        setFilteredData(kycData)
        return kycData
      }

      try {
        const results = await searchKycRecords(term)
        setFilteredData(results)
        return results
      } catch (err) {
        console.error('Error searching KYC records:', err)
        toast.error('Search failed')
        throw err
      }
    },
    [kycData]
  )

  // Filter KYC records by status
  const filterKyc = useCallback(
    async status => {
      if (status === 'all') {
        setFilteredData(kycData)
        return kycData
      }

      try {
        const results = await filterKycByStatus(status)
        setFilteredData(results)
        return results
      } catch (err) {
        console.error('Error filtering KYC records:', err)
        toast.error('Filter failed')
        throw err
      }
    },
    [kycData]
  )

  // Approve KYC
  const approveKycRecord = useCallback(
    async (kycId, reason = '') => {
      try {
        const result = await approveKyc(kycId, reason)
        toast.success('KYC approved successfully')

        // Refresh data
        await fetchKycData()

        return result
      } catch (err) {
        console.error('Error approving KYC:', err)
        toast.error(err.response?.data?.message || 'Failed to approve KYC')
        throw err
      }
    },
    [fetchKycData]
  )

  // Reject KYC
  const rejectKycRecord = useCallback(
    async (kycId, reason) => {
      try {
        const result = await rejectKyc(kycId, reason)
        toast.success('KYC rejected successfully')

        // Refresh data
        await fetchKycData()

        return result
      } catch (err) {
        console.error('Error rejecting KYC:', err)
        toast.error(err.response?.data?.message || 'Failed to reject KYC')
        throw err
      }
    },
    [fetchKycData]
  )

  // Revoke KYC
  const revokeKycRecord = useCallback(
    async (kycId, reason) => {
      try {
        const result = await revokeKyc(kycId, reason)
        toast.success('KYC revoked successfully')

        // Refresh data
        await fetchKycData()

        return result
      } catch (err) {
        console.error('Error revoking KYC:', err)
        toast.error(err.response?.data?.message || 'Failed to revoke KYC')
        throw err
      }
    },
    [fetchKycData]
  )

  // Bulk approve KYC
  const bulkApproveKycRecords = useCallback(
    async (kycIds, reason = '') => {
      if (kycIds.length === 0) {
        toast.error('Please select at least one KYC record')
        return
      }

      try {
        const results = await bulkApproveKyc(kycIds, reason)

        const successCount = results.filter(r => r.success).length
        const failureCount = results.length - successCount

        if (successCount > 0) {
          toast.success(`Successfully approved ${successCount} record(s)`)
        }
        if (failureCount > 0) {
          toast.error(`Failed to approve ${failureCount} record(s)`)
        }

        // Refresh data
        await fetchKycData()
        setSelectedItems([])

        return results
      } catch (err) {
        console.error('Error in bulk approve:', err)
        toast.error('Bulk approve failed')
        throw err
      }
    },
    [fetchKycData]
  )

  // Bulk reject KYC
  const bulkRejectKycRecords = useCallback(
    async (kycIds, reason) => {
      if (kycIds.length === 0) {
        toast.error('Please select at least one KYC record')
        return
      }

      try {
        const results = await bulkRejectKyc(kycIds, reason)

        const successCount = results.filter(r => r.success).length
        const failureCount = results.length - successCount

        if (successCount > 0) {
          toast.success(`Successfully rejected ${successCount} record(s)`)
        }
        if (failureCount > 0) {
          toast.error(`Failed to reject ${failureCount} record(s)`)
        }

        // Refresh data
        await fetchKycData()
        setSelectedItems([])

        return results
      } catch (err) {
        console.error('Error in bulk reject:', err)
        toast.error('Bulk reject failed')
        throw err
      }
    },
    [fetchKycData]
  )

  // Export KYC data
  const exportKycData = useCallback(
    (data = filteredData, filename = null) => {
      try {
        const defaultFilename = `kyc_data_${
          new Date().toISOString().split('T')[0]
        }.csv`
        downloadKycCsv(data, filename || defaultFilename)
        toast.success('KYC data exported successfully')
      } catch (err) {
        console.error('Error exporting KYC data:', err)
        toast.error('Export failed')
        throw err
      }
    },
    [filteredData]
  )

  // Handle item selection
  const handleItemSelection = useCallback((itemId, isSelected) => {
    if (isSelected) {
      setSelectedItems(prev => [...prev, itemId])
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId))
    }
  }, [])

  // Handle select all
  const handleSelectAll = useCallback(
    isSelected => {
      if (isSelected) {
        const allIds = filteredData.map(item => item.id)
        setSelectedItems(allIds)
      } else {
        setSelectedItems([])
      }
    },
    [filteredData]
  )

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedItems([])
  }, [])

  // Clear filters
  const clearFilters = useCallback(() => {
    setSearchTerm('')
    setStatusFilter('all')
    setFilteredData(kycData)
  }, [kycData])

  // Initialize data on mount
  useEffect(() => {
    fetchKycData()
  }, [fetchKycData])

  return {
    // State
    kycData,
    filteredData,
    isLoading,
    kycStats,
    searchTerm,
    statusFilter,
    selectedItems,
    error,

    // Actions
    fetchKycData,
    searchKyc,
    filterKyc,
    approveKycRecord,
    rejectKycRecord,
    revokeKycRecord,
    bulkApproveKycRecords,
    bulkRejectKycRecords,
    exportKycData,

    // Selection handlers
    handleItemSelection,
    handleSelectAll,
    clearSelection,

    // Filter handlers
    setSearchTerm,
    setStatusFilter,
    clearFilters,

    // Utility functions
    getStatusBadgeClass: kyc => {
      if (kyc.approved) return 'bg-[#00613A] text-white'
      if (kyc.status === 'rejected')
        return 'bg-red-100 text-red-800 border-red-200'
      if (kyc.status === 'revoked')
        return 'bg-gray-100 text-gray-800 border-gray-200'
      return 'bg-[#FDF4EE] text-[#ED7F31] border-[#ED7F3133]'
    },

    getStatusText: kyc => {
      if (kyc.approved) return 'Approved'
      if (kyc.status === 'rejected') return 'Rejected'
      if (kyc.status === 'revoked') return 'Revoked'
      return 'Pending'
    },

    getActionOptions: kyc => {
      if (kyc.approved) {
        return ['Revoke', 'View Details']
      } else if (kyc.status === 'rejected') {
        return ['Approve', 'View Details']
      } else if (kyc.status === 'revoked') {
        return ['Approve', 'View Details']
      } else {
        return ['Approved', 'Not Approved', 'View Details']
      }
    }
  }
}
