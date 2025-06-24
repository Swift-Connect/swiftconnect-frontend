import React from 'react'

const CommissionsTable = ({ commissions = [], onPay, payingId }) => {
  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-sm border-collapse'>
        <thead>
          <tr className='bg-[#F9F8FA] text-left text-[#525252]'>
            <th className='py-3 px-4'>S/N</th>
            <th className='py-3 px-4'>Referrer</th>
            <th className='py-3 px-4'>Referred</th>
            <th className='py-3 px-4'>Amount</th>
            <th className='py-3 px-4'>Status</th>
            <th className='py-3 px-4'>Paid</th>
            <th className='py-3 px-4'>Date</th>
            <th className='py-3 px-4'>Action</th>
          </tr>
        </thead>
        <tbody>
          {commissions.length === 0 ? (
            <tr>
              <td colSpan={8} className='text-center py-8 text-gray-400'>
                No commissions found
              </td>
            </tr>
          ) : (
            commissions.map((item, idx) => (
              <tr
                key={item.id || idx}
                className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className='py-3 px-4'>{idx + 1}</td>
                <td className='py-3 px-4'>{item.referrer_username || '-'}</td>
                <td className='py-3 px-4'>{item.referred_username || '-'}</td>
                <td className='py-3 px-4'>
                  ₦{item.amount?.toLocaleString() || '0'}
                </td>
                <td className='py-3 px-4'>{item.status || '-'}</td>
                <td className='py-3 px-4'>{item.paid ? 'Yes' : 'No'}</td>
                <td className='py-3 px-4'>
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString()
                    : '-'}
                </td>
                <td className='py-3 px-4'>
                  {!item.paid && (
                    <button
                      className={`bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs flex items-center gap-2 ${
                        payingId === item.id
                          ? 'opacity-60 cursor-not-allowed'
                          : ''
                      }`}
                      onClick={() => onPay && onPay(item)}
                      disabled={payingId === item.id}
                    >
                      {payingId === item.id ? (
                        <span className='w-4 h-4 border-2 border-white border-t-green-600 rounded-full animate-spin inline-block'></span>
                      ) : null}
                      Pay
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default CommissionsTable
