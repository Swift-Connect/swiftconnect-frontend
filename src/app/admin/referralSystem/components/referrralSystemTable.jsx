import { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import ActionPopUp from '../../components/actionPopUp'

const ReferralSystemTable = ({ data, currentPage, itemsPerPage }) => {
  const columns = [
    'S/N',
    'Referred Username',
    'Referred Email',
    'Referrer ID',
    'Bonus Paid',
    'Active',
    'Total Commission',
    'Date Created'
  ]

  const [checkedItems, setCheckedItems] = useState(
    new Array(data.length).fill(false)
  )
  const [isAllChecked, setIsAllChecked] = useState(false)
  const [activeRow, setActiveRow] = useState(null)

  const handleHeaderCheckboxChange = () => {
    const newCheckedState = !isAllChecked
    setIsAllChecked(newCheckedState)
    setCheckedItems(new Array(data.length).fill(newCheckedState))
  }

  const handleCheckboxChange = index => {
    const newCheckedItems = [...checkedItems]
    newCheckedItems[index] = !newCheckedItems[index]
    setCheckedItems(newCheckedItems)
    setIsAllChecked(newCheckedItems.every(item => item))
  }

  const handleActionClick = index => {
    setActiveRow(activeRow === index ? null : index)
  }

  // ** PAGINATION LOGIC **
  const startIndex = (currentPage - 1) * itemsPerPage
  const selectedData = data.slice(startIndex, startIndex + itemsPerPage)

  return (
    <>
      {data.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>No Referrals yet</div>
      ) : (
        <table className='w-full text-sm border-collapse'>
          <thead>
            <tr className='bg-[#F9F8FA] text-left text-[#525252]'>
              <th className='py-[1.3em] px-[1.8em] font-semibold text-[#232323]'>
                <input
                  type='checkbox'
                  checked={isAllChecked}
                  onChange={handleHeaderCheckboxChange}
                />
              </th>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className='py-[1.3em] px-[1.8em] whitespace-nowrap'
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedData.map((item, idx) => (
              <tr
                key={item.id || idx}
                className={`border-t ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className='py-[1.3em] px-[1.8em]'>
                  <input
                    type='checkbox'
                    checked={checkedItems[startIndex + idx]}
                    onChange={() => handleCheckboxChange(startIndex + idx)}
                  />
                </td>
                <td className='py-[1.3em] px-[1.8em] font-semibold text-[#232323]'>
                  {startIndex + idx + 1}
                </td>
                <td className='py-[1.3em] px-[1.8em] text-[#232323]'>
                  {item.referred_username || '-'}
                </td>
                <td className='py-[1.3em] px-[1.8em] text-[#9CA3AF]'>
                  {item.referred_email || '-'}
                </td>
                <td className='py-[1.3em] px-[1.8em] text-[#9CA3AF]'>
                  {item.referrer || '-'}
                </td>
                <td className='py-[1.3em] px-[1.8em] text-[#9CA3AF]'>
                  {item.bonus_paid ? 'Yes' : 'No'}
                </td>
                <td className='py-[1.3em] px-[1.8em] text-[#9CA3AF]'>
                  {item.is_active ? 'Active' : 'Inactive'}
                </td>
                <td className='py-[1.3em] px-[1.8em] text-[#9CA3AF]'>
                  ₦{item.total_commission?.toLocaleString() || '0'}
                </td>
                <td className='py-[1.3em] px-[1.8em] text-[#9CA3AF]'>
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString()
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}

export default ReferralSystemTable
