// app/page.js
"use client";
import React from "react";

const TransactionsTable = () => {
  return (
    <div className="pt-8">
      <div className="">
        <h1 className="text-[22px] font-semibold ">Recent Transactions</h1>
        <div className="flex  flex-col justify-between mb-4">
          <ul className="flex items-center gap-[5em]">
            <li className="font-semibold p-2 text-green-600 border-b-2 border-green-600 cursor-pointer">
              All Transactions
            </li>
            <li className="text-gray-500 cursor-pointer">Credit</li>
            <li className="text-gray-500 cursor-pointer">Debit</li>
          </ul>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search for something"
              className="border rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-green-600"
            />
            <div className="flex items-center space-x-2">
              <button className="flex items-center text-gray-500 text-sm">
                <span className="material-icons">calendar_today</span>
                <span className="ml-1">Nov 1, 2024 - Nov 24, 2024</span>
              </button>
              <button className="text-gray-500 text-sm flex items-center">
                <span className="material-icons">filter_list</span>
                <span className="ml-1">Filter</span>
              </button>
            </div>
          </div>
        </div>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#E9F5EE] text-left">
              <th className="py-2 px-4">Product</th>
              <th className="py-2 px-4">Transaction ID</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {[
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
                color: "orange",
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
            ].map((transaction, idx) => (
              <tr
                key={idx}
                className={`border-t ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="py-2 px-4">{transaction.product}</td>
                <td className="py-2 px-4">{transaction.id}</td>
                <td className="py-2 px-4">{transaction.date}</td>
                <td
                  className={`py-2 px-4 font-medium text-${
                    transaction.amount.startsWith("+") ? "green" : "red"
                  }-600`}
                >
                  {transaction.amount}
                </td>
                <td className="py-2 px-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full bg-${transaction.color}-100 text-${transaction.color}-600`}
                  >
                    {transaction.status}
                  </span>
                </td>
                <td className="py-2 px-4">
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
  );
};

export default TransactionsTable;
