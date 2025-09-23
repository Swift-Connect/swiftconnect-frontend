'use client'

import Image from 'next/image'
import React, { useEffect, useState, useCallback, useRef } from 'react'
// import TrxManagementTable from "./components/TrxManagementTable";
import Pagination from '../components/pagination'
import TableTabs from '../components/tableTabs'
import EditUserTrx from './components/editUserTransaction'
import { FaChevronRight } from 'react-icons/fa'
import TrxManagementTable from './components/trxManagementTable'
import TransactionsTable from "../dashboard/components/TransactionsTable";
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
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [nextUrls, setNextUrls] = useState([])
  const sentinelRef = useRef(null)
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

  const fetchDashboardData = useCallback(async () => {
    if (!token) return
    setIsLoading(true)
    try {
      // Fetch all transactions
      const transactionEndpoints = [
        '/payments/admin/transactions/',
        '/services/airtime-topups-transactions/',
        '/services/data-plan-transactions/',
        '/services/cable-recharges-transactions/',
        '/services/education-transactions/',
        '/services/electricity-transactions/',
        '/services/bulk-sms-transactions/'
      ]

      // First-page fetch for progressive loading (50 per request)
      const firstPagePromises = transactionEndpoints.map(async endpoint => {
        try {
          const res = await api.get(`${endpoint}${endpoint.includes('?') ? '&' : '?'}page_size=50`)
          const results = res.data.results || res.data || []
          const next = res.data.next || null
          return { items: results.map(tx => ({ ...tx, __endpoint: endpoint })), next, endpoint }
        } catch (error) {
          toast.error(`Error fetching ${endpoint}`)
          console.error(`Error fetching ${endpoint}:`, error)
          return { items: [], next: null, endpoint }
        }
      })

      const firstPages = await Promise.all(firstPagePromises)
      const allTransactions = firstPages.flatMap(p => p.items)

      // Track next URLs to enable lazy loading more
      const initialNexts = firstPages
        .map(p => ({ endpoint: p.endpoint, next: p.next }))
        .filter(p => !!p.next)
      setNextUrls(initialNexts)

      // Process transactions
      const processedDataTrx = allTransactions
        .map(tx => ({
          id: tx.id ?? '-',
          product: getProductName(tx) ?? '-',
          // Display amount for tables/views
          amount: tx.amount != null ? formatCurrency(tx.amount, tx.currency) : '0',
          // Keep numeric amount for editing/payloads
          __amount_numeric: typeof tx.amount === 'number' ? tx.amount : Number(tx.amount) || 0,
          date: tx.created_at
            ? new Date(tx.created_at).toLocaleDateString('en-GB')
            : '-',
          // Keep original status as helper and display a human version
          __status_raw: tx.status ?? null,
          status: tx.status ? capitalizeFirstLetter(String(tx.status)) : '-',
          transaction_type: (tx.transaction_type && ['credit','debit'].includes(String(tx.transaction_type).toLowerCase()))
            ? String(tx.transaction_type).toLowerCase()
            : (() => {
                const product = (getProductName(tx) || '').toLowerCase();
                const reason = (tx.reason || '').toLowerCase();
                const serviceName = (tx.service_name || '').toLowerCase();
                if (
                  product.includes('wallet') ||
                  reason.includes('wallet') ||
                  serviceName.includes('wallet') ||
                  product.includes('fund') ||
                  reason.includes('fund') ||
                  serviceName.includes('fund')
                ) return 'credit';
                return 'debit';
              })(),
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
      setHasMore(initialNexts.length > 0)
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
  }, [token])

  useEffect(() => {
    if (!token) return
    fetchDashboardData()
  }, [token, fetchDashboardData])

  // Load next batches (50) for all endpoints with a next URL
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return
    setIsLoadingMore(true)
    try {
      const batch = await Promise.all(
        nextUrls.map(async ({ endpoint, next }) => {
          try {
            const url = next.includes('page_size=') ? next : `${next}${next.includes('?') ? '&' : '?'}page_size=50`
            const res = await api.get(url)
            const results = res.data.results || res.data || []
            const nextUrl = res.data.next || null
            return { endpoint, items: results.map(tx => ({ ...tx, __endpoint: endpoint })), next: nextUrl }
          } catch (err) {
            console.error('Error loading more for', endpoint, err)
            return { endpoint, items: [], next: null }
          }
        })
      )

      const newItems = batch.flatMap(b => b.items)
      if (newItems.length > 0) {
        const processed = newItems.map(tx => ({
          id: tx.id ?? '-',
          product: getProductName(tx) ?? '-',
          amount: tx.amount != null ? formatCurrency(tx.amount, tx.currency) : '0',
          __amount_numeric: typeof tx.amount === 'number' ? tx.amount : Number(tx.amount) || 0,
          date: tx.created_at ? new Date(tx.created_at).toLocaleDateString('en-GB') : '-',
          __status_raw: tx.status ?? null,
          status: tx.status ? capitalizeFirstLetter(String(tx.status)) : '-',
          transaction_type: (tx.transaction_type && ['credit','debit'].includes(String(tx.transaction_type).toLowerCase()))
            ? String(tx.transaction_type).toLowerCase()
            : (() => {
                const product = (getProductName(tx) || '').toLowerCase();
                const reason = (tx.reason || '').toLowerCase();
                const serviceName = (tx.service_name || '').toLowerCase();
                if (
                  product.includes('wallet') ||
                  reason.includes('wallet') ||
                  serviceName.includes('wallet') ||
                  product.includes('fund') ||
                  reason.includes('fund') ||
                  serviceName.includes('fund')
                ) return 'credit';
                return 'debit';
              })(),
          transaction_id: tx.transaction_id ?? '-',
          created_at: tx.created_at ?? null,
          updated_at: tx.updated_at ?? null,
          ...tx
        }))
        setAllTransaactionData(prev => {
          const merged = [...prev, ...processed]
          return merged.sort((a, b) => new Date(b.created_at || b.updated_at) - new Date(a.created_at || a.updated_at))
        })
      }

      const updatedNexts = batch.map(b => ({ endpoint: b.endpoint, next: b.next })).filter(p => !!p.next)
      setNextUrls(updatedNexts)
      setHasMore(updatedNexts.length > 0)
    } finally {
      setIsLoadingMore(false)
    }
  }, [nextUrls, hasMore, isLoadingMore])

  // IntersectionObserver to auto-load more
  useEffect(() => {
    if (!sentinelRef.current) return
    const node = sentinelRef.current
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadMore()
      }
    }, { root: null, rootMargin: '200px', threshold: 0 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [loadMore])

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
    amount: '',
    status: '',
  });

  const parseAmountFromDisplay = (display) => {
    if (typeof display === 'number') return display
    if (!display) return 0
    const parsed = Number(String(display).replace(/[^0-9.-]/g, ''))
    return Number.isFinite(parsed) ? parsed : 0
  }

  const handleEditClick = rowData => {
    setEditData(rowData)
    setEditTrxForm({
      amount: rowData?.__amount_numeric ?? parseAmountFromDisplay(rowData?.amount),
      status: String(rowData?.__status_raw ?? rowData?.status ?? '').toLowerCase(),
    })
    setShowEdit(true)
  }

  // Helper to find the correct endpoint for a transaction
  const findTransactionEndpoint = (trx) => {
    // Prefer explicit source tag if available
    if (trx?.__endpoint) return trx.__endpoint;
    const endpoints = {
      airtime: '/services/airtime-topups-transactions/',
      data: '/services/data-plan-transactions/',
      cable: '/services/cable-recharges-transactions/',
      education: '/services/education-transactions/',
      electricity: '/services/electricity-transactions/',
      sms: '/services/bulk-sms-transactions/',
      wallet: '/payments/admin/transactions/'
    };
    if (trx?.plan_id) return endpoints.data;
    if (trx?.service_name === 'airtime topup') return endpoints.airtime;
    if (trx?.service_name === 'cable recharge') return endpoints.cable;
    if (trx?.service_name === 'education') return endpoints.education;
    if (trx?.service_name === 'electricity') return endpoints.electricity;
    if (trx?.sms_count) return endpoints.sms;
    if ((trx?.reason || '').toLowerCase().includes('wallet')) return endpoints.wallet;
    return endpoints.airtime;
  };

  // Edit (update) handler for transactions
  const handleUpdateTrx = async (e) => {
    e.preventDefault()
    if (!editData?.id) return
    // Build minimal payload with only changed fields
    const payload = {}
    const originalAmount = editData?.__amount_numeric ?? parseAmountFromDisplay(editData?.amount)
    const originalStatus = String(editData?.__status_raw ?? editData?.status ?? '').toLowerCase()
    const nextAmount = Number(editTrxForm.amount)
    const nextStatus = String(editTrxForm.status || '').toLowerCase()
    if (Number.isFinite(nextAmount) && nextAmount !== originalAmount) {
      payload.amount = nextAmount
    }
    if (nextStatus && nextStatus !== originalStatus) {
      payload.status = nextStatus
    }
    if (Object.keys(payload).length === 0) {
      toast.info('No changes to update.')
      return
    }

    setIsLoading(true)
    try {
      const endpoint = findTransactionEndpoint(editData)
      await api.put(`${endpoint}${editData.id}/`, payload)
      toast.success('Transaction updated successfully.')
      await fetchDashboardData()
      setShowEdit(false)
      setEditData(null)
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Failed to update transaction.')
    } finally {
      setIsLoading(false)
    }
  }

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
              <div className="mb-4 text-sm text-gray-600">
                <div className="flex justify-between"><span className="font-medium">Product:</span><span>{editData?.product}</span></div>
                <div className="flex justify-between"><span className="font-medium">Transaction ID:</span><span>{editData?.transaction_id || `#${editData?.id}`}</span></div>
              </div>
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
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <TableTabs
                  header={"Recent Transactions"}
                  setActiveTab={setActiveTabTransactions}
                  activeTab={activeTabTransactions}
                  tabs={["All Transactions", "Credit", "Debit"]}
                  from="dashboard"
                  filterOptions={[
                    { label: "Success", value: "Success" },
                    { label: "Failed", value: "Failed" },
                    { label: "Refunded", value: "Refunded" },
                    { label: "Pending", value: "Pending" },
                  ]}
                  onFilterChange={setTransactionFilter}
                />

                <TransactionsTable
                  data={filteredTransactionData}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  isLoading={isLoading}
                  activeTabTransactions={activeTabTransactions}
                  setShowEdit={handleEditClick}
                />

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredTransactionData.length}
                />
                <div ref={sentinelRef} className="flex items-center justify-center py-4 text-sm text-gray-500">
                  {isLoadingMore ? 'Loading more…' : (hasMore ? 'Scroll to load more' : 'No more transactions')}
                </div>
              </div>
            </div>
            {/* View modal is managed inside TransactionsTable */}
          </>
        )}
      </div>
    </div>
  );
}

export default TransactionManagement
