// app/page.js
'use client'
import Pagination from '@/app/admin/components/pagination'
import axiosInstance from '../../../utils/axiosInstance'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useTransactionContext } from '../../../contexts/TransactionContext'
import ViewTransactionModal from '@/app/admin/components/viewTransactionModal'

const TransactionsTable = () => {
  const [activeTransactionTab, setActiveTransactionTab] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewTransaction, setViewTransaction] = useState(null)
  const { transactions, loading, total, pageSize, fetchTransactions, refetch } = useTransactionContext();
  const itemsPerPage = pageSize;

  useEffect(() => {
    fetchTransactions(currentPage, itemsPerPage, false);
    // eslint-disable-next-line
  }, [currentPage, itemsPerPage]);
  const filteredTransactions =
    activeTransactionTab === 'all'
      ? transactions
      : activeTransactionTab === 'Credit'
      ? transactions.filter(transaction =>
          transaction.transaction_type === 'credit' ? transaction.amount : ''
        )
      : transactions.filter(transaction =>
          transaction.transaction_type === 'debit' ? transaction.amount : ''
        );
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedData = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className='pt-4 w-[90%] max-md-[400px]:w-full max-md-[400px]:text-xl overflow-scroll'>
      <div className=''>
        <h1 className='text-base sm:text-lg max-md-[400px]:text-xl font-semibold mb-2'>Recent Transactions</h1>
        <div className='flex  flex-col justify-between mb-2'>
          <ul className='flex items-center gap-4 sm:gap-12 text-xs sm:text-md max-md-[400px]:text-xl mb-2 border-b border-gray-200'>
            <li
              className={`font-medium px-2 max-md-[400px]:text-[1.2em] cursor-pointer ${
                activeTransactionTab === 'all'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTransactionTab('all')}
            >
              All Transactions
            </li>
            <li
              className={`font-medium   px-2 cursor-pointer ${
                activeTransactionTab === 'Credit'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTransactionTab('Credit')}
            >
              Credit
            </li>
            <li
              className={`font-medium   px-2 cursor-pointer ${
                activeTransactionTab === 'Debit'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTransactionTab('Debit')}
            >
              Debit
            </li>
          </ul>
          <div className='flex items-center justify-between'>
            <div className='flex items-center w-[60%] border rounded-full px-2 py-1'>
              <Image
                src={'/search.svg'}
                alt='search icon'
                width={100}
                height={100}
                className='w-[2.4em]'
              />
              <input
                type='text'
                placeholder='Search for something'
                className='border-none outline-none rounded-md px-2 py-1 text-xs sm:text-sm bg-transparent w-full'
              />
            </div>
            <div className='flex items-center space-x-2 '>
              <button className='flex items-center text-gray-500 text-xs sm:text-sm gap-2 sm:gap-3 px-2 sm:px-4 py-1 sm:py-2 border rounded-full'>
                <Image
                  src={'/calendar.svg'}
                  alt='calendar'
                  width={100}
                  height={100}
                  className='w-[1.6em]'
                />
                <span className='ml-1 text-[16px] max-md-[400px]:hidden'>
                  Nov 1, 2024 - Nov 24, 2024
                </span>
              </button>
              <button className='text-gray-500 text-xs sm:text-sm flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-1 sm:py-2 border rounded-full'>
                <Image
                  src={'/filter.svg'}
                  alt='calendar'
                  width={100}
                  height={100}
                  className='w-[1.6em]'
                />
                <span className='ml-1 max-md-[400px]:hidden'>Filter</span>
              </button>
            </div>
          </div>
        </div>

        <div className='rounded-t-lg overflow-scroll border border-gray-200'>
          {filteredTransactions.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
              No Transactions yet
            </div>
          ) : (
            <table className='w-full text-xs sm:text-sm border-collapse max-md-[400px]:scale-[3em] overflow-scroll'>
              <thead>
                <tr className='bg-[#F9F8FA] text-left text-[#525252]'>
                  <th className='py-2 px-2 sm:py-3 sm:px-4'>Product</th>
                  <th className='py-2 px-2 sm:py-3 sm:px-4'>Transaction ID</th>
                  <th className='py-2 px-2 sm:py-3 sm:px-4'>Date</th>
                  <th className='py-2 px-2 sm:py-3 sm:px-4'>Amount</th>
                  <th className='py-2 px-2 sm:py-3 sm:px-4'>Status</th>
                  <th className='py-2 px-2 sm:py-3 sm:px-4'>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {selectedData.map((transaction, idx) => (
                  <tr
                    key={idx}
                    className={`border-t ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    {/* {console.log(transaction)} */}
                    <td className='py-2 px-2 sm:py-3 sm:px-4 font-semibold text-[#232323]'>
                      {transaction.reason}
                    </td>
                    <td className='py-2 px-2 sm:py-3 sm:px-4 text-[#9CA3AF]'>
                      #{transaction.transaction_id}
                    </td>
                    <td className='py-2 px-2 sm:py-3 sm:px-4 text-[#9CA3AF]'>
                      {new Date(transaction.created_at).toLocaleDateString(
                        'en-GB'
                      )}
                    </td>

                    <td
                      className={`py-2 px-2 sm:py-3 sm:px-4 font-medium text-${
                        transaction.transaction_type === 'credit'
                          ? 'green'
                          : 'red'
                      }-600`}
                    >
                      {transaction.transaction_type === 'credit' ? '+' : '-'}₦
                      {transaction.amount}
                    </td>
                    <td className='py-2 px-2 sm:py-3 sm:px-4'>
                      <div
                        className={`py-1 text-center text-xs font-medium rounded-full ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-600'
                            : transaction.status === 'Failed'
                            ? 'bg-red-100 text-red-600'
                            : transaction.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-600'
                            : transaction.status === 'Refunded'
                            ? 'bg-[#52525233] text-[#525252]'
                            : ''
                        }`}
                      >
                        {transaction.status}
                      </div>
                    </td>
                    <td className='py-2 px-2 sm:py-3 sm:px-4'>
                      <button
                        className='text-[#525252] border border-[#525252] text-sm font-semibold py-1 px-5 hover:bg-[#e1e1e1]  text-center   rounded-full'
                        onClick={() => setViewTransaction(transaction)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {viewTransaction && (
            <ViewTransactionModal
              isOpen={!!viewTransaction}
              transaction={viewTransaction}
              onClose={() => setViewTransaction(null)}
            />
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  )
}

export default TransactionsTable
