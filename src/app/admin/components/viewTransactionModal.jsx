import Image from 'next/image'
import Modal from '../../../components/common/Modal'

const formatKey = key =>
  key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

// Helper function to format values properly
const formatValue = (value) => {
  if (value === null || value === undefined) return 'N/A'
  if (typeof value === 'object') {
    // Handle objects and arrays
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'Empty'
    }
    // For objects, try to extract meaningful information
    if (value.username) return value.username
    if (value.email) return value.email
    if (value.user_email) return value.user_email
    if (value.name) return value.name
    if (value.id) return `ID: ${value.id}`
    if (value.user_id) return `ID: ${value.user_id}`
    // If it's a complex object, show a summary
    const keys = Object.keys(value)
    if (keys.length > 0) {
      return `${keys.length} properties: ${keys.slice(0, 3).join(', ')}${keys.length > 3 ? '...' : ''}`
    }
    return 'Object'
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'number') return value.toLocaleString()
  if (typeof value === 'string') {
    // Handle long strings
    if (value.length > 100) return `${value.substring(0, 100)}...`
    return value
  }
  return String(value)
}

export default function ViewTransactionModal({ isOpen, onClose, transaction, showAllFields = true }) {
  console.log('Transaction data after click:', transaction);
  
  if (!transaction) return null

  // Handle user data properly - check for both nested and flat structures
  const userData = {
    user_username: transaction?.user?.username || transaction?.username || 'N/A',
    user_email: transaction?.user?.user_email || transaction?.user?.email || transaction?.user_email || 'N/A',
    user_id: transaction?.user?.user_id || transaction?.user?.id || transaction?.user_id || 'N/A',
  }

  // Flatten transaction data and add user info
  const flattened = {
    ...transaction,
    ...userData,
  }

  // Filter out technical keys and handle raw_data specially
  const entries = Object.entries(flattened).filter(([key, value]) => {
    if (key === 'user' || key === 'callback_processed' || key.startsWith('__')) return false
    if (key === 'raw_data') return false // Skip raw_data as it's usually an object
    return value !== null && value !== undefined && value !== ''
  })

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
    'user_username',
    'user_email',
    'user_id',
    'plan_id'
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
          {summary.map(([key, value]) => (
            <div className='flex justify-between' key={key}>
              <span className='font-medium'>{formatKey(key)}:</span>
              {key === 'status' ? (
                <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusBadgeClasses(value)}`}>
                  {formatValue(value)}
                </span>
              ) : (
                <span
                  className={
                    key === 'amount'
                      ? 'font-semibold text-green-600'
                      : ''
                  }
                >
                  {formatValue(value)}
                </span>
              )}
            </div>
          ))}
          
          {/* The rest of the fields */}
          {(showAllFields ? rest : rest.slice(0, 20)).map(([key, value]) => (
            <div className='flex justify-between' key={key}>
              <span className='font-medium'>{formatKey(key)}:</span>
              <span className='text-right max-w-xs break-words'>
                {formatValue(value)}
              </span>
            </div>
          ))}
          
          {/* Show raw data summary if available */}
          {transaction.raw_data && showAllFields && (
            <div className='mt-4 pt-4 border-t border-gray-200'>
              <div className='flex justify-between items-center mb-2'>
                <span className='font-medium text-gray-600'>Raw Data Summary:</span>
                <span className='text-xs text-gray-500'>
                  {Object.keys(transaction.raw_data).length} properties
                </span>
              </div>
              <div className='bg-gray-50 p-3 rounded text-xs font-mono max-h-32 overflow-y-auto'>
                {Object.entries(transaction.raw_data)
                  .filter(([key, value]) => value !== null && value !== undefined)
                  .slice(0, 10) // Show first 10 properties
                  .map(([key, value]) => (
                    <div key={key} className='mb-1'>
                      <span className='text-blue-600'>{key}:</span>{' '}
                      <span className='text-gray-700'>
                        {typeof value === 'object' 
                          ? `{${Object.keys(value).slice(0, 3).join(', ')}${Object.keys(value).length > 3 ? '...' : ''}}`
                          : String(value).substring(0, 50)
                        }
                      </span>
                    </div>
                  ))}
                {Object.keys(transaction.raw_data).length > 10 && (
                  <div className='text-gray-500 italic'>
                    ... and {Object.keys(transaction.raw_data).length - 10} more properties
                  </div>
                )}
              </div>
            </div>
          )}
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
