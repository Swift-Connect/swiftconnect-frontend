import React, { useEffect, useState } from "react";
import { FaDollarSign } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { HiOutlineDocumentText } from "react-icons/hi";
import axiosInstance from "@/utils/axiosInstance";
import Image from "next/image";

const Card = ({ icon, title, value, bgColor, textColor }) => {
  return (
    <div
      className={`p-4 rounded-2xl flex items-center gap-4 shadow w-46 ${bgColor}`}
    >
      <div className="bg-gray-200 p-2 rounded-full">{icon}</div>
      <div>
        <p
          className={`text-[14px] ${
            title === "Total Revenue" ? "text-whit" : "text-gray-500"
          }`}
        >
          {title}
        </p>
        <h2
          className={`text-l  ${
            title === "Total Revenue" ? "font-medium" : " font-bold"
          }  ${textColor}`}
        >
          {value}
        </h2>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Approve KYC");
  const [activeTransactionTab, setActiveTransactionTab] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);

  //   const fetchTransactions = async () => {
  //     try {
  //       const response = await axiosInstance.get("/payments/transactions/");
  //       setTransactions(response.data);
  //     } catch (error) {
  //       console.error("Error fetching transactions:", error);
  //     }
  //   };

  //   const fetchUsers = async () => {
  //     try {
  //       const response = await axiosInstance.get("/admin/users/");
  //       setUsers(response.data || []);
  //     } catch (error) {
  //       console.error("Error fetching users:", error);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchTransactions();
  //     fetchUsers();
  //   }, []);

  const filteredTransactions =
    activeTransactionTab === "all"
      ? transactions
      : activeTransactionTab === "Credit"
      ? transactions.filter((transaction) =>
          String(transaction?.amount).startsWith("+")
        )
      : transactions.filter((transaction) =>
          String(transaction?.amount).startsWith("-")
        );

  const stats = [
    {
      title: "Total Revenue",
      value: "₦95,000,000",
      icon: <FaDollarSign className="text-blue-600 text-lg" />,
      bgColor: "bg-blue-600 text-white",
      textColor: "text-white",
    },
    {
      title: "Total Users",
      value: "64,239",
      icon: <IoIosStats className="text-blue-600 text-lg" />,
      bgColor: "bg-white",
      textColor: "text-gray-900",
    },
    {
      title: "Inactive Users",
      value: "4,239",
      icon: <IoIosStats className="text-blue-600 text-lg" />,
      bgColor: "bg-white",
      textColor: "text-gray-900",
    },
    {
      title: "Users Pending KYC",
      value: "4,239",
      icon: <IoIosStats className="text-blue-600 text-lg" />,
      bgColor: "bg-white",
      textColor: "text-gray-900",
    },
    {
      title: "Total Agents",
      value: "2,935",
      icon: <HiOutlineDocumentText className="text-blue-600 text-lg" />,
      bgColor: "bg-white",
      textColor: "text-gray-900",
    },
  ];

  return (
    <div className="bg-gray-50">
      <div className="flex gap-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            bgColor={stat.bgColor}
            textColor={stat.textColor}
          />
        ))}
      </div>

      <div className="pt-8 w-[90%] max-md-[400px]:hidden">
        <h1 className="text-[22px] font-semibold mb-4">Pending Transactions</h1>

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
          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No Users yet</div>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#F9F8FA] text-left text-[#525252]">
                  <th className="py-[1.3em] px-[1.8em]">Username</th>
                  <th className="py-[1.3em] px-[1.8em]">Account Id</th>
                  <th className="py-[1.3em] px-[1.8em]">Date</th>
                  <th className="py-[1.3em] px-[1.8em]">API Response</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr
                    key={idx}
                    className={`border-t ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="py-[1.3em] px-[1.8em] font-semibold text-[#232323]">
                      {user.username}
                    </td>
                    <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                      #{user.account_id}
                    </td>
                    <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                      {new Date(user.created_at).toLocaleDateString("en-GB")}
                    </td>
                    <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                      {user.api_response}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="pt-8 w-[90%] max-md-[400px]:hidden">
        <h1 className="text-[22px] font-semibold mb-4">Recent Transactions</h1>
        <div className="flex  flex-col justify-between mb-4">
          <ul className="flex items-center gap-[5em] mb-4 border-b-[1px] border-gray-200">
            <li
              className={`font-medium text-[16px] px-2 cursor-pointer ${
                activeTransactionTab === "all"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTransactionTab("all")}
            >
              All Transactions
            </li>
            <li
              className={`font-medium text-[16px] px-2 cursor-pointer ${
                activeTransactionTab === "Credit"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTransactionTab("Credit")}
            >
              Credit
            </li>
            <li
              className={`font-medium text-[16px] px-2 cursor-pointer ${
                activeTransactionTab === "Debit"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTransactionTab("Debit")}
            >
              Debit
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
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No Transactions yet
            </div>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#F9F8FA] text-left text-[#525252]">
                  <th className="py-[1.3em] px-[1.8em]">Product</th>
                  <th className="py-[1.3em] px-[1.8em]">Transaction ID</th>
                  <th className="py-[1.3em] px-[1.8em]">Date</th>
                  <th className="py-[1.3em] px-[1.8em]">Amount</th>
                  <th className="py-[1.3em] px-[1.8em]">Status</th>
                  <th className="py-[1.3em] px-[1.8em]">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, idx) => (
                  <tr
                    key={idx}
                    className={`border-t ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="py-[1.3em] px-[1.8em] font-semibold text-[#232323]">
                      {transaction.reason === "Wallet funding"
                        ? "Transfer"
                        : ""}
                    </td>
                    <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                      #{transaction.transaction_id}
                    </td>
                    <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                      {new Date(transaction.created_at).toLocaleDateString(
                        "en-GB"
                      )}
                    </td>
                    <td
                      className={`py-[1.3em] px-[1.8em] font-medium text-${
                        transaction.transaction_type === "credit"
                          ? "green"
                          : "red"
                      }-600`}
                    >
                      {transaction.transaction_type === "credit" ? "+" : "-"}₦
                      {transaction.amount}
                    </td>
                    <td className="py-[1.3em] px-[1.8em]">
                      <div
                        className={`py-1 text-center text-xs font-medium rounded-full ${
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : transaction.status === "Failed"
                            ? "bg-red-100 text-red-600"
                            : transaction.status === "Pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : transaction.status === "Refunded"
                            ? "bg-[#52525233] text-[#525252]"
                            : ""
                        }`}
                      >
                        {transaction.status}
                      </div>
                    </td>
                    <td className="py-[1.3em] px-[1.8em]">
                      <button className="text-green-600 text-sm font-semibold">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
