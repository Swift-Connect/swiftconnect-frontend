'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import {
  fetchAllKycRecords,
  fetchPendingKycRequests,
  getKycStatistics,
  searchKycRecords,
  filterKycByStatus,
  downloadKycCsv,
  bulkApproveKyc,
  bulkRejectKyc
} from '../../../utils/adminKycUtils'
import UsersTable from '../dashboard/components/userTable'
import Pagination from '../components/pagination'
import TableTabs from '../components/tableTabs'
import { FaDownload, FaSearch, FaFilter, FaSync } from 'react-icons/fa'

const KYCManagement = () => {
  const router = useRouter()
  const [token, setToken] = useState(null)
  const [activeTab, setActiveTab] = useState('All KYC')
  const [kycData, setKycData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [kycStats, setKycStats] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const itemsPerPage = 10

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
    fetchKycData()
  }, [token])

  const fetchKycData = async () => {
    setIsLoading(true)
    try {
      let data

      switch (activeTab) {
        case 'Pending KYC':
          data = await fetchPendingKycRequests()
          break
        case 'All KYC':
        default:
          data = await fetchAllKycRecords()
          break
      }

      setKycData(data)
      setFilteredData(data)

      const stats = await getKycStatistics()
      setKycStats(stats)
    } catch (error) {
      console.error('Error fetching KYC data:', error)
      toast.error('Failed to fetch KYC data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setFilteredData(kycData)
      return
    }

    try {
      const searchResults = await searchKycRecords(searchTerm)
      setFilteredData(searchResults)
    } catch (error) {
      console.error('Error searching KYC records:', error)
      toast.error('Search failed')
    }
  }

  const handleStatusFilter = async status => {
    if (status === 'all') {
      setFilteredData(kycData)
      setStatusFilter('all')
      return
    }

    try {
      const filteredResults = await filterKycByStatus(status)
      setFilteredData(filteredResults)
      setStatusFilter(status)
    } catch (error) {
      console.error('Error filtering KYC records:', error)
      toast.error('Filter failed')
    }
  }

  const handleExportCsv = () => {
    try {
      const filename = `kyc_data_${activeTab.replace(' ', '_')}_${
        new Date().toISOString().split('T')[0]
      }.csv`
      downloadKycCsv(filteredData, filename)
      toast.success('KYC data exported successfully')
    } catch (error) {
      console.error('Error exporting KYC data:', error)
      toast.error('Export failed')
    }
  }

  const handleBulkAction = async action => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one KYC record')
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to ${action.toLowerCase()} ${
        selectedItems.length
      } KYC record(s)?`
    )

    if (!confirmed) return

    try {
      let results
      if (action === 'Approve') {
        results = await bulkApproveKyc(selectedItems)
      } else if (action === 'Reject') {
        results = await bulkRejectKyc(selectedItems, 'Bulk rejection')
      }

      const successCount = results.filter(r => r.success).length
      const failureCount = results.length - successCount

      if (successCount > 0) {
        toast.success(
          `Successfully ${action.toLowerCase()}d ${successCount} record(s)`
        )
      }
      if (failureCount > 0) {
        toast.error(
          `Failed to ${action.toLowerCase()} ${failureCount} record(s)`
        )
      }

      // Refresh data
      fetchKycData()
      setSelectedItems([])
    } catch (error) {
      console.error(`Error in bulk ${action.toLowerCase()}:`, error)
      toast.error(`Bulk ${action.toLowerCase()} failed`)
    }
  }

  const handleItemSelection = (itemId, isSelected) => {
    if (isSelected) {
      setSelectedItems([...selectedItems, itemId])
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId))
    }
  }

  const handleSelectAll = isSelected => {
    if (isSelected) {
      const allIds = filteredData.map(item => item.id)
      setSelectedItems(allIds)
    } else {
      setSelectedItems([])
    }
  }

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            KYC Management
          </h1>
          <p className='text-gray-600'>Manage and review KYC applications</p>
        </div>

        {/* Statistics Cards */}
        <div className='grid grid-cols-2 md:grid-cols-5 gap-6 mb-8'>
          <div className='bg-white p-6 rounded-lg shadow'>
            <h3 className='text-sm text-gray-500 mb-2'>Total KYC</h3>
            <p className='text-3xl font-bold'>{kycStats.total || 0}</p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow'>
            <h3 className='text-sm text-gray-500 mb-2'>Pending</h3>
            <p className='text-3xl font-bold text-orange-600'>
              {kycStats.pending || 0}
            </p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow'>
            <h3 className='text-sm text-gray-500 mb-2'>Approved</h3>
            <p className='text-3xl font-bold text-green-600'>
              {kycStats.approved || 0}
            </p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow'>
            <h3 className='text-sm text-gray-500 mb-2'>Rejected</h3>
            <p className='text-3xl font-bold text-red-600'>
              {kycStats.rejected || 0}
            </p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow'>
            <h3 className='text-sm text-gray-500 mb-2'>Revoked</h3>
            <p className='text-3xl font-bold text-gray-600'>
              {kycStats.revoked || 0}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className='mb-6'>
          <TableTabs
            header='KYC Management'
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            tabs={['All KYC', 'Pending KYC']}
            from='kyc'
          />
        </div>

        {/* Search and Filter Controls */}
        <div className='bg-white p-6 rounded-lg shadow mb-6'>
          <div className='flex flex-wrap gap-4 items-center'>
            <div className='flex-1 min-w-[300px]'>
              <div className='relative'>
                <input
                  type='text'
                  placeholder='Search by name, email, or ID...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSearch()}
                  className='w-full pl-10 pr-4 py-2 border rounded-lg'
                />
                <FaSearch className='absolute left-3 top-3 text-gray-400' />
              </div>
            </div>

            <button
              onClick={handleSearch}
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
            >
              Search
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className='px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2'
            >
              <FaFilter />
              Filter
            </button>

            <button
              onClick={handleExportCsv}
              className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2'
            >
              <FaDownload />
              Export CSV
            </button>

            <button
              onClick={fetchKycData}
              className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2'
            >
              <FaSync />
              Refresh
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className='mt-4 pt-4 border-t'>
              <div className='flex flex-wrap gap-4 items-center'>
                <label className='flex items-center gap-2'>
                  <span>Status:</span>
                  <select
                    value={statusFilter}
                    onChange={e => handleStatusFilter(e.target.value)}
                    className='px-3 py-1 border rounded'
                  >
                    <option value='all'>All</option>
                    <option value='pending'>Pending</option>
                    <option value='approved'>Approved</option>
                    <option value='rejected'>Rejected</option>
                    <option value='revoked'>Revoked</option>
                  </select>
                </label>

                <button
                  onClick={() => {
                    setStatusFilter('all')
                    setSearchTerm('')
                    setFilteredData(kycData)
                  }}
                  className='px-3 py-1 text-sm text-gray-600 hover:text-gray-800'
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className='bg-blue-50 p-4 rounded-lg mb-6'>
            <div className='flex items-center gap-4'>
              <span className='text-sm text-gray-600'>
                {selectedItems.length} item(s) selected
              </span>
              <button
                onClick={() => handleBulkAction('Approve')}
                className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
              >
                Bulk Approve
              </button>
              <button
                onClick={() => handleBulkAction('Reject')}
                className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
              >
                Bulk Reject
              </button>
              <button
                onClick={() => setSelectedItems([])}
                className='px-3 py-1 text-sm text-gray-600 hover:text-gray-800'
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* KYC Table */}
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          <UsersTable
            userssData={paginatedData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            isLoading={isLoading}
            actionItem={null}
            setActionItem={() => {}}
            refreshData={fetchKycData}
            selectedItems={selectedItems}
            onItemSelection={handleItemSelection}
            onSelectAll={handleSelectAll}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='mt-6'>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default KYCManagement
