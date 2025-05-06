import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import ActionPopUp from "../../components/actionPopUp";

const APIManagementTable = ({
  data,
  currentPage,
  itemsPerPage,
  setShowEdit,
}) => {
  const columns = [
    "Key Name",
    "API Key (Masked)",
    "Status",
    "Created On",
    "Last Used",
    "Created By",
    "Revocation Day",
    "Revocked By",

    "Action",
  ];

  const [checkedItems, setCheckedItems] = useState(
    new Array(data.length).fill(false)
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
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No Users yet</div>
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
            {selectedData.map((user, idx) => (
              <tr
                key={idx}
                className={`border-t ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
                onDoubleClick={() => setShowEdit(user)}
              >
                <td className="py-[1.3em] px-[1.8em]">
                  <input
                    type="checkbox"
                    checked={checkedItems[startIndex + idx]}
                    onChange={() => handleCheckboxChange(startIndex + idx)}
                  />
                </td>
                <td className="py-[1.3em] px-[1.8em] font-semibold whitespace-nowrap">
                  {user?.key_name}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  #{user?.api_key_masked}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#fff] relative">
                  <span
                    className="bg-[#00613A] rounded-xl flex w-fit items-center justify-center gap-2 py-1 px-2 cursor-pointer"
                    onClick={() => handleActionClick(idx)}
                  >
                    Approved <FaChevronDown />
                  </span>
                  {activeRow === idx && <ActionPopUp />}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {user?.created_on}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {user?.last_used}
                </td>
                <td className="py-[1.3em] whitespace-nowrap px-[1.8em] text-[#9CA3AF]">
                  {user?.created_by}
                </td>
                <td className="py-[1.3em]  px-[1.8em] text-[#9CA3AF]">
                  {user?.revocation_date}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {user?.revoked_by}
                </td>

                <td className="py-[1.3em] px-[1.8em] text-[#fff] relative">
                  <span
                    className="bg-[#00613A] rounded-xl flex w-fit items-center justify-center gap-2 py-1 px-2 cursor-pointer"
                    onClick={() => handleActionClick(idx)}
                  >
                    Approved <FaChevronDown />
                  </span>
                  {activeRow === idx && <ActionPopUp />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default APIManagementTable;
