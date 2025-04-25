import { useState } from "react";
import { FaEdit, FaTrash } from 'react-icons/fa';

const AudtiLogTable = ({
  data,
  currentPage,
  itemsPerPage,
  setShowEdit,
  handleDelete,
}) => {
  const columns = [
    "Product",
    "Transaction ID",
    "Date",
    "Amount",
    "Status",
    "Receipt",
    "Actions",
  ];

  const [checkedItems, setCheckedItems] = useState(
    new Array(data.length).fill(false)
  );
  const [isAllChecked, setIsAllChecked] = useState(false);

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
  const selectedData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No Transactions yet
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
                key={idx}
                className={`border-t ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
                onDoubleClick={() => setShowEdit(transaction)}
              >
                <td className="py-[1.3em] px-[1.8em]">
                  <input
                    type="checkbox"
                    checked={checkedItems[startIndex + idx]}
                    onChange={() => handleCheckboxChange(startIndex + idx)}
                  />
                </td>
                <td className="py-[1.3em] px-[1.8em] font-semibold text-[#232323]">
                  {transaction.product}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  #{transaction.id}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {new Date(transaction.date).toLocaleDateString("en-GB")}
                </td>
                <td
                  className={`py-[1.3em] px-[1.8em] font-medium text-${
                    transaction.status === "Completed" ? "green" : "red"
                  }-600`}
                >
                  {transaction.status === "Completed" ? "+" : "-"}₦
                  {transaction.amount}
                </td>
                <td className="py-[1.3em] px-[1.8em]">
                  <div
                    className={`py-1 text-center text-xs font-medium rounded-full ${
                      transaction.status === "Completed"
                        ? "bg-green-100 text-green-600"
                        : transaction.status === "Failed"
                        ? "bg-red-100 text-red-600"
                        : transaction.status === "Pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : transaction.status === "Refunded"
                        ? "bg-[#52525233] text-[#525252]"
                        : ""
                    }`}
                  >
                    {transaction.status}
                  </div>
                </td>
                <td className="py-[1.3em] px-[1.8em]">
                  <button className="text-green-600 text-sm font-semibold">
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
    </>
  );
};

export default AudtiLogTable;