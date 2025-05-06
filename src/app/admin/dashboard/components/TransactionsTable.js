import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "@/utils/api";

const TransactionsTable = ({
  data,
  setShowEdit,
  handleDelete,
  currentPage,
  itemsPerPage,
  isLoading,
}) => {
  // const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const columns = [
    "Product",
    "Transaction ID",
    "Date",
    "Amount",
    "Status",
    "Receipt",
    "Actions",
  ];

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     try {
  //       const transactionEndpoints = [
  //         "/services/cable-recharges-transactions/",
  //         "/services/data-plan-transactions/",
  //         "/payments/transactions/",
  //         "/services/airtime-topups-transactions/",
  //       ];

  //       const transactionPromises = transactionEndpoints.map(
  //         async (endpoint) => {
  //           try {
  //             const data = await fetchAllPages(endpoint);
  //             return data;
  //           } catch (error) {
  //             toast.error(`Error fetching ${endpoint}`);
  //             return [];
  //           }
  //         }
  //       );

  //       const transactionResults = await Promise.all(transactionPromises);
  //       const allTransactions = transactionResults.flat();

  //       // Filter valid transactions
  //       const validTransactions = allTransactions.filter(
  //         (tx) =>
  //           tx.id &&
  //           tx.amount &&
  //           tx.created_at &&
  //           tx.status &&
  //           typeof tx.amount === "number" // Ensure amount is a number
  //       );
  //       console.log("Fetched transactions:", allTransactions);
  //       console.log("Valid transactions:", validTransactions);

  //       // Process transactions
  //       const processedData = allTransactions.map((tx) => {
  //         console.log("dsdsxsxs", tx);

  //         // const user = validUsers.find((u) => u.id === tx.user);
  //         // console.log("uddd", user);

  //         return {
  //           id: tx.id,
  //           // user: user ? "user.username" : "System",
  //           product: getProductName(tx),
  //           amount: formatCurrency(tx.amount, tx.currency),
  //           date: new Date(tx.created_at).toLocaleDateString("en-GB"),
  //           status: tx.status ? capitalizeFirstLetter(tx.status) : "Completed",
  //         };
  //       });

  //       console.log("Processed transactions:", processedData);
  //       setData(processedData);
  //       setCheckedItems(new Array(processedData.length).fill(false));
  //     } catch (error) {
  //       toast.error("Failed to fetch transactions. Please try again later.");
  //       console.error("Fetch error:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

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

  // const fetchAllPages = async (endpoint) => {
  //   let allData = [];
  //   let nextPage = endpoint;
  //   while (nextPage) {
  //     try {
  //       const res = await api.get(nextPage);
  //       allData = allData.concat(res.data.results || res.data);
  //       nextPage = res.data.next || null;
  //     } catch (error) {
  //       toast.error(`Error fetching data from ${nextPage}`);
  //       console.error(`Error fetching ${nextPage}:`, error);
  //       break;
  //     }
  //   }
  //   return allData;
  // };

  // const getProductName = (transaction) => {
  //   if (transaction.reason) return transaction.reason;
  //   if (transaction.network) return `${transaction.network} Airtime`;
  //   if (transaction.cable_name) return `${transaction.cable_name} Cable`;
  //   return "Service Transaction";
  // };

  // const formatCurrency = (amount, currency = "NGN") => {
  //   return new Intl.NumberFormat("en-NG", {
  //     style: "currency",
  //     currency: currency,
  //   }).format(amount);
  // };

  // const capitalizeFirstLetter = (str) => {
  //   return str.charAt(0).toUpperCase() + str.slice(1);
  // };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedData = data.slice(startIndex, startIndex + itemsPerPage);

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
                    transaction.status === "Completed" ? "green" : "red"
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
                  <button className="text-[#525252] border border-[#525252] text-sm font-semibold py-1 px-5  text-center   rounded-full">
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
                    onClick={() => handleDelete(transaction.id)}
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
    </>
  );
};

export default TransactionsTable;
