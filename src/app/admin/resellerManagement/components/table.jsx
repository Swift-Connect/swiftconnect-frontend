import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import ActionPopUp from "../../components/actionPopUp";

const ResellerTable = ({ data, currentPage, itemsPerPage, setShowEdit }) => {
  const columns = [
    "Username",
    "Account ID",
    "Fullname",
    "Email",
    "Phone Number",
    "Wallet Balance",
    "Previous Balance",
    "Referrals",
    "Commision Rate",
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
                <td className="py-[1.3em] px-[1.8em] font-semibold">
                  {user?.username}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  #{user?.account_id}
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

export default ResellerTable;
