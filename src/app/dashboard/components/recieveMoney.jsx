'use client'

import { useState, useEffect } from 'react'
import { X, Copy, Share2 } from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import EnterPinModal from './sendMoney/enterPin'
import { fetchWithAuth, postWithAuth } from '@/utils/api'

const ReceiveMoneyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  const [accounts, setAccounts] = useState([])
  const [hasFetchedAccounts, setHasFetchedAccounts] = useState(false)
  const [bvn, setBvn] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    payment_type: '',
    currency: 'NGN',
    reason: ''
  })
  const [pin, setPin] = useState(['', '', '', ''])
  const [isPinModalOpen, setIsPinModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [bankLogoMap, setBankLogoMap] = useState({})
  const [addAccountModalOpen, setAddAccountModalOpen] = useState(false)
  const [gatewayModalOpen, setGatewayModalOpen] = useState(false)
  const [step, setStep] = useState('main') // 'main', 'addAccount', 'gatewayForm'
  const [selectedGateway, setSelectedGateway] = useState(null)
  const paymentTypes = [
    {
      id: 'flutterwave',
      name: 'Flutterwave',
      logo: '/flutterwave.png',
      description: 'Fast and secure payments with Flutterwave'
      // features: ["Instant transfers", "Multiple currencies", "24/7 support"]
    },
    {
      id: 'paystack',
      name: 'Paystack',
      logo: '/paystack.svg',
      description: 'Simple and reliable payments with Paystack'
      // features: ["Quick setup", "Secure transactions", "Detailed analytics"]
    },
    {
      id: 'monify',
      name: 'Monify',
      logo: '/monify.png',
      description: 'Seamless payment experience with Monify'
      // features: ["Easy integration", "Real-time tracking", "Competitive rates"]
    }
  ]

  // Fetch Nigerian banks and build logo map
  useEffect(() => {
    async function fetchBankLogos () {
      try {
        const res = await fetch('https://nigerianbanks.xyz')
        const banks = await res.json()
        const map = {}
        banks.forEach(bank => {
          map[bank.code] = bank.logo
        })
        setBankLogoMap(map)
      } catch (e) {
        // fallback: do nothing, will use default logo
      }
    }
    fetchBankLogos()
  }, [])

  // Fetch reserved accounts on mount
  useEffect(() => {
    if (!isOpen || hasFetchedAccounts) return

    let loadingToast = null
    const fetchAccounts = async () => {
      loadingToast = toast.loading('Fetching bank accounts...')
      try {
        const data = await fetchWithAuth('payments/account-numbers/')
        setAccounts(data?.accounts || [])
        setHasFetchedAccounts(true)
        toast.update(loadingToast, {
          render: 'Bank accounts fetched successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
      } catch (error) {
        toast.update(loadingToast, {
          render: `Error: ${error.message || 'Failed to fetch accounts'}`,
          type: 'error',
          isLoading: false,
          autoClose: 4000
        })
      }
    }

    fetchAccounts()

    // Cleanup function to dismiss any pending toasts when component unmounts or modal closes
    return () => {
      if (loadingToast) {
        toast.dismiss(loadingToast)
      }
    }
  }, [isOpen])

  // Reset hasFetchedAccounts when modal closes
  useEffect(() => {
    if (!isOpen) setHasFetchedAccounts(false)
  }, [isOpen])

  const handleCreateAccount = async () => {
    if (!bvn) return toast.error('Enter a valid BVN')

    const loadingToast = toast.loading('Creating bank account...')
    setLoading(true)
    try {
      const response = await postWithAuth('payments/create-reserved-account/', {
        bvn
      })
      if (!response?.account) throw new Error('No account returned')

      setAccounts(prev => [...prev, response.account])
      setBvn('')
      toast.update(loadingToast, {
        render: 'Bank account created!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })
    } catch (err) {
      toast.update(loadingToast, {
        render: `Error: ${err.message}`,
        type: 'error',
        isLoading: false,
        autoClose: 4000
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFormSubmit = e => {
    e.preventDefault()
    setIsPinModalOpen(true)
  }

  const handlePinConfirm = async e => {
    e.preventDefault()
    const pinString = pin.join('')
    const loadingToast = toast.loading('Processing payment...')
    setIsSubmitting(true)
    try {
      const response = await fetch(
        'https://aesthetic-mandi-swiftconnect-a9332357.koyeb.app//payments/credit-wallet/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Transaction-PIN': pinString,
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          },
          body: JSON.stringify(formData)
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
        setIsPinModalOpen(false)
        toast.dismiss(loadingToast)
        toast.error(data.message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        })
      }
    } catch (err) {
      setIsPinModalOpen(false)
      toast.dismiss(loadingToast)
      toast.error(err.message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text)
    toast.success(`${type} copied to clipboard!`, {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    })
  }

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div
        className='bg-white rounded-xl p-4 w-full max-w-md relative shadow-xl'
        onClick={e => e.stopPropagation()}
      >
        <button
          className='absolute top-3 right-3 text-gray-500 hover:text-gray-700'
          onClick={onClose}
        >
          <X />
        </button>
        <h2 className='text-xl font-bold mb-2 text-center'>Receive Money</h2>

        {step === 'main' && (
          <>
            {/* Bank Accounts Section */}
            <div className='mb-3 p-2 bg-green-50 border border-green-200 rounded text-green-800 text-xs'>
              Send money to any of the accounts below and it will reflect in
              your wallet automatically.
            </div>
            {accounts.length === 0 ? (
              <div>
                <p className='text-xs text-gray-600 mb-2'>
                  No account found. Create one below:
                </p>
                <button
                  onClick={() => setStep('addAccount')}
                  className='w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition text-sm'
                >
                  Add Account
                </button>
              </div>
            ) : (
              <>
                {accounts.map((acc, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-4 border rounded-xl mb-2 hover:shadow transition text-sm'
                  >
                    <div className='flex items-center space-x-3'>
                      <img
                        src={bankLogoMap[acc.bank_code] || '/default-logo.png'}
                        alt={`${acc.bank_name} logo`}
                        className='w-10 h-10 rounded-full bg-white border'
                        onError={e => {
                          e.target.onerror = null
                          e.target.src = '/default-logo.png'
                        }}
                      />
                      <div className='space-y-1'>
                        <p className='text-sm font-medium text-gray-900'>
                          {acc.bank_name}
                        </p>
                        <p className='text-xs text-gray-600'>
                          Account Number: {acc.account_number}
                        </p>
                        <p className='text-xs text-gray-600'>
                          Reference: {acc.account_reference}
                        </p>
                        <p className='text-xs text-gray-500'>
                          Created:{' '}
                          {new Date(acc.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className='flex flex-col space-y-2'>
                      <button
                        onClick={() =>
                          handleCopy(acc.account_number, 'Account number')
                        }
                        className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors'
                        title='Copy account number'
                      >
                        <Copy className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() =>
                          handleCopy(acc.account_reference, 'Reference')
                        }
                        className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors'
                        title='Copy reference'
                      >
                        <Share2 className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                ))}
                {accounts.length === 0 && (
                  <button
                    onClick={() => setStep('addAccount')}
                    className='w-full bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition mb-2 text-xs'
                  >
                    + Add Another Account
                  </button>
                )}
              </>
            )}

            {/* Payment Gateways Section */}
            <div className='mt-4'>
              <h3 className='text-base font-semibold mb-2'>
                Or use a payment gateway
              </h3>
              <div className='grid grid-cols-1 gap-2 mb-3'>
                {paymentTypes.map(type => (
                  <div
                    key={type.id}
                    className={`p-2 border rounded-lg cursor-pointer flex items-center space-x-2 transition-all duration-300 ${
                      formData.payment_type === type.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => {
                      setFormData({ ...formData, payment_type: type.id })
                      setSelectedGateway(type.id)
                      setStep('gatewayForm')
                    }}
                  >
                    <img
                      src={type.logo}
                      alt={`${type.name} logo`}
                      className='w-8 h-8 object-contain'
                    />
                    <div>
                      <h3 className='font-semibold text-base'>{type.name}</h3>
                      <p className='text-xs text-gray-600'>
                        {type.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 'addAccount' && (
          <div>
            <button
              className='mb-2 text-[1.2em] border rounded px-2 shadow-lg hover:bg-green-700 hover:text-white text-green-700 underline'
              type='button'
              onClick={() => setStep('main')}
            >
              ← Back
            </button>
            <h3 className='text-lg font-semibold mb-2 text-center'>
              Add New Account
            </h3>
            <input
              type='text'
              placeholder='Enter your BVN'
              value={bvn}
              onChange={e => setBvn(e.target.value)}
              className='w-full border rounded-md p-2 mb-2 text-sm'
            />
            <button
              onClick={handleCreateAccount}
              disabled={loading}
              className='w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition text-sm'
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        )}

        {step === 'gatewayForm' && (
          <form
            onSubmit={e => {
              e.preventDefault()
              // Only send required fields
              const payload = {
                amount: formData.amount,
                currency: formData.currency,
                payment_type: formData.payment_type,
                reason: formData.reason
              }
              setIsPinModalOpen(true)
              // You can use payload in your API call
            }}
            className='space-y-3 bg-gray-50 p-3 rounded-lg mt-2'
          >
            <button
              className='mb-2 text-[1.2em] border rounded px-2 shadow-lg hover:bg-green-700 hover:text-white text-green-700 underline'
              type='button'
              onClick={() => setStep('main')}
            >
              ← Back
            </button>
            <h3 className='text-base font-semibold mb-2'>Payment Details</h3>
            <div>
              <label className='block text-xs font-medium mb-1'>
                Amount (NGN)
              </label>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
                  ₦
                </span>
                <input
                  type='number'
                  name='amount'
                  value={formData.amount}
                  onChange={handleFormChange}
                  required
                  className='w-full p-2 pl-8 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm'
                  disabled={isSubmitting}
                  placeholder='0.00'
                />
              </div>
            </div>
            <div>
              <label className='block text-xs font-medium mb-1'>
                Payment Reason
              </label>
              <input
                type='text'
                name='reason'
                value={formData.reason}
                onChange={handleFormChange}
                required
                className='w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm'
                placeholder='Enter reason for payment'
                disabled={isSubmitting}
              />
            </div>
            <button
              type='submit'
              className='w-full bg-black text-white py-2 rounded-md hover:bg-[#000000ad] transition-colors duration-300 flex items-center justify-center space-x-2 text-sm'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className='animate-spin h-4 w-4 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Payment</span>
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                </>
              )}
            </button>
          </form>
        )}

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
    </div>
  )
}

export default ReceiveMoneyModal
