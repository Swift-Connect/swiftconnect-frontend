
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { handleApiError, handleApiResponse } from '@/utils/api'
import {
  approveKyc,
  rejectKyc,
  revokeKyc
} from '../../../utils/adminKycUtils'

const ActionPopUp = ({ 
  optionList, 
  setActionItem, 
  onClose, 
  userId, 
  kycId, 
  onSuccess 
}) => {
  const [showReasonModal, setShowReasonModal] = useState(false)
  const [selectedAction, setSelectedAction] = useState(null)
  const [reason, setReason] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleActionClick = action => {
    setSelectedAction(action)

    // For approve action, we can proceed without reason
    if (action === 'Approved') {
      handleKycAction(action, '')
    } else {
      // For reject/revoke, we need a reason
      setShowReasonModal(true)
    }
  }

  const handleKycAction = async (action, reasonText) => {
    setIsProcessing(true)
    const loadingToast = toast.loading(`Processing ${action} Request...`)

    try {
      let result

      switch (action) {
        case 'Approved':
          result = await approveKyc(kycId || userId, reasonText)
          break
        case 'Not Approved':
          result = await rejectKyc(
            kycId || userId,
            reasonText || 'KYC application rejected'
          )
          break
        case 'Revoke':
          result = await revokeKyc(
            kycId || userId,
            reasonText || 'KYC approval revoked'
          )
          break
        default:
          throw new Error('Invalid action')
      }

      handleApiResponse(result)
      
      toast.update(loadingToast, {
        render: result?.message || `KYC ${action} Successfully`,
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })

      if (setActionItem) setActionItem(action)
      if (onSuccess) onSuccess()
      onClose()
    } catch (error) {
      handleApiError(error)
      
      toast.update(loadingToast, {
        render: error?.message || `Failed to ${action.toLowerCase()} KYC`,
        type: 'error',
        isLoading: false,
        autoClose: 5000
      })
    } finally {
      setIsProcessing(false)
      setShowReasonModal(false)
      setReason('')
    }
  }

  const handleReasonSubmit = () => {
    if (!reason.trim() && selectedAction !== 'Approved') {
      toast.error('Please provide a reason')
      return
    }
    handleKycAction(selectedAction, reason)
  }

  const handleCancel = () => {
    setShowReasonModal(false)
    setReason('')
    setSelectedAction(null)
  }

  return (
    <>
      <div className='bg-white z-30 text-black shadow-lg rounded-xl absolute top-[80%] right-[-10%] border border-gray-200 min-w-[200px]'>
        <div className="py-2">
          {optionList?.map((item, index) => (
            <button
              key={item}
              className={`w-full text-left px-6 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between ${
                index !== optionList.length - 1 ? 'border-b border-gray-100' : ''
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !isProcessing && handleActionClick(item)}
              disabled={isProcessing}
            >
              <span className="font-medium">{item}</span>
              {item === 'Approved' && <span className="text-green-600 text-sm">✓</span>}
              {item === 'Not Approved' && <span className="text-red-600 text-sm">✗</span>}
              {item === 'Revoke' && <span className="text-orange-600 text-sm">⚠</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Reason Modal */}
      {showReasonModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl'>
            <div className="flex items-center justify-between mb-4">
              <h3 className='text-lg font-bold text-gray-900'>
                Provide Reason for {selectedAction}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 text-xl"
                disabled={isProcessing}
              >
                ×
              </button>
            </div>
            
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder={`Enter reason for ${selectedAction?.toLowerCase()}...`}
              className='w-full p-3 border border-gray-300 rounded-lg mb-4 h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              disabled={isProcessing}
              maxLength={500}
            />
            
            <div className="text-sm text-gray-500 mb-4">
              {reason.length}/500 characters
            </div>
            
            <div className='flex gap-3 justify-end'>
              <button
                onClick={handleCancel}
                className='px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handleReasonSubmit}
                className={`px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedAction === 'Approved' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : selectedAction === 'Not Approved'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
                disabled={isProcessing || (!reason.trim() && selectedAction !== 'Approved')}
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

export default ActionPopUp
