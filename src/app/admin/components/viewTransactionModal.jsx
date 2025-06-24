import Image from 'next/image'

const formatKey = key =>
  key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

const ViewTransactionModal = ({ transaction, onClose }) => {
  if (!transaction) return null

  // Filter out 'user' and 'callback_processed'
  const entries = Object.entries(transaction).filter(
    ([key]) => key !== 'user' && key !== 'callback_processed'
  )

  // Summary fields to show at the top
  const summaryKeys = [
    'id',
    'transaction_id',
    'product',
    'amount',
    'status',
    'date',
    'created_at',
    'transaction_type'
  ]
  const summary = entries.filter(([key]) => summaryKeys.includes(key))
  const rest = entries.filter(([key]) => !summaryKeys.includes(key))

  return (
    <div className='fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50'>
      <div className='relative bg-white p-8 rounded-lg max-w-md w-full shadow-xl overflow-hidden'>
        {/* Watermark */}
        <div className='absolute inset-0 flex justify-center items-center opacity-10 pointer-events-none'>
          <Image
            src={'logo.svg'}
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
              <span
                className={
                  key === 'amount'
                    ? 'font-semibold text-green-600'
                    : key === 'status' && value === 'Completed'
                    ? 'font-semibold text-green-600'
                    : key === 'status'
                    ? 'font-semibold text-red-600'
                    : ''
                }
              >
                {value === null || value === undefined || value === ''
                  ? '-'
                  : String(value)}
              </span>
            </div>
          ))}
          {/* The rest of the fields */}
          {rest.map(([key, value]) => (
            <div className='flex justify-between' key={key}>
              <span className='font-medium'>{formatKey(key)}:</span>
              <span>
                {value === null || value === undefined || value === ''
                  ? '-'
                  : String(value)}
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
    </div>
  )
}

export default ViewTransactionModal
