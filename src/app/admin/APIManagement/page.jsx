"use client";
import React, { useState, useEffect } from "react";
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
import api from "@/utils/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const token = localStorage.getItem("access_token");
  const [activeTabPending, setActiveTabPending] = React.useState("Active");
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!token) {
      router.push("/account/login");
      return;
    }

    const fetchApiKeys = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/payments/payment-configs/");
        setApiKeys(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          router.push("/account/login");
        } else {
          toast.error("Failed to fetch API keys");
        }
        console.error("Error fetching API keys:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKeys();
  }, [token, router]);

  const handleCreateKey = async (keyData) => {
    try {
      const response = await api.post("/payments/payment-configs/", keyData);
      setApiKeys([...apiKeys, response.data]);
      toast.success("API key created successfully");
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to create API key");
      console.error("Error creating API key:", error);
    }
  };

  const handleUpdateKey = async (id, keyData) => {
    try {
      const response = await api.put(
        `/payments/payment-configs/${id}/`,
        keyData
      );
      setApiKeys(apiKeys.map((key) => (key.id === id ? response.data : key)));
      toast.success("API key updated successfully");
      setShowEdit(false);
    } catch (error) {
      toast.error("Failed to update API key");
      console.error("Error updating API key:", error);
    }
  };

  const handleDeleteKey = async (id) => {
    try {
      await api.delete(`/payments/payment-configs/${id}/`);
      setApiKeys(apiKeys.filter((key) => key.id !== id));
      toast.success("API key deleted successfully");
    } catch (error) {
      toast.error("Failed to delete API key");
      console.error("Error deleting API key:", error);
    }
  };

  const totalPages = Math.ceil(apiKeys.length / itemsPerPage);

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
        tabs={["Active", "Inactive"]}
        from="APIManage"
        onPress={() => setShowModal(true)}
      />

      <div className="rounded-t-[1em] overflow-auto border border-gray-200 min-h-[50vh]">
        <APIManagementTable
          data={apiKeys}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onEdit={handleUpdateKey}
          onDelete={handleDeleteKey}
          isLoading={isLoading}
        />
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {showModal && (
        <CreateNewKey
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateKey}
        />
      )}
    </div>
  );
}
