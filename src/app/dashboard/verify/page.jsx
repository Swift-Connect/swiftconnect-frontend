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

    const tx_ref = searchParams.get('tx_ref')
    const transaction_id = searchParams.get('transaction_id')
    const payment_type = searchParams.get('payment_type')

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
          'https://swiftconnect-backend.onrender.com/payments/payment-callback/',
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
          <p>Payment verification process has completed.</p>
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
