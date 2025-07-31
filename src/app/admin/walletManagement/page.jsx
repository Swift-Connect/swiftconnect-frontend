
"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { fetchWithAuth, postWithAuth, patchWithAuth } from "@/utils/api";
import TableTabs from "../components/tableTabs";
import Pagination from "../components/pagination";
import {
  FaPlus,
  FaMinus,
  FaEdit,
  FaEye,
  FaSearch,
  FaFilter,
  FaDownload,
  FaWallet,
  FaDollarSign,
  FaUsers,
  FaExchangeAlt
} from "react-icons/fa";

const WalletManagement = () => {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("User Wallets");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletAction, setWalletAction] = useState("credit"); // credit, debit
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWalletBalance: 0,
    totalTransactions: 0,
    pendingTransactions: 0
  });

  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersResponse, transactionsResponse] = await Promise.all([
        fetchWithAuth("users/list-users/"),
        fetchWithAuth("payments/transactions/")
      ]);

      setUsers(usersResponse || []);
      setTransactions(transactionsResponse || []);

      // Calculate stats
      const totalUsers = usersResponse?.length || 0;
      const totalTransactions = transactionsResponse?.length || 0;
      const pendingTransactions = transactionsResponse?.filter(t => t.status === 'pending')?.length || 0;

      setStats({
        totalUsers,
        totalWalletBalance: 0, // Will be calculated from individual wallet fetches
        totalTransactions,
        pendingTransactions
      });

    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch wallet data");
    } finally {
      setLoading(false);
    }
  };

  const handleWalletOperation = async () => {
    if (!selectedUser || !amount || !reason) {
      toast.error("Please fill all required fields");
      return;
    }

    setProcessing(true);
    try {
      const payload = {
        amount: parseFloat(amount),
        currency: "NGN",
        payment_type: "monify",
        reason: reason,
        transaction_type: walletAction,
        user: selectedUser.id
      };

      if (walletAction === "credit") {
        await postWithAuth("payments/credit-wallet/", payload);
        toast.success(`Successfully credited ₦${amount} to ${selectedUser.username}'s wallet`);
      } else {
        // For debit, we'll create a debit transaction
        await postWithAuth("payments/transfer-funds/", {
          transfer_type: "internal",
          amount: amount,
          recipient_email: "admin@swiftconnect.com", // Admin email for debit operations
          narration: reason
        });
        toast.success(`Successfully debited ₦${amount} from ${selectedUser.username}'s wallet`);
      }

      setShowWalletModal(false);
      setAmount("");
      setReason("");
      setSelectedUser(null);
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Wallet operation error:", error);
      toast.error(`Failed to ${walletAction} wallet: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions.filter(tx =>
    tx.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.user?.toString().includes(searchTerm)
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(
    (activeTab === "User Wallets" ? filteredUsers.length : filteredTransactions.length) / itemsPerPage
  );

  const StatsCard = ({ title, value, icon, bgColor }) => (
    <div className={`${bgColor} rounded-lg p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={<FaUsers />}
          bgColor="bg-blue-500"
        />
        <StatsCard
          title="Total Wallet Balance"
          value="₦0.00" // Will be calculated
          icon={<FaWallet />}
          bgColor="bg-green-500"
        />
        <StatsCard
          title="Total Transactions"
          value={stats.totalTransactions.toLocaleString()}
          icon={<FaExchangeAlt />}
          bgColor="bg-purple-500"
        />
        <StatsCard
          title="Pending Transactions"
          value={stats.pendingTransactions.toString()}
          icon={<FaDollarSign />}
          bgColor="bg-orange-500"
        />
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <TableTabs
            header="Wallet Management"
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            tabs={["User Wallets", "Transaction History", "Wallet Operations"]}
            from="wallet"
            onSearchChange={setSearchTerm}
            searchValue={searchTerm}
          />

          {/* User Wallets Tab */}
          {activeTab === "User Wallets" && (
            <>
              {loading ? (
                <div className="text-center py-8">Loading users...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="text-left p-4 font-medium text-gray-900">User</th>
                        <th className="text-left p-4 font-medium text-gray-900">Email</th>
                        <th className="text-left p-4 font-medium text-gray-900">Phone</th>
                        <th className="text-left p-4 font-medium text-gray-900">Status</th>
                        <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-gray-900">{user.username}</p>
                              <p className="text-sm text-gray-500">{user.fullname || 'No name provided'}</p>
                            </div>
                          </td>
                          <td className="p-4 text-gray-900">{user.email}</td>
                          <td className="p-4 text-gray-900">{user.phone_number || 'Not provided'}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.email_verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.email_verified ? 'Verified' : 'Unverified'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setWalletAction("credit");
                                  setShowWalletModal(true);
                                }}
                                className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                              >
                                <FaPlus className="mr-1" /> Credit
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setWalletAction("debit");
                                  setShowWalletModal(true);
                                }}
                                className="flex items-center px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                              >
                                <FaMinus className="mr-1" /> Debit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Transaction History Tab */}
          {activeTab === "Transaction History" && (
            <>
              {loading ? (
                <div className="text-center py-8">Loading transactions...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="text-left p-4 font-medium text-gray-900">Transaction ID</th>
                        <th className="text-left p-4 font-medium text-gray-900">User</th>
                        <th className="text-left p-4 font-medium text-gray-900">Type</th>
                        <th className="text-left p-4 font-medium text-gray-900">Amount</th>
                        <th className="text-left p-4 font-medium text-gray-900">Status</th>
                        <th className="text-left p-4 font-medium text-gray-900">Date</th>
                        <th className="text-left p-4 font-medium text-gray-900">Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-mono text-sm">#{transaction.id}</td>
                          <td className="p-4">User {transaction.user}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.transaction_type === 'credit' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {transaction.transaction_type}
                            </span>
                          </td>
                          <td className="p-4 font-medium">
                            {transaction.transaction_type === 'credit' ? '+' : '-'}
                            ₦{parseFloat(transaction.amount).toLocaleString()}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : transaction.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-sm">{transaction.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Wallet Operations Tab */}
          {activeTab === "Wallet Operations" && (
            <div className="py-8">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Bulk Wallet Operations</h3>
                <p className="text-gray-600 mb-8">Select users from the User Wallets tab to perform operations</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 border rounded-lg">
                    <FaDownload className="mx-auto mb-4 text-2xl text-blue-600" />
                    <h4 className="font-medium mb-2">Export Data</h4>
                    <p className="text-sm text-gray-600 mb-4">Download wallet and transaction data</p>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Export CSV
                    </button>
                  </div>
                  <div className="p-6 border rounded-lg">
                    <FaPlus className="mx-auto mb-4 text-2xl text-green-600" />
                    <h4 className="font-medium mb-2">Bulk Credit</h4>
                    <p className="text-sm text-gray-600 mb-4">Credit multiple wallets at once</p>
                    <button className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                      Bulk Credit
                    </button>
                  </div>
                  <div className="p-6 border rounded-lg">
                    <FaEdit className="mx-auto mb-4 text-2xl text-purple-600" />
                    <h4 className="font-medium mb-2">Audit Trail</h4>
                    <p className="text-sm text-gray-600 mb-4">View all wallet operations</p>
                    <button className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                      View Audit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={activeTab === "User Wallets" ? filteredUsers.length : filteredTransactions.length}
          />
        </div>
      </div>

      {/* Wallet Operation Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium mb-4">
              {walletAction === "credit" ? "Credit" : "Debit"} Wallet
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User: {selectedUser?.username}
                </label>
                <p className="text-sm text-gray-600">{selectedUser?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter reason for this operation"
                  rows="3"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowWalletModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleWalletOperation}
                className={`flex-1 px-4 py-2 text-white rounded-lg ${
                  walletAction === "credit" 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-red-600 hover:bg-red-700"
                }`}
                disabled={processing}
              >
                {processing ? "Processing..." : `${walletAction === "credit" ? "Credit" : "Debit"} Wallet`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletManagement;
