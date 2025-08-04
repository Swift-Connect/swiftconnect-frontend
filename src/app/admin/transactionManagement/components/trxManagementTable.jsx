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
}) => {
  const columns = [
    "Product",
    "Transaction ID",
    "Date",
    "Amount",
    "Status",
    "Receipt",
    "Action",
  ];

  const [viewTransaction, setViewTransaction] = useState(null);

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
                  #{transaction.transaction_id}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {new Date(transaction.date).toLocaleDateString("en-GB")}
                </td>
                <td
                  className={`py-[1.3em] px-[1.8em] font-medium text-${
                    transaction.status === "Completed" ? "green" : "red"
                  }-600`}
                >
                  {transaction.status === "Completed" ? "+" : "-"}
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
                  <button
                    className="text-[#525252] border border-[#525252] text-sm font-semibold py-1 px-5 hover:bg-[#e1e1e1]  text-center   rounded-full"
                    onClick={() => setViewTransaction(transaction)}
                  >
                    View
                  </button>
                </td>
                <td className="py-[1.3em] px-[1.8em]">
                  <button
                    className="text-[#525252] bg-[#66f04d67] border border-[#6ccb66] text-sm font-semibold py-1 px-5 hover:bg-[#e1e1e1]  text-center   rounded-full"
                    onClick={() => setShowEdit(transaction)}
                  >
                    edit
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
          showAllFields={true}
        />
      )}
    </>
  );
};

export default TrxManagementTable;
