'use client'
import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const VerifyPaymentContent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const hasVerified = useRef(false)

  useEffect(() => {
    if (hasVerified.current) return

    const tx_ref = searchParams.get('tx_ref') || searchParams.get('txRef') || searchParams.get('reference')
    const transaction_id = searchParams.get('transaction_id') || searchParams.get('transactionId')
    const payment_type = (searchParams.get('payment_type') || searchParams.get('provider') || '').toLowerCase()

    if (!tx_ref) {
      toast.error('Transaction reference is missing.')
      setIsLoading(false)
      return
    }

    const payload = {
      tx_ref,
      ...(payment_type === 'flutterwave' && { transaction_id })
    }

    const verifyPayment = async () => {
      try {
        hasVerified.current = true
        const response = await fetch(
          'https://aesthetic-mandi-swiftconnect-a9332357.koyeb.app//payments/payment-callback/',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          }
        )

        if (response.status === 200 || response.ok) {
          toast.success('Payment verified successfully!')
          router.push('/dashboard')
        } else {
          const data = await response.json()
          toast.error(data.message || 'Failed to verify payment.')
        }
      } catch (error) {
        toast.error('An error occurred while verifying the payment.')
        console.error('Verification error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    verifyPayment()

    return () => {
      hasVerified.current = true // Cleanup
    }
  }, [searchParams, router])

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <ToastContainer />
      {isLoading ? (
        <div className='bg-white rounded-2xl p-6 w-full max-w-lg'>
          <h2 className='text-xl font-bold mb-4'>Verifying Payment...</h2>
          <p>Please wait while we verify your payment.</p>
          <div className='mt-4 flex justify-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
          </div>
        </div>
      ) : (
        <div className='bg-white rounded-2xl p-6 w-full max-w-lg'>
          <h2 className='text-xl font-bold mb-4'>Payment Verification</h2>
          <p className='mb-4'>Payment verification process has completed.</p>
          <div className='flex gap-3 justify-end'>
            <button
              className='px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50'
              onClick={() => router.back()}
            >
              Go Back
            </button>
            <button
              className='px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700'
              onClick={() => router.push('/dashboard')}
            >
              Go Home
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const VerifyPaymentPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyPaymentContent />
    </Suspense>
  )
}

export default VerifyPaymentPage
