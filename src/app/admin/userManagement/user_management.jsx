import Image from "next/image";
import React, { useState } from "react";
import UsersTable from "./components/usersTable";
import Pagination from "../components/pagination";
import TableTabs from "../components/tableTabs";
import UserForm from "./components/editUser";
import { FaChevronRight } from "react-icons/fa";

const UserManagement = () => {
  const [activeTabPending, setActiveTabPending] = React.useState("Active");
  const usersData = [
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      fullname: "John Doe",
      email: "john.doe@example.com",
      phone_number: "123-456-7890",
      wallet_number: "WALLET123",
      previous_balance: "₦10,000",
      referrals: 5,
      referral_bonus: "₦500",
      last_login: "2/4/2025",
      date_joined: "2/4/2025",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      fullname: "John Doe",
      email: "john.doe@example.com",
      phone_number: "123-456-7890",
      wallet_number: "WALLET123",
      previous_balance: "₦10,000",
      referrals: 5,
      referral_bonus: "₦500",
      last_login: "2/4/2025",
      date_joined: "2/4/2025",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      fullname: "John Doe",
      email: "john.doe@example.com",
      phone_number: "123-456-7890",
      wallet_number: "WALLET123",
      previous_balance: "₦10,000",
      referrals: 5,
      referral_bonus: "₦500",
      last_login: "2/4/2025",
      date_joined: "2/4/2025",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      fullname: "John Doe",
      email: "john.doe@example.com",
      phone_number: "123-456-7890",
      wallet_number: "WALLET123",
      previous_balance: "₦10,000",
      referrals: 5,
      referral_bonus: "₦500",
      last_login: "2/4/2025",
      date_joined: "2/4/2025",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      fullname: "John Doe",
      email: "john.doe@example.com",
      phone_number: "123-456-7890",
      wallet_number: "WALLET123",
      previous_balance: "₦10,000",
      referrals: 5,
      referral_bonus: "₦500",
      last_login: "2/4/2025",
      date_joined: "2/4/2025",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      fullname: "John Doe",
      email: "john.doe@example.com",
      phone_number: "123-456-7890",
      wallet_number: "WALLET123",
      previous_balance: "₦10,000",
      referrals: 5,
      referral_bonus: "₦500",
      last_login: "2/4/2025",
      date_joined: "2/4/2025",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      fullname: "John Doe",
      email: "john.doe@example.com",
      phone_number: "123-456-7890",
      wallet_number: "WALLET123",
      previous_balance: "₦10,000",
      referrals: 5,
      referral_bonus: "₦500",
      last_login: "2/4/2025",
      date_joined: "2/4/2025",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      fullname: "John Doe",
      email: "john.doe@example.com",
      phone_number: "123-456-7890",
      wallet_number: "WALLET123",
      previous_balance: "₦10,000",
      referrals: 5,
      referral_bonus: "₦500",
      last_login: "2/4/2025",
      date_joined: "2/4/2025",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      fullname: "John Doe",
      email: "john.doe@example.com",
      phone_number: "123-456-7890",
      wallet_number: "WALLET123",
      previous_balance: "₦10,000",
      referrals: 5,
      referral_bonus: "₦500",
      last_login: "2/4/2025",
      date_joined: "2/4/2025",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      fullname: "John Doe",
      email: "john.doe@example.com",
      phone_number: "123-456-7890",
      wallet_number: "WALLET123",
      previous_balance: "₦10,000",
      referrals: 5,
      referral_bonus: "₦500",
      last_login: "2/4/2025",
      date_joined: "2/4/2025",
    },
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      fullname: "John Doe",
      email: "john.doe@example.com",
      phone_number: "123-456-7890",
      wallet_number: "WALLET123",
      previous_balance: "₦10,000",
      referrals: 5,
      referral_bonus: "₦500",
      last_login: "2/4/2025",
      date_joined: "2/4/2025",
    },
    // Add more users...
  ];

  const editUser = true;
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(usersData.length / itemsPerPage);
  return (
    <div className="overflow-hidden ">
      <div className="max-md-[400px]:hidden">
        {editUser ? (
          <>
            <div>
              <h1 className="text-[16px] font-semibold mb-8 flex items-center gap-4">
                User Management <FaChevronRight /> Edit User
              </h1>
            </div>
            <UserForm />
          </>
        ) : (
          <>
            <h1 className="text-[16px] font-semibold mb-8">User Management</h1>

            <TableTabs
              header={""}
              setActiveTab={setActiveTabPending}
              activeTab={activeTabPending}
              tabs={["Active", "Inactive", "Recently Added"]}
            />
            <div className="rounded-t-[1em] overflow-auto border border-gray-200 min-h-[50vh]">
              <UsersTable
                data={usersData}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
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
