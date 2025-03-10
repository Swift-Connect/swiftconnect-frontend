import Image from "next/image";
import React, { useState } from "react";
import UsersTable from "../dashboard/components/userTable";


const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("Approve KYC");
  const [activeTransactionTab, setActiveTransactionTab] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  return (
    <div className="overflow-hidden ">
      <div className="max-md-[400px]:hidden">
        <h1 className="text-[22px] font-semibold mb-8">User Management</h1>

        <div className="flex  flex-col justify-between mb-4">
          <ul className="flex items-center gap-[5em] mb-4 border-b-[1px] border-gray-200">
            <li
              className={`font-medium text-[16px] px-2 cursor-pointer ${
                activeTab === "Approve KYC"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("Approve KYC")}
            >
              Approve KYC
            </li>
            <li
              className={`font-medium text-[16px] px-2 cursor-pointer ${
                activeTab === "Approve Withdrawal"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("Approve Withdrawal")}
            >
              Approve Withdrawal
            </li>
            <li
              className={`font-medium text-[16px] px-2 cursor-pointer ${
                activeTab === "Transaction"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("Transaction")}
            >
              Transaction
            </li>
          </ul>
          <div className="flex items-center justify-between">
            <div className="flex items-center w-[50%] border rounded-[4em] px-3 py-1 ">
              <Image
                src={"/search.svg"}
                alt="search icon"
                width={100}
                height={100}
                className="w-[2.4em]"
              />
              <input
                type="text"
                placeholder="Search for something"
                className="border-none outline-none rounded-md px-3 py-1 text-sm bg-transparent w-full"
              />
            </div>
            <div className="flex items-center space-x-2 ">
              <button className="flex items-center text-gray-500 text-sm gap-3 px-4 py-3 border rounded-[4em]">
                <Image
                  src={"/calendar.svg"}
                  alt="calendar"
                  width={100}
                  height={100}
                  className="w-[1.6em]"
                />
                <span className="ml-1 text-[16px]">
                  Nov 1, 2024 - Nov 24, 2024
                </span>
              </button>
              <button className="text-gray-500 text-sm flex items-center gap-3 px-4 py-3 border rounded-[4em]">
                <Image
                  src={"/filter.svg"}
                  alt="calendar"
                  width={100}
                  height={100}
                  className="w-[1.6em]"
                />
                <span className="ml-1">Filter</span>
              </button>
            </div>
          </div>
        </div>
        <div className="rounded-t-[1em] overflow-hidden border border-gray-200">
          <UsersTable />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
