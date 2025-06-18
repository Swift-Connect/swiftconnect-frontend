import React, { useState, useEffect } from 'react'
import { FaChevronDown, FaEye } from 'react-icons/fa'
import { toast, ToastContainer } from 'react-toastify'
import api from '@/utils/api'
import ActionPopUp from '../../components/actionPopUp'
import Image from 'next/image'

const UsersTable = ({
  userssData,
  currentPage,
  itemsPerPage,
  isLoading,
  actionItem,
  setActionItem
}) => {
  const [data, setData] = useState([])
  const [checkedItems, setCheckedItems] = useState([])
  const [isAllChecked, setIsAllChecked] = useState(false)
  const [activeRow, setActiveRow] = useState(null)
  const [selectedKyc, setSelectedKyc] = useState(null)
  const [showKycModal, setShowKycModal] = useState(false)

  const columns = [
    'User Details',
    'Contact Info',
    'Address',
    'ID Document',
    'Status',
    'Action'
  ]

  const handleHeaderCheckboxChange = () => {
    const newCheckedState = !isAllChecked
    setIsAllChecked(newCheckedState)
    setCheckedItems(new Array(data.length).fill(newCheckedState))
  }

  const handleCheckboxChange = index => {
    const newCheckedItems = [...checkedItems]
    newCheckedItems[index] = !newCheckedItems[index]
    setCheckedItems(newCheckedItems)
    setIsAllChecked(newCheckedItems.every(item => item))
  }

  const handleActionClick = index => {
    setActiveRow(activeRow === index ? null : index)
  }

  const handleViewKyc = kyc => {
    setSelectedKyc(kyc)
    setShowKycModal(true)
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const selectedData = userssData.slice(startIndex, startIndex + itemsPerPage)

  return (
    <>
      {isLoading ? (
        <div className='text-center py-8'>Loading...</div>
      ) : (
        <table className='w-full'>
          <thead>
            <tr className='bg-[#F9FAFB]'>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className='py-[1.3em] px-[1.8em] text-left text-[#6B7280] font-medium'
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedData.map((user, idx) => (
              <tr key={idx} className='border-b'>
                <td className='py-[1.3em] px-[1.8em]'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
                      <span className='text-gray-600 font-medium'>
                        {user?.user?.fullname?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className='font-medium text-gray-900'>
                        {user?.user?.fullname}
                      </p>
                      <p className='text-sm text-gray-500'>
                        ID: {user?.user?.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className='py-[1.3em] px-[1.8em]'>
                  <div className='space-y-1'>
                    <p className='text-sm text-gray-900'>{user?.user?.email}</p>
                    <p className='text-sm text-gray-500'>
                      {user?.user?.phone_number || 'Not provided'}
                    </p>
                  </div>
                </td>
                <td className='py-[1.3em] px-[1.8em]'>
                  <p className='text-sm text-gray-900'>
                    {user?.user?.residential_address}
                  </p>
                </td>
                <td className='py-[1.3em] px-[1.8em]'>
                  <button
                    onClick={() => handleViewKyc(user)}
                    className='flex items-center gap-2 text-blue-600 hover:text-blue-800'
                  >
                    <FaEye className='w-4 h-4' />
                    <span>View Document</span>
                  </button>
                </td>
                <td className='py-[1.3em] px-[1.8em]'>
                  <span
                    className={`${
                      user?.approved
                        ? 'bg-[#00613A] text-white'
                        : 'bg-[#FDF4EE] text-[#ED7F31] border-[#ED7F3133]'
                    } border-[0.1px] rounded-3xl flex w-fit items-center justify-center gap-2 py-1 px-4`}
                  >
                    {user?.approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className='py-[1.3em] px-[1.8em] text-[#fff] relative'>
                  <span
                    className={`${
                      user?.approved
                        ? 'bg-[#00613A] text-white'
                        : 'bg-[#FDF4EE] text-[#ED7F31] border-[#ED7F3133]'
                    } border-[0.1px] rounded-3xl flex w-fit items-center justify-center gap-2 py-1 px-4 cursor-pointer`}
                    onClick={() => handleActionClick(idx)}
                  >
                    {user?.approved ? 'Approved' : 'Pending'} <FaChevronDown />
                  </span>
                  {activeRow === idx && (
                    <ActionPopUp
                      optionList={['Approved', 'Not Approved', 'Processing']}
                      setActionItem={setActionItem}
                      onClose={() => setActiveRow(null)}
                      userId={user?.id}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* KYC Document Modal */}
      {showKycModal && selectedKyc && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 max-w-2xl w-full mx-4'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-bold'>KYC Document</h2>
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
              <div className='grid grid-cols-2 gap-4'>
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
                <div className='col-span-2'>
                  <p className='text-sm text-gray-500'>Residential Address</p>
                  <p className='font-medium'>
                    {selectedKyc.user.residential_address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default UsersTable
