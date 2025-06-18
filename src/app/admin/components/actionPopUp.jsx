import api from '@/utils/api'
import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { fetchAndUpdateUserData } from '../../../utils/userUtils'
import {
  approveKyc,
  rejectKyc,
  revokeKyc,
  getKycById
} from '../../../utils/adminKycUtils'

const ActionPopUp = ({ optionList, setActionItem, onClose, userId, kycId }) => {
  const [showReasonModal, setShowReasonModal] = useState(false)
  const [selectedAction, setSelectedAction] = useState(null)
  const [reason, setReason] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  console.log('the user Id', userId, 'kycId', kycId)

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

      // Refresh user data after KYC action
      try {
        await fetchAndUpdateUserData()
        console.log('User data refreshed after KYC action')
      } catch (userError) {
        console.error('Error refreshing user data:', userError)
      }

      toast.update(loadingToast, {
        render: result.message || `KYC ${action} Successfully`,
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })

      setActionItem(action)
      onClose()
    } catch (err) {
      console.log('the error', err)
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
    }
  }

  const handleReasonSubmit = () => {
    if (!reason.trim() && selectedAction !== 'Approved') {
      toast.error('Please provide a reason')
      return
    }
    handleKycAction(selectedAction, reason)
  }

  return (
    <>
      <div className='bg-white z-30 text-black shadow-md rounded-2xl absolute top-[80%] right-[-10%]'>
        <ul className='flex flex-col items-center'>
          {optionList?.map(item => (
            <li
              key={item}
              className='border-b w-full text-center px-[4em] py-4 hover:bg-gray-200 cursor-pointer'
              onClick={() => handleActionClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

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
              placeholder={`Enter reason for ${selectedAction.toLowerCase()}...`}
              className='w-full p-3 border rounded-lg mb-4 h-24 resize-none'
              disabled={isProcessing}
            />
            <div className='flex gap-3 justify-end'>
              <button
                onClick={() => {
                  setShowReasonModal(false)
                  setReason('')
                  setSelectedAction(null)
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

export default ActionPopUp
