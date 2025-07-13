import Image from 'next/image'
import React, { useState } from 'react'
import BecomeAnAgent from './becomeAnAgent'
import { useUserContext } from '../../../contexts/UserContext'
import { isKycApproved } from '../../../utils/userUtils'
import axios from 'axios'
import { fetchAndUpdateUserData } from '../../../utils/userUtils'

const AgentKycComponent = ({ setActiveSidebar }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showKycModal, setShowKycModal] = useState(false)
  const { user } = useUserContext()
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [editLoading, setEditLoading] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)

  // Check if KYC is approved using utility function
  const kycApproved = isKycApproved(user)
  const hasKyc = !!user?.kyc
  const kycPending = hasKyc && user.kyc.status === "pending"

  const documentTypeMap = {
    IP: 'International Passport',
    DL: "Driver's License",
    NI: 'National ID',
  }

  const handleEditClick = () => {
    setEditForm({
      fullname: user.fullname || '',
      date_of_birth: user.date_of_birth || '',
      residential_address: user.residential_address || '',
      gender: user.gender || '',
      document_type: user.kyc?.document_type || '',
      id_document: null,
    })
    setEditing(true)
  }

  const handleEditChange = e => {
    const { name, value, files } = e.target
    if (name === 'id_document') {
      setEditForm(f => ({ ...f, id_document: files[0] }))
    } else {
      setEditForm(f => ({ ...f, [name]: value }))
    }
  }

  const handleOpenKycModal = async () => {
    setModalLoading(true)
    setShowKycModal(true)
    // If you want to fetch fresh KYC/user data, do it here. For now, just simulate loading.
    // await fetchAndUpdateUserData();
    setModalLoading(false)
  }

  const handleEditSubmit = async e => {
    e.preventDefault()
    setEditLoading(true)
    try {
      const formData = new FormData()
      formData.append('fullname', editForm.fullname)
      formData.append('date_of_birth', editForm.date_of_birth)
      formData.append('residential_address', editForm.residential_address)
      formData.append('gender', editForm.gender)
      formData.append('document_type', editForm.document_type)
      if (editForm.id_document) {
        formData.append('id_document', editForm.id_document)
      }
      await axios.put(
        `https://swiftconnect-backend.onrender.com/users/kyc-status/me/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      )
      await fetchAndUpdateUserData()
      setEditing(false)
      setShowKycModal(false)
    } catch (err) {
      alert('Failed to update KYC. Please try again.')
    } finally {
      setEditLoading(false)
    }
  }

  return (
    <>
      {isOpen && <BecomeAnAgent onClose={() => setIsOpen(false)} />}
      {showKycModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={() => { if (!modalLoading && !editLoading) { setShowKycModal(false); setEditing(false); } }}
        >
          <div
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative border border-gray-200"
            onClick={e => e.stopPropagation()}
          >
            <button className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl font-bold disabled:opacity-50" onClick={() => { if (!modalLoading && !editLoading) { setShowKycModal(false); setEditing(false); } }} disabled={modalLoading || editLoading}>
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">KYC Submission Details</h2>
            {modalLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
                <span className="text-gray-600">Loading...</span>
              </div>
            ) : !editing ? (
              <>
                <div className="mb-4 space-y-3 divide-y divide-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1">
                    <span className="font-semibold text-gray-600">Full Name:</span>
                    <span className="text-gray-900">{user.fullname}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1">
                    <span className="font-semibold text-gray-600">Lastname:</span>
                    <span className="text-gray-900">{user.fullname?.split(' ').slice(-1)[0]}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1">
                    <span className="font-semibold text-gray-600">Email:</span>
                    <span className="text-gray-900">{user.email}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1">
                    <span className="font-semibold text-gray-600">Date of Birth:</span>
                    <span className="text-gray-900">{user.date_of_birth}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1">
                    <span className="font-semibold text-gray-600">Gender:</span>
                    <span className="text-gray-900">{user.gender}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1">
                    <span className="font-semibold text-gray-600">Address:</span>
                    <span className="text-gray-900">{user.residential_address}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1">
                    <span className="font-semibold text-gray-600">Document Type:</span>
                    <span className="text-gray-900">{documentTypeMap[user.kyc?.document_type] || user.kyc?.document_type}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1">
                    <span className="font-semibold text-gray-600">Status:</span>
                    <span className={`font-semibold ${user.kyc?.approved ? 'text-green-600' : 'text-yellow-600'}`}>{user.kyc?.approved ? 'Approved' : 'Pending'}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1">
                    <span className="font-semibold text-gray-600">Submitted:</span>
                    <span className="text-gray-900">{user.kyc?.created_at && new Date(user.kyc.created_at).toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1">
                    <span className="font-semibold text-gray-600">Last Updated:</span>
                    <span className="text-gray-900">{user.kyc?.updated_at && new Date(user.kyc.updated_at).toLocaleString()}</span>
                  </div>
                  {user.kyc?.id_document && (
                    <div className="pt-4 flex flex-col items-center">
                      <span className="font-semibold text-gray-600 mb-2">Document Image:</span>
                      <img
                        src={user.kyc.id_document}
                        alt="KYC Document"
                        className="w-full max-w-xs max-h-56 object-contain border rounded shadow"
                      />
                    </div>
                  )}
                </div>
                <button className="bg-black text-white px-4 py-2 rounded-lg w-full mt-2 hover:bg-orange-500 font-semibold transition disabled:opacity-50" onClick={handleEditClick} disabled={editLoading}>
                  {editLoading ? (
                    <span className="flex items-center justify-center"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>Loading...</span>
                  ) : 'Edit/Resubmit'}
                </button>
              </>
            ) : (
              <form onSubmit={handleEditSubmit} className="space-y-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
                  <input type="text" name="fullname" value={editForm.fullname} onChange={handleEditChange} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Date of Birth</label>
                  <input type="date" name="date_of_birth" value={editForm.date_of_birth} onChange={handleEditChange} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Address</label>
                  <input type="text" name="residential_address" value={editForm.residential_address} onChange={handleEditChange} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Gender</label>
                  <select name="gender" value={editForm.gender} onChange={handleEditChange} className="w-full border rounded px-3 py-2" required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Document Type</label>
                  <select name="document_type" value={editForm.document_type} onChange={handleEditChange} className="w-full border rounded px-3 py-2" required>
                    <option value="IP">International Passport</option>
                    <option value="DL">Driver's License</option>
                    <option value="NI">National ID</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">ID Document (Image)</label>
                  <input type="file" name="id_document" accept="image/*" onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
                </div>
                <button type="submit" className="bg-black text-white px-4 py-2 rounded-lg w-full mt-2 hover:bg-orange-500 font-semibold transition disabled:opacity-50" disabled={editLoading}>
                  {editLoading ? (
                    <span className="flex items-center justify-center"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>Submitting...</span>
                  ) : 'Submit Changes'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      <div className='space-y-2 pt-2 bg-gray-5 w-[90%] max-md-[400px]:w-full'>
        {/* Become an Agent Card */}
        <div
          className='flex items-center justify-between bg-white shadow-lg rounded-lg sm:rounded-xl p-2 sm:p-3 border border-gray-200'
          onClick={() => setIsOpen(true)}
        >
          <div className='flex items-start space-x-2 sm:space-x-4 w-[60%] max-md-[400px]:w-full'>
            <Image
              src='/rocket.svg'
              alt='Agent Icon'
              width={100}
              height={100}
              className='h-8 w-8 sm:h-12 sm:w-12'
            />
            <div>
              <h2 className='text-base sm:text-lg font-bold text-[#000000]'>
                Become an Agent{' '}
                <span className='hidden sm:inline'>
                  {' '}
                  — Unlock More Earnings!{' '}
                </span>
              </h2>
              <p className='text-xs sm:text-sm text-[#525252]'>
                Earn commissions, grow your network, and access exclusive tools.
                Upgrade now to maximize your potential!
              </p>
            </div>

          </div>
          <button
            onClick={() => setIsOpen(true)}
            className='bg-black text-white p-2 sm:p-3 rounded-lg w-[20%] hidden sm:block hover:bg-gray-800 text-xs sm:text-sm'
          >
            Become an Agent
          </button>
        </div>

        {/* KYC Banners */}
        {!hasKyc && (
          <div className='flex items-center justify-between bg-white shadow-lg rounded-lg sm:rounded-xl p-2 sm:p-3 border border-gray-200'>
            <div className='flex items-start space-x-2 sm:space-x-4'>
              <Image
                src='/rounded-exclamation.svg'
                alt='Agent Icon'
                width={100}
                height={100}
                className='h-8 w-8 sm:h-12 sm:w-12'
              />
              <div>
                <h2 className='text-base sm:text-lg font-bold text-[#000000]'>
                  Complete KYC
                </h2>
                <p className='text-xs sm:text-sm text-[#525252]'>
                  Complete your KYC to receive your Swift Connect account
                  number.{' '}
                  <span
                    onClick={() => setActiveSidebar('KYC')}
                    className='text-orange-500 hover:underline'
                  >
                    Click here to complete
                  </span>
                </p>
              </div>
            </div>
            <button
              className='bg-orange-500 text-white w-[20%] rounded-lg hover:bg-orange-600 p-2 sm:p-3 hidden sm:block text-xs sm:text-sm'
              onClick={() => setActiveSidebar('KYC')}
            >
              Complete KYC
            </button>
          </div>
        )}
        {kycPending && (
          <div className='flex items-center justify-between bg-white shadow-lg rounded-lg sm:rounded-xl p-2 sm:p-3 border border-gray-200'>
            <div className='flex items-start space-x-2 sm:space-x-4'>
              <Image
                src='/rounded-exclamation.svg'
                alt='KYC Pending Icon'
                width={100}
                height={100}
                className='h-8 w-8 sm:h-12 sm:w-12'
              />
              <div>
                <h2 className='text-base sm:text-lg font-bold text-[#000000]'>
                  KYC Submitted, Awaiting Approval
                </h2>
                <p className='text-xs sm:text-sm text-[#525252]'>
                  Your KYC has been submitted and is currently under review. You will be notified once it is approved. You can view or update your submission below.
                </p>
              </div>
            </div>
            <button
              className='bg-orange-500 text-white w-[20%] rounded-lg hover:bg-orange-600 p-2 sm:p-3 hidden sm:block text-xs sm:text-sm disabled:opacity-50'
              onClick={handleOpenKycModal}
              disabled={modalLoading}
            >
              {modalLoading ? (
                <span className="flex items-center justify-center"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>Loading...</span>
              ) : 'View'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default AgentKycComponent
