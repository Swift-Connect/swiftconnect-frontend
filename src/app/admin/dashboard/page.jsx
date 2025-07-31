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
import UsersTable from "./components/userTable";
import TransactionsTable from "./components/TransactionsTable";
import TableTabs from "../components/tableTabs";
import Card from "../components/card";
import Pagination from "../components/pagination";

const COLORS = ["#1D4ED8", "#60A5FA"];

const Dashboard = () => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [activeTabPending, setActiveTabPending] = useState("Approve KYC");
  const [activeTabTransactions, setActiveTabTransactions] =
    useState("All Transactions");

  // Data states
  const [incomeData, setIncomeData] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [userssData, setUserssData] = useState([]);
  const [stats, setStats] = useState([]);
  const [allTransactionData, setAllTransaactionData] = useState([]);
  const [usersKYCPendingData, setUsersKYCPendingData] = useState([]);

  // Loading states
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingKYC, setIsLoadingKYC] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

  // Filter states
  const [transactionFilter, setTransactionFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [actionItem, setActionItem] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageTrx, setCurrentPageTrx] = useState(1);
  const itemsPerPage = 10;

  // Filtered and searched data
  const filteredTransactionData = allTransactionData.filter((tx) => {
    console.log("all transactions data", allTransactionData);
    const matchesFilter =
      transactionFilter === "All" ||
      (transactionFilter === "Success" &&
        tx.status.toLowerCase() === "completed") ||
      tx.status.toLowerCase() === transactionFilter.toLowerCase();

    const matchesSearch =
      !searchTerm ||
      tx.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toString().includes(searchTerm);

    const matchesDate =
      !dateRange.start ||
      !dateRange.end ||
      (new Date(tx.date) >= new Date(dateRange.start) &&
        new Date(tx.date) <= new Date(dateRange.end));

    return matchesFilter && matchesSearch && matchesDate;
  });

  const filteredKYCData = usersKYCPendingData.filter((user) => {
    const matchesSearch =
      !searchTerm ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.account_id.toString().includes(searchTerm);

    // Show only pending KYC by default for the dashboard
    const isPending =
      user.status === "Pending" ||
      !user.status ||
      user.status === "Not Approved";

    return matchesSearch && isPending;
  });

  const totalPages = Math.ceil(filteredKYCData.length / itemsPerPage);
  const totalPagesTrx = Math.ceil(
    filteredTransactionData.length / itemsPerPage,
  );

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
      const response = await fetchWithAuth("users/");
      return response?.results || response || [];
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
      // Fetch all KYC records at once
      const kycResponse = await fetchWithAuth("users/all-kyc/");
      const allKycData =
        kycResponse?.data || kycResponse?.results || kycResponse || [];

      return allKycData;
    } catch (error) {
      console.error("Error fetching KYC data:", error);
      return [];
    } finally {
      setIsLoadingKYC(false);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    setIsLoadingTransactions(true);
    try {
      // Fetch all transaction types at once
      const endpoints = [
        "services/airtime-topups-transactions/",
        "services/data-plan-transactions/",
        "services/cable-recharges-transactions/",
        "services/electricity-transactions/",
        "services/education-transactions/",
        "services/bulk-sms-transactions/",
        "payments/transactions/",
      ];

      const allData = await Promise.all(
        endpoints.map(async (endpoint) => {
          try {
            return await fetchAllPages(endpoint);
          } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            return [];
          }
        }),
      );

      return allData.flat();
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    } finally {
      setIsLoadingTransactions(false);
    }
  }, [fetchAllPages]);

  const processUsers = useCallback((usersData) => {
    const validUsers = usersData.filter((user) => user?.id);
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
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
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
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );
    return processedUserKYCData;
  }, []);

  const processTransactions = useCallback((transactions) => {
    const processedDataTrx = transactions.map((tx) => ({
      id: tx.id,
      product: getProductName(tx),
      amount: formatCurrency(tx.amount, tx.currency),
      date: tx.created_at
        ? new Date(tx.created_at).toLocaleDateString("en-GB")
        : "N/A",
      status: tx.status ? capitalizeFirstLetter(tx.status) : "Completed",
      user: tx.user?.username || tx.user?.email || "N/A",
      reference: tx.reference || tx.transaction_id || "N/A",
      created_at: tx.created_at,
      raw_data: tx,
    }));

    // Sort by most recent
    processedDataTrx.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );
    return processedDataTrx;
  }, []);

  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      // Generate stats from existing data or fetch from dedicated endpoints
      const totalUsers = userssData.length;
      const totalTransactions = allTransactionData.length;
      const totalRevenue = allTransactionData.reduce((sum, tx) => {
        const amount = parseFloat(tx.amount.replace(/[^0-9.-]+/g, "")) || 0;
        return sum + amount;
      }, 0);

      const statsData = [
        {
          title: "Total Users",
          value: totalUsers.toLocaleString(),
          icon: <FaUsers className="w-6 h-6" />,
          bgColor: "bg-blue-500",
          textColor: "text-white",
        },
        {
          title: "Total Transactions",
          value: totalTransactions.toLocaleString(),
          icon: <FaExchangeAlt className="w-6 h-6" />,
          bgColor: "bg-green-500",
          textColor: "text-white",
        },
        {
          title: "Total Revenue",
          value: formatCurrency(totalRevenue),
          icon: <FaDollarSign className="w-6 h-6" />,
          bgColor: "bg-purple-500",
          textColor: "text-white",
        },
        {
          title: "Pending KYC",
          value: usersKYCPendingData.length.toString(),
          icon: <HiOutlineDocumentText className="w-6 h-6" />,
          bgColor: "bg-orange-500",
          textColor: "text-white",
        },
      ];

      setStats(statsData);

      // Mock chart data - you can enhance this with real API data
      setIncomeData([
        { name: "Mon", transactions: 12000, utility: 8000, agents: 3000 },
        { name: "Tue", transactions: 19000, utility: 12000, agents: 4000 },
        { name: "Wed", transactions: 15000, utility: 9000, agents: 3500 },
        { name: "Thu", transactions: 22000, utility: 15000, agents: 5000 },
        { name: "Fri", transactions: 18000, utility: 11000, agents: 4200 },
        { name: "Sat", transactions: 25000, utility: 18000, agents: 6000 },
        { name: "Sun", transactions: 20000, utility: 14000, agents: 4800 },
      ]);

      setTrafficData([
        { name: "Mon", visitors: 1200 },
        { name: "Tue", visitors: 1900 },
        { name: "Wed", visitors: 1500 },
        { name: "Thu", visitors: 2200 },
        { name: "Fri", visitors: 1800 },
        { name: "Sat", visitors: 2500 },
        { name: "Sun", visitors: 2000 },
      ]);

      const activeUsers = Math.floor(totalUsers * 0.7);
      const inactiveUsers = totalUsers - activeUsers;

      setUserData([
        { name: "Active Users", value: activeUsers },
        { name: "Inactive Users", value: inactiveUsers },
      ]);
    } catch (error) {
      handleApiError(error, "Failed to fetch stats");
    } finally {
      setIsLoadingStats(false);
    }
  }, [userssData.length, allTransactionData, usersKYCPendingData.length]);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      setIsLoadingDashboard(true);
      try {
        const usersPromise = fetchUsers();
        const kycDataPromise = fetchKYC();
        const transactionsPromise = fetchTransactions();

        const [users, allKycData, transactions] = await Promise.all([
          usersPromise,
          kycDataPromise,
          transactionsPromise,
        ]);

        const processedUsers = processUsers(users);
        setUserssData(processedUsers);

        const processedKYC = processKYC(allKycData);
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

  useEffect(() => {
    if (
      userssData.length ||
      allTransactionData.length ||
      usersKYCPendingData.length
    ) {
      fetchStats();
    }
  }, [userssData, allTransactionData, usersKYCPendingData, fetchStats]);

  useEffect(() => {
    setCurrentPageTrx(1);
  }, [transactionFilter, searchTerm, dateRange]);

  const formatCurrency = (amount, currency = "NGN") => {
    const numAmount =
      typeof amount === "string"
        ? parseFloat(amount.replace(/[^0-9.-]+/g, ""))
        : amount;

    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
    }).format(numAmount || 0);
  };

  const getProductName = (transaction) => {
    if (transaction.reason) return transaction.reason;
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
        {isLoadingStats ? (
          <div className="text-center py-8">
            <div className="animate-pulse">Loading dashboard stats...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        )}
      </div>

      {/* Charts Section */}
      {!isLoadingStats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Income Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Income Overview
              </h3>
              <span className="text-sm text-gray-500">This Week</span>
            </div>

            <div className="mb-4">
              <h2 className="text-3xl font-bold text-gray-900">
                {formatCurrency(
                  incomeData.reduce((sum, item) => sum + item.transactions, 0),
                )}
              </h2>
              <p className="text-green-600 text-sm font-medium">
                Total Income +2.45%
              </p>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={incomeData}>
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
                  dataKey="transactions"
                  stroke="#1D4ED8"
                  strokeWidth={3}
                  dot={{ fill: "#1D4ED8" }}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="flex justify-between text-sm mt-4 pt-4 border-t">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-700 rounded-full mr-2"></div>
                <span className="text-gray-600">Transactions</span>
              </div>
            </div>
          </div>

          {/* Traffic Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Daily Traffic
              </h3>
            </div>

            <div className="mb-4">
              <h2 className="text-3xl font-bold text-gray-900">
                {trafficData
                  .reduce((sum, item) => sum + item.visitors, 0)
                  .toLocaleString()}
              </h2>
              <p className="text-green-600 text-sm font-medium">
                Visitors +2.45%
              </p>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={trafficData}>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="visitors" fill="#10b981" radius={[4, 4, 0, 0]} />
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
                  data={userData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {userData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-2 mt-4 pt-4 border-t">
              {userData.map((item, index) => (
                <div key={item.name} className="flex justify-between text-sm">
                  <div className="flex items-center">
                    <span
                      className={`w-3 h-3 rounded-full mr-2`}
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
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
              currentPage * itemsPerPage,
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

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <TableTabs
            header={"Recent Transactions"}
            setActiveTab={setActiveTabTransactions}
            activeTab={activeTabTransactions}
            tabs={["All Transactions", "Credit", "Debit"]}
            from="dashboard"
            filterOptions={[
              { label: "Success", value: "Success" },
              { label: "Failed", value: "Failed" },
              { label: "Refunded", value: "Refunded" },
              { label: "Pending", value: "Pending" },
            ]}
            onFilterChange={setTransactionFilter}
            onSearchChange={setSearchTerm}
            onDateRangeChange={setDateRange}
            searchValue={searchTerm}
            dateRange={dateRange}
          />

          <TransactionsTable
            data={filteredTransactionData.slice(
              (currentPageTrx - 1) * itemsPerPage,
              currentPageTrx * itemsPerPage,
            )}
            currentPage={currentPageTrx}
            itemsPerPage={itemsPerPage}
            isLoading={isLoadingTransactions}
            activeTabTransactions={activeTabTransactions}
          />

          <Pagination
            currentPage={currentPageTrx}
            totalPages={totalPagesTrx}
            onPageChange={setCurrentPageTrx}
            itemsPerPage={itemsPerPage}
            totalItems={filteredTransactionData.length}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
