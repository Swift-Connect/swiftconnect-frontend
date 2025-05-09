import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import ActionPopUp from "../../components/actionPopUp";

const Table = ({ data, currentPage, itemsPerPage, setShowEdit, onDelete }) => {
  const columns = [
    "Product",
    "Transaction ID",
    "Date",
    "Amount",
    "Status",
    "API Response",
  ];
  // console.log("data from table", data);

  const [checkedItems, setCheckedItems] = useState(
    new Array(data?.length).fill(false)
  );
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [activeRow, setActiveRow] = useState(null);

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

  const handleActionClick = (index) => {
    setActiveRow(activeRow === index ? null : index);
  };

  // ** PAGINATION LOGIC **
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      {data?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No Data Yet</div>
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
              {Object.keys(data[0]).map((key) => (
                <th
                  key={key}
                  className="py-[1.3em] px-[1.8em] whitespace-nowrap"
                >
                  {key.toUpperCase()}
                </th>
              ))}
              <th className="py-[1.3em] px-[1.8em] whitespace-nowrap">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {selectedData.map((item, idx) => (
              <tr
                key={idx}
                className={`border-t ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
                onDoubleClick={() => setShowEdit(item)}
              >
                <td className="py-[1.3em] px-[1.8em]">
                  <input
                    type="checkbox"
                    checked={checkedItems[startIndex + idx]}
                    onChange={() => handleCheckboxChange(startIndex + idx)}
                  />
                </td>

                {Object.values(item).map((value, idx) => (
                  <td
                    key={idx}
                    className="py-[1.3em] px-[1.8em] text-[#9CA3AF] whitespace-nowrap"
                  >
                    {value}
                  </td>
                ))}

                <td className="py-[1.3em] px-[1.8em] flex gap-2">
                  <button
                    onClick={() => setShowEdit(item)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
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

export default Table;
