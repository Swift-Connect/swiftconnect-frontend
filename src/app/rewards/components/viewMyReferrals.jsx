import { ChevronLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchWithAuth } from '@/utils/api'

export default function Referrals ({ onBack }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchReferrals = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchWithAuth('/users/complete-profile/my_referrals/')
        setUsers(data || [])
      } catch (err) {
        setError('Failed to fetch referrals')
      } finally {
        setLoading(false)
      }
    }
    fetchReferrals()
  }, [])

  return (
    <div className='min-h-screen flex flex-col bg-[#f7fbf6]'>
      <div className='w-full max-w-4xl bg-whit rounded-lg '>
        {/* Back Button */}
        <button
          className='flex items-center text-gray-600 hover:text-gray-900 mb-4'
          onClick={onBack}
        >
          <ChevronLeft /> Back
        </button>

        {/* Table */}
        <div className='overflow-x-auto border rounded-lg '>
          <table className='w-full border-collapse rounded-lg overflow-hidden'>
            <thead>
              <tr className='bg-[#F9F8FA] text-gray-700 font-bold text-left text-sm'>
                <th className='p-5'>S/N</th>
                <th className='p-5'>Username</th>
                <th className='p-5'>Email</th>
                <th className='p-5'>Status</th>
                <th className='p-5'>Signup Bonus</th>
                <th className='p-5'>1st Txn Bonus</th>
                <th className='p-5'>% Bonus</th>
                <th className='p-5'>Monthly Bonus</th>
                <th className='p-5'>Any Bonus</th>
                <th className='p-5'>Total Commission</th>
                <th className='p-5'>Date</th>
              </tr>
            </thead>
            <tbody className='bg-white'>
              {loading ? (
                <tr>
                  <td colSpan={11} className='p-5 text-center text-gray-400'>
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={11} className='p-5 text-center text-red-500'>
                    {error}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={11} className='p-5 text-center text-gray-400'>
                    You have not referred anyone yet.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user?.id || index}
                    className='border-t hover:bg-gray-50  text-sm'
                  >
                    <td className='p-5 font-bold'>{index + 1}.</td>
                    <td className='p-5'>{user?.referred_username || '-'}</td>
                    <td className='p-5 text-[#9CA3AF]'>
                      {user?.referred_email || '-'}
                    </td>
                    <td className='p-5 text-[#9CA3AF]'>
                      {user?.is_active ? 'Active' : 'Inactive'}
                    </td>
                    <td className='p-5 text-[#9CA3AF]'>
                      {user?.signup_bonus_paid ? 'Paid' : 'Not Paid'}
                    </td>
                    <td className='p-5 text-[#9CA3AF]'>
                      {user?.first_transaction_bonus_paid ? 'Paid' : 'Not Paid'}
                    </td>
                    <td className='p-5 text-[#9CA3AF]'>
                      {user?.transaction_percentage_paid ? 'Paid' : 'Not Paid'}
                    </td>
                    <td className='p-5 text-[#9CA3AF]'>
                      {user?.monthly_active_bonus_paid ? 'Paid' : 'Not Paid'}
                    </td>
                    <td className='p-5 text-[#9CA3AF]'>
                      {user?.bonus_paid ? 'Paid' : 'Not Paid'}
                    </td>
                    <td className='p-5 text-[#9CA3AF]'>
                      ₦{user?.total_commission ? Number(user.total_commission).toLocaleString() : '0.00'}
                    </td>
                    <td className='p-5  text-[#9CA3AF]'>
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
