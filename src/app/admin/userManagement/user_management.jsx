import Image from "next/image";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import UsersTable from "./components/usersTable";
import Pagination from "../components/pagination";
import TableTabs from "../components/tableTabs";
import UserForm from "./components/editUser";
import DeleteConfirmationModal from "./components/deleteConfirmationModal";
import { FaChevronRight, FaPlus, FaTrashAlt, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import { useUsers } from "@/hooks/useUsers";

const UserManagement = () => {
  const router = useRouter();
  const { users: allUsersData, loading: isLoading, searchUsers } = useUsers();
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState("All Users");
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [usersData, setUsersData] = useState([]); // Filtered users for display
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [itemsPerPage] = useState(50);
  const [detailedUserCache, setDetailedUserCache] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('access_token');
      setToken(accessToken);
      
      if (!accessToken) {
        router.push('/account/login');
      }
    }
  }, [router]);

  // Filter users based on search and tab
  useEffect(() => {
    filterUsers();
  }, [allUsersData, searchTerm, activeTab]);

  const fetchAllUsers = async () => {
    setIsLoading(true);
    try {
      // Build query parameters for initial load
      const params = new URLSearchParams({
        page_size: '1000', // Get more users initially
      });

      const response = await api.get(`/users/list-users/?${params.toString()}`);
      
      // Handle paginated response
      const { results, count, next, previous } = response.data;
      const users = results || [];
      
      // Process users with basic data structure
      const processedUsers = users.map(user => ({
        id: user.id,
        username: user.username || 'N/A',
        email: user.email || 'N/A',
        phone_number: user.phone_number || 'N/A',
        fullname: user.fullname || 'N/A',
        
        // Basic verification status
        email_verified: user.email_verified || false,
        phone_verified: user.phone_verified || false,
        kyc_verified: user.kyc_verified || false,
        
        // Account status
        is_active: user.is_active !== undefined ? user.is_active : true,
        is_staff: user.is_staff || false,
        is_superuser: user.is_superuser || false,
        role: user.role || 'user',
        
        // Basic dates
        date_joined: user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A',
        last_login: user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never',
        
        // Basic KYC status
        kyc_status: user.kyc_status || {
          has_kyc: false,
          status: 'not_submitted',
          approved: false,
          document_type: null,
          submitted_at: null
        },
        
        // Basic referral info
        referral_code: user.referral_code || 'N/A',
        total_referrals: user.total_referrals || 0,
        total_referral_earnings: user.total_referral_earnings || '0.00',
        
        // Security
        has_transaction_pin: user.has_transaction_pin || false,
        
        // Raw data for reference
        raw_data: user
      }));

      setAllUsersData(processedUsers);
      setTotalUsers(count || 0);
      setHasLoadedAllUsers(true);
      
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
    let filtered = searchUsers(searchTerm);
    
    // Filter by tab
    switch (activeTab) {
      case 'Active':
        filtered = filtered.filter(user => user.is_active);
        break;
      case 'Inactive':
        filtered = filtered.filter(user => !user.is_active);
        break;
      case 'Verified':
        filtered = filtered.filter(user => user.email_verified && user.phone_verified);
        break;
      case 'Unverified':
        filtered = filtered.filter(user => !user.email_verified || !user.phone_verified);
        break;
      case 'KYC Approved':
        filtered = filtered.filter(user => user.kyc_verified);
        break;
      case 'KYC Pending':
        filtered = filtered.filter(user => user.kyc_status?.has_kyc && !user.kyc_verified);
        break;
      case 'Recently Added':
        filtered = filtered.filter(user => {
          const createdDate = new Date(user.raw_data?.date_joined);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return createdDate > weekAgo;
        });
        break;
      case 'Staff':
        filtered = filtered.filter(user => user.is_staff || user.is_superuser);
        break;
      default:
        // All Users - no filtering
        break;
    }
    
    setUsersData(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const preloadNextPage = async () => {
    if (isLoadingNextPage) return;
    
    setIsLoadingNextPage(true);
    try {
      const params = new URLSearchParams({
        page: (currentPage + 1).toString(),
        page_size: itemsPerPage.toString(),
      });

      const response = await api.get(`/users/list-users/?${params.toString()}`);
      const { results, count } = response.data;
      const users = results || [];
      
      const processedUsers = users.map(user => ({
        id: user.id,
        username: user.username || 'N/A',
        email: user.email || 'N/A',
        phone_number: user.phone_number || 'N/A',
        fullname: user.fullname || 'N/A',
        
        // Basic verification status
        email_verified: user.email_verified || false,
        phone_verified: user.phone_verified || false,
        kyc_verified: user.kyc_verified || false,
        
        // Account status
        is_active: user.is_active !== undefined ? user.is_active : true,
        is_staff: user.is_staff || false,
        is_superuser: user.is_superuser || false,
        role: user.role || 'user',
        
        // Basic dates
        date_joined: user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A',
        last_login: user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never',
        
        // Basic KYC status
        kyc_status: user.kyc_status || {
          has_kyc: false,
          status: 'not_submitted',
          approved: false,
          document_type: null,
          submitted_at: null
        },
        
        // Basic referral info
        referral_code: user.referral_code || 'N/A',
        total_referrals: user.total_referrals || 0,
        total_referral_earnings: user.total_referral_earnings || '0.00',
        
        // Security
        has_transaction_pin: user.has_transaction_pin || false,
        
        // Raw data for reference
        raw_data: user
      }));

      // Add new users to allUsersData
      setAllUsersData(prev => {
        const existingIds = new Set(prev.map(user => user.id));
        const newUsers = processedUsers.filter(user => !existingIds.has(user.id));
        return [...prev, ...newUsers];
      });
      
    } catch (error) {
      console.error('Error preloading next page:', error);
    } finally {
      setIsLoadingNextPage(false);
    }
  };

  // Get paginated data for current page
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return usersData.slice(startIndex, endIndex);
  }, [usersData, currentPage, itemsPerPage]);

  // Function to fetch detailed user information when needed
  const fetchDetailedUserInfo = async (userId) => {
    // Check if we already have detailed info cached
    if (detailedUserCache[userId]) {
      return detailedUserCache[userId];
    }

    try {
      const response = await api.get(`/users/admin/user/${userId}/`);
      const user = response.data;
      
      // Process detailed user data
      const detailedUser = {
        id: user.id,
        username: user.username || 'N/A',
        email: user.email || 'N/A',
        phone_number: user.phone_number || 'N/A',
        fullname: user.fullname || 'N/A',
        date_of_birth: user.date_of_birth || 'N/A',
        gender: user.gender || 'Not Specified',
        residential_address: user.residential_address || 'N/A',
        
        // Verification status
        email_verified: user.email_verified || false,
        phone_verified: user.phone_verified || false,
        kyc_verified: user.kyc_verified || false,
        
        // Account status
        is_active: user.is_active !== undefined ? user.is_active : true,
        is_staff: user.is_staff || false,
        is_superuser: user.is_superuser || false,
        role: user.role || 'user',
        
        // Dates
        date_joined: user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A',
        last_login: user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never',
        
        // KYC information
        kyc_status: user.kyc_status || {
          has_kyc: false,
          status: 'not_submitted',
          approved: false,
          document_type: null,
          submitted_at: null
        },
        kyc_details: user.kyc_details || null,
        
        // Referral information
        referral_code: user.referral_code || 'N/A',
        referred_by_username: user.referred_by_username || null,
        total_referrals: user.referral_stats?.total_referrals || 0,
        total_referral_earnings: user.referral_stats?.total_earnings || '0.00',
        pending_referral_earnings: user.referral_stats?.pending_earnings || '0.00',
        referral_stats: user.referral_stats || {
          total_referrals: 0,
          total_earnings: "0.00",
          pending_earnings: "0.00"
        },
        recent_activity: user.recent_activity || {
          recent_referrals: []
        },
        
        // Security
        has_transaction_pin: user.has_transaction_pin || false,
        
        // Account status object
        account_status: user.account_status || {
          account_created: null,
          last_activity: null,
          email_verified: false,
          phone_verified: false,
          kyc_verified: false,
          has_transaction_pin: false,
          profile_complete: false,
          account_active: false,
          has_admin_access: false
        },
        
        // Raw data for reference
        raw_data: user
      };

      // Cache the detailed user info
      setDetailedUserCache(prev => ({
        ...prev,
        [userId]: detailedUser
      }));

      return detailedUser;
    } catch (error) {
      console.error('Error fetching detailed user info:', error);
      toast.error('Failed to fetch detailed user information');
      return null;
    }
  };

  const handleEditClick = async (rowData) => {
    // Fetch detailed user info for editing
    const detailedUser = await fetchDetailedUserInfo(rowData.id);
    if (detailedUser) {
      setEditData(detailedUser);
      setShowEdit(true);
    }
  };

  const handleViewClick = async (rowData) => {
    // Fetch detailed user info for viewing
    const detailedUser = await fetchDetailedUserInfo(rowData.id);
    if (detailedUser) {
      setViewData(detailedUser);
      setShowView(true);
    }
  };

  const handleDeleteClick = (rowData) => {
    setDeleteData(rowData);
    setShowDeleteModal(true);
  };

  const handleUpdateUser = async (updatedData) => {
    try {
      await api.patch(`/users/${updatedData.id}/`, {
        username: updatedData.username,
        email: updatedData.email,
        role: updatedData.role,
        is_active: updatedData.is_active,
        is_staff: updatedData.is_staff,
        is_superuser: updatedData.is_superuser
      });
      
      toast.success('User updated successfully');
      setShowEdit(false);
      
      // Clear cache for this user and refetch
      setDetailedUserCache(prev => {
        const newCache = { ...prev };
        delete newCache[updatedData.id];
        return newCache;
      });
      
      // Update the user in allUsersData
      setAllUsersData(prev => 
        prev.map(user => 
          user.id === updatedData.id 
            ? { ...user, ...updatedData }
            : user
        )
      );
    } catch (error) {
      toast.error('Failed to update user');
      console.error('Error updating user:', error);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUserIds.length === 0) {
      toast.warning('Please select users to perform this action');
      return;
    }

    try {
      const promises = selectedUserIds.map(userId => {
        switch (action) {
          case 'activate':
            return api.patch(`/users/${userId}/`, { is_active: true });
          case 'deactivate':
            return api.patch(`/users/${userId}/`, { is_active: false });
          case 'delete':
            return api.delete(`/users/${userId}/`);
          default:
            return Promise.resolve();
        }
      });

      await Promise.all(promises);
      toast.success(`Successfully ${action}d ${selectedUserIds.length} users`);
      setSelectedUserIds([]);
      
      // Clear cache and refetch all users
      setDetailedUserCache({});
      setHasLoadedAllUsers(false);
      fetchAllUsers();
    } catch (error) {
      toast.error(`Failed to ${action} users`);
      console.error(`Error ${action}ing users:`, error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteData) return;

    try {
      await api.delete(`/users/${deleteData.id}/`);
      toast.success(`User ${deleteData.username} deleted successfully`);
      setShowDeleteModal(false);
      setDeleteData(null);
      
      // Clear cache for this user and refetch
      setDetailedUserCache(prev => {
        const newCache = { ...prev };
        delete newCache[deleteData.id];
        return newCache;
      });
      
      // Remove user from allUsersData
      setAllUsersData(prev => prev.filter(user => user.id !== deleteData.id));
    } catch (error) {
      toast.error('Failed to delete user');
      console.error('Error deleting user:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedUserIds([]); // Clear selection when changing pages
  };

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    // No need to reset page or clear cache - filtering handles it
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSelectedUserIds([]); // Clear selection when changing tabs
  };

  return (
    <div className="overflow-hidden">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteData(null);
        }}
        onConfirm={handleConfirmDelete}
        userData={deleteData}
      />

      <div className="max-md-[400px]:hidden">
        {showEdit ? (
          <>
            <div>
              <h1 className="text-[16px] font-semibold mb-8 flex items-center gap-4">
                <span 
                  className="text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={() => setShowEdit(false)}
                >
                  User Management
                </span>
                <FaChevronRight />
                Edit User: {editData?.username}
              </h1>
            </div>
            <UserForm 
              data={editData} 
              onSave={handleUpdateUser}
              onCancel={() => setShowEdit(false)}
            />
          </>
        ) : showView ? (
          <>
            <div>
              <h1 className="text-[16px] font-semibold mb-8 flex items-center gap-4">
                <span 
                  className="text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={() => setShowView(false)}
                >
                  User Management
                </span>
                <FaChevronRight />
                View User: {viewData?.username}
              </h1>
            </div>
            <UserDetailView 
              data={viewData} 
              onClose={() => setShowView(false)}
              onEdit={() => {
                setShowView(false);
                handleEditClick(viewData);
              }}
            />
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-[16px] font-semibold">
                User Management
              </h1>
              
              <div className="flex items-center gap-4">
                {selectedUserIds.length > 0 && (
                  <div className="flex items-center gap-2">
                    <select 
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      onChange={(e) => handleBulkAction(e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>Bulk Actions</option>
                      <option value="activate">Activate Selected</option>
                      <option value="deactivate">Deactivate Selected</option>
                      <option value="delete">Delete Selected</option>
                    </select>
                    
                    <span className="text-sm text-gray-500">
                      ({selectedUserIds.length} selected)
                    </span>
                  </div>
                )}
                
                <button
                  onClick={() => setShowAddUser(true)}
                  className="bg-[#00613A] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-[#004d2e]"
                >
                  <FaPlus />
                  Add User
                </button>
              </div>
            </div>

            <TableTabs
              header=""
              setActiveTab={handleTabChange}
              activeTab={activeTab}
              tabs={["All Users", "Active", "Inactive", "Verified", "Unverified", "KYC Approved", "KYC Pending", "Staff", "Recently Added"]}
              from="userManagement"
              onPress={() => setShowAddUser(true)}
              searchValue={searchTerm}
              onSearchChange={handleSearchChange}
            />
            
            <div className="rounded-t-[1em] overflow-auto border border-gray-200 min-h-[50vh]">
              {isLoading ? (
                <div className="text-center py-8">Loading users...</div>
              ) : (
                <UsersTable
                  data={paginatedUsers}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  setShowEdit={handleEditClick}
                  setShowView={handleViewClick}
                  setShowDelete={handleDeleteClick}
                  selectedUserIds={selectedUserIds}
                  setSelectedUserIds={setSelectedUserIds}
                  isLoading={isLoading}
                />
              )}
            </div>
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

// User Detail View Component
const UserDetailView = ({ data, onClose, onEdit }) => {
  if (!data) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            User Details: {data.username}
          </h2>
          <p className="text-gray-600 mt-2">Complete user information and account status</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Edit User
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-6">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <p className="text-lg font-semibold text-gray-900">{data.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <p className="text-lg text-gray-900">{data.fullname || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-lg text-gray-900">{data.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <p className="text-lg text-gray-900">{data.phone_number || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <p className="text-lg text-gray-900">{data.gender || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <p className="text-lg text-gray-900">{data.date_of_birth || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <p className="text-lg text-gray-900">{data.residential_address || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        {/* Account Status */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-6">Account Status</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                data.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {data.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <p className="text-lg capitalize text-gray-900">{data.role}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Staff Access</label>
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                data.is_staff ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {data.is_staff ? 'Staff' : 'Regular User'}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Super User</label>
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                data.is_superuser ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {data.is_superuser ? 'Super User' : 'Regular User'}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Verification</label>
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                data.email_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {data.email_verified ? 'Verified' : 'Not Verified'}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Verification</label>
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                data.phone_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {data.phone_verified ? 'Verified' : 'Not Verified'}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transaction PIN</label>
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                data.has_transaction_pin ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {data.has_transaction_pin ? 'Set' : 'Not Set'}
              </span>
            </div>
          </div>
        </div>

        {/* KYC Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-6">KYC Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">KYC Status</label>
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                data.kyc_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {data.kyc_verified ? 'Approved' : data.kyc_status?.has_kyc ? 'Pending' : 'Not Submitted'}
              </span>
            </div>
            {data.kyc_details && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                <p className="text-lg text-gray-900">{data.kyc_details.document_type}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">KYC Details</label>
              <p className="text-sm text-gray-600">
                {data.kyc_status?.has_kyc 
                  ? `Status: ${data.kyc_status.status}${data.kyc_details?.created_at ? ` - Submitted on ${new Date(data.kyc_details.created_at).toLocaleDateString()}` : ''}`
                  : 'No KYC documents submitted'
                }
              </p>
            </div>
            {data.kyc_details?.document_url && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document</label>
                <div className="mt-2">
                  <img 
                    src={data.kyc_details.document_url} 
                    alt="KYC Document"
                    className="w-full max-w-md h-auto rounded-lg border border-gray-200 shadow-sm"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div 
                    className="hidden w-full max-w-md p-4 bg-gray-100 rounded-lg border border-gray-200 text-center text-gray-500"
                    style={{ display: 'none' }}
                  >
                    <p className="text-sm">Image could not be loaded</p>
                    <a 
                      href={data.kyc_details.document_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline mt-2 inline-block"
                    >
                      View Document
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Referral Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-6">Referral Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Referral Code</label>
              <p className="text-lg font-mono text-gray-900">{data.referral_code}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Referred By</label>
              <p className="text-lg text-gray-900">{data.referred_by_username || 'None'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Referrals</label>
              <p className="text-lg text-gray-900">{data.referral_stats?.total_referrals || 0}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Earnings</label>
              <p className="text-lg font-semibold text-green-600">₦{parseFloat(data.referral_stats?.total_earnings || '0.00').toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pending Earnings</label>
              <p className="text-lg font-semibold text-orange-600">₦{parseFloat(data.referral_stats?.pending_earnings || '0.00').toLocaleString()}</p>
            </div>
            {data.recent_activity?.recent_referrals && data.recent_activity.recent_referrals.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recent Referrals</label>
                <div className="space-y-2">
                  {data.recent_activity.recent_referrals.slice(0, 3).map((referral, index) => (
                    <div key={index} className="text-sm text-gray-600 bg-white p-2 rounded border">
                      {referral.username || referral.email || 'Unknown User'}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timeline Information */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-6">Timeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Joined</label>
            <p className="text-lg text-gray-900">{data.date_joined}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
            <p className="text-lg text-gray-900">{data.last_login}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
