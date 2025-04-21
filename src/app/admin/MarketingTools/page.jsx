"use client"
import React, { useState } from "react";
import PerformanceStats from "./components/monitorPerformance";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChevronDown, Mail, Smartphone } from "lucide-react";
import DetailedMsgPerformance from "./components/detailedMsgPerformance";
import Pagination from "../components/pagination";
const latencyData = [
  { month: "Jan", success: 800, fail: 100 },
  { month: "Feb", success: 750, fail: 80 },
  { month: "Mar", success: 770, fail: 90 },
  { month: "Apr", success: 200, fail: 50 },
  { month: "May", success: 250, fail: 60 },
  { month: "Jun", success: 150, fail: 40 },
  { month: "July", success: 100, fail: 30 },
];
const MarketingTools = () => {
  const [activeTabPending, setActiveTabPending] = useState("Active");
  const usersData = [
    {
      id: 1,
      channel: <Smartphone className="w-4 h-4" />,
      message_name:
        "Welcome New Contacts!. We have special deals just for you!!",
      open_rate: "64%",
      recipients: "58,786,896",
      status: "Sent",
    },
    {
      id: 1,
      channel: <Mail className="w-4 h-4" />,
      message_name:
        "Welcome New Contacts!. We have special deals just for you!!",
      open_rate: "64%",
      recipients: "58,786,896",
      status: "Sent",
    },
    {
      id: 1,
      channel: <Smartphone className="w-4 h-4" />,
      message_name:
        "Welcome New Contacts!. We have special deals just for you!!",
      open_rate: "64%",
      recipients: "58,786,896",
      status: "Draft",
    },
    {
      id: 1,
      channel: <Smartphone className="w-4 h-4" />,
      message_name:
        "Welcome New Contacts!. We have special deals just for you!!",
      open_rate: "64%",
      recipients: "58,786,896",
      status: "Sent",
    },
    {
      id: 1,
      channel: <Smartphone className="w-4 h-4" />,
      message_name:
        "Welcome New Contacts!. We have special deals just for you!!",
      open_rate: "64%",
      recipients: "58,786,896",
      status: "Sent",
    },
    {
      id: 1,
      channel: <Mail className="w-4 h-4" />,
      message_name:
        "Welcome New Contacts!. We have special deals just for you!!",
      open_rate: "64%",
      recipients: "58,786,896",
      status: "Draft",
    },
    {
      id: 1,
      channel: <Mail className="w-4 h-4" />,
      message_name:
        "Welcome New Contacts!. We have special deals just for you!!",
      open_rate: "64%",
      recipients: "58,786,896",
      status: "Sent",
    },
    {
      id: 1,
      channel: <Mail className="w-4 h-4" />,
      message_name:
        "Welcome New Contacts!. We have special deals just for you!!",
      open_rate: "64%",
      recipients: "58,786,896",
      status: "Sent",
    },
  ];

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(usersData.length / itemsPerPage);
  return (
    <div>
      <PerformanceStats />
      <div className="p-6 bg-white shadow-md rounded-2xl">
        <div className="flex justify-between  items-center mb-4">
          <h2 className="text-lg font-semibold ">Open Rate</h2>
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-1">
              <strong>Metric:</strong>{" "}
              <span className="text-green-700">Open Rate</span>{" "}
              <ChevronDown className="w-4 h-4" />
            </p>
            <div className="border border-gray-200 px-4">
              <select name="" id="" className="text-gray-400">
                <option value="">Weekly</option>
                <option value="">Daily</option>
                <option value="">Yearly</option>
              </select>
            </div>
          </div>
        </div>
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
            {/* <Line
                        type="monotone"
                        dataKey="fail"
                        stroke="#dc2626"
                        strokeWidth={2}
                      /> */}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <>
        <h1 className="text-[16px] font-semibold mb-8">
          Detailed Message Performance
        </h1>
        {/* 
        <TableTabs
          header={""}
          setActiveTab={setActiveTabPending}
          activeTab={activeTabPending}
          tabs={["Active", "Inactive", "Recently Added"]}
          onPress={() => {}}
        /> */}
        <div className="rounded-t-[1em] overflow-auto border border-gray-200 min-h-[50vh]">
          <DetailedMsgPerformance
            data={usersData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            // setShowEdit={handleEditClick}
          />
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </>
    </div>
  );
};

export default MarketingTools;
