
import React, { useState, useEffect } from "react";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "@/utils/api";
import ViewTransactionModal from "../../components/viewTransactionModal";
import Modal from "../../../../components/common/Modal";

const TransactionsTable = ({
  data,
  setShowEdit,
  currentPage,
  itemsPerPage,
  isLoading,
  activeTabTransactions,
}) => {
  const [checkedItems, setCheckedItems] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [viewTransaction, setViewTransaction] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const deriveTransactionType = (t) => {
    const existing = (t?.transaction_type || '').toString().toLowerCase();
    if (existing === 'credit' || existing === 'debit') return existing;

    const product = (t?.product || '').toString().toLowerCase();
    const reason = (t?.reason || '').toString().toLowerCase();
    const serviceName = (t?.service_name || '').toString().toLowerCase();

    // Heuristics: wallet funding/top-up or credit keywords => credit
    const looksLikeWalletFunding =
      product.includes('wallet') ||
      reason.includes('wallet') ||
      serviceName.includes('wallet');

    const looksLikeFunding =
      product.includes('fund') || reason.includes('fund') || serviceName.includes('fund');

    if (looksLikeWalletFunding || looksLikeFunding) return 'credit';
    return 'debit';
  };

  const dataWithType = data.map((transaction) => ({
    ...transaction,
    transaction_type: deriveTransactionType(transaction),
  }));

  const filteredTransactions =
    activeTabTransactions === "All Transactions"
      ? dataWithType
      : dataWithType.filter(
          (transaction) =>
            transaction.transaction_type === activeTabTransactions?.toLowerCase()
        );

  const handleHeaderCheckboxChange = () => {
    const newCheckedState = !isAllChecked;
    setIsAllChecked(newCheckedState);
    setCheckedItems(new Array(data.length).fill(newCheckedState));
  };

  const handleCheckboxChange = (index) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
    setIsAllChecked(newCheckedItems.every((item) => item));
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedData = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const endpointMap = {
    "Airtime": "services/airtime-topups-transactions",
    "Cable TV": "services/cable-recharges-transactions",
    "Data": "services/data-plans-transactions",
    "Education": "services/education-transactions",
    "Electricity": "services/electricity-transactions",
    "Wallet funding": "payments/admin/transactions",
  };

  const getNormalizedProduct = (product) => {
    if (!product) return null;
    product = product.toLowerCase();

    if (product.includes("airtime")) return "Airtime";
    if (product.includes("data")) return "Data";
    if (product.includes("cable")) return "Cable TV";
    if (product.includes("education")) return "Education";
    if (product.includes("electricity")) return "Electricity";
    if (product.includes("wallet")) return "Wallet funding";

    return null;
  };

  const handleDelete = async (transaction) => {
    const loadingToast = toast.loading("Processing...");
    try {
      const normalizedProduct = getNormalizedProduct(transaction.product);
      const endpoint = endpointMap[normalizedProduct];

      if (!endpoint) {
        toast.update(loadingToast, {
          render: "Unknown transaction type",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return;
      }

      await api.delete(`${endpoint}/${transaction.id}/`);
      toast.update(loadingToast, {
        render: "Transaction deleted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "An error occurred";
      toast.update(loadingToast, {
        render: "Failed to delete transaction: " + errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error(error);
    }
  };

  const formatAmount = (amount, transactionType) => {
    const sign = transactionType === 'credit' ? '+' : '-';
    return `${sign}${amount}`;
  };

  const getStatusColor = (status) => {
    const s = (status || '').toString().toLowerCase();
    switch (s) {
      case "completed":
      case "success":
      case "successful":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "refunded":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading transactions...</span>
      </div>
    );
  }

  if (selectedData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-5xl mb-4">📄</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
        <p className="text-gray-500">There are no transactions to display at the moment.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        {/* Desktop view */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-left">
                  <input
                    type="checkbox"
                    checked={isAllChecked}
                    onChange={handleHeaderCheckboxChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {selectedData.map((transaction, idx) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      checked={checkedItems[idx] || false}
                      onChange={() => handleCheckboxChange(idx)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.product}
                      </div>
                      <div className="text-sm text-gray-500">
                        #{transaction.id}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-700">
                    {transaction?.user?.username || transaction?.user?.email || transaction?.user || 'N/A'}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-sm font-medium ${
                      transaction.transaction_type === 'credit' ? "text-green-600" : "text-red-600"
                    }`}>
                      {formatAmount(transaction.amount, transaction.transaction_type)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {transaction.date}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setViewTransaction(transaction)}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <FaEye className="mr-1" />
                        View
                      </button>
                      {typeof setShowEdit === 'function' && (
                        <button
                          onClick={() => setShowEdit(transaction)}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                          title="Edit"
                        >
                          <FaEdit className="mr-1" />
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteTarget(transaction)}
                        className="inline-flex items-center p-2 text-xs font-medium text-gray-500 bg-transparent border border-transparent rounded-md hover:bg-gray-100 hover:text-red-600 focus:outline-none"
                        title="Delete"
                        aria-label="Delete transaction"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile view */}
        <div className="lg:hidden">
          {selectedData.map((transaction, idx) => (
            <div key={transaction.id} className="border-b border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <input
                      type="checkbox"
                      checked={checkedItems[idx] || false}
                      onChange={() => handleCheckboxChange(idx)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {transaction.product}
                      </h4>
                      <p className="text-xs text-gray-500">#{transaction.id}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Amount:</span>
                      <span className={`ml-1 font-medium ${
                        transaction.transaction_type === 'credit' ? "text-green-600" : "text-red-600"
                      }`}>
                        {formatAmount(transaction.amount, transaction.transaction_type)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <span className="ml-1">{transaction.date}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">User:</span>
                      <span className="ml-1">{transaction?.user?.username || transaction?.user?.email || transaction?.user || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setViewTransaction(transaction)}
                        className="text-blue-600 text-sm hover:text-blue-800"
                        title="View"
                        aria-label="View transaction"
                      >
                        <FaEye />
                      </button>
                      {typeof setShowEdit === 'function' && (
                        <button
                          onClick={() => setShowEdit(transaction)}
                          className="text-gray-700 text-sm hover:text-gray-900"
                          title="Edit"
                          aria-label="Edit transaction"
                        >
                          <FaEdit />
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteTarget(transaction)}
                        className="text-gray-400 text-sm hover:text-red-600"
                        title="Delete"
                        aria-label="Delete transaction"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {viewTransaction && (
        <ViewTransactionModal
          isOpen={!!viewTransaction}
          transaction={viewTransaction}
          onClose={() => setViewTransaction(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => (isDeleting ? null : setDeleteTarget(null))}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Delete transaction?</h3>
          <p className="text-sm text-gray-600">
            You are about to delete transaction #{deleteTarget?.id}. This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              onClick={async () => {
                if (!deleteTarget) return;
                try {
                  setIsDeleting(true);
                  await handleDelete(deleteTarget);
                } finally {
                  setIsDeleting(false);
                  setDeleteTarget(null);
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TransactionsTable;
