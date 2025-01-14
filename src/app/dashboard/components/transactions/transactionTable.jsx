// app/page.js
"use client";
import Image from "next/image";
import React from "react";

const TransactionsTable = () => {
  const transactions = [
    {
      product: "Airtime",
      id: "#12548796",
      date: "28/11/2024",
      amount: "-₦2,500",
      status: "Success",
      color: "green",
      receipt: true,
    },
    {
      product: "Transfer",
      id: "#12548796",
      date: "25/11/2024",
      amount: "+₦75,000",
      status: "Failed",
      color: "red",
      receipt: true,
    },
    {
      product: "Internet",
      id: "#12548796",
      date: "23/11/2024",
      amount: "-₦2,500",
      status: "Pending",
      color: "#ED7F31",
      receipt: true,
    },
    {
      product: "Transfer",
      id: "#12548796",
      date: "22/11/2024",
      amount: "-₦10,500",
      status: "Success",
      color: "green",
      receipt: true,
    },
    {
      product: "Cable",
      id: "#12548796",
      date: "20/11/2024",
      amount: "+₦28,870",
      status: "Success",
      color: "green",
      receipt: true,
    },
    {
      product: "Electricity",
      id: "#12548796",
      date: "18/11/2024",
      amount: "+₦15,000",
      status: "Refunded",
      color: "blue",
      receipt: true,
    },
  ];

  return (
    <div className="pt-8 w-[90%]">
      <div className="">
        <h1 className="text-[22px] font-semibold mb-4">Recent Transactions</h1>
        <div className="flex  flex-col justify-between mb-4">
          <ul className="flex items-center gap-[5em] mb-4 border-b-[1px] border-gray-200">
            <li className="font-medium text-[16px] px-2 text-green-600 border-b-2 border-green-600 cursor-pointer">
              All Transactions
            </li>
            <li className="text-gray-500 font-medium cursor-pointer text-[16px]">
              Credit
            </li>
            <li className="text-gray-500 font-medium cursor-pointer text-[16px]">
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
                className="border-none outline-none rounded-md px-3 py-1 text-sm bg-transparent"
              />
            </div>
            <div className="flex items-center space-x-2 ">
              <button className="flex items-center text-gray-500 text-sm">
                {/* <span className="material-icons">calendar_today</span> */}
                <span className="ml-1">Nov 1, 2024 - Nov 24, 2024</span>
              </button>
              <button className="text-gray-500 text-sm flex items-center">
                {/* <span className="material-icons">filter_list</span> */}
                <span className="ml-1">Filter</span>
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-t-[1em] overflow-hidden border border-gray-200">
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
              {transactions.map((transaction, idx) => (
                <tr
                  key={idx}
                  className={`border-t ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="py-[1.3em] px-[1.8em] font-semibold text-[#232323]">
                    {transaction.product}
                  </td>
                  <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                    {transaction.id}
                  </td>
                  <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                    {transaction.date}
                  </td>
                  <td
                    className={`py-[1.3em] px-[1.8em] font-medium text-${
                      transaction.amount.startsWith("+") ? "green" : "red"
                    }-600`}
                  >
                    {transaction.amount}
                  </td>
                  <td className="py-[1.3em] px-[1.8em]">
                    <div
                      className={`py-1 text-center text-xs font-medium rounded-full ${
                        transaction.status === "Success"
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
        </div>
      </div>
    </div>
  );
};

export default TransactionsTable;
