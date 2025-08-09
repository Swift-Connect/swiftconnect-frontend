import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import ActionPopUp from "../../components/actionPopUp";
import ViewTransactionModal from "../../components/viewTransactionModal";

const TrxManagementTable = ({
  data,
  currentPage,
  itemsPerPage,
  setShowEdit,
  isLoading,
  onCheckedItemsChange, // Notify parent about checked items
  setViewTransaction,
}) => {
  const columns = [
    "Product",
    "User",
    "Amount",
    "Status",
    "Date",
    "Actions",
  ];

  console.log("data from trxManagementTable", data);

 

  const [checkedItems, setCheckedItems] = useState(
    new Array(data.length).fill(false)
  );
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [activeRow, setActiveRow] = useState(null);

  const handleHeaderCheckboxChange = () => {
    const newCheckedState = !isAllChecked;
    setIsAllChecked(newCheckedState);
    const updatedCheckedItems = new Array(data.length).fill(newCheckedState);
    setCheckedItems(updatedCheckedItems);

    const selectedIds = newCheckedState ? data.map((item) => item.id) : [];
    onCheckedItemsChange(selectedIds); // Notify parent with IDs
  };

  const handleCheckboxChange = (index) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
    setIsAllChecked(newCheckedItems.every((item) => item));

    const selectedIds = data
      .filter((_, idx) => newCheckedItems[idx])
      .map((item) => item.id);
    onCheckedItemsChange(selectedIds); // Notify parent with IDs
  };

  const handleActionClick = (index) => {
    setActiveRow(activeRow === index ? null : index);
  };

  // ** PAGINATION LOGIC **
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      {isLoading ? (
        <div className="text-center py-8">
          Loading transactions, please wait...
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No Transactions yet
        </div>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-[1.3em] px-[1.8em] font-semibold text-[#232323]">
                <input
                  type="checkbox"
                  checked={isAllChecked}
                  onChange={handleHeaderCheckboxChange}
                />
              </th>
              {columns.map((column, index) => (
                <th key={index} className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedData.map((transaction, idx) => (
              <tr key={transaction.id || idx} className="hover:bg-gray-50">
                <td className="py-[1.3em] px-[1.8em]">
                  <input
                    type="checkbox"
                    checked={checkedItems[startIndex + idx]}
                    onChange={() => handleCheckboxChange(startIndex + idx)}
                  />
                </td>
                <td className="py-4 px-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{transaction.product}</div>
                    <div className="text-sm text-gray-500">#{transaction.id}</div>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-700">{transaction.user?.username || transaction.user || 'N/A'}</td>
                <td className="py-4 px-4">
                  <span className={`text-sm font-medium ${transaction.status === 'Completed' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.status === 'Completed' ? '+' : '-'}{transaction.amount}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                    transaction.status === 'Completed'
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : transaction.status === 'Failed'
                      ? 'bg-red-100 text-red-800 border-red-200'
                      : transaction.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                  }`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-500">{transaction.date}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <button
                      className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => setViewTransaction(transaction)}
                    >
                      View
                    </button>
                    <button
                      className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200"
                      onClick={() => setShowEdit(transaction)}
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default TrxManagementTable;
