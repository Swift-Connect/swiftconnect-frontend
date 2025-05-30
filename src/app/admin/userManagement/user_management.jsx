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
    setShowEdit(true);
    console.log("shit");
  };

  const handleSelectedUsersChange = (selectedIds) => {
    setSelectedUserIds(selectedIds);
  };

  return (
    <div className="overflow-hidden ">
      <div className="max-md-[400px]:hidden">
        {showEdit ? (
          <>
            <div>
              <h1 className="text-[16px] font-semibold mb-8 flex items-center gap-4">
                User Management <FaChevronRight /> Edit User
              </h1>
            </div>
            <UserForm fields={Object.keys(editData || {})} data={editData} />
          </>
        ) : (
          <>
            <h1 className="text-[16px] font-semibold mb-8">User Management</h1>

            <TableTabs
              header={""}
              setActiveTab={setActiveTabPending}
              activeTab={activeTabPending}
              tabs={["Active", "Inactive", "Recently Added"]}
              onPress={() => {}}
              selectedRows={selectedUserIds} // Pass selected row IDs
            />
            <div className="rounded-t-[1em] overflow-auto border border-gray-200 min-h-[50vh]">
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
