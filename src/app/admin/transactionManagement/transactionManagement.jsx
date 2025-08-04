'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
// import TrxManagementTable from "./components/TrxManagementTable";
import Pagination from '../components/pagination'
import TableTabs from '../components/tableTabs'
import EditUserTrx from './components/editUserTransaction'
import { FaChevronRight } from 'react-icons/fa'
import TrxManagementTable from './components/trxManagementTable'
import { toast } from 'react-toastify'
import api from '@/utils/api'
import ViewTransactionModal from '../components/viewTransactionModal'
import { useRouter } from 'next/navigation'

const TransactionManagement = () => {
  const router = useRouter()
  const [token, setToken] = useState(null)
   const [viewTransaction, setViewTransaction] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('access_token')
      setToken(accessToken)

      if (!accessToken) {
        router.push('/account/login')
      }
    }
  }, [])

  const [activeTabPending, setActiveTabPending] =
    React.useState('All Transaction')
  
  // const [activeTabPending, setActiveTabPending] = useState("Approve KYC");
  const [activeTabTransactions, setActiveTabTransactions] =
    useState('All Transactions')

  const [isLoading, setIsLoading] = useState(true)
  const [allTransactionData, setAllTransaactionData] = useState([])
  const [transactionFilter, setTransactionFilter] = useState('All')
  const [checkedItems, setCheckedItems] = useState([]) // Track selected rows
  // Filtered transaction data based on the selected filter
  console.log('Clicked Filtered Optiom', transactionFilter)

  const filteredTransactionData = allTransactionData.filter(tx => {
    if (transactionFilter === 'All' ) return true
    if (transactionFilter === 'Success')
      return tx.status.toLowerCase() === 'completed'
    return tx.status.toLowerCase() === transactionFilter.toLowerCase()
  })

  useEffect(() => {
    if (!token) return

    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        // Fetch all transactions
        const transactionEndpoints = [
          '/payments/transactions/',
          '/services/airtime-topups-transactions/',
          '/services/data-plan-transactions/',
          '/services/cable-recharges-transactions/',
          '/services/education-transactions/',
          '/services/electricity-transactions/',
          '/services/bulk-sms-transactions/'
        ]

        const transactionPromises = transactionEndpoints.map(async endpoint => {
          try {
            return await fetchAllPages(endpoint)
          } catch (error) {
            toast.error(`Error fetching ${endpoint}`)
            console.error(`Error fetching ${endpoint}:`, error)
            return []
          }
        })

        const transactionResults = await Promise.all(transactionPromises)
        const allTransactions = transactionResults.flat()
        console.log('Fetched transactions:', allTransactions)
        // Filter valid transactions
        const validTransactions = allTransactions.filter(
          tx =>
            tx.id &&
            tx.amount &&
            tx.created_at &&
            tx.status &&
            typeof tx.amount === 'number' // Ensure amount is a number
        )
        console.log('Fetched transactions:', allTransactions)
        console.log('Valid transactions:', validTransactions)

        // Process transactions
        const processedDataTrx = allTransactions
          .map(tx => ({
            id: tx.id ?? '-',
            product: getProductName(tx) ?? '-',
            amount:
              tx.amount != null ? formatCurrency(tx.amount, tx.currency) : '0',
            date: tx.created_at
              ? new Date(tx.created_at).toLocaleDateString('en-GB')
              : '-',
            status: tx.status ? capitalizeFirstLetter(tx.status) : '-',
            transaction_id: tx.transaction_id ?? '-',
            created_at: tx.created_at ?? null,
            updated_at: tx.updated_at ?? null,
            ...tx // include all other fields for modal
          }))
          .sort(
            (a, b) =>
              new Date(b.created_at || b.updated_at) -
              new Date(a.created_at || a.updated_at)
          )

        setAllTransaactionData(processedDataTrx)
      } catch (error) {
        if (error.response?.status === 401) {
          router.push('/account/login')
        } else {
          toast.error('Failed to fetch dashboard data. Please try again later.')
        }
        console.error('Fetch dashboard data error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [token])

  const fetchAllPages = async (endpoint, maxPages = 50) => {
    let allData = []
    let nextPage = endpoint
    let pageCount = 0

    try {
      while (nextPage && pageCount < maxPages) {
        const res = await api.get(nextPage)
        allData = allData.concat(res.data.results || res.data)
        nextPage = res.data.next || null
        pageCount++
      }

      if (pageCount >= maxPages) {
        console.warn(`Reached max page limit (${maxPages}) for ${endpoint}`)
      }
    } catch (error) {
      toast.error(`Error fetching data from ${endpoint}`)
      console.error(`Error fetching ${endpoint}:`, error)
    }

    return allData
  }

  const formatCurrency = (amount, currency = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const getProductName = transaction => {
    if (transaction.reason) return transaction.reason
    if (transaction.network) return `${transaction.network} Airtime`
    if (transaction.cable_name) return `${transaction.cable_name} Cable`
    return 'Service Transaction'
  }

  const capitalizeFirstLetter = str => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const editTrx = true
  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(filteredTransactionData.length / itemsPerPage)
  const [showEdit, setShowEdit] = useState(false)
  const [editData, setEditData] = useState(null)
  const [editTrxForm, setEditTrxForm] = useState({
    amount: "",
    product: "",
    status: "",
    // ...add other fields as needed
  });

  const handleEditClick = rowData => {
    setEditData(rowData);
    setEditTrxForm({
      amount: rowData.amount || "",
      product: rowData.product || "",
      status: rowData.status || "",
      // ...populate other fields as needed
    });
    setShowEdit(true);
  };

  // Helper to find the correct endpoint for a transaction
  const findTransactionEndpoint = (trx) => {
    const endpoints = [
      '/services/airtime-topups-transactions/',
      '/services/data-plan-transactions/',
      '/services/cable-recharges-transactions/',
      '/services/education-transactions/',
      '/services/electricity-transactions/',
      '/services/bulk-sms-transactions/'
    ];
    // You may want to improve this logic based on your data structure
    if (trx?.network) return endpoints[0];
    if (trx?.data_plan) return endpoints[1];
    if (trx?.cable_name) return endpoints[2];
    if (trx?.education_type) return endpoints[3];
    if (trx?.meter_number) return endpoints[4];
    if (trx?.sms_count) return endpoints[5];
    // fallback
    return endpoints[0];
  };

  // Edit (update) handler for transactions
  const handleUpdateTrx = async (e) => {
    e.preventDefault();
    if (!editData?.id) return;
    setIsLoading(true);
    try {
      const endpoint = findTransactionEndpoint(editData);
      await api.put(`${endpoint}${editData.id}/`, editTrxForm);
      toast.success("Transaction updated successfully.");
      setShowEdit(false);
      setEditData(null);
      // Refresh transactions (quick way)
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Failed to update transaction.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckedItemsChange = newCheckedItems => {
    setCheckedItems(newCheckedItems)
  }

  // Add this array at the top-level of the component (after useState, before useEffect)
  const transactionDeleteEndpoints = [
    '/services/airtime-topups-transactions/',
    '/services/data-plan-transactions/',
    '/services/cable-recharges-transactions/',
    '/services/education-transactions/',
    '/services/electricity-transactions/',
    '/services/bulk-sms-transactions/'
  ];

  // Add delete handler for transactions
  const handleDeleteSelected = async () => {
    if (checkedItems.length === 0) return;
    if (!window.confirm("Are you sure you want to delete the selected transactions?")) return;
    setIsLoading(true);
    try {
      for (const id of checkedItems) {
        let deleted = false;
        for (const endpoint of transactionDeleteEndpoints) {
          try {
            await api.delete(`${endpoint}${id}/`);
            deleted = true;
            break; // Stop after first successful delete
          } catch (err) {
            // Try next endpoint if not found
            if (err?.response?.status !== 404) {
              throw err;
            }
          }
        }
        if (!deleted) {
          toast.error(`Transaction with ID ${id} could not be deleted.`);
        }
      }
      toast.success("Selected transactions deleted successfully.");
      // Refresh transactions
      // (re-run fetchDashboardData)yy
    } catch (error) {
      console.log(error);
      
      toast.error(error?.response?.data?.detail || "Failed to delete transactions.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-hidden ">
      <div className="max-md-[400px]:hidden">
        {showEdit ? (
          <>
            <div>
              <h1 className="text-[16px] font-semibold mb-8 flex items-center gap-4">
                Transaction Management <FaChevronRight /> Edit User Transaction
              </h1>
            </div>
            {/* Edit Transaction Form */}
            <form
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onSubmit={handleUpdateTrx}
            >
              <h2 className="text-lg font-bold mb-4">Edit Transaction</h2>
              <div className="mb-3">
                <label className="block mb-1">Amount*</label>
                <input
                  type="number"
                  required
                  className="border rounded px-2 py-1 w-full"
                  value={editTrxForm.amount}
                  onChange={(e) =>
                    setEditTrxForm((f) => ({ ...f, amount: e.target.value }))
                  }
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Product*</label>
                <input
                  type="text"
                  required
                  className="border rounded px-2 py-1 w-full"
                  value={editTrxForm.product}
                  onChange={(e) =>
                    setEditTrxForm((f) => ({ ...f, product: e.target.value }))
                  }
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Status</label>
                <select
                  className="border rounded px-2 py-1 w-full"
                  value={editTrxForm.status}
                  onChange={(e) =>
                    setEditTrxForm((f) => ({ ...f, status: e.target.value }))
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              {/* Add more fields as needed */}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Transaction"}
                </button>
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setShowEdit(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-[16px] font-semibold mb-8">
              Transaction Management
            </h1>

            <TableTabs
              header={""}
              setActiveTab={setActiveTabPending}
              activeTab={activeTabPending}
              tabs={["All Transaction", "Inactive", "Recently Added"]}
              from="transactionManagement"
              onPress={() => {}}
              selectedRows={checkedItems} // Pass selected rows
              onDelete={handleDeleteSelected} // Pass delete handler
            />
            <div className="rounded-t-[1em] overflow-auto border border-gray-200 min-h-[50vh]">
              <TrxManagementTable
                data={filteredTransactionData}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                setShowEdit={handleEditClick}
                isLoading={isLoading}
                onCheckedItemsChange={handleCheckedItemsChange} // Handle checked items
                setViewTransaction={setViewTransaction}
              />
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
            {viewTransaction && (
              <ViewTransactionModal
                isOpen={!!viewTransaction}
                transaction={viewTransaction}
                onClose={() => setViewTransaction(null)}
                showAllFields={true}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TransactionManagement
