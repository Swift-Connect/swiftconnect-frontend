import { useState } from "react";
import { FaChevronDown, FaEdit, FaTrash } from "react-icons/fa";
import ActionPopUp from "../../components/actionPopUp";

const UsersTable = ({ 
  data, 
  currentPage, 
  itemsPerPage, 
  setShowEdit, 
  selectedUserIds = [], 
  setSelectedUserIds = () => {},
  roles = []
}) => {
  const columns = [
    "Username",
    "Email",
    "Role",
    "Status",
    "Last Login",
    "Created",
    "Actions",
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
    
    if (newCheckedState) {
      const allUserIds = data.map(user => user.id);
      setSelectedUserIds(allUserIds);
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleCheckboxChange = (index) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
    setIsAllChecked(newCheckedItems.every((item) => item));
    
    const userId = data[index]?.id;
    if (userId) {
      if (newCheckedItems[index]) {
        setSelectedUserIds(prev => [...prev, userId]);
      } else {
        setSelectedUserIds(prev => prev.filter(id => id !== userId));
      }
    }
  };

  const handleActionClick = (index) => {
    setActiveRow(activeRow === index ? null : index);
  };

  const getRoleBadgeColor = (role) => {
    const roleLower = role?.toLowerCase();
    if (roleLower === 'super admin' || roleLower === 'admin') {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    }
    if (roleLower === 'support') {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (roleLower === 'finance') {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (roleLower === 'reseller manager') {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    }
    if (roleLower === 'marketing') {
      return 'bg-pink-100 text-pink-800 border-pink-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusBadgeColor = (status) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  // ** PAGINATION LOGIC **
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      {data.length === 0 ? (
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
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </th>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="py-[1.3em] px-[1.8em] whitespace-nowrap font-semibold"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedData.map((user, idx) => (
              <tr
                key={user.id || idx}
                className={`border-t hover:bg-gray-50 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="py-[1.3em] px-[1.8em]">
                  <input
                    type="checkbox"
                    checked={checkedItems[startIndex + idx]}
                    onChange={() => handleCheckboxChange(startIndex + idx)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>
                <td className="py-[1.3em] px-[1.8em]">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {user?.username || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {user?.id}
                    </div>
                  </div>
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {user?.email || 'N/A'}
                </td>
                <td className="py-[1.3em] px-[1.8em] relative">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(user?.role)}`}
                    >
                      {user?.role || 'User'}
                    </span>
                    <button
                      onClick={() => handleActionClick(idx)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FaChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                  {activeRow === idx && (
                    <ActionPopUp 
                      optionList={roles.map(role => role.name)}
                      onSelect={(selectedRole) => {
                        // Handle role change here
                        console.log('Role changed to:', selectedRole);
                        setActiveRow(null);
                      }}
                    />
                  )}
                </td>
                <td className="py-[1.3em] px-[1.8em]">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadgeColor(user?.status)}`}>
                    {user?.status || 'Unknown'}
                  </span>
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {user?.last_login || 'Never'}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {user?.created_at || 'N/A'}
                </td>
                <td className="py-[1.3em] px-[1.8em]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowEdit(user)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Edit User"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${user?.username}?`)) {
                          // Handle delete here
                          console.log('Delete user:', user?.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete User"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
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
