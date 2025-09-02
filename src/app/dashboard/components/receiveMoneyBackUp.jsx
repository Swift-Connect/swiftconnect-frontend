'use client'

import axiosInstance from '../../../utils/axiosInstance'
import axios from 'axios'
import { useState } from 'react'
import { FaTimes, FaShareAlt, FaCopy } from 'react-icons/fa'
import EnterPinModal from './sendMoney/enterPin'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ReceiveMoneyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null
  const [formData, setFormData] = useState({
    amount: '',
    payment_type: '',
    currency: 'NGN',
    reason: ''
  })
  const [isPinModalOpen, setIsPinModalOpen] = useState(false)
  const [transactionPin, setTransactionPin] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [pin, setPin] = useState(['', '', '', ''])

  const paymentTypes = ['flutterwave', 'monify', 'paystack']

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    setIsPinModalOpen(true) // Show the PIN modal
  }

  const handlePinConfirm = async e => {
    e.preventDefault()
    const pinString = pin.join('')
    // setTransactionPin(pin);
    // setIsPinModalOpen(true);

    // Make the API request with the entered PIN
    // setIsLoading(true);
    const loadingToast = toast.loading('Processing payment...')
    try {
      const response = await fetch(
        'http://127.0.0.1:8000/payments/credit-wallet/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Transaction-PIN': pinString,
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          },
          body: JSON.stringify({
            amount: formData.amount,
            payment_type: formData.payment_type,
            currency: formData.currency,
            reason: formData.reason
          })
        }
      )
      const data = await response.json()
      if (response.ok) {
        toast.update(loadingToast, {
          render: 'Payment processed successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
        window.location.href = data.payment_link
      } else {
        toast.update(loadingToast, {
          render: data.detail || 'Failed to process payment',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })
      }
      console.log(data)
    } catch (err) {
      toast.update(loadingToast, {
        render: 'Fetch error: ' + err.message,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      })
      console.error('Fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <ToastContainer />
      <div
        className='bg-white rounded-2xl p-6 w-full max-w-lg relative'
        // onClick={(e) => e.stopPropagation()}
      >
        <button
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700'
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>
        <h2 className='text-xl font-bold mb-4'>Credit Wallet</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium'>Amount</label>
            <input
              type='number'
              name='amount'
              value={formData.amount}
              onChange={handleChange}
              required
              className='w-full p-2 border rounded-md'
              placeholder='Enter amount'
              disabled={isLoading}
            />
          </div>

          <div>
            <label className='block text-sm font-medium'>Payment Type</label>
            <select
              name='payment_type'
              value={formData.payment_type}
              onChange={handleChange}
              required
              className='w-full p-2 border rounded-md'
              disabled={isLoading}
            >
              <option value=''>Select Payment Type</option>
              {paymentTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium'>Currency</label>
            <input
              type='text'
              name='currency'
              value='NGN'
              readOnly
              className='w-full p-2 border rounded-md bg-gray-100'
              disabled={isLoading}
            />
          </div>

          <div>
            <label className='block text-sm font-medium'>Reason</label>
            <input
              type='text'
              name='reason'
              value={formData.reason}
              onChange={handleChange}
              required
              className='w-full p-2 border rounded-md'
              placeholder='Enter reason'
              disabled={isLoading}
            />
          </div>

          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600'
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Submit'}
          </button>
        </form>
      </div>

      {isPinModalOpen && (
        <EnterPinModal
          onConfirmTopUp={handlePinConfirm}
          onClose={() => setIsPinModalOpen(false)}
          setPin={setPin}
          pin={pin}
          from='top up'
        />
      )}
    </div>
  )
}

export default ReceiveMoneyModal
