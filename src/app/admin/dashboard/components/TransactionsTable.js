
import React, { useState, useEffect } from "react";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "@/utils/api";
import ViewTransactionModal from "../../components/viewTransactionModal";

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

  const dataWithType = data.map((transaction) => ({
    ...transaction,
    transaction_type: ["Wallet funding"].includes(transaction.product)
      ? "credit"
      : "debit",
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
    "Wallet funding": "payments/transactions",
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

  const formatAmount = (amount, status) => {
    const sign = status === "Completed" ? "+" : "-";
    return `${sign}${amount}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Refunded":
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
                  <td className="py-4 px-4">
                    <span className={`text-sm font-medium ${
                      transaction.status === "Completed" ? "text-green-600" : "text-red-600"
                    }`}>
                      {formatAmount(transaction.amount, transaction.status)}
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
                      <button
                        onClick={() => handleDelete(transaction)}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <FaTrash className="mr-1" />
                        Delete
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
                        transaction.status === "Completed" ? "text-green-600" : "text-red-600"
                      }`}>
                        {formatAmount(transaction.amount, transaction.status)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <span className="ml-1">{transaction.date}</span>
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
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction)}
                        className="text-red-600 text-sm hover:text-red-800"
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
          transaction={viewTransaction}
          onClose={() => setViewTransaction(null)}
        />
      )}
    </>
  );
};

export default TransactionsTable;
