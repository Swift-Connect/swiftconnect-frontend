import Image from "next/image";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import UsersTable from "./components/usersTable";
import Pagination from "../components/pagination";
import TableTabs from "../components/tableTabs";
import UserForm from "./components/editUser";
import DeleteConfirmationModal from "./components/deleteConfirmationModal";
import { 
  FaChevronRight, 
  FaPlus, 
  FaTrashAlt, 
  FaEye, 
  FaUsers, 
  FaUserCheck, 
  FaUserTimes, 
  FaShieldAlt, 
  FaClock, 
  FaCrown,
  FaSearch,
  FaFilter,
  FaDownload,
  FaChartLine,
  FaUserEdit,
  FaUserPlus,
  FaBan,
  FaCheckCircle,
  FaExclamationTriangle,
  FaIdCard,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaShareAlt,
  FaTimes
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import { useUsers } from "@/hooks/useUsers";

const UserManagement = () => {
  const router = useRouter();
  const { users: allUsersData, loading: isLoading, searchUsers, refreshUsers } = useUsers();
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
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [hasLoadedAllUsers, setHasLoadedAllUsers] = useState(false);

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
    setIsLoadingUsers(true);
    try {
      // Build query parameters for initial load
      const params = new URLSearchParams({
        page_size: '50', // Get more users initially
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

      // Update the users through the useUsers hook
      // The hook will handle the state management
      setHasLoadedAllUsers(true);
      
    } catch (error) {
      if (error.response?.status === 401) {
        router.push('/account/login');
      } else {
        toast.error('Failed to fetch users');
        console.error('Error fetching users:', error);
      }
    } finally {
      setIsLoadingUsers(false);
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

      // Users are managed by the useUsers hook
      // No need to manually update local state
      
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
    console.log('handleEditClick called with:', rowData);
    // Fetch detailed user info for editing
    const detailedUser = await fetchDetailedUserInfo(rowData.id);
    console.log('Detailed user data fetched:', detailedUser);
    if (detailedUser) {
      setEditData(detailedUser);
      setShowEdit(true);
    } else {
      toast.error('Failed to fetch user details for editing');
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
      console.log('handleUpdateUser called with:', updatedData);
      
      // Clean and prepare the update payload - only include non-empty, non-N/A values
      const updatePayload = {};
      
      // Helper function to check if a value should be included
      const shouldIncludeField = (value) => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') {
          const trimmed = value.trim();
          return trimmed !== '' && trimmed !== 'N/A' && trimmed !== 'n/a';
        }
        if (typeof value === 'boolean') return true; // Always include boolean fields
        return value !== '';
      };

      // Only include fields that have meaningful values
      if (shouldIncludeField(updatedData.username)) {
        updatePayload.username = updatedData.username.trim();
      }
      if (shouldIncludeField(updatedData.email)) {
        updatePayload.email = updatedData.email.trim();
      }
      if (shouldIncludeField(updatedData.phone_number)) {
        updatePayload.phone_number = updatedData.phone_number.trim();
      }
      if (shouldIncludeField(updatedData.fullname)) {
        updatePayload.fullname = updatedData.fullname.trim();
      }
      if (shouldIncludeField(updatedData.date_of_birth)) {
        updatePayload.date_of_birth = updatedData.date_of_birth;
      }
      if (shouldIncludeField(updatedData.gender)) {
        updatePayload.gender = updatedData.gender;
      }
      if (shouldIncludeField(updatedData.residential_address)) {
        updatePayload.residential_address = updatedData.residential_address.trim();
      }
      if (shouldIncludeField(updatedData.role)) {
        updatePayload.role = updatedData.role;
      }
      // Always include boolean fields as they have meaningful values
      updatePayload.is_active = updatedData.is_active;
      updatePayload.is_staff = updatedData.is_staff;
      updatePayload.is_superuser = updatedData.is_superuser;

      console.log('Cleaned update payload:', updatePayload);
      console.log('API endpoint:', `/users/${updatedData.id}/`);

      // Try different endpoint variations
      let response;
      try {
        response = await api.patch(`/users/${updatedData.id}/`, updatePayload);
      } catch (endpointError) {
        console.log('First endpoint failed, trying alternative...');
        try {
          response = await api.patch(`/users/${updatedData.id}`, updatePayload);
        } catch (secondError) {
          console.log('Second endpoint failed, trying admin endpoint...');
          response = await api.patch(`/users/admin/user/${updatedData.id}/`, updatePayload);
        }
      }
      
      console.log('Update response:', response);
      
      toast.success('User updated successfully');
      setShowEdit(false);
      
      // Clear cache for this user and refetch
      setDetailedUserCache(prev => {
        const newCache = { ...prev };
        delete newCache[updatedData.id];
        return newCache;
      });
      
      // Refresh the data to show updated information
      try {
        await refreshUsers();
      } catch (refreshError) {
        console.log('Manual refresh failed, but update was successful');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      // Provide more specific error messages
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        console.log('Validation errors:', errorData);
        if (errorData.username) {
          toast.error(`Username error: ${Array.isArray(errorData.username) ? errorData.username.join(', ') : errorData.username}`);
        } else if (errorData.email) {
          toast.error(`Email error: ${Array.isArray(errorData.email) ? errorData.email.join(', ') : errorData.email}`);
        } else if (errorData.phone_number) {
          toast.error(`Phone error: ${Array.isArray(errorData.phone_number) ? errorData.phone_number.join(', ') : errorData.phone_number}`);
        } else {
          toast.error('Validation error: Please check your input');
        }
      } else if (error.response?.status === 403) {
        toast.error('Permission denied: You cannot update this user');
      } else if (error.response?.status === 404) {
        toast.error('User not found');
      } else if (error.response?.status === 500) {
        toast.error('Server error: Please try again later');
      } else {
        toast.error(`Failed to update user: ${error.message || 'Unknown error'}`);
      }
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
      
      // Refresh the users list after successful deletion
      try {
        await refreshUsers();
      } catch (refreshError) {
        console.log('Manual refresh failed, but delete was successful');
      }
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
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-7xl mx-auto border border-gray-200">
      {/* Enhanced Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-white">
              {data.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-gray-900">
              {data.username}
            </h2>
            <p className="text-gray-600 text-lg mt-1">User ID: #{data.id}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className={`inline-flex px-4 py-2 text-sm font-medium rounded-xl ${
                data.is_active ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {data.is_active ? '✓ Active' : '✗ Inactive'}
              </span>
              <span className={`inline-flex px-4 py-2 text-sm font-medium rounded-xl ${
                data.kyc_verified ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
              }`}>
                {data.kyc_verified ? '✓ KYC Approved' : '⏳ KYC Pending'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-2"
          >
            <FaUserEdit />
            Edit User
          </button>
          <button
            onClick={onClose}
            className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
          >
            <FaTimes />
            Close
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Basic Information */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8 rounded-2xl border border-blue-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaUserEdit className="text-white text-sm sm:text-base" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Basic Information</h3>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaUserEdit className="text-blue-500 flex-shrink-0" />
                  <span className="truncate">Username</span>
                </label>
                <p className="text-sm sm:text-base font-semibold text-gray-900 bg-white px-3 sm:px-4 py-2 rounded-lg border border-blue-200 break-words overflow-hidden">{data.username}</p>
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaUserEdit className="text-blue-500 flex-shrink-0" />
                  <span className="truncate">Full Name</span>
                </label>
                <p className="text-sm sm:text-base text-gray-900 bg-white px-3 sm:px-4 py-2 rounded-lg border border-blue-200 break-words overflow-hidden">{data.fullname || 'Not provided'}</p>
              </div>
              <div className="min-w-0 sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaEnvelope className="text-blue-500 flex-shrink-0" />
                  <span className="truncate">Email</span>
                </label>
                <p className="text-sm sm:text-base text-gray-900 bg-white px-3 sm:px-4 py-2 rounded-lg border border-blue-200 break-words overflow-hidden">{data.email}</p>
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaPhone className="text-blue-500 flex-shrink-0" />
                  <span className="truncate">Phone Number</span>
                </label>
                <p className="text-sm sm:text-base text-gray-900 bg-white px-3 sm:px-4 py-2 rounded-lg border border-blue-200 break-words overflow-hidden">{data.phone_number || 'Not provided'}</p>
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaUserEdit className="text-blue-500 flex-shrink-0" />
                  <span className="truncate">Gender</span>
                </label>
                <p className="text-sm sm:text-base text-gray-900 bg-white px-3 sm:px-4 py-2 rounded-lg border border-blue-200 break-words overflow-hidden">{data.gender || 'Not specified'}</p>
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-500 flex-shrink-0" />
                  <span className="truncate">Date of Birth</span>
                </label>
                <p className="text-sm sm:text-base text-gray-900 bg-white px-3 sm:px-4 py-2 rounded-lg border border-blue-200 break-words overflow-hidden">{data.date_of_birth || 'Not provided'}</p>
              </div>
            </div>
            <div className="min-w-0">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-500 flex-shrink-0" />
                <span className="truncate">Address</span>
              </label>
              <p className="text-sm sm:text-base text-gray-900 bg-white px-3 sm:px-4 py-2 rounded-lg border border-blue-200 break-words overflow-hidden">{data.residential_address || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        {/* Account Status */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 sm:p-6 lg:p-8 rounded-2xl border border-green-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaShieldAlt className="text-white text-sm sm:text-base" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Account Status</h3>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <span className={`inline-flex px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-xl ${
                  data.is_active ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {data.is_active ? '✓ Active' : '✗ Inactive'}
                </span>
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <p className="text-sm sm:text-base capitalize text-gray-900 bg-white px-3 sm:px-4 py-2 rounded-lg border border-green-200 break-words overflow-hidden">{data.role}</p>
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Staff Access</label>
                <span className={`inline-flex px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-xl ${
                  data.is_staff ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-gray-100 text-gray-800 border border-gray-200'
                }`}>
                  {data.is_staff ? '✓ Staff' : 'Regular User'}
                </span>
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Super User</label>
                <span className={`inline-flex px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-xl ${
                  data.is_superuser ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-gray-100 text-gray-800 border border-gray-200'
                }`}>
                  {data.is_superuser ? '✓ Super User' : 'Regular User'}
                </span>
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Verification</label>
                <span className={`inline-flex px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-xl ${
                  data.email_verified ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                }`}>
                  {data.email_verified ? '✓ Verified' : '⚠ Not Verified'}
                </span>
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Verification</label>
                <span className={`inline-flex px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-xl ${
                  data.phone_verified ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                }`}>
                  {data.phone_verified ? '✓ Verified' : '⚠ Not Verified'}
                </span>
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Transaction PIN</label>
                <span className={`inline-flex px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-xl ${
                  data.has_transaction_pin ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {data.has_transaction_pin ? '✓ Set' : '✗ Not Set'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* KYC Information */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 sm:p-6 lg:p-8 rounded-2xl border border-purple-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaIdCard className="text-white text-sm sm:text-base" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">KYC Information</h3>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2">KYC Status</label>
                <span className={`inline-flex px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-xl ${
                  data.kyc_verified ? 'bg-green-100 text-green-800 border border-green-200' : 
                  data.kyc_status?.has_kyc ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 
                  'bg-gray-100 text-gray-800 border border-gray-200'
                }`}>
                  {data.kyc_verified ? '✓ Approved' : data.kyc_status?.has_kyc ? '⏳ Pending' : '❌ Not Submitted'}
                </span>
              </div>
              {data.kyc_details && (
                <div className="min-w-0">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Document Type</label>
                  <p className="text-sm sm:text-base text-gray-900 bg-white px-3 sm:px-4 py-2 rounded-lg border border-purple-200 break-words overflow-hidden">{data.kyc_details.document_type}</p>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <label className="block text-sm font-semibold text-gray-700 mb-2">KYC Details</label>
              <p className="text-sm text-gray-600 bg-white px-3 sm:px-4 py-2 rounded-lg border border-purple-200 break-words overflow-hidden">
                {data.kyc_status?.has_kyc 
                  ? `Status: ${data.kyc_status.status}${data.kyc_details?.created_at ? ` - Submitted on ${new Date(data.kyc_details.created_at).toLocaleDateString()}` : ''}`
                  : 'No KYC documents submitted'
                }
              </p>
            </div>
            {data.kyc_details?.document_url && (
              <div className="min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Document</label>
                <div className="mt-2">
                  <img 
                    src={data.kyc_details.document_url} 
                    alt="KYC Document"
                    className="w-full max-w-full sm:max-w-md h-auto rounded-xl border border-purple-200 shadow-sm"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div 
                    className="hidden w-full max-w-full sm:max-w-md p-4 bg-gray-100 rounded-xl border border-purple-200 text-center text-gray-500"
                    style={{ display: 'none' }}
                  >
                    <p className="text-sm">Image could not be loaded</p>
                    <a 
                      href={data.kyc_details.document_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800 text-sm underline mt-2 inline-block"
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
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 sm:p-6 lg:p-8 rounded-2xl border border-pink-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaShareAlt className="text-white text-sm sm:text-base" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Referral Information</h3>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Referral Code</label>
                <p className="text-sm sm:text-base font-mono text-gray-900 bg-white px-3 sm:px-4 py-2 rounded-lg border border-pink-200 break-words overflow-hidden">{data.referral_code}</p>
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Referred By</label>
                <p className="text-sm sm:text-base text-gray-900 bg-white px-3 sm:px-4 py-2 rounded-lg border border-pink-200 break-words overflow-hidden">{data.referred_by_username || 'None'}</p>
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Referrals</label>
                <p className="text-sm sm:text-base text-gray-900 bg-white px-3 sm:px-4 py-2 rounded-lg border border-pink-200 break-words overflow-hidden">{data.referral_stats?.total_referrals || 0}</p>
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Earnings</label>
                <p className="text-sm sm:text-base font-semibold text-green-600 bg-white px-3 sm:px-4 py-2 rounded-lg border border-pink-200 break-words overflow-hidden">₦{parseFloat(data.referral_stats?.total_earnings || '0.00').toLocaleString()}</p>
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pending Earnings</label>
                <p className="text-sm sm:text-base font-semibold text-orange-600 bg-white px-3 sm:px-4 py-2 rounded-lg border border-pink-200 break-words overflow-hidden">₦{parseFloat(data.referral_stats?.pending_earnings || '0.00').toLocaleString()}</p>
              </div>
            </div>
            {data.recent_activity?.recent_referrals && data.recent_activity.recent_referrals.length > 0 && (
              <div className="min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Recent Referrals</label>
                <div className="space-y-2">
                  {data.recent_activity.recent_referrals.slice(0, 3).map((referral, index) => (
                    <div key={index} className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-pink-200 flex items-center gap-2">
                      <FaUserPlus className="text-pink-500 flex-shrink-0" />
                      <span className="break-words overflow-hidden">{referral.username || referral.email || 'Unknown User'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timeline Information */}
      <div className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-6 lg:p-8 rounded-2xl border border-amber-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <FaClock className="text-white text-sm sm:text-base" />
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Account Timeline</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-amber-200 min-w-0">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FaCalendarAlt className="text-amber-500 flex-shrink-0" />
              <span className="truncate">Date Joined</span>
            </label>
            <p className="text-sm sm:text-base font-semibold text-gray-900 break-words overflow-hidden">{data.date_joined}</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-amber-200 min-w-0">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FaClock className="text-amber-500 flex-shrink-0" />
              <span className="truncate">Last Login</span>
            </label>
            <p className="text-sm sm:text-base font-semibold text-gray-900 break-words overflow-hidden">{data.last_login}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
