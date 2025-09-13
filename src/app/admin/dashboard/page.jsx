"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  FaDollarSign,
  FaUsers,
  FaCreditCard,
  FaExchangeAlt,
} from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { HiOutlineDocumentText } from "react-icons/hi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { fetchWithAuth, handleApiError } from "@/utils/api";
import { useAnalytics } from "@/hooks/useAnalytics";
import UsersTable from "./components/userTable";
import TableTabs from "../components/tableTabs";
import Card from "../components/card";
import Pagination from "../components/pagination";
import TransactionManagement from "../transactionManagement/transactionManagement";

const COLORS = ["#1D4ED8", "#60A5FA"];

const Dashboard = ({ setActiveSidebar }) => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [activeTabPending, setActiveTabPending] = useState("Approve KYC");
  // Data states
  const [userssData, setUserssData] = useState([]);
  const [allTransactionData, setAllTransaactionData] = useState([]);
  const [usersKYCPendingData, setUsersKYCPendingData] = useState([]);
  
  // Analytics hook
  const {
    analytics,
    loading: analyticsLoading,
    error: analyticsError,
    getStatsCards,
    getTransactionData,
    getUserActivityData,
    getUserBreakdownData,
    getTrafficData,
    formatCurrency
  } = useAnalytics();

  // Loading states
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingKYC, setIsLoadingKYC] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [actionItem, setActionItem] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtered and searched data
  const filteredTransactionData = allTransactionData;

  const filteredKYCData = usersKYCPendingData.filter((user) => {
    return (
      !searchTerm ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.account_id.toString().includes(searchTerm)
    );
  });

  const totalPages = Math.ceil(filteredKYCData.length / itemsPerPage);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("access_token");
      setToken(accessToken);

      if (!accessToken) {
        router.push("/account/login");
      }
    }
  }, [router]);

  const fetchAllPages = useCallback(async (endpoint, maxPages = 50) => {
    let allData = [];
    let nextPage = endpoint;
    let pageCount = 0;

    try {
      while (nextPage && pageCount < maxPages) {
        const response = await fetchWithAuth(nextPage);

        if (response.results) {
          allData = allData.concat(response.results);
          nextPage = response.next;
        } else if (Array.isArray(response)) {
          allData = allData.concat(response);
          nextPage = null;
        } else {
          allData.push(response);
          nextPage = null;
        }

        pageCount++;
      }

      if (pageCount >= maxPages) {
        console.warn(`Reached max page limit (${maxPages}) for ${endpoint}`);
      }
    } catch (error) {
      handleApiError(error, `Error fetching data from ${endpoint}`);
      throw error;
    }

    return allData;
  }, []);

  // Unified loading state
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);

  // API functions with correct endpoints based on swagger docs
  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      // Using correct endpoint from swagger
      const data = await fetchWithAuth("users/");
      // Always return an array
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.results)) return data.results;
      return [];
    } catch (error) {
      console.error("Error fetching user data:", error);
      return [];
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  const fetchKYC = useCallback(async () => {
    setIsLoadingKYC(true);
    try {
      // Use axios-based helper which already returns JSON data
      const [allKycData, pendingKycData] = await Promise.all([
        fetchWithAuth('users/all-kyc/').then((d) => d?.results || d || []),
        fetchWithAuth('users/pending-kyc-requests/').then((d) => d?.results || d || []),
      ]);

      return { allKycData, pendingKycData };
    } catch (error) {
      console.error("Error fetching KYC data:", error);
      return { allKycData: [], pendingKycData: [] };
    } finally {
      setIsLoadingKYC(false);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
 
    
    setIsLoadingTransactions(true);
    try {
      // Using correct transaction endpoints
      const endpoints = [
        "services/airtime-topups-transactions/",
        "services/data-plan-transactions/",
        "services/cable-recharges-transactions/",
        "services/electricity-transactions/",
        "services/education-transactions/",
        "services/bulk-sms-transactions/",
        // "payments/admin/transactions/", // Include wallet transactions
      ];

      const responses = await Promise.all(
        endpoints.map((endpoint) =>
          fetchWithAuth(endpoint).then((data) => data?.results || data || []),
        ),
      );

      console.log("responses", responses);

      const allTransactions = responses.flat();
      return allTransactions;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    } finally {
      setIsLoadingTransactions(false);
    }
  }, []);



  const processUsers = useCallback((usersData) => {
    const array = Array.isArray(usersData)
      ? usersData
      : Array.isArray(usersData?.results)
      ? usersData.results
      : usersData
      ? [usersData]
      : [];
    const validUsers = array.filter((user) => user?.id);
    const processedData = validUsers.map((user) => ({
      id: user?.id,
      username: user?.username || user?.fullname || "N/A",
      account_id: user?.account_id || user?.id || "null",
      created_at: user?.created_at || "null",
      api_response: user?.api_response || "N/A",
      status: user?.status || "Not Approved",
      email: user?.email || "N/A",
      phone: user?.phone_number || "N/A",
    }));

    // Sort by most recent
    processedData.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    return processedData;
  }, []);

  const processKYC = useCallback((kycData) => {
    const processedUserKYCData = kycData.map((item) => ({
      id: item?.id,
      username: item?.user?.fullname || item?.user?.username || "N/A",
      account_id: item?.user?.id || "null",
      created_at: item?.created_at || item?.user?.created_at || "null",
      api_response: item?.user?.api_response || "N/A",
      status: item?.approved ? "Approved" : "Pending",
      email: item?.user?.email || "N/A",
      phone: item?.user?.phone_number || "N/A",
    }));

    // Sort by most recent
    processedUserKYCData.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    return processedUserKYCData;
  }, []);

  const processTransactions = useCallback((transactions) => {
    console.log("transactions", transactions);
    if (!Array.isArray(transactions)) return [];

    const toNumber = (val) => {
      if (val == null) return 0;
      if (typeof val === 'number') return val;
      if (typeof val === 'string') return parseFloat(val.replace(/[^0-9.-]+/g, '')) || 0;
      return 0;
    };

    const normalizeStatus = (status) => {
      if (!status) return 'Completed';
      const s = String(status).toLowerCase();
      if (s === 'completed' || s === 'success' || s === 'successful') return 'Completed';
      if (s === 'failed' || s === 'error') return 'Failed';
      if (s === 'pending' || s === 'processing') return 'Pending';
      if (s === 'refunded') return 'Refunded';
      return capitalizeFirstLetter(s);
    };

    const processedDataTrx = transactions
      .filter((tx) => tx && (tx.id != null || tx.transaction_id))
      .map((tx) => ({
        id: tx.id ?? tx.transaction_id,
        product: getProductName(tx),
        amount: formatCurrency(toNumber(tx.amount), tx.currency || 'NGN'),
        date: (tx.created_at || tx.date || tx.timestamp)
          ? new Date(tx.created_at || tx.date || tx.timestamp).toLocaleDateString('en-GB')
          : 'N/A',
        status: normalizeStatus(tx.status),
        user: tx.user?.username || tx.user?.user_email || tx.user?.email || 'N/A',
        reference: tx.reference || tx.transaction_id || 'N/A',
        created_at: tx.created_at || tx.date || tx.timestamp || null,
        raw_data: tx,
      }));

    processedDataTrx.sort(
      (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0),
    );
    return processedDataTrx;
  }, []);



  useEffect(() => {
    // if (!token) return;

    const fetchData = async () => {
      console.log("Fetching initial data...");
      
      setIsLoadingDashboard(true);
      try {
        const usersPromise = fetchUsers();
        const kycDataPromise = fetchKYC();
        const transactionsPromise = fetchTransactions();

        const [users, kycData, transactions] = await Promise.all([
          usersPromise,
          kycDataPromise,
          transactionsPromise,
        ]);

        const processedUsers = processUsers(users);
        setUserssData(processedUsers);

        const { allKycData, pendingKycData } = kycData;
        const processedKYC = processKYC(pendingKycData);
        setUsersKYCPendingData(processedKYC);

        const processedTransactions = processTransactions(transactions);
        setAllTransaactionData(processedTransactions);
      } finally {
        setIsLoadingDashboard(false);
      }
    };

    fetchData();
  }, [
    token,
    fetchUsers,
    fetchKYC,
    fetchTransactions,
    processUsers,
    processKYC,
    processTransactions,
  ]);
  






  const getIconForStat = (iconType) => {
    switch (iconType) {
      case 'users':
        return <FaUsers className="w-6 h-6" />;
      case 'active-users':
        return <FaUsers className="w-6 h-6" />;
      case 'revenue':
        return <FaDollarSign className="w-6 h-6" />;
      case 'transactions':
        return <FaExchangeAlt className="w-6 h-6" />;
      case 'kyc':
        return <HiOutlineDocumentText className="w-6 h-6" />;
      case 'wallets':
        return <FaCreditCard className="w-6 h-6" />;
      default:
        return <IoIosStats className="w-6 h-6" />;
    }
  };

  const getProductName = (transaction) => {
    if (transaction.reason) return transaction.reason;
    if (transaction.service_name) return transaction.service_name;
    if (transaction.network) return `${transaction.network} Airtime`;
    if (transaction.cable_name) return `${transaction.cable_name} Cable`;
    if (transaction.service_type) return transaction.service_type;
    return "Service Transaction";
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };



  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-gray-50 min-h-screen">
      {/* Stats Cards */}
      <div className="mb-8">
        {analyticsLoading ? (
          <div className="text-center py-8">
            <div className="animate-pulse">Loading dashboard stats...</div>
          </div>
        ) : analyticsError ? (
          <div className="text-center py-8 text-red-500">
            Error loading analytics: {analyticsError}
          </div>
        ) : (
          <div className="grid grid-cols-1 w-full justify-between md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getStatsCards().map((stat, index) => (
              <Card
                key={index}
                title={stat.title}
                value={stat.value}
                icon={getIconForStat(stat.icon)}
                bgColor={stat.bgColor}
                textColor={stat.textColor}
              />
            ))}
          </div>
        )}
      </div>

      {/* Charts Section */}
      {!analyticsLoading && !analyticsError && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Transaction Volume Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Transaction Volume
              </h3>
              <span className="text-sm text-gray-500">Overview</span>
            </div>

            <div className="mb-4">
              <h2 className="text-3xl font-bold text-gray-900">
                {formatCurrency(
                  getTransactionData().reduce((sum, item) => sum + item.volume, 0)
                )}
              </h2>
              <p className="text-green-600 text-sm font-medium">
                Total Volume
              </p>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={getTransactionData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#1D4ED8"
                  strokeWidth={3}
                  dot={{ fill: "#1D4ED8" }}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="flex justify-between text-sm mt-4 pt-4 border-t">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-700 rounded-full mr-2"></div>
                <span className="text-gray-600">Volume (NGN)</span>
              </div>
            </div>
          </div>

          {/* User Activity Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                User Activity
              </h3>
            </div>

            <div className="mb-4">
              <h2 className="text-3xl font-bold text-gray-900">
                {getUserActivityData()
                  .reduce((sum, item) => sum + item.active, 0)
                  .toLocaleString()}
              </h2>
              <p className="text-green-600 text-sm font-medium">
                Active Users
              </p>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={getUserActivityData()}>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="active" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* User Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Users Breakdown
            </h3>

            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={getUserBreakdownData()}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {getUserBreakdownData().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-2 mt-4 pt-4 border-t">
              {getUserBreakdownData().map((item, index) => (
                <div key={item.name} className="flex justify-between text-sm">
                  <div className="flex items-center">
                    <span
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium">
                    {item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pending KYC Table */}
      <div className="bg-white rounded-lg shadow-sm border mb-8">
        <div className="p-6">
          <TableTabs
            header={"Pending Tasks"}
            setActiveTab={setActiveTabPending}
            activeTab={activeTabPending}
            tabs={["Approve KYC"]}
            from="dashboard"
            onSearchChange={setSearchTerm}
            searchValue={searchTerm}
          />

          <UsersTable
            userssData={filteredKYCData.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            isLoading={isLoadingKYC}
            actionItem={actionItem}
            setActionItem={setActionItem}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredKYCData.length}
          />
        </div>
      </div>

      {/* Transaction Management Component */}
      <TransactionManagement />
    </div>
  );
};

export default Dashboard;
