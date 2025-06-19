import React, { useState, useEffect, useRef } from 'react'
import {
  FaChevronDown,
  FaEye,
  FaDownload,
  FaSearch,
  FaFilter,
  FaEllipsisV
} from 'react-icons/fa'
import { toast, ToastContainer } from 'react-toastify'
import api from '@/utils/api'
import ActionPopUp from '../../components/actionPopUp'
import Image from 'next/image'
import {
  fetchAllKycRecords,
  searchKycRecords,
  filterKycByStatus,
  downloadKycCsv,
  getKycStatistics,
  approveKyc,
  rejectKyc,
  revokeKyc
} from '../../../../utils/adminKycUtils'

const UsersTable = ({
  userssData,
  currentPage,
  itemsPerPage,
  isLoading,
  actionItem,
  setActionItem,
  refreshData,
  selectedItems = [],
  onItemSelection = () => {},
  onSelectAll = () => {}
}) => {
  const [data, setData] = useState([])
  const [activeRow, setActiveRow] = useState(null)
  const [selectedKyc, setSelectedKyc] = useState(null)
  const [showKycModal, setShowKycModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [kycData, setKycData] = useState([])
  const [kycStats, setKycStats] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  const [showReasonModal, setShowReasonModal] = useState(false)
  const [selectedAction, setSelectedAction] = useState(null)
  const [reason, setReason] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentKycId, setCurrentKycId] = useState(null)
  const actionMenuRef = useRef(null)

  const columns = [
    'User Details',
    'Contact Info',
    'Address',
    'ID Document',
    'Status',
    'Action'
  ]

  // Fetch KYC data on component mount
  useEffect(() => {
    fetchKycData()
  }, [])

  // Close actions dropdown on outside click
  useEffect(() => {
    if (activeRow === null) return
    function handleClickOutside (event) {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target)
      ) {
        setActiveRow(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [activeRow])

  const fetchKycData = async () => {
    try {
      const allKyc = await fetchAllKycRecords()
      setKycData(allKyc)

      const stats = await getKycStatistics()
      setKycStats(stats)
    } catch (error) {
      console.error('Error fetching KYC data:', error)
      toast.error('Failed to fetch KYC data')
    }
  }

  const handleHeaderCheckboxChange = () => {
    const allSelected = data.length > 0 && selectedItems.length === data.length
    if (allSelected) {
      onSelectAll(false)
    } else {
      onSelectAll(true)
    }
  }

  const handleCheckboxChange = item => {
    const isSelected = selectedItems.includes(item.id)
    onItemSelection(item.id, !isSelected)
  }

  const handleActionClick = index => {
    setActiveRow(activeRow === index ? null : index)
  }

  const handleViewKyc = kyc => {
    setSelectedKyc(kyc)
    setShowKycModal(true)
  }

  const handleSearch = async () => {
    try {
      const filteredData = await searchKycRecords(searchTerm)
      setKycData(filteredData)
    } catch (error) {
      console.error('Error searching KYC records:', error)
      toast.error('Search failed')
    }
  }

  const handleStatusFilter = async status => {
    try {
      const filteredData = await filterKycByStatus(status)
      setKycData(filteredData)
      setStatusFilter(status)
    } catch (error) {
      console.error('Error filtering KYC records:', error)
      toast.error('Filter failed')
    }
  }

  const handleExportCsv = () => {
    try {
      downloadKycCsv(
        kycData,
        `kyc_data_${new Date().toISOString().split('T')[0]}.csv`
      )
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

    // This would need to be implemented based on your backend
    toast.info(`Bulk ${action} functionality would be implemented here`)
  }

  const handleActionMenuClick = async (action, kyc) => {
    setActiveRow(null)
    setCurrentKycId(kyc.id)
    setSelectedAction(action)
    if (action === 'Approve') {
      await handleKycAction('Approve', kyc.id)
    } else if (action === 'Reject' || action === 'Revoke') {
      setShowReasonModal(true)
    } else if (action === 'View Details') {
      handleViewKyc(kyc)
    }
  }

  const handleKycAction = async (action, kycId, reasonText = '') => {
    setIsProcessing(true)
    const loadingToast = toast.loading(`Processing ${action} Request...`)
    try {
      let result
      if (action === 'Approve') {
        result = await approveKyc(kycId, reasonText)
      } else if (action === 'Reject') {
        result = await rejectKyc(kycId, reasonText)
      } else if (action === 'Revoke') {
        result = await revokeKyc(kycId, reasonText)
      }
      toast.update(loadingToast, {
        render: result.message || `KYC ${action} Successfully`,
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })
      fetchKycData()
    } catch (err) {
      toast.update(loadingToast, {
        render:
          err.response?.data?.message ||
          err.response?.data?.details ||
          `Failed to ${action.toLowerCase()} KYC`,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      })
    } finally {
      setIsProcessing(false)
      setShowReasonModal(false)
      setReason('')
      setSelectedAction(null)
      setCurrentKycId(null)
    }
  }

  const handleReasonSubmit = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason')
      return
    }
    await handleKycAction(selectedAction, currentKycId, reason)
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const selectedData = kycData.slice(startIndex, startIndex + itemsPerPage)

  const getStatusBadgeClass = kyc => {
    if (kyc.approved) return 'bg-[#00613A] text-white'
    if (kyc.status === 'rejected')
      return 'bg-red-100 text-red-800 border-red-200'
    if (kyc.status === 'revoked')
      return 'bg-gray-100 text-gray-800 border-gray-200'
    return 'bg-[#FDF4EE] text-[#ED7F31] border-[#ED7F3133]'
  }

  const getStatusText = kyc => {
    if (kyc.approved) return 'Approved'
    if (kyc.status === 'rejected') return 'Rejected'
    if (kyc.status === 'revoked') return 'Revoked'
    return 'Pending'
  }

  const getActionOptions = kyc => {
    if (kyc.approved) {
      return ['Revoke', 'View Details']
    } else if (kyc.status === 'rejected') {
      return ['Approve', 'View Details']
    } else if (kyc.status === 'revoked') {
      return ['Approve', 'View Details']
    } else {
      return ['Approve', 'Reject', 'View Details']
    }
  }

  return (
    <>
      {/* KYC Statistics */}
      <div className='mb-6 grid grid-cols-2 md:grid-cols-5 gap-4'>
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-sm text-gray-500'>Total KYC</h3>
          <p className='text-2xl font-bold'>{kycStats.total || 0}</p>
        </div>
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-sm text-gray-500'>Pending</h3>
          <p className='text-2xl font-bold text-orange-600'>
            {kycStats.pending || 0}
          </p>
        </div>
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-sm text-gray-500'>Approved</h3>
          <p className='text-2xl font-bold text-green-600'>
            {kycStats.approved || 0}
          </p>
        </div>
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-sm text-gray-500'>Rejected</h3>
          <p className='text-2xl font-bold text-red-600'>
            {kycStats.rejected || 0}
          </p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className='mb-4 flex flex-wrap gap-4 items-center'>
        <div className='flex-1 min-w-[300px]'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search by name, email, or ID...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
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
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className='mb-4 p-4 bg-gray-50 rounded-lg'>
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
                fetchKycData()
              }}
              className='px-3 py-1 text-sm text-gray-600 hover:text-gray-800'
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className='mb-4 p-4 bg-blue-50 rounded-lg'>
          <div className='flex items-center gap-4'>
            <span className='text-sm text-gray-600'>
              {selectedItems.length} item(s) selected
            </span>
            <button
              onClick={() => handleBulkAction('Approve')}
              className='px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700'
            >
              Bulk Approve
            </button>
            <button
              onClick={() => handleBulkAction('Reject')}
              className='px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700'
            >
              Bulk Reject
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className='text-center py-8'>Loading...</div>
      ) : (
        <div className='w-full rounded-lg'>
          <table className='w-full'>
            <thead>
              <tr className='bg-[#F9FAFB]'>
                <th className='py-[1.3em] px-[1.8em] text-left text-[#6B7280] font-medium'>
                  <input
                    type='checkbox'
                    checked={
                      selectedItems.length > 0 &&
                      selectedItems.length === data.length
                    }
                    onChange={handleHeaderCheckboxChange}
                    className='w-4 h-4'
                  />
                </th>
                {/* User Details always visible */}
                <th className='py-[1.3em] px-[1.8em] text-left text-[#6B7280] font-medium'>
                  User Details
                </th>
                {/* Contact Info hidden on mobile */}
                <th className='py-[1.3em] px-[1.8em] text-left text-[#6B7280] font-medium hidden md:table-cell'>
                  Contact Info
                </th>
                {/* ID Document always visible */}
                <th className='py-[1.3em] px-[1.8em] text-left text-[#6B7280] font-medium'>
                  Details
                </th>
                {/* Status always visible */}
                <th className='py-[1.3em] px-[1.8em] text-left text-[#6B7280] font-medium'>
                  Status
                </th>
                {/* Action always visible */}
                <th className='py-[1.3em] px-[1.8em] text-left text-[#6B7280] font-medium'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedData.map((kyc, idx) => (
                <tr key={idx} className='border-b'>
                  <td className='py-[1.3em] px-[1.8em]'>
                    <input
                      type='checkbox'
                      checked={selectedItems.includes(kyc.id)}
                      onChange={() => handleCheckboxChange(kyc)}
                      className='w-4 h-4'
                    />
                  </td>
                  <td className='py-[1.3em] px-[1.8em]'>
                    <div className='flex items-center gap-3'>
                      <div>
                        <p className='font-medium text-gray-900'>
                          {kyc?.user?.fullname}
                        </p>
                      </div>
                    </div>
                  </td>
                  {/* Contact Info hidden on mobile */}
                  <td className='py-[1.3em] px-[1.8em] hidden md:table-cell'>
                    <div className='space-y-1'>
                      <p className='text-sm text-gray-900'>
                        {kyc?.user?.email}
                      </p>
                      <p className='text-sm text-gray-500'>
                        {kyc?.user?.phone_number || 'Not provided'}
                      </p>
                    </div>
                  </td>

                  <td className='py-[1.3em] px-[1.8em]'>
                    <button
                      onClick={() => handleViewKyc(kyc)}
                      className='flex items-center gap-2 text-blue-600 hover:text-blue-800'
                    >
                      <FaEye className='w-4 h-4' />
                      <span>View Document</span>
                    </button>
                  </td>
                  <td className='py-[1.3em] px-[1.8em]'>
                    <span
                      className={`${getStatusBadgeClass(
                        kyc
                      )} border-[0.1px] rounded-3xl flex w-fit items-center justify-center gap-2 py-1 px-4`}
                    >
                      {getStatusText(kyc)}
                    </span>
                  </td>
                  <td className='py-[1.3em] px-[1.8em] text-[#fff] relative'>
                    <button
                      className='flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      onClick={() =>
                        setActiveRow(activeRow === idx ? null : idx)
                      }
                      aria-label='Actions'
                    >
                      <FaEllipsisV className='w-5 h-5' />
                      <span className='hidden sm:inline'>Actions</span>
                    </button>
                    {activeRow === idx && (
                      <div
                        ref={actionMenuRef}
                        className='absolute right-0 mt-2 z-40 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[160px]'
                      >
                        <ul className='py-1'>
                          {getActionOptions(kyc).map(option => (
                            <li key={option}>
                              <button
                                className='w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800'
                                onClick={() =>
                                  handleActionMenuClick(option, kyc)
                                }
                              >
                                {option}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* KYC Document Modal */}
      {showKycModal && selectedKyc && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-4 sm:p-6 max-w-2xl w-full mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-bold'>KYC Document Details</h2>
              <button
                onClick={() => setShowKycModal(false)}
                className='text-gray-500 hover:text-gray-700'
              >
                <FaChevronDown className='w-6 h-6 transform rotate-180' />
              </button>
            </div>
            <div className='space-y-4'>
              <div className='aspect-video relative bg-gray-100 rounded-lg overflow-hidden'>
                <Image
                  src={selectedKyc.id_document}
                  alt='KYC Document'
                  fill
                  className='object-contain'
                />
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-gray-500'>Full Name</p>
                  <p className='font-medium'>{selectedKyc.user.fullname}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Date of Birth</p>
                  <p className='font-medium'>
                    {selectedKyc.user.date_of_birth}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Gender</p>
                  <p className='font-medium'>{selectedKyc.user.gender}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Email</p>
                  <p className='font-medium'>{selectedKyc.user.email}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Document Type</p>
                  <p className='font-medium'>{selectedKyc.document_type}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Status</p>
                  <p className='font-medium'>{getStatusText(selectedKyc)}</p>
                </div>
                <div className='col-span-1 sm:col-span-2'>
                  <p className='text-sm text-gray-500'>Residential Address</p>
                  <p className='font-medium'>
                    {selectedKyc.user.residential_address}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Created At</p>
                  <p className='font-medium'>
                    {new Date(selectedKyc.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Updated At</p>
                  <p className='font-medium'>
                    {new Date(selectedKyc.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reason Modal */}
      {showReasonModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 max-w-md w-full mx-4'>
            <h3 className='text-lg font-bold mb-4'>
              Provide Reason for {selectedAction}
            </h3>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder={`Enter reason for ${selectedAction?.toLowerCase()}...`}
              className='w-full p-3 border rounded-lg mb-4 h-24 resize-none'
              disabled={isProcessing}
            />
            <div className='flex gap-3 justify-end'>
              <button
                onClick={() => {
                  setShowReasonModal(false)
                  setReason('')
                  setSelectedAction(null)
                  setCurrentKycId(null)
                }}
                className='px-4 py-2 text-gray-600 hover:text-gray-800'
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handleReasonSubmit}
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50'
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default UsersTable
