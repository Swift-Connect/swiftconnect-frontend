import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "@/utils/api";
import ActionPopUp from "../../components/actionPopUp";

const UsersTable = ({ userssData, currentPage, itemsPerPage, isLoading }) => {
  const [data, setData] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [activeRow, setActiveRow] = useState(null);

  const columns = ["Username", "Account Id", "Date", "Action", "API Response"];

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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedData = userssData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      {isLoading ? (
        <div className="text-center py-8">Loading users, please wait...</div>
      ) : selectedData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No Users found</div>
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
                key={user.id}
                className={`border-t ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="py-[1.3em] px-[1.8em] font-semibold text-[#232323]">
                  <input
                    type="checkbox"
                    checked={checkedItems[idx]}
                    onChange={() => handleCheckboxChange(idx)}
                  />
                </td>
                <td className="py-[1.3em] px-[1.8em] font-semibold text-[#232323]">
                  {user.username}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  #{user.account_id}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {new Date(user.created_at).toLocaleDateString("en-GB")}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#fff] relative">
                  <span
                    className={`${
                      user.status === "Approved"
                        ? "bg-[#00613A] text-white"
                        : user.status === "Processing"
                        ? "bg-[#EEFBFD] text-[#219CAF] border-[#219CAF]"
                        : "bg-[#FDF4EE] text-[#ED7F31] border-[#ED7F3133]"
                    } border-[0.1px] rounded-3xl flex w-fit items-center justify-center gap-2 py-1 px-4 cursor-pointer`}
                    onClick={() => handleActionClick(idx)}
                  >
                    {user.status} <FaChevronDown />
                  </span>
                  {activeRow === idx && (
                    <ActionPopUp
                      optionList={["Approved", "Not Approved", "Processing"]}
                    />
                  )}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {user.api_response}
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
