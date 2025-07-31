import api from './api'

/**
 * Admin KYC Management Utilities
 * Provides comprehensive KYC management functions for admin users
 */

/**
 * Fetch all KYC records (admin only)
 * @returns {Promise<Array>} Array of all KYC records
 */
export const fetchAllKycRecords = async () => {
  try {
    const response = await api.get('/users/all-kyc/')
    return response.data
  } catch (error) {
    console.error('Error fetching all KYC records:', error)
    throw error
  }
}

/**
 * Fetch pending KYC requests
 * @returns {Promise<Array>} Array of pending KYC requests
 */
export const fetchPendingKycRequests = async () => {
  try {
    const response = await api.get('/users/pending-kyc-requests/')
    return response.data
  } catch (error) {
    console.error('Error fetching pending KYC requests:', error)
    throw error
  }
}

/**
 * Approve KYC request
 * @param {number} kycId - KYC record ID
 * @param {string} reason - Optional reason for approval
 * @returns {Promise<Object>} Response data
 */
export const approveKyc = async (kycId, reason = '') => {
  try {
    const response = await api.patch(`/users/kyc/manage/${kycId}/`, {
      action: 'approve',
      reason: reason
    })
    return response.data
  } catch (error) {
    console.error('Error approving KYC:', error)
    throw error
  }
}

/**
 * Reject KYC request
 * @param {number} kycId - KYC record ID
 * @param {string} reason - Reason for rejection
 * @returns {Promise<Object>} Response data
 */
export const rejectKyc = async (kycId, reason) => {
  try {
    const response = await api.patch(`/users/kyc/manage/${kycId}/`, {
      action: 'reject',
      reason: reason
    })
    return response.data
  } catch (error) {
    console.error('Error rejecting KYC:', error)
    throw error
  }
}

/**
 * Revoke KYC approval
 * @param {number} kycId - KYC record ID
 * @param {string} reason - Reason for revocation
 * @returns {Promise<Object>} Response data
 */
export const revokeKyc = async (kycId, reason) => {
  try {
    const response = await api.patch(`/users/kyc/manage/${kycId}/`, {
      action: 'revoke',
      reason: reason
    })
    return response.data
  } catch (error) {
    console.error('Error revoking KYC:', error)
    throw error
  }
}

/**
 * Get KYC statistics
 * @returns {Promise<Object>} KYC statistics
 */
export const getKycStatistics = async () => {
  try {
    const allKyc = await fetchAllKycRecords()
    const pendingKyc = await fetchPendingKycRequests()

    const stats = {
      total: allKyc.length,
      pending: pendingKyc.length,
      approved: allKyc.filter(kyc => kyc.approved).length,
      rejected: allKyc.filter(kyc => !kyc.approved && kyc.status === 'rejected')
        .length,
      revoked: allKyc.filter(kyc => kyc.status === 'revoked').length
    }

    return stats
  } catch (error) {
    console.error('Error getting KYC statistics:', error)
    throw error
  }
}

/**
 * Search KYC records by user details
 * @param {string} searchTerm - Search term (name, email, etc.)
 * @returns {Promise<Array>} Filtered KYC records
 */
export const searchKycRecords = async searchTerm => {
  try {
    const allKyc = await fetchAllKycRecords()

    if (!searchTerm) return allKyc

    const filtered = allKyc.filter(
      kyc =>
        kyc.user?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kyc.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kyc.user?.id?.toString().includes(searchTerm)
    )

    return filtered
  } catch (error) {
    console.error('Error searching KYC records:', error)
    throw error
  }
}

/**
 * Filter KYC records by status
 * @param {string} status - Status to filter by (pending, approved, rejected, revoked)
 * @returns {Promise<Array>} Filtered KYC records
 */
export const filterKycByStatus = async status => {
  try {
    const allKyc = await fetchAllKycRecords()

    if (!status || status === 'all') return allKyc

    const filtered = allKyc.filter(kyc => {
      if (status === 'pending') return !kyc.approved
      if (status === 'approved') return kyc.approved
      if (status === 'rejected')
        return !kyc.approved && kyc.status === 'rejected'
      if (status === 'revoked') return kyc.status === 'revoked'
      return true
    })

    return filtered
  } catch (error) {
    console.error('Error filtering KYC records:', error)
    throw error
  }
}

