import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "@/utils/api";

const UsersTable = ({
  data,
  currentPage,
  itemsPerPage,
  setShowEdit,
  handleDelete,
}) => {
  // Log the raw data for debugging
  console.log('data..::..', data);

  // Filter out invalid users (must have id, username, and email)
  const validUsers = data ? data.filter(user => user?.id && user?.username && user?.email) : ()=>{};
  console.log('validUsers..::..', validUsers);

  const columns = ["ID", "Username", "Email", "Role", "Actions"];

  // Initialize checkedItems based on valid users
  const [checkedItems, setCheckedItems] = useState(
    new Array(validUsers.length).fill(false)
  );
  const [isAllChecked, setIsAllChecked] = useState(false);

  const handleHeaderCheckboxChange = () => {
    const newCheckedState = !isAllChecked;
    setIsAllChecked(newCheckedState);
    setCheckedItems(new Array(validUsers.length).fill(newCheckedState));
  };

  const handleCheckboxChange = (index) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
    setIsAllChecked(newCheckedItems.every((item) => item));
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedData = validUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleDeleteClick = async (user) => {
    if (window.confirm(`Are you sure you want to delete user #${user?.id}?`)) {
      try {
        await api.delete(`/users/list-users/${user?.id}/`);
        toast.success("User deleted successfully.");
        handleDelete(user);
      } catch (error) {
        toast.error("Failed to delete user?. Please try again.");
      }
    }
  };

  return (
    <>
      {validUsers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No Users found</div>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#F9F8FA] text-left text-[#2e2e2e]">
              <th className="py-[1.3em] px-[1.8em] font-semibold text-[#2e2e2e]">
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
                key={user?.id}
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
                <td className="py-[1.3em] px-[1.8em] font-semibold text-[#232323]">
                  #{user?.id}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#2e2e2e]">
                  {user?.username}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#2e2e2e]">
                  {user?.email}
                </td>
                <td className="py-[1.3em] px-[1.8em]">
                  <div
                    className={`py-1 text-center text-xs font-medium rounded-full ${
                      user?.role === "Admin"
                        ? "bg-green-100 text-green-600"
                        : user?.role === "User"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {user?.role || "N/A"}
                  </div>
                </td>
                <td className="py-[1.3em] px-[1.8em]">
                  <button
                    className="p-1 text-blue-600 hover:text-blue-800"
                    onClick={() => setShowEdit(user)}
                    aria-label="Edit user"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="p-1 text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteClick(user)}
                    aria-label="Delete user"
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

export default UsersTable;