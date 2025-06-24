import React from 'react'

const DashboardStats = ({ dashboard }) => {
  if (!dashboard || !dashboard.stats)
    return (
      <div className='text-center py-8 text-gray-400'>No stats available</div>
    )
  const { stats, recent_referrals, recent_commissions, settings } = dashboard
  return (
    <div className='my-6 flex flex-col gap-8'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='bg-white rounded-lg shadow p-6 flex flex-col items-center'>
          <span className='text-gray-500 text-sm mb-2'>Total Referrals</span>
          <span className='text-3xl font-bold'>
            {stats.total_referrals ?? '-'}
          </span>
        </div>
        <div className='bg-white rounded-lg shadow p-6 flex flex-col items-center'>
          <span className='text-gray-500 text-sm mb-2'>Active Referrals</span>
          <span className='text-3xl font-bold'>
            {stats.active_referrals ?? '-'}
          </span>
        </div>
        <div className='bg-white rounded-lg shadow p-6 flex flex-col items-center'>
          <span className='text-gray-500 text-sm mb-2'>Total Earnings</span>
          <span className='text-3xl font-bold'>
            ₦{stats.total_earnings?.toLocaleString() ?? '-'}
          </span>
        </div>
        <div className='bg-white rounded-lg shadow p-6 flex flex-col items-center'>
          <span className='text-gray-500 text-sm mb-2'>Pending Earnings</span>
          <span className='text-3xl font-bold'>
            ₦{stats.pending_earnings?.toLocaleString() ?? '-'}
          </span>
        </div>
      </div>
      {/* Referral Code */}
      <div className='bg-green-50 rounded-lg shadow p-6 flex flex-col items-center w-fit'>
        <span className='text-gray-500 text-sm mb-2'>Referral Code</span>
        <span className='text-xl font-bold tracking-widest text-[#00613A]'>
          {stats.referral_code ?? '-'}
        </span>
      </div>
      {/* Recent Referrals */}
      <div>
        <h3 className='text-lg font-semibold mb-2'>Recent Referrals</h3>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm border-collapse'>
            <thead>
              <tr className='bg-[#F9F8FA] text-left text-[#525252]'>
                <th className='py-3 px-4'>Username</th>
                <th className='py-3 px-4'>Date Joined</th>
                <th className='py-3 px-4'>Total Commission</th>
              </tr>
            </thead>
            <tbody>
              {recent_referrals && recent_referrals.length > 0 ? (
                recent_referrals.map((r, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className='py-3 px-4'>{r.username}</td>
                    <td className='py-3 px-4'>
                      {r.date_joined
                        ? new Date(r.date_joined).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className='py-3 px-4'>
                      ₦{r.total_commission?.toLocaleString() ?? '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className='text-center py-4 text-gray-400'>
                    No recent referrals
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Recent Commissions */}
      <div>
        <h3 className='text-lg font-semibold mb-2'>Recent Commissions</h3>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm border-collapse'>
            <thead>
              <tr className='bg-[#F9F8FA] text-left text-[#525252]'>
                <th className='py-3 px-4'>Type</th>
                <th className='py-3 px-4'>Amount</th>
                <th className='py-3 px-4'>Status</th>
                <th className='py-3 px-4'>Date</th>
              </tr>
            </thead>
            <tbody>
              {recent_commissions && recent_commissions.length > 0 ? (
                recent_commissions.map((c, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className='py-3 px-4'>{c.type}</td>
                    <td className='py-3 px-4'>
                      ₦{c.amount?.toLocaleString() ?? '-'}
                    </td>
                    <td className='py-3 px-4'>{c.status}</td>
                    <td className='py-3 px-4'>
                      {c.created_at
                        ? new Date(c.created_at).toLocaleDateString()
                        : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className='text-center py-4 text-gray-400'>
                    No recent commissions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Settings */}
      <div>
        <h3 className='text-lg font-semibold mb-2'>Referral Settings</h3>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm border-collapse'>
            <thead>
              <tr className='bg-[#F9F8FA] text-left text-[#525252]'>
                <th className='py-3 px-4'>Signup Bonus</th>
                <th className='py-3 px-4'>First Transaction Bonus</th>
                <th className='py-3 px-4'>Transaction %</th>
                <th className='py-3 px-4'>Min Transaction Amount</th>
              </tr>
            </thead>
            <tbody>
              {settings ? (
                <tr className='bg-white'>
                  <td className='py-3 px-4'>
                    ₦{settings.signup_bonus?.toLocaleString() ?? '-'}
                  </td>
                  <td className='py-3 px-4'>
                    ₦{settings.first_transaction_bonus?.toLocaleString() ?? '-'}
                  </td>
                  <td className='py-3 px-4'>
                    {settings.transaction_percentage ?? '-'}%
                  </td>
                  <td className='py-3 px-4'>
                    ₦
                    {settings.minimum_transaction_amount?.toLocaleString() ??
                      '-'}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={4} className='text-center py-4 text-gray-400'>
                    No settings
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DashboardStats
