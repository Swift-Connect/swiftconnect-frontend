import React, { useEffect, useState } from "react";
import { FaDollarSign } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { HiOutlineDocumentText } from "react-icons/hi";
import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart, Bar } from "recharts";
import { PieChart, Pie, Cell, Legend } from "recharts";
import UsersTable from "./components/userTable";
import TransactionsTable from "./components/TransactionsTable";
import TableTabs from "../components/tableTabs";
// import UsersTable from "./userTable";
// import TransactionsTable from "./TransactionsTable";

const Card = ({ icon, title, value, bgColor, textColor }) => {
  return (
    <div
      className={`p-4 rounded-2xl flex items-center gap-4 shadow  ${bgColor}`}
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

const incomeData = [
  { name: "SEP", transactions: 3000000, utility: 2000000, agents: 1000000 },
  { name: "OCT", transactions: 4000000, utility: 2500000, agents: 1500000 },
  { name: "NOV", transactions: 5000000, utility: 3000000, agents: 2000000 },
  { name: "DEC", transactions: 6000000, utility: 3500000, agents: 2500000 },
  { name: "JAN", transactions: 5000000, utility: 1000000, agents: 500000 },
  { name: "FEB", transactions: 6000000, utility: 2000000, agents: 1000000 },
];

const trafficData = [
  { name: "00", visitors: 1000 },
  { name: "04", visitors: 5000 },
  { name: "08", visitors: 12000 },
  { name: "12", visitors: 8000 },
  { name: "14", visitors: 10000 },
  { name: "16", visitors: 14000 },
  { name: "18", visitors: 3000 },
];

const userData = [
  { name: "Active User", value: 70 },
  { name: "Inactive User", value: 30 },
];

const COLORS = ["#1D4ED8", "#60A5FA"];

const Dashboard = () => {
  const [activeTabPending, setActiveTabPending] = React.useState("Approve KYC");
  const [activeTabTransactions, setActiveTabTransactions] =
    React.useState("All Transactions");

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
    <div className="overflow-hidden">
      <div className="overflow-x-aut">
        <div className="flex gap-4 justify-between">
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
      </div>
      <div className="py-6 bg-gray-50 flex gap-6">
        {/* Income Chart */}
        <div className="bg-white p-4 rounded-lg shadow w-1/3">
          <p className="text-gray-500 text-sm">This Week ▼</p>
          <h2 className="text-2xl font-bold">₦6,000,000</h2>
          <p className="text-green-500 text-sm">Total Income +2.45%</p>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={incomeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="transactions"
                stroke="#1D4ED8"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="utility"
                stroke="#60A5FA"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="agents"
                stroke="#FB923C"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="flex justify-between text-sm mt-4">
            <p className="text-blue-700">● Transactions</p>
            <p className="text-blue-400">● Utility Bills</p>
            <p className="text-orange-500">● Agent Subscription</p>
          </div>
        </div>

        {/* Traffic Chart */}
        <div className="bg-white p-4 rounded-lg shadow w-1/3">
          <p className="text-gray-500 text-sm">Daily Traffic</p>
          <h2 className="text-2xl font-bold">25,000 Visitors</h2>
          <p className="text-green-500 text-sm">+2.45%</p>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trafficData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="visitors" fill="url(#gradient)" barSize={30} />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1D4ED8" stopOpacity={1} />
                  <stop offset="100%" stopColor="#60A5FA" stopOpacity={1} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User Breakdown */}
        <div className="bg-white p-4 rounded-lg shadow w-1/3">
          <p className="text-gray-500 text-sm">Users Breakdown</p>

          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={userData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {userData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex justify-between text-sm mt-4">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-blue-700 rounded-full mr-2"></span>{" "}
              Active User
            </div>
            <p>70%</p>
          </div>
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-blue-400 rounded-full mr-2"></span>{" "}
              Inactive User
            </div>
            <p>30%</p>
          </div>
        </div>
      </div>

      <div className="pt-8 max-md-[400px]:hidden">
        <TableTabs
          header={"Pending Tasks"}
          setActiveTab={setActiveTabPending}
          activeTab={activeTabPending}
          tabs={["Approve KYC", "Approve Withdrawal", "Transaction"]}
          from="dashboard"
          filterOptions={[
            { label: "MTN", value: "MTN" },
            { label: "Airtel", value: "Airtel" },
            { label: "Glo", value: "Glo" },
            { label: "9mobile", value: "9mobile" },
          ]}
        />
        <div className="rounded-t-[1em] overflow-hidden border border-gray-200">
          <UsersTable />
        </div>
      </div>

      <div className="pt-8 max-md-[400px]:hidden">
        <TableTabs
          header={"Recent Transactions"}
          setActiveTab={setActiveTabTransactions}
          activeTab={activeTabTransactions}
          tabs={["All Transactions", "Credit", "Debit"]}
          from="dashboard"
          filterOptions={[
            { label: "MTN", value: "MTN" },
            { label: "Airtel", value: "Airtel" },
            { label: "Glo", value: "Glo" },
            { label: "9mobile", value: "9mobile" },
          ]}
        />
        <div className="rounded-t-[1em] overflow-hidden border border-gray-200">
          <TransactionsTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
