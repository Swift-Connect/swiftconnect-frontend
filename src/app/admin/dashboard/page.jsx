"use client";
import React, { useEffect, useState } from "react";
import { FaDollarSign } from "react-icons/fa";
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
} from "recharts";
import { BarChart, Bar } from "recharts";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { toast } from "react-toastify";
import api from "@/utils/api";
import UsersTable from "./components/userTable";
import TransactionsTable from "./components/TransactionsTable";
import TableTabs from "../components/tableTabs";
import Card from "../components/card";
import Pagination from "../components/pagination";
import { STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR } from "next/dist/lib/constants";

const COLORS = ["#1D4ED8", "#60A5FA"];

const Dashboard = () => {
  const [activeTabPending, setActiveTabPending] = useState("Approve KYC");
  const [activeTabTransactions, setActiveTabTransactions] =
    useState("All Transactions");
  const [incomeData, setIncomeData] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [userssData, setUserssData] = useState([]);
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allTransactionData, setAllTransaactionData] = useState([]);
  const [transactionFilter, setTransactionFilter] = useState("All");
  const [actionItem, setActionItem] = useState(null);
  const [usersKYCPendingData, setUsersKYCPendingData] = useState([]);
  // Filtered transaction data based on the selected filter
  // console.log("Clicked Filtered Optiom", transactionFilter);
  // console.log("Clicked Action PopUP", actionItem);

  const filteredTransactionData = allTransactionData.filter((tx) => {
    if (transactionFilter === "All") return true;
    if (transactionFilter === "Success")
      return tx.status.toLowerCase() === "completed";
    return tx.status.toLowerCase() === transactionFilter.toLowerCase();
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch users
        const usersData = await fetchAllPages("/users/list-users/");
        // console.log("Fetched users:", usersData);

        const validUsers = usersData.filter((user) => user?.id);
        // console.log("Fetched users:", usersData);
        // console.log("Valid users:", validUsers);

        // Process users to match table structure
        const processedData = validUsers.map((user) => ({
          id: user?.id,
          username: user?.username,
          account_id: user?.account_id || "null",
          created_at: user?.created_at || "null",
          api_response: user?.api_response || "N/A",
          status: user?.status || "Not Approved", // Default to match action
        }));
        console.log("data", processedData);

        setUserssData(processedData);

        // Fetch pending KYC requests
        const pendingKycData = await fetchAllPages(
          "/users/pending-kyc-requests/"
        );
        console.log("Fetched pending KYC:", pendingKycData);

        const processedUserKYCData = pendingKycData.map((item) =>
          // console.log(item.user)

          ({
            id: item?.id,
            username: item?.user?.fullname,
            account_id: item?.user?.id || "null",
            created_at: item?.user?.created_at || "null",
            api_response: item?.user?.api_response || "N/A",
            status: item?.approved ? "Approved" : "Not Approved", // Default to match action
          })
        );

        console.log("data for KYC", processedUserKYCData);

        setUsersKYCPendingData(processedUserKYCData);

        // Fetch all transactions
        const transactionEndpoints = [
          "/payments/transactions/",
          "/services/airtime-topups-transactions/",
          "/services/data-plan-transactions/",
          "/services/cable-recharges-transactions/",
          "/services/education-transactions/",
          "/services/electricity-transactions/",
          "/services/bulk-sms-transactions/",
        ];

        const transactionPromises = transactionEndpoints.map(
          async (endpoint) => {
            try {
              return await fetchAllPages(endpoint);
            } catch (error) {
              toast.error(`Error fetching ${endpoint}`);
              console.error(`Error fetching ${endpoint}:`, error);
              return [];
            }
          }
        );

        const transactionResults = await Promise.all(transactionPromises);
        const allTransactions = transactionResults.flat();
        console.log("Fetched transactions:", allTransactions);
        // Filter valid transactions
        const validTransactions = allTransactions.filter(
          (tx) =>
            tx.id &&
            tx.amount &&
            tx.created_at &&
            tx.status &&
            typeof tx.amount === "number" // Ensure amount is a number
        );
        // console.log("Fetched transactions:", allTransactions);
        // console.log("Valid transactions:", validTransactions);

        // Process transactions
        const processedDataTrx = allTransactions.map((tx) => {
          // console.log("dsdsxsxs", tx);

          // const user = validUsers.find((u) => u.id === tx.user);
          // console.log("uddd", user);

          return {
            id: tx.id,
            // user: user ? "user?.username" : "System",
            product: getProductName(tx),
            amount: formatCurrency(tx.amount, tx.currency),
            date: new Date(tx.created_at).toLocaleDateString("en-GB"),
            status: tx.status ? capitalizeFirstLetter(tx.status) : "Completed",
          };
        });

        setAllTransaactionData(processedDataTrx);

        // Process stats
        const completedTransactions = allTransactions.filter(
          (tx) => tx.status === "completed"
        );
        const totalRevenue = completedTransactions.reduce(
          (sum, tx) => sum + Number(tx.amount || 0),
          0
        );
        const totalUsers = usersData.length;
        const inactiveUsers = usersData.filter(
          (user) => !user?.email_verified && !user?.phone_verified
        ).length;
        const pendingKycUsers = pendingKycData.filter(
          (kyc) => !kyc.approved
        ).length;
        const totalAgents = pendingKycData.filter((kyc) => kyc.approved).length; // Assuming approved KYC = agent

        const statsData = [
          {
            title: "Total Revenue",
            value: formatCurrency(totalRevenue),
            icon: <FaDollarSign className="text-blue-600 text-lg" />,
            bgColor: "bg-blue-600 text-white",
            textColor: "text-white",
          },
          {
            title: "Total Users",
            value: totalUsers.toLocaleString(),
            icon: <IoIosStats className="text-blue-600 text-lg" />,
            bgColor: "bg-white",
            textColor: "text-gray-900",
          },
          {
            title: "Inactive Users",
            value: inactiveUsers.toLocaleString(),
            icon: <IoIosStats className="text-blue-600 text-lg" />,
            bgColor: "bg-white",
            textColor: "text-gray-900",
          },
          {
            title: "Users Pending KYC",
            value: pendingKycUsers.toLocaleString(),
            icon: <IoIosStats className="text-blue-600 text-lg" />,
            bgColor: "bg-white",
            textColor: "text-gray-900",
          },
          {
            title: "Total Agents",
            value: totalAgents.toLocaleString(),
            icon: <HiOutlineDocumentText className="text-blue-600 text-lg" />,
            bgColor: "bg-white",
            textColor: "text-gray-900",
          },
        ];
        console.log("Processed stats:", statsData);
        setStats(statsData);

        // Process income data (last 6 months)
        const months = Array.from({ length: 6 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          return {
            name: date.toLocaleString("en", { month: "short" }).toUpperCase(),
            date,
          };
        }).reverse();

        const incomeData = months.map(({ name, date }) => {
          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
          const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

          const monthTransactions = allTransactions.filter((tx) => {
            const txDate = new Date(tx.created_at);
            return (
              txDate >= monthStart &&
              txDate <= monthEnd &&
              tx.status === "completed"
            );
          });

          const transactions = monthTransactions
            .filter((tx) => tx.reason || tx.transaction_type)
            .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
          const utility = monthTransactions
            .filter((tx) => tx.meter_number || tx.cable_name)
            .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
          const agents = monthTransactions
            .filter((tx) => tx.reason?.includes("agent"))
            .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

          return { name, transactions, utility, agents };
        });
        // console.log("Processed income data:", incomeData);
        setIncomeData(incomeData);

        // Process traffic data (hourly transaction count)
        const trafficData = Array.from({ length: 24 }, (_, i) => {
          const hour = i.toString().padStart(2, "0");
          const transactionsInHour = allTransactions.filter((tx) => {
            const txHour = new Date(tx.created_at).getHours();
            return txHour === i;
          }).length;
          return { name: hour, visitors: transactionsInHour * 100 }; // Scale for visualization
        }).filter((_, i) => i % 4 === 0); // Sample every 4 hours
        // console.log("Processed traffic data:", trafficData);
        setTrafficData(trafficData);

        // Process user breakdown
        const activeUsers = usersData.filter(
          (user) => user?.email_verified || user?.phone_verified
        ).length;
        const inactiveUsersCount = totalUsers - activeUsers;
        const userBreakdownData = [
          { name: "Active User", value: activeUsers },
          { name: "Inactive User", value: inactiveUsersCount },
        ];
        // console.log("Processed user breakdown:", userBreakdownData);
        setUserData(userBreakdownData);
      } catch (error) {
        toast.error("Failed to fetch dashboard data. Please try again later.");
        console.error("Fetch dashboard data error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const fetchAllPages = async (endpoint, maxPages = 50) => {
    let allData = [];
    let nextPage = endpoint;
    let pageCount = 0;

    try {
      while (nextPage && pageCount < maxPages) {
        const res = await api.get(nextPage);
        allData = allData.concat(res.data.results || res.data);
        nextPage = res.data.next || null;
        pageCount++;
      }

      if (pageCount >= maxPages) {
        console.warn(`Reached max page limit (${maxPages}) for ${endpoint}`);
      }
    } catch (error) {
      toast.error(`Error fetching data from ${endpoint}`);
      console.error(`Error fetching ${endpoint}:`, error);
    }

    return allData;
  };

  const formatCurrency = (amount, currency = "NGN") => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getProductName = (transaction) => {
    if (transaction.reason) return transaction.reason;
    if (transaction.network) return `${transaction.network} Airtime`;
    if (transaction.cable_name) return `${transaction.cable_name} Cable`;
    return "Service Transaction";
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // console.log("the users data", userssData);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageTrx, setCurrentPageTrx] = useState(1);
  const totalPages = Math.ceil(usersKYCPendingData.length / itemsPerPage);

  useEffect(() => {
    setCurrentPageTrx(1);
  }, [transactionFilter]);

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-8">
            Loading dashboard data, please wait...
          </div>
        ) : (
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
        )}
      </div>
      {!isLoading && (
        <div className="py-6 bg-gray-50 flex gap-6">
          {/* Income Chart */}
          <div className="bg-white p-4 rounded-lg shadow w-1/3">
            <p className="text-gray-500 text-sm">This Week ▼</p>
            <h2 className="text-2xl font-bold">
              {formatCurrency(
                incomeData.reduce((sum, item) => sum + item.transactions, 0)
              )}
            </h2>
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
            <h2 className="text-2xl font-bold">
              {trafficData.reduce((sum, item) => sum + item.visitors, 0)}{" "}
              Visitors
            </h2>
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
                <span className="w-3 h-3 bg-blue-700 rounded-full mr-2"></span>
                Active User
              </div>
              <p>
                {userData[0]?.value
                  ? `${Math.round(
                      (userData[0].value /
                        (userData[0].value + (userData[1]?.value || 0))) *
                        100
                    )}%`
                  : "0%"}
              </p>
            </div>
            <div className="flex justify-between text-sm">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
                Inactive User
              </div>
              <p>
                {userData[1]?.value
                  ? `${Math.round(
                      (userData[1].value /
                        (userData[0]?.value + userData[1].value)) *
                        100
                    )}%`
                  : "0%"}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="pt-8 max-md-[400px]:hidden">
        <TableTabs
          header={"Pending Tasks"}
          setActiveTab={setActiveTabPending}
          activeTab={activeTabPending}
          tabs={["Approve KYC", "Approve Withdrawal"]}
          from="dashboard"
          // filterOptions={[
          //   { label: "MTN", value: "MTN" },
          //   { label: "Airtel", value: "Airtel" },
          //   { label: "Glo", value: "Glo" },
          //   { label: "9mobile", value: "9mobile" },
          // ]}
        />
        <div className="rounded-t-[1em] overflow-hidde border border-gray-200 ">
          <UsersTable
            userssData={usersKYCPendingData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            isLoading={isLoading}
            actionItem={actionItem}
            setActionItem={setActionItem}
          />
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <div className="pt-8 max-md-[400px]:hidden">
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
          onFilterChange={(filter) => setTransactionFilter(filter)}
        />
        <div className="rounded-t-[1em] overflow-hidden border border-gray-200">
          <TransactionsTable
            data={filteredTransactionData}
            currentPage={currentPageTrx}
            itemsPerPage={itemsPerPage}
            isLoading={isLoading}
          />
        </div>
        <Pagination
          currentPage={currentPageTrx}
          totalPages={Math.ceil(filteredTransactionData.length / itemsPerPage)}
          onPageChange={setCurrentPageTrx}
        />
      </div>
    </div>
  );
};

export default Dashboard;
