
"use client";
import Image from "next/image";
import React, { useState } from "react";
// import UsersTable from "./components/usersTable";
import Pagination from "../components/pagination";
// import TableTabs from "../components/tableTabs";
// import UserForm from "./components/editUser";
import { FaChevronRight } from "react-icons/fa";

import UsersTable from "./components/usersData";
import UserForm from "./components/editUser";
import TableTabs from "../components/tableTabs";

const RoleBasedAccessControl = () => {
  const [activeTabPending, setActiveTabPending] = React.useState("Active");
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const usersData = [
    {
      id: 1,
      username: "John Doe",
      last_login: "2/4/2025",
      role: "John Doe",
      last_logout: "2/4/2025",
      status: "Active",
      last_upgraded: "2/4/2025",
    },
    {
      id: 1,
      username: "John Doe",
      last_login: "2/4/2025",
      role: "John Doe",
      last_logout: "2/4/2025",
      status: "Active",
      last_upgraded: "2/4/2025",
    },
    {
      id: 1,
      username: "John Doe",
      last_login: "2/4/2025",
      role: "John Doe",
      last_logout: "2/4/2025",
      status: "Active",
      last_upgraded: "2/4/2025",
    },
    {
      id: 1,
      username: "John Doe",
      last_login: "2/4/2025",
      role: "John Doe",
      last_logout: "2/4/2025",
      status: "Active",
      last_upgraded: "2/4/2025",
    },
    {
      id: 1,
      username: "John Doe",
      last_login: "2/4/2025",
      role: "John Doe",
      last_logout: "2/4/2025",
      status: "Active",
      last_upgraded: "2/4/2025",
    },
    {
      id: 1,
      username: "John Doe",
      last_login: "2/4/2025",
      role: "John Doe",
      last_logout: "2/4/2025",
      status: "Active",
      last_upgraded: "2/4/2025",
    },
    {
      id: 1,
      username: "John Doe",
      last_login: "2/4/2025",
      role: "John Doe",
      last_logout: "2/4/2025",
      status: "Active",
      last_upgraded: "2/4/2025",
    },
    {
      id: 1,
      username: "John Doe",
      last_login: "2/4/2025",
      role: "John Doe",
      last_logout: "2/4/2025",
      status: "Active",
      last_upgraded: "2/4/2025",
    },
    {
      id: 1,
      username: "John Doe",
      last_login: "2/4/2025",
      role: "John Doe",
      last_logout: "2/4/2025",
      status: "Active",
      last_upgraded: "2/4/2025",
    },
    {
      id: 1,
      username: "John Doe",
      last_login: "2/4/2025",
      role: "John Doe",
      last_logout: "2/4/2025",
      status: "Active",
      last_upgraded: "2/4/2025",
    },
    {
      id: 1,
      username: "John Doe",
      last_login: "2/4/2025",
      role: "John Doe",
      last_logout: "2/4/2025",
      status: "Active",
      last_upgraded: "2/4/2025",
    },
    {
      id: 1,
      username: "John Doe",
      last_login: "2/4/2025",
      role: "John Doe",
      last_logout: "2/4/2025",
      status: "Active",
      last_upgraded: "2/4/2025",
    },
    {
      id: 1,
      username: "John Doe",
      last_login: "2/4/2025",
      role: "John Doe",
      last_logout: "2/4/2025",
      status: "Active",
      last_upgraded: "2/4/2025",
    },
    {
      id: 1,
      username: "John Doe",
      last_login: "2/4/2025",
      role: "John Doe",
      last_logout: "2/4/2025",
      status: "Active",
      last_upgraded: "2/4/2025",
    },
    {
      id: 1,
      username: "John Doe",
      last_login: "2/4/2025",
      role: "John Doe",
      last_logout: "2/4/2025",
      status: "Active",
      last_upgraded: "2/4/2025",
    },
    {
      id: 1,
      username: "John Doe",
      last_login: "2/4/2025",
      role: "John Doe",
      last_logout: "2/4/2025",
      status: "Active",
      last_upgraded: "2/4/2025",
    },

    // Add more users...
  ];

  const editUser = true;
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(usersData.length / itemsPerPage);

  const handleEditClick = (rowData) => {
    setEditData(rowData);
    setShowEdit(true);
    console.log("shit");
  };
  return (
    <div className="overflow-hidden ">
      <div className="max-md-[400px]:hidden">
        {showEdit ? (
          <>
            <div>
              <h1 className="text-[16px] font-semibold mb-8 flex items-center gap-4">
                Role-Based Access Control   <FaChevronRight /> Edit User
              </h1>
            </div>
            <UserForm fields={Object.keys(editData || {})} data={editData} />
          </>
        ) : (
          <>
            <h1 className="text-[16px] font-semibold mb-8">
              Role-Based Access Control  
            </h1>

            <TableTabs
              header={""}
              setActiveTab={setActiveTabPending}
              activeTab={activeTabPending}
              tabs={[]}
              from="RBAC"
            />
            <div className="rounded-t-[1em] overflow-auto border border-gray-200 min-h-[50vh]">
              <UsersTable
                data={usersData}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                setShowEdit={handleEditClick}
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

export default RoleBasedAccessControl;
