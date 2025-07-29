import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import ActionPopUp from "../../components/actionPopUp";

const UsersTable = ({
  data,
  currentPage,
  itemsPerPage,
  setShowEdit,
  isLoading,
  onCheckedItemsChange, // Notify parent about checked items
}) => {
  const columns = [
    "Username",
    "Account Id",
    "Fullname",
    "Email",
    "Phone Number",
    "Wallet number",
    "Previous Balance",
    "Referrals",
    "Referral Bonus",
    "Last Login",
    "Date Joined",
    "Status",
  ];

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

  console.log("data from userManageaTable", data);

  return (
    <>
      {isLoading ? (
        <div className="text-center py-8">Loading Users, please wait...</div>
      ) : selectedData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No Users yet</div>
      ) : (
        <table className="text-sm border-collapse">
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
                <td className="py-[1.3em] px-[1.8em] font-semibold">
                  {user?.username}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  #{user?.id}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {user?.fullname}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {user?.email}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {user?.phone_number}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {user?.wallet_number}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {user?.previous_balance}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {user?.referrals}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {user?.referral_bonus}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {user?.last_login}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {user?.date_joined}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#fff] relative flex items-center gap-2">
                  {/*
                  <span
                    className="bg-[#00613A] rounded-xl flex w-fit items-center justify-center gap-2 py-1 px-2 cursor-pointer"
                    onClick={() => handleActionClick(idx)}
                  >
                    Approved <FaChevronDown />
                  </span>
                  {activeRow === idx && <ActionPopUp />}
                  */}
                  <button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-1.5 rounded-md text-xs font-semibold shadow"
                    onClick={() => setShowEdit(user)}
                  >
                    Edit
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

export default UsersTable;
