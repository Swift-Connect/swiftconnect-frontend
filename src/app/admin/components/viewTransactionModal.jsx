import Image from 'next/image'
import Modal from '../../../components/common/Modal'

const formatKey = key =>
  key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

export default function ViewTransactionModal({ isOpen, onClose, transaction, showAllFields = true }) {
  console.log('Transaction data after click:', transaction);
  
  if (!transaction) return null

  // Flatten user info for readability
  const flattened = {
    ...transaction,
    user_username: transaction?.user?.username,
    user_email: transaction?.user?.user_email || transaction?.user?.email,
    user_id: transaction?.user?.user_id || transaction?.user?.id,
  }

  // Filter out technical keys
  const entries = Object.entries(flattened).filter(
    ([key]) => key !== 'user' && key !== 'callback_processed' && !key.startsWith('__')
  )

  // Summary fields to show at the top
  const summaryKeys = [
    'id',
    'transaction_id',
    'product',
    'amount',
    'status',
    'transaction_type',
    'date',
    'created_at',
    'transaction_type'
  ]
  const summary = entries.filter(([key]) => summaryKeys.includes(key))
  const rest = entries.filter(([key]) => !summaryKeys.includes(key))

  const getStatusBadgeClasses = (status) => {
    const val = String(status || '').toLowerCase()
    if (val === 'completed' || val === 'success' || val === 'successful') {
      return 'bg-green-100 text-green-800 border-green-200'
    }
    if (val === 'failed' || val === 'error') {
      return 'bg-red-100 text-red-800 border-red-200'
    }
    if (val === 'pending' || val === 'processing') {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
    if (val === 'refunded') {
      return 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }


  

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='relative p-8'>
        {/* Watermark */}
        <div className='absolute inset-0 flex justify-center items-center opacity-10 pointer-events-none'>
          <Image
            src={'./logo.svg'}
            alt='Watermark Logo'
            className='w-32 h-32 object-contain'
            width={0}
            height={0}
          />
        </div>

        <h2 className='text-2xl font-semibold text-center mb-6 border-b pb-3'>
          Transaction Receipt
        </h2>

        <div className='space-y-3 text-sm text-gray-800 relative z-10 max-h-[60vh] overflow-y-auto'>
          {/* Summary fields first */}
          {summary
            .filter(([key, value]) => value !== null && value !== undefined && value !== '')
            .map(([key, value]) => (
              <div className='flex justify-between' key={key}>
                <span className='font-medium'>{formatKey(key)}:</span>
                {key === 'status' ? (
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusBadgeClasses(value)}`}>
                    {String(value)}
                  </span>
                ) : (
                  <span
                    className={
                      key === 'amount'
                        ? 'font-semibold text-green-600'
                        : ''
                    }
                  >
                    {String(value)}
                  </span>
                )}
              </div>
            ))}
          {/* The rest of the fields */}
          {(showAllFields ? rest : rest.slice(0, 20))
            .filter(([key, value]) => value !== null && value !== undefined && value !== '')
            .map(([key, value]) => (
              <div className='flex justify-between' key={key}>
                <span className='font-medium'>{formatKey(key)}:</span>
                <span>
                  {String(value)}
                </span>
              </div>
            ))}
        </div>

        <div className='mt-6 text-right relative z-10'>
          <button
            className='bg-gray-700 text-white px-5 py-2 rounded-md hover:bg-gray-800 transition'
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  )
}
