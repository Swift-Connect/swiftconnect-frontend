"use client";
import React, { useState, useEffect } from "react";
import { FaChevronRight, FaPlus, FaTrashAlt, FaUserCog } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import { useUsers } from "@/hooks/useUsers";

import Pagination from "../components/pagination";
import TableTabs from "../components/tableTabs";
import UsersTable from "./components/usersData";
import UserForm from "./components/editUser";

const RoleBasedAccessControl = () => {
  const router = useRouter();
  const { users: allUsers, loading: isLoading, searchUsers } = useUsers();
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState("All Users");
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [showAddRole, setShowAddRole] = useState(false);
  const [roles, setRoles] = useState([
    { id: 1, name: "Super Admin", description: "Full system access", permissions: ["all"] },
    { id: 2, name: "Admin", description: "Administrative access", permissions: ["users", "transactions", "kyc"] },
    { id: 3, name: "Support", description: "Customer support access", permissions: ["support", "kyc"] },
    { id: 4, name: "Finance", description: "Financial operations", permissions: ["transactions", "payments"] },
    { id: 5, name: "Reseller Manager", description: "Reseller management", permissions: ["resellers", "commissions"] },
    { id: 6, name: "Marketing", description: "Marketing operations", permissions: ["marketing", "notifications"] },
    { id: 7, name: "API Admin", description: "API management", permissions: ["api", "integrations"] },
    { id: 8, name: "System Admin", description: "System monitoring", permissions: ["system", "monitoring"] },
  ]);

  const itemsPerPage = 10;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('access_token');
      setToken(accessToken);
      
      if (!accessToken) {
        router.push('/account/login');
      }
    }
  }, [router]);

  useEffect(() => {
    filterUsers();
  }, [allUsers, activeTab]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/users/list-users/');
      const users = response.data.results || response.data || [];
      
      // Process users with role information
      const processedUsers = users.map(user => ({
        id: user.id,
        username: user.username || 'N/A',
        email: user.email || user.user_email || 'N/A',
        role: user.role || 'user',
        status: user.is_active ? 'Active' : 'Inactive',
        last_login: user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never',
        last_logout: user.last_logout ? new Date(user.last_logout).toLocaleDateString() : 'N/A',
        created_at: user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A',
        permissions: user.permissions || [],
        is_active: user.is_active || false,
        raw_data: user
      }));

      setUsersData(processedUsers);
    } catch (error) {
      if (error.response?.status === 401) {
        router.push('/account/login');
      } else {
        toast.error('Failed to fetch users');
        console.error('Error fetching users:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = allUsers.map(user => ({
      id: user.id,
      username: user.username || 'N/A',
      email: user.email || user.user_email || 'N/A',
      role: user.role || 'user',
      status: user.is_active ? 'Active' : 'Inactive',
      last_login: user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never',
      last_logout: user.last_logout ? new Date(user.last_logout).toLocaleDateString() : 'N/A',
      created_at: user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A',
      permissions: user.permissions || [],
      is_active: user.is_active || false,
      raw_data: user
    }));
    
    switch (activeTab) {
      case 'Active':
        filtered = filtered.filter(user => user.status === 'Active');
        break;
      case 'Inactive':
        filtered = filtered.filter(user => user.status === 'Inactive');
        break;
      case 'Admins':
        filtered = filtered.filter(user => 
          user.role === 'admin' || user.role === 'super_admin' || user.role === 'Admin'
        );
        break;
      case 'Support':
        filtered = filtered.filter(user => user.role === 'support' || user.role === 'Support');
        break;
      case 'Finance':
        filtered = filtered.filter(user => user.role === 'finance' || user.role === 'Finance');
        break;
      default:
        // All Users - no filtering
        break;
    }
    
    setFilteredData(filtered);
    setUsersData(filtered);
  };

  const handleEditClick = (rowData) => {
    setEditData(rowData);
    setShowEdit(true);
  };

  const handleUpdateUser = async (updatedData) => {
    try {
      const response = await api.patch(`/users/${updatedData.id}/`, {
        role: updatedData.role,
        is_active: updatedData.is_active,
        permissions: updatedData.permissions
      });
      
      toast.success('User role updated successfully');
      setShowEdit(false);
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error('Failed to update user role');
      console.error('Error updating user:', error);
    }
  };

  const handleBulkRoleUpdate = async (newRole) => {
    if (selectedUserIds.length === 0) {
      toast.warning('Please select users to update');
      return;
    }

    try {
      const updatePromises = selectedUserIds.map(userId =>
        api.patch(`/users/${userId}/`, { role: newRole })
      );
      
      await Promise.all(updatePromises);
      toast.success(`Updated role for ${selectedUserIds.length} users`);
      setSelectedUserIds([]);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user roles');
      console.error('Error bulk updating users:', error);
    }
  };

  const handleDeleteUsers = async () => {
    if (selectedUserIds.length === 0) {
      toast.warning('Please select users to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedUserIds.length} users?`)) {
      return;
    }

    try {
      const deletePromises = selectedUserIds.map(userId =>
        api.delete(`/users/${userId}/`)
      );
      
      await Promise.all(deletePromises);
      toast.success(`Deleted ${selectedUserIds.length} users`);
      setSelectedUserIds([]);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete users');
      console.error('Error deleting users:', error);
    }
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="overflow-hidden">
      <div className="max-md-[400px]:hidden">
        {showEdit ? (
          <>
            <div>
              <h1 className="text-[16px] font-semibold mb-8 flex items-center gap-4">
                <span 
                  className="text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={() => setShowEdit(false)}
                >
                  Role-Based Access Control
                </span>
                <FaChevronRight />
                Edit User: {editData?.username}
              </h1>
            </div>
            <UserForm 
              data={editData} 
              roles={roles}
              onSave={handleUpdateUser}
              onCancel={() => setShowEdit(false)}
            />
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-[16px] font-semibold">
                Role-Based Access Control
              </h1>
              
              <div className="flex items-center gap-4">
                {selectedUserIds.length > 0 && (
                  <>
                    <select 
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      onChange={(e) => handleBulkRoleUpdate(e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>Bulk Role Update</option>
                      {roles.map(role => (
                        <option key={role.id} value={role.name.toLowerCase()}>
                          Set as {role.name}
                        </option>
                      ))}
                    </select>
                    
                    <button
                      onClick={handleDeleteUsers}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-red-700"
                    >
                      <FaTrashAlt />
                      Delete Selected ({selectedUserIds.length})
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => setShowAddRole(true)}
                  className="bg-[#00613A] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-[#004d2e]"
                >
                  <FaPlus />
                  Add Role
                </button>
              </div>
            </div>

            <TableTabs
              header=""
              setActiveTab={setActiveTab}
              activeTab={activeTab}
              tabs={["All Users", "Active", "Inactive", "Admins", "Support", "Finance"]}
              from="RBAC"
              onPress={() => {}}
            />
            
            <div className="rounded-t-[1em] overflow-auto border border-gray-200 min-h-[50vh]">
              {isLoading ? (
                <div className="text-center py-8">Loading users...</div>
              ) : (
                <UsersTable
                  data={filteredData}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  setShowEdit={handleEditClick}
                  selectedUserIds={selectedUserIds}
                  setSelectedUserIds={setSelectedUserIds}
                  roles={roles}
                />
              )}
            </div>
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default RoleBasedAccessControl;
