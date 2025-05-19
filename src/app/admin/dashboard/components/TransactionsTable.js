import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "@/utils/api";
import Image from "next/image";
import ViewTransactionModal from "../../components/viewTransactionModal";

const TransactionsTable = ({
  data,
  setShowEdit,
  // handleDelete,
  currentPage,
  itemsPerPage,
  isLoading,
  activeTabTransactions,
}) => {
  // const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [viewTransaction, setViewTransaction] = useState(null);

  // console.log("dddd", data);

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
            transaction.transaction_type === activeTabTransactions.toLowerCase()
        );

  const columns = [
    "Product",
    "Transaction ID",
    "Date",
    "Amount",
    "Status",
    "Receipt",
    "Actions",
  ];
 
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
    // "Wallet funding": "services/wallet-funding-transactions", // if applicable
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
  try {
    const normalizedProduct = getNormalizedProduct(transaction.product);
    const endpoint = endpointMap[normalizedProduct];

    if (!endpoint) {
      toast.error("Unknown transaction type");
      return;
    }

    await api.delete(`${endpoint}/${transaction.id}/`);
    toast.success("Transaction deleted successfully");
  } catch (error) {
    toast.error("Failed to delete transaction");
    console.error(error);
  }
};





  return (
    <>
      {isLoading ? (
        <div className="text-center py-8">
          Loading transactions, please wait...
        </div>
      ) : selectedData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No Transactions found
        </div>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#F9F8FA] text-left text-[#525252]">
              <th className="py-[1.3em] px-[1.8em] font-semibold text-[#232323]">
                <input
                  type="checkbox"
                  checked={isAllChecked}
                  onChange={handleHeaderCheckboxChange}
                />
              </th>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="py-[1.3em] px-[1.8em] whitespace-nowrap"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedData.map((transaction, idx) => (
              <tr
                key={transaction.id}
                className={`border-t ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
                onDoubleClick={() => setShowEdit(transaction)}
              >
                <td className="py-[1.3em] px-[1.8em]">
                  <input
                    type="checkbox"
                    checked={checkedItems[idx]}
                    onChange={() => handleCheckboxChange(idx)}
                  />
                </td>
                <td className="py-[1.3em] px-[1.8em] font-semibold text-[#232323]">
                  {transaction.product}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  #{transaction.id}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {transaction.date}
                </td>
                <td
                  className={`py-[1.3em] px-[1.8em] font-medium text-${
                    transaction.status === "Completed"
                      ? "green"
                      : transaction.status == "Pending"
                      ? "yellow"
                      : "red"
                  }-600`}
                >
                  {transaction.status === "Completed" ? "+" : "-"}
                  {transaction.amount}
                </td>
                <td className="">
                  <div
                    className={`py-1  text-center text-xs font-medium rounded-full ${
                      transaction.status === "Completed"
                        ? "bg-green-100 text-green-600 border border-green-200"
                        : transaction.status === "Failed"
                        ? "bg-red-100 text-red-600 border border-red-200"
                        : transaction.status === "Pending"
                        ? "bg-yellow-100 text-yellow-600 border border-yellow-200"
                        : transaction.status === "Refunded"
                        ? "bg-[#52525233] text-[#525252] border border-[#525252]"
                        : ""
                    }`}
                  >
                    {transaction.status}
                  </div>
                </td>
                <td className="text-center">
                  <button
                    className="text-[#525252] border border-[#525252] text-sm font-semibold py-1 px-5 hover:bg-[#e1e1e1]  text-center   rounded-full"
                    onClick={() => setViewTransaction(transaction)}
                  >
                    View
                  </button>
                </td>
                <td className="py-[1.3em] px-[1.8em]">
                  <button
                    className="p-1 text-blue-600 hover:text-blue-800"
                    onClick={() => setShowEdit(transaction)}
                    aria-label="Edit transaction"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="p-1 text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(transaction)}
                    aria-label="Delete transaction"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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
