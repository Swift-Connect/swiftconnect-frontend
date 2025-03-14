import { useState } from "react";
import { FaArrowDown, FaChevronDown } from "react-icons/fa";
import ActionPopUp from "../../components/actionPopUp";

const UsersTable = () => {
  const columns = ["ID", "Name", "Email", "Status"];
  const data = [
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      created_at: "2/4/2025",
      api_response: "Api Response",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      created_at: "2/4/2025",
      api_response: "Api Response",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      created_at: "2/4/2025",
      api_response: "Api Response",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      created_at: "2/4/2025",
      api_response: "Api Response",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      created_at: "2/4/2025",
      api_response: "Api Response",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      created_at: "2/4/2025",
      api_response: "Api Response",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      created_at: "2/4/2025",
      api_response: "Api Response",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      created_at: "2/4/2025",
      api_response: "Api Response",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      created_at: "2/4/2025",
      api_response: "Api Response",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      created_at: "2/4/2025",
      api_response: "Api Response",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      created_at: "2/4/2025",
      api_response: "Api Response",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      created_at: "2/4/2025",
      api_response: "Api Response",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      created_at: "2/4/2025",
      api_response: "Api Response",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      created_at: "2/4/2025",
      api_response: "Api Response",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      created_at: "2/4/2025",
      api_response: "Api Response",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      created_at: "2/4/2025",
      api_response: "Api Response",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      created_at: "2/4/2025",
      api_response: "Api Response",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      created_at: "2/4/2025",
      api_response: "Api Response",
    },
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
  const action = "Not Approved";

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
              <th className="py-[1.3em] px-[1.8em]">Username</th>
              <th className="py-[1.3em] px-[1.8em]">Account Id</th>
              <th className="py-[1.3em] px-[1.8em]">Date</th>
              <th className="py-[1.3em] px-[1.8em]">Action</th>
              <th className="py-[1.3em] px-[1.8em]">API Response</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, idx) => (
              <tr
                key={idx}
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
                      action === "Approved"
                        ? "bg-[#00613A]"
                        : action === "Processing"
                        ? "bg-[#EEFBFD] text-[#219CAF]  border-[#219CAF]"
                        : "bg-[#FDF4EE] text-[#ED7F31] border-[#ED7F3133]"
                    } border-[0.1px] rounded-3xl flex w-fit items-center justify-center gap-2 py-1 px-4 cursor-pointer`}
                    onClick={() => handleActionClick(idx)}
                  >
                    {action} <FaChevronDown />
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
