import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "@/utils/api";
import ActionPopUp from "../../components/actionPopUp";

const UsersTable = () => {
  const [data, setData] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const columns = ["Username", "Account Id", "Date", "Action", "API Response"];

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const usersData = await fetchAllPages("/users/list-users/");
        // Filter valid users
        const validUsers = usersData.filter(
          (user) => user.id && user.username && user.account_id && user.created_at
        );
        console.log("Fetched users:", usersData);
        console.log("Valid users:", validUsers);

        // Process users to match table structure
        const processedData = validUsers.map((user) => ({
          id: user.id,
          username: user.username,
          account_id: user.account_id,
          created_at: user.created_at,
          api_response: user.api_response || "N/A",
          status: user.status || "Not Approved", // Default to match action
        }));

        setData(processedData);
        setCheckedItems(new Array(processedData.length).fill(false));
      } catch (error) {
        toast.error("Failed to fetch users. Please try again later.");
        console.error("Fetch users error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const fetchAllPages = async (endpoint) => {
    let allData = [];
    let nextPage = endpoint;
    while (nextPage) {
      try {
        const res = await api.get(nextPage);
        allData = allData.concat(res.data.results || res.data);
        nextPage = res.data.next || null;
      } catch (error) {
        toast.error(`Error fetching data from ${nextPage}`);
        console.error(`Error fetching ${nextPage}:`, error);
        break;
      }
    }
    return allData;
  };

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

  return (
    <>
      {isLoading ? (
        <div className="text-center py-8">Loading users, please wait...</div>
      ) : data.length === 0 ? (
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
            {data.map((user, idx) => (
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
                  {activeRow === idx && <ActionPopUp />}
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