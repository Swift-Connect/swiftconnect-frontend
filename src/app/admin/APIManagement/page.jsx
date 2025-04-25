"use client"
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import APIManagementTable from "./components/table";
import Pagination from "../components/pagination";
import TableTabs from "../components/tableTabs";
import CreateNewKey from "./components/createNewKey";

const stats = [
  { label: "Total API Requests", value: "15,000", icon: "⏱️" },
  { label: "Successful Requests", value: "12,340", icon: "👥" },
  { label: "Failed Requests", value: "120", icon: "❌" },
  { label: "Avg Response Time", value: "280ms", icon: "📉" },
];

const latencyData = [
  { month: "Jan", success: 800, fail: 100 },
  { month: "Feb", success: 750, fail: 80 },
  { month: "Mar", success: 770, fail: 90 },
  { month: "Apr", success: 200, fail: 50 },
  { month: "May", success: 250, fail: 60 },
  { month: "Jun", success: 150, fail: 40 },
  { month: "July", success: 100, fail: 30 },
];

export default function Dashboard() {
  const [activeTabPending, setActiveTabPending] = React.useState("Active");
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const usersData = [
    {
      id: 1,
      key_name: "Payment ApI Key",
      api_key_masked: "pk_live_*********89GT",
      created_on: "2/4/2025",
      last_used: "2/4/2025",
      created_by: "Adele Vance",
      revoction_date: "2025-01-30",
      revoked_by: "-",
    },
    {
      id: 1,
      key_name: "Payment ApI Key",
      api_key_masked: "pk_live_*********89GT",
      created_on: "2/4/2025",
      last_used: "2/4/2025",
      created_by: "Adele Vance",
      revoction_date: "2025-01-30",
      revoked_by: "-",
    },
    {
      id: 1,
      key_name: "Payment ApI Key",
      api_key_masked: "pk_live_*********89GT",
      created_on: "2/4/2025",
      last_used: "2/4/2025",
      created_by: "Adele Vance",
      revoction_date: "2025-01-30",
      revoked_by: "-",
    },
    {
      id: 1,
      key_name: "Payment ApI Key",
      api_key_masked: "pk_live_*********89GT",
      created_on: "2/4/2025",
      last_used: "2/4/2025",
      created_by: "Adele Vance",
      revocation_date: "2025-01-30",
      revoked_by: "Adele Vance",
    },
    {
      id: 1,
      key_name: "Payment ApI Key",
      api_key_masked: "pk_live_*********89GT",
      created_on: "2/4/2025",
      last_used: "2/4/2025",
      created_by: "Adele Vance",
      revoction_date: "2025-01-30",
      revoked_by: "-",
    },
    {
      id: 1,
      key_name: "Payment ApI Key",
      api_key_masked: "pk_live_*********89GT",
      created_on: "2/4/2025",
      last_used: "2/4/2025",
      created_by: "Adele Vance",
      revoction_date: "2025-01-30",
      revoked_by: "-",
    },
    {
      id: 1,
      key_name: "Payment ApI Key",
      api_key_masked: "pk_live_*********89GT",
      created_on: "2/4/2025",
      last_used: "2/4/2025",
      created_by: "Adele Vance",
      revoction_date: "2025-01-30",
      revoked_by: "-",
    },
    {
      id: 1,
      key_name: "Payment ApI Key",
      api_key_masked: "pk_live_*********89GT",
      created_on: "2/4/2025",
      last_used: "2/4/2025",
      created_by: "Adele Vance",
      revoction_date: "2025-01-30",
      revoked_by: "-",
    },
    {
      id: 1,
      key_name: "Payment ApI Key",
      api_key_masked: "pk_live_*********89GT",
      created_on: "2/4/2025",
      last_used: "2/4/2025",
      created_by: "Adele Vance",
      revoction_date: "2025-01-30",
      revoked_by: "-",
    },
    {
      id: 1,
      key_name: "Payment ApI Key",
      api_key_masked: "pk_live_*********89GT",
      created_on: "2/4/2025",
      last_used: "2/4/2025",
      created_by: "Adele Vance",
      revoction_date: "2025-01-30",
      revoked_by: "-",
    },
    {
      id: 1,
      key_name: "Payment ApI Key",
      api_key_masked: "pk_live_*********89GT",
      created_on: "2/4/2025",
      last_used: "2/4/2025",
      created_by: "Adele Vance",
      revoction_date: "2025-01-30",
      revoked_by: "-",
    },
    // Add more users...
  ];

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(usersData.length / itemsPerPage);

  const handleEditClick = (rowData) => {
    setEditData(rowData);
    setShowEdit(true);
    console.log("shit");
  };
  return (
    <div className="">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white shadow-md p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{stat.icon}</span>
              <h2 className="text-sm text-gray-600 font-medium">
                {stat.label}
              </h2>
            </div>
            <p className="text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="p-6 bg-white shadow-md rounded-2xl">
        <h2 className="text-lg font-semibold mb-4">
          API Latency Over Time (Graph)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={latencyData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="success"
              stroke="#16a34a"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="fail"
              stroke="#dc2626"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <TableTabs
        header={""}
        setActiveTab={setActiveTabPending}
        activeTab={activeTabPending}
        tabs={[""]}
        from="APIManage"
        onPress={() => setShowModal(true)}
      />
      <div className="rounded-t-[1em] overflow-auto border border-gray-200 min-h-[50vh]">
        <APIManagementTable
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
      {showModal && <CreateNewKey onClose={() => setShowModal(false)} />}
    </div>
  );
}
