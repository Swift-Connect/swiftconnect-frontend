import { useState } from "react";
import { FaEdit, FaEye, FaTrash, FaUser, FaEnvelope, FaCalendar, FaShieldAlt, FaPhone, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const UsersTable = ({
  data,
  currentPage,
  itemsPerPage,
  setShowEdit,
  setShowView,
  setShowDelete,
  selectedUserIds = [],
  setSelectedUserIds = () => {},
  isLoading = false,
}) => {
  // Reduced columns - optimized for compact display
  const columns = [
    "User",
    "Status",
    "Verification",
    "Role",
    "Joined",
    "Actions",
  ];

  const [checkedItems, setCheckedItems] = useState(
    new Array(data.length).fill(false)
  );
  const [isAllChecked, setIsAllChecked] = useState(false);

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

  const getStatusBadgeColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getVerificationBadgeColor = (emailVerified, phoneVerified) => {
    if (emailVerified && phoneVerified) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (emailVerified || phoneVerified) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else {
      return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getRoleBadgeColor = (role, isStaff, isSuperuser) => {
    if (isSuperuser) {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    } else if (isStaff) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    } else if (role === 'admin') {
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    } else if (role === 'manager') {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getVerificationText = (emailVerified, phoneVerified) => {
    if (emailVerified && phoneVerified) {
      return 'Full';
    } else if (emailVerified) {
      return 'Email';
    } else if (phoneVerified) {
      return 'Phone';
    } else {
      return 'None';
    }
  };

  const getRoleText = (role, isStaff, isSuperuser) => {
    if (isSuperuser) {
      return 'Super User';
    } else if (isStaff) {
      return 'Staff';
    } else {
      return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FaUser className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium">No users found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 font-semibold text-gray-900 text-left">
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
                    className="py-3 px-4 font-semibold text-gray-900 text-left whitespace-nowrap"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((user, idx) => (
                <tr
                  key={user.id || idx}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={checkedItems[idx]}
                      onChange={() => handleCheckboxChange(idx)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  
                  {/* User Column - Compact with avatar, name, and contact */}
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaUser className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {user?.username || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user?.fullname || 'No name'}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center mt-1">
                          <FaEnvelope className="w-3 h-3 mr-1" />
                          {user?.email || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Status Column */}
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadgeColor(user?.is_active)}`}>
                      {user?.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  
                  {/* Verification Column */}
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getVerificationBadgeColor(user?.email_verified, user?.phone_verified)}`}>
                        {getVerificationText(user?.email_verified, user?.phone_verified)}
                      </span>
                      <div className="flex space-x-1">
                        {user?.email_verified ? (
                          <FaCheckCircle className="w-3 h-3 text-green-500" title="Email Verified" />
                        ) : (
                          <FaTimesCircle className="w-3 h-3 text-red-500" title="Email Not Verified" />
                        )}
                        {user?.phone_verified ? (
                          <FaCheckCircle className="w-3 h-3 text-green-500" title="Phone Verified" />
                        ) : (
                          <FaTimesCircle className="w-3 h-3 text-red-500" title="Phone Not Verified" />
                        )}
                      </div>
                    </div>
                  </td>
                  
                  {/* Role Column */}
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(user?.role, user?.is_staff, user?.is_superuser)}`}>
                      {getRoleText(user?.role, user?.is_staff, user?.is_superuser)}
                    </span>
                  </td>
                  
                  {/* Joined Date Column */}
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <FaCalendar className="w-3 h-3 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {user?.date_joined || 'N/A'}
                      </span>
                    </div>
                  </td>
                  
                  {/* Actions Column - Prominent View button */}
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowView(user)}
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
                        title="View Details"
                      >
                        <FaEye className="w-3 h-3" />
                        View
                      </button>
                      <button
                        onClick={() => setShowEdit(user)}
                        className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
                        title="Edit User"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDelete(user)}
                        className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
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
        </div>
      )}
      
      {/* Summary Footer */}
      {data.length > 0 && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Showing {data.length} users on page {currentPage}
            </span>
            {selectedUserIds.length > 0 && (
              <span className="text-blue-600 font-medium">
                {selectedUserIds.length} user(s) selected
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UsersTable;