/**
 * Get KYC record by ID
 * @param {number} kycId - KYC record ID
 * @returns {Promise<Object>} KYC record
 */
export const getKycById = async kycId => {
  try {
    const allKyc = await fetchAllKycRecords()
    const kyc = allKyc.find(k => k.id === kycId)

    if (!kyc) {
      throw new Error('KYC record not found')
    }

    return kyc
  } catch (error) {
    console.error('Error getting KYC by ID:', error)
    throw error
  }
}

/**
 * Export KYC data to CSV format
 * @param {Array} kycData - KYC data to export
 * @returns {string} CSV formatted string
 */
export const exportKycToCsv = kycData => {
  const headers = [
    'ID',
    'User ID',
    'Full Name',
    'Email',
    'Phone Number',
    'Date of Birth',
    'Gender',
    'Address',
    'Document Type',
    'Status',
    'Created At',
    'Updated At'
  ]

  const csvContent = [
    headers.join(','),
    ...kycData.map(kyc =>
      [
        kyc.id,
        kyc.user?.id || '',
        `"${kyc.user?.fullname || ''}"`,
        kyc.user?.email || '',
        kyc.user?.phone_number || '',
        kyc.user?.date_of_birth || '',
        kyc.user?.gender || '',
        `"${kyc.user?.residential_address || ''}"`,
        kyc.document_type || '',
        kyc.approved ? 'Approved' : 'Pending',
        kyc.created_at || '',
        kyc.updated_at || ''
      ].join(',')
    )
  ].join('\n')

  return csvContent
}

/**
 * Download KYC data as CSV file
 * @param {Array} kycData - KYC data to download
 * @param {string} filename - Filename for the download
 */
export const downloadKycCsv = (kycData, filename = 'kyc_data.csv') => {
  const csvContent = exportKycToCsv(kycData)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

/**
 * Bulk approve KYC requests
 * @param {Array} kycIds - Array of KYC IDs to approve
 * @param {string} reason - Optional reason for approval
 * @returns {Promise<Array>} Results of bulk operations
 */
export const bulkApproveKyc = async (kycIds, reason = '') => {
  const results = []

  for (const kycId of kycIds) {
    try {
      const result = await approveKyc(kycId, reason)
      results.push({ id: kycId, success: true, data: result })
    } catch (error) {
      results.push({ id: kycId, success: false, error: error.message })
    }
  }

  return results
}

/**
 * Bulk reject KYC requests
 * @param {Array} kycIds - Array of KYC IDs to reject
 * @param {string} reason - Reason for rejection
 * @returns {Promise<Array>} Results of bulk operations
 */
export const bulkRejectKyc = async (kycIds, reason) => {
  const results = []

  for (const kycId of kycIds) {
    try {
      const result = await rejectKyc(kycId, reason)
      results.push({ id: kycId, success: true, data: result })
    } catch (error) {
      results.push({ id: kycId, success: false, error: error.message })
    }
  }

  return results
}

/**
 * Get KYC audit trail (if available)
 * @param {number} kycId - KYC record ID
 * @returns {Promise<Array>} Audit trail data
 */
export const getKycAuditTrail = async kycId => {
  try {
    // This would depend on your backend implementation
    // For now, we'll return basic info
    const kyc = await getKycById(kycId)

    const auditTrail = [
      {
        action: 'KYC Submitted',
        timestamp: kyc.created_at,
        user: kyc.user?.fullname,
        details: 'KYC application submitted'
      }
    ]

    if (kyc.updated_at && kyc.updated_at !== kyc.created_at) {
      auditTrail.push({
        action: kyc.approved ? 'KYC Approved' : 'KYC Updated',
        timestamp: kyc.updated_at,
        user: 'Admin',
        details: kyc.approved
          ? 'KYC application approved'
          : 'KYC application updated'
      })
    }

    return auditTrail
  } catch (error) {
    console.error('Error getting KYC audit trail:', error)
    throw error
  }
}
