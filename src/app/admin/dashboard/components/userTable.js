
import React, { useState, useEffect, useRef } from 'react'
import {
  FaChevronDown,
  FaEye,
  FaDownload,
  FaSearch,
  FaFilter,
  FaEllipsisV,
  FaCheck,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone
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
  const [showImagePreview, setShowImagePreview] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const actionMenuRef = useRef(null)

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

  // Handle ESC key for image preview
  useEffect(() => {
    function handleKeyDown (event) {
      if (event.key === 'Escape' && showImagePreview) {
        setShowImagePreview(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showImagePreview])

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

  const handleImagePreview = (imageUrl) => {
    setPreviewImage(imageUrl)
    setShowImagePreview(true)
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
    if (kyc.approved) return 'bg-green-100 text-green-800 border-green-200'
    if (kyc.status === 'rejected')
      return 'bg-red-100 text-red-800 border-red-200'
    if (kyc.status === 'revoked')
      return 'bg-gray-100 text-gray-800 border-gray-200'
    return 'bg-yellow-100 text-yellow-800 border-yellow-200'
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

  const getDocumentTypeName = (documentType) => {
    const documentTypeMap = {
      'DL': "Driver's License",
      'NI': "National ID", 
      'IP': "International Passport"
    }
    return documentTypeMap[documentType] || documentType || 'N/A'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading KYC data...</span>
      </div>
    );
  }

  return (
    <>
      {/* KYC Statistics */}
      <div className='mb-6 grid grid-cols-2 md:grid-cols-4 gap-4'>
        <div className='bg-white p-4 rounded-lg shadow border'>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaUser className="text-blue-600" />
            </div>
            <div className="ml-3">
              <p className='text-sm text-gray-500'>Total KYC</p>
              <p className='text-xl font-bold text-gray-900'>{kycStats.total || 0}</p>
            </div>
          </div>
        </div>
        <div className='bg-white p-4 rounded-lg shadow border'>
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FaEye className="text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className='text-sm text-gray-500'>Pending</p>
              <p className='text-xl font-bold text-yellow-600'>{kycStats.pending || 0}</p>
            </div>
          </div>
        </div>
        <div className='bg-white p-4 rounded-lg shadow border'>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaCheck className="text-green-600" />
            </div>
            <div className="ml-3">
              <p className='text-sm text-gray-500'>Approved</p>
              <p className='text-xl font-bold text-green-600'>{kycStats.approved || 0}</p>
            </div>
          </div>
        </div>
        <div className='bg-white p-4 rounded-lg shadow border'>
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FaTimes className="text-red-600" />
            </div>
            <div className="ml-3">
              <p className='text-sm text-gray-500'>Rejected</p>
              <p className='text-xl font-bold text-red-600'>{kycStats.rejected || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className='mb-6 flex flex-wrap gap-4 items-center'>
        <div className='flex-1 min-w-[300px]'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search by name, email, or ID...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
            <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
          </div>
        </div>

        <button
          onClick={handleSearch}
          className='px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors'
        >
          Search
        </button>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className='px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 flex items-center gap-2 transition-colors'
        >
          <FaFilter />
          Filter
        </button>

        <button
          onClick={handleExportCsv}
          className='px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 flex items-center gap-2 transition-colors'
        >
          <FaDownload />
          Export
        </button>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className='mb-6 p-4 bg-gray-50 rounded-lg border'>
          <div className='flex flex-wrap gap-4 items-center'>
            <label className='flex items-center gap-2'>
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <select
                value={statusFilter}
                onChange={e => handleStatusFilter(e.target.value)}
                className='px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
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
              className='px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50'
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className='mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200'>
          <div className='flex items-center gap-4'>
            <span className='text-sm text-blue-800 font-medium'>
              {selectedItems.length} item(s) selected
            </span>
            <button
              onClick={() => handleBulkAction('Approve')}
              className='px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500'
            >
              Bulk Approve
            </button>
            <button
              onClick={() => handleBulkAction('Reject')}
              className='px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500'
            >
              Bulk Reject
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className='bg-white rounded-lg shadow border overflow-hidden'>
        {/* Desktop view */}
        <div className="hidden lg:block overflow-x-auto">
          <table className='w-full'>
            <thead>
              <tr className='bg-gray-50 border-b border-gray-200'>
                <th className='py-3 px-4 text-left'>
                  <input
                    type='checkbox'
                    checked={
                      selectedItems.length > 0 &&
                      selectedItems.length === data.length
                    }
                    onChange={handleHeaderCheckboxChange}
                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
                  />
                </th>
                <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  User Details
                </th>
                <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Contact
                </th>
                <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Document
                </th>
                <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {selectedData.map((kyc, idx) => (
                <tr key={kyc.id} className='hover:bg-gray-50'>
                  <td className='py-4 px-4'>
                    <input
                      type='checkbox'
                      checked={selectedItems.includes(kyc.id)}
                      onChange={() => handleCheckboxChange(kyc)}
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
                    />
                  </td>
                  <td className='py-4 px-4'>
                    <div className='flex items-center'>
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <FaUser className="text-gray-600" />
                      </div>
                      <div className="ml-3">
                        <p className='text-sm font-medium text-gray-900'>
                          {kyc?.user_fullname || 'N/A'}
                        </p>
                        <p className='text-sm text-gray-500'>
                          @{kyc?.user_username || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className='py-4 px-4'>
                    <div className='space-y-1'>
                      <div className="flex items-center text-sm text-gray-900">
                        <FaEnvelope className="mr-2 text-gray-400" />
                        {kyc?.user_email || 'N/A'}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaPhone className="mr-2 text-gray-400" />
                        {kyc?.user_phone_number || 'Not provided'}
                      </div>
                    </div>
                  </td>
                  <td className='py-4 px-4'>
                    <button
                      onClick={() => handleViewKyc(kyc)}
                      className='flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium'
                    >
                      <FaEye className='w-4 h-4' />
                      View Document
                    </button>
                  </td>
                  <td className='py-4 px-4'>
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(kyc)}`}
                    >
                      {getStatusText(kyc)}
                    </span>
                  </td>
                  <td className='py-4 px-4 relative'>
                    <button
                      className='flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                      onClick={() =>
                        setActiveRow(activeRow === idx ? null : idx)
                      }
                    >
                      <FaEllipsisV className='w-4 h-4' />
                      Actions
                    </button>
                    {activeRow === idx && (
                      <div
                        ref={actionMenuRef}
                        className='absolute right-0 mt-2 z-40 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[160px]'
                      >
                        <div className='py-1'>
                          {getActionOptions(kyc).map(option => (
                            <button
                              key={option}
                              className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100'
                              onClick={() =>
                                handleActionMenuClick(option, kyc)
                              }
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile view */}
        <div className="lg:hidden">
          {selectedData.map((kyc, idx) => (
            <div key={kyc.id} className="border-b border-gray-200 p-4">
              <div className="flex items-start space-x-3">
                <input
                  type='checkbox'
                  checked={selectedItems.includes(kyc.id)}
                  onChange={() => handleCheckboxChange(kyc)}
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mt-1'
                />
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <FaUser className="text-gray-600 text-sm" />
                    </div>
                    <div className="ml-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {kyc?.user_fullname || 'N/A'}
                      </h4>
                      <p className="text-xs text-gray-500">@{kyc?.user_username || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600 mb-3">
                    <div className="flex items-center">
                      <FaEnvelope className="mr-2" />
                      {kyc?.user_email || 'N/A'}
                    </div>
                    <div className="flex items-center">
                      <FaPhone className="mr-2" />
                      {kyc?.user_phone_number || 'Not provided'}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(kyc)}`}>
                      {getStatusText(kyc)}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewKyc(kyc)}
                        className="text-blue-600 text-sm hover:text-blue-800"
                      >
                        <FaEye />
                      </button>
                      <button
                        className='text-gray-600 text-sm hover:text-gray-800'
                        onClick={() =>
                          setActiveRow(activeRow === idx ? null : idx)
                        }
                      >
                        <FaEllipsisV />
                      </button>
                    </div>
                  </div>
                  
                  {activeRow === idx && (
                    <div className="mt-2 border-t pt-2">
                      <div className="flex flex-wrap gap-2">
                        {getActionOptions(kyc).map(option => (
                          <button
                            key={option}
                            className='px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200'
                            onClick={() =>
                              handleActionMenuClick(option, kyc)
                            }
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">👤</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No KYC records found</h3>
            <p className="text-gray-500">There are no KYC records to display at the moment.</p>
          </div>
        )}
      </div>

      {/* KYC Document Modal */}
      {showKycModal && selectedKyc && selectedKyc.id && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-bold text-gray-900'>KYC Document Details</h2>
              <button
                onClick={() => setShowKycModal(false)}
                className='text-gray-400 hover:text-gray-600 transition-colors'
              >
                <FaTimes className='w-6 h-6' />
              </button>
            </div>
            <div className='space-y-6'>
              <div className='aspect-video relative bg-gray-100 rounded-lg overflow-hidden'>
                {selectedKyc.id_document && selectedKyc.id_document !== null ? (
                  <>
                    <img
                      src={selectedKyc.id_document}
                      alt='KYC Document'
                      className='w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity'
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                      onClick={() => handleImagePreview(selectedKyc.id_document)}
                    />
                    <div className='absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs'>
                      Click to zoom
                    </div>
                  </>
                ) : null}
                <div className='absolute inset-0 flex items-center justify-center bg-gray-100' style={{ display: (selectedKyc.id_document && selectedKyc.id_document !== null) ? 'none' : 'flex' }}>
                  <div className='text-center'>
                    <FaEye className='w-12 h-12 text-gray-400 mx-auto mb-2' />
                    <p className='text-gray-500 text-sm'>User did not submit document</p>
                  </div>
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className="space-y-1">
                  <p className='text-sm font-medium text-gray-900'>Full Name</p>
                  <p className='text-sm text-gray-600'>{selectedKyc.user_fullname || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className='text-sm font-medium text-gray-900'>Email</p>
                  <p className='text-sm text-gray-600'>{selectedKyc.user_email || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className='text-sm font-medium text-gray-900'>Username</p>
                  <p className='text-sm text-gray-600'>{selectedKyc.user_username || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className='text-sm font-medium text-gray-900'>Document Type</p>
                  <p className='text-sm text-gray-600'>{getDocumentTypeName(selectedKyc.document_type)}</p>
                </div>
                <div className="space-y-1">
                  <p className='text-sm font-medium text-gray-900'>Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(selectedKyc)}`}>
                    {getStatusText(selectedKyc)}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className='text-sm font-medium text-gray-900'>Submitted Date</p>
                  <p className='text-sm text-gray-600'>
                    {selectedKyc.created_at
                      ? new Date(selectedKyc.created_at).toLocaleDateString()
                      : 'N/A'}
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
            <h3 className='text-lg font-bold mb-4 text-gray-900'>
              Provide Reason for {selectedAction}
            </h3>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder={`Enter reason for ${selectedAction?.toLowerCase()}...`}
              className='w-full p-3 border border-gray-300 rounded-lg mb-4 h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
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
                className='px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50'
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handleReasonSubmit}
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 focus:ring-2 focus:ring-blue-500'
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImagePreview && (
       <div
       className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
       onClick={() => setShowImagePreview(false)}
     >
       <div
         className="relative max-w-full max-h-full overflow-auto"
         onClick={(e) => e.stopPropagation()} // prevent close on image click
       >
         <button
           onClick={() => setShowImagePreview(false)}
           className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-colors"
         >
           <FaTimes className="w-6 h-6" />
         </button>
         
         <img
           src={previewImage}
           alt="Preview"
           className="max-w-none object-contain"
           style={{ transformOrigin: "center center" }}
           onWheel={(e) => {
             e.target.style.transform = `scale(${Math.max(0.5, Math.min(3, (parseFloat(e.target.dataset.scale) || 1) + e.deltaY * -0.001))})`;
             e.target.dataset.scale = parseFloat(e.target.dataset.scale) || 1;
           }}
         />
       </div>
     </div>
      )}
    </>
  )
}

export default UsersTable
