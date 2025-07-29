import Image from "next/image";
import React, { useEffect, useState } from "react";
import UsersTable from "./components/usersTable";
import Pagination from "../components/pagination";
import TableTabs from "../components/tableTabs";
import UserForm from "./components/editUser";
import { FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "@/utils/api";
import { useRouter } from "next/navigation";

const UserManagement = () => {
  const router = useRouter();
  const token = localStorage.getItem("access_token");
  const [activeTabPending, setActiveTabPending] = React.useState("Active");
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [usersData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [selectedUserIds, setSelectedUserIds] = useState([]); // Track selected rows
  const [showAddUser, setShowAddUser] = useState(false);
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState("");
  const [addUserForm, setAddUserForm] = useState({
    username: "",
    email: "",
    role: "user",
    is_active: true,
  });
  const [editUserLoading, setEditUserLoading] = useState(false);
  const [editUserError, setEditUserError] = useState("");
  const [editUserForm, setEditUserForm] = useState({
    username: "",
    email: "",
    role: "user",
    is_active: true,
  });

  useEffect(() => {
    if (!token) {
      router.push("/account/login");
      return;
    }

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const usersData = await fetchAllPages("/users/list-users/");
        // Filter valid users
        const validUsers = usersData.filter((user) => user?.id);
        console.log("Fetched users:", usersData);
        console.log("Valid users:", validUsers);

        // Process users to match table structure
        const processedData = validUsers.map((user) => ({
          id: user?.id,
          username: user?.username,
          account_id: user?.account_id,
          created_at: user?.created_at,
          api_response: user?.api_response || "N/A",
          status: user?.status || "Not Approved", // Default to match action
        }));
        console.log("processed data from user managament", validUsers);

        setUserData(validUsers);
        // setCheckedItems(new Array(processedData.length).fill(false));
      } catch (error) {
        if (error.response?.status === 401) {
          router.push("/account/login");
        } else {
          toast.error("Failed to fetch users. Please try again later.");
        }
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

  console.log("user data from the endpoint", usersData);

  const editUser = true;
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(usersData.length / itemsPerPage);

  const handleEditClick = (rowData) => {
    setEditData(rowData);
    setEditUserForm({
      username: rowData.username || "",
      email: rowData.email || "",
      role: rowData.role || "user",
      is_active: rowData.is_active !== undefined ? rowData.is_active : true,
    });
    setShowEdit(true);
  };

  const handleSelectedUsersChange = (selectedIds) => {
    setSelectedUserIds(selectedIds);
  };

  // Add user handler
  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddUserLoading(true);
    setAddUserError("");
    try {
      await api.post("/users/role-admin/", addUserForm);
      toast.success("User added successfully.");
      setShowAddUser(false);
      setAddUserForm({
        username: "",
        email: "",
        role: "user",
        is_active: true,
      });
      // Refresh user list
      const usersData = await fetchAllPages("/users/list-users/");
      const validUsers = usersData.filter((user) => user?.id);
      setUserData(validUsers);
    } catch (error) {
      setAddUserError(error?.response?.data?.detail || "Failed to add user.");
    } finally {
      setAddUserLoading(false);
    }
  };

  // Update user handler
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editData?.id) return;
    setEditUserLoading(true);
    setEditUserError("");
    try {
      await api.patch(`/users/role-admin/${editData.id}/`, editUserForm);
      toast.success("User updated successfully.");
      setShowEdit(false);
      setEditData(null);
      // Refresh user list
      const usersData = await fetchAllPages("/users/list-users/");
      const validUsers = usersData.filter((user) => user?.id);
      setUserData(validUsers);
    } catch (error) {
      setEditUserError(error?.response?.data?.detail || "Failed to update user.");
    } finally {
      setEditUserLoading(false);
    }
  };

  // Add delete handler
  const handleDeleteSelected = async () => {
    if (selectedUserIds.length === 0) return;
    if (!window.confirm("Are you sure you want to delete the selected users?"))
      return;
    setIsLoading(true);
    try {
      for (const id of selectedUserIds) {
        console.log("in the delete function", id);

        await api.delete(`/users/role-admin/${id}/`);
      }
      toast.success("Selected users deleted successfully.");
      // Refresh user list
      const usersData = await fetchAllPages("/users/list-users/");
      const validUsers = usersData.filter((user) => user?.id);
      setUserData(validUsers);
      setSelectedUserIds([]);
    } catch (error) {
      toast.error(error?.response?.data.detail);
      console.error(
        "Delete users error:",
        error?.response?.data.detail || error
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-hidden ">
      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <form
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onSubmit={handleAddUser}
          >
            <h2 className="text-lg font-bold mb-4">Add User</h2>
            <div className="mb-3">
              <label className="block mb-1">Username*</label>
              <input
                type="text"
                required
                minLength={1}
                maxLength={255}
                className="border rounded px-2 py-1 w-full"
                value={addUserForm.username}
                onChange={(e) =>
                  setAddUserForm((f) => ({ ...f, username: e.target.value }))
                }
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Email*</label>
              <input
                type="email"
                required
                minLength={1}
                maxLength={254}
                className="border rounded px-2 py-1 w-full"
                value={addUserForm.email}
                onChange={(e) =>
                  setAddUserForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Role</label>
              <select
                className="border rounded px-2 py-1 w-full"
                value={addUserForm.role}
                onChange={(e) =>
                  setAddUserForm((f) => ({ ...f, role: e.target.value }))
                }
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>
            <div className="mb-3 flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={addUserForm.is_active}
                onChange={(e) =>
                  setAddUserForm((f) => ({ ...f, is_active: e.target.checked }))
                }
              />
              <label htmlFor="is_active" className="ml-2">
                Active
              </label>
            </div>
            {addUserError && (
              <div className="text-red-500 mb-2">{addUserError}</div>
            )}
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-[#00613A]  text-white px-4 py-2 rounded"
                disabled={addUserLoading}
              >
                {addUserLoading ? "Adding..." : "Add User"}
              </button>
              <button
                type="button"
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowAddUser(false)}
                disabled={addUserLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="max-md-[400px]:hidden">
        {showEdit ? (
          <>
            <div>
              <h1 className="text-[16px] font-semibold mb-8 flex items-center gap-4">
                User Management <FaChevronRight /> Edit User
              </h1>
            </div>
            {/* Edit User Form */}
            <form
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onSubmit={handleUpdateUser}
            >
              <h2 className="text-lg font-bold mb-4">Edit User</h2>
              <div className="mb-3">
                <label className="block mb-1">Username*</label>
                <input
                  type="text"
                  required
                  minLength={1}
                  maxLength={255}
                  className="border rounded px-2 py-1 w-full"
                  value={editUserForm.username}
                  onChange={(e) =>
                    setEditUserForm((f) => ({ ...f, username: e.target.value }))
                  }
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Email*</label>
                <input
                  type="email"
                  required
                  minLength={1}
                  maxLength={254}
                  className="border rounded px-2 py-1 w-full"
                  value={editUserForm.email}
                  onChange={(e) =>
                    setEditUserForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Role</label>
                <select
                  className="border rounded px-2 py-1 w-full"
                  value={editUserForm.role}
                  onChange={(e) =>
                    setEditUserForm((f) => ({ ...f, role: e.target.value }))
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
              <div className="mb-3 flex items-center">
                <input
                  type="checkbox"
                  id="edit_is_active"
                  checked={editUserForm.is_active}
                  onChange={(e) =>
                    setEditUserForm((f) => ({ ...f, is_active: e.target.checked }))
                  }
                />
                <label htmlFor="edit_is_active" className="ml-2">
                  Active
                </label>
              </div>
              {editUserError && (
                <div className="text-red-500 mb-2">{editUserError}</div>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-[#00613A] text-white px-4 py-2 rounded"
                  disabled={editUserLoading}
                >
                  {editUserLoading ? "Updating..." : "Update User"}
                </button>
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setShowEdit(false)}
                  disabled={editUserLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-[16px] font-semibold mb-8">User Management</h1>
            <TableTabs
              header={""}
              setActiveTab={setActiveTabPending}
              activeTab={activeTabPending}
              tabs={["Active", "Inactive", "Recently Added"]}
              onPress={() => setShowAddUser(true)} // Open modal on add
              selectedRows={selectedUserIds}
              from={"userManagement"}
              onDelete={handleDeleteSelected}
            />
            <p className="mb-2 text-gray-500 text-sm">
              Double-click a user row to edit their details.
            </p>
            <div className="rounded-t-[1em] overflow-x-scroll    border border-gray-200 min-h-[50vh]">
              <UsersTable
                data={usersData}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                setShowEdit={handleEditClick}
                isLoading={isLoading}
                onCheckedItemsChange={handleSelectedUsersChange} // Handle selected rows
              />
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

export default UserManagement;
