"use client";

import Image from "next/image";
import React, { useState } from "react";
// import UsersTable from "./components/usersTable";
import Pagination from "../components/pagination";
import TableTabs from "../components/tableTabs";
// import UserForm from "./components/editUser";
import { FaChevronRight } from "react-icons/fa";
import VCMTable from "./components/table";
import EditVCM from "./components/edit";

const VCManagement = () => {
  const [activeTabPending, setActiveTabPending] = React.useState("Active");
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
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
                Virtual Card Management <FaChevronRight /> Manage Card
              </h1>
            </div>
            <EditVCM />
          </>
        ) : (
          <>
            <h1 className="text-[16px] font-semibold mb-8">
              Virtual Card Management
            </h1>

            <TableTabs
              header={""}
              setActiveTab={setActiveTabPending}
              activeTab={activeTabPending}
              tabs={["With Cards", "Without Cards"]}
              from={"VCM"}
              onPress={() => {}}
            />
            <div className="rounded-t-[1em] overflow-auto border border-gray-200 min-h-[50vh]">
              <VCMTable
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

export default VCManagement;
