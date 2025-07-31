
"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { fetchWithAuth, postWithAuth, patchWithAuth, handleApiError } from "@/utils/api";
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
  FaExchangeAlt,
  FaTrash,
  FaTimes
} from "react-icons/fa";

const WalletManagement = () => {
  const [wallets, setWallets] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("User Wallets");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletAction, setWalletAction] = useState("credit"); // credit, debit
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState("");
  const [selectedWallets, setSelectedWallets] = useState([]);
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
      const [walletsResponse, usersResponse, transactionsResponse] = await Promise.allSettled([
        fetchWithAuth("payments/admin/manage-user-wallet/"),
        fetchWithAuth("users/list-users/"),
        fetchWithAuth("payments/transactions/")
      ]);

      // Handle wallets response
      let walletsData = [];
      if (walletsResponse.status === "fulfilled") {
        walletsData = walletsResponse.value?.results || walletsResponse.value || [];
      } else {
        console.error("Failed to fetch wallets:", walletsResponse.reason);
        toast.error("Failed to fetch wallet data");
      }

      // Handle users response
      let usersData = [];
      if (usersResponse.status === "fulfilled") {
        usersData = usersResponse.value?.results || usersResponse.value || [];
      } else {
        console.error("Failed to fetch users:", usersResponse.reason);
        toast.error("Failed to fetch users data");
      }

      // Handle transactions response
      let transactionsData = [];
      if (transactionsResponse.status === "fulfilled") {
        transactionsData = transactionsResponse.value?.results || transactionsResponse.value || [];
      } else {
        console.error("Failed to fetch transactions:", transactionsResponse.reason);
        // Don't show error toast for transactions as it's not critical
      }

      setWallets(walletsData);
      setUsers(usersData);
      setTransactions(transactionsData);

      // Calculate stats
      const totalUsers = usersData.length;
      const totalWalletBalance = walletsData.reduce((sum, wallet) => sum + parseFloat(wallet.balance || 0), 0);
      const totalTransactions = transactionsData.length;
      const pendingTransactions = transactionsData.filter(t => t.status === 'pending').length;

      setStats({
        totalUsers,
        totalWalletBalance,
        totalTransactions,
        pendingTransactions
      });

    } catch (error) {
      console.error("Error fetching data:", error);
      handleApiError(error, "Failed to fetch wallet management data");
    } finally {
      setLoading(false);
    }
  };

  const handleWalletOperation = async () => {
    if (!selectedWallet || !amount || !reason) {
      toast.error("Please fill all required fields");
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    setProcessing(true);
    const loadingToast = toast.loading(`Processing ${walletAction} operation...`);

    try {
      if (walletAction === "credit") {
        // Use the fund_wallet endpoint for crediting
        const payload = {
          balance: parseFloat(amount)
        };

        await postWithAuth(`payments/admin/manage-user-wallet/${selectedWallet.id}/fund_wallet/`, payload);
        
        toast.update(loadingToast, {
          render: `Successfully credited ₦${parseFloat(amount).toLocaleString()} to wallet`,
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        // For debit, we'll update the wallet balance directly
        const newBalance = parseFloat(selectedWallet.balance) - parseFloat(amount);
        
        if (newBalance < 0) {
          toast.update(loadingToast, {
            render: "Insufficient balance for debit operation",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
          return;
        }

        const payload = {
          balance: newBalance.toString()
        };

        await patchWithAuth(`payments/admin/manage-user-wallet/${selectedWallet.id}/`, payload);
        
        toast.update(loadingToast, {
          render: `Successfully debited ₦${parseFloat(amount).toLocaleString()} from wallet`,
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }

      setShowWalletModal(false);
      setAmount("");
      setReason("");
      setSelectedWallet(null);
      setSelectedUser(null);
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Wallet operation error:", error);
      
      let errorMessage = "Unknown error occurred";
      if (error.status === 403 && error.message === "Transaction PIN is required.") {
        errorMessage = "Admin wallet operations require transaction PIN. Please contact system administrator.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.update(loadingToast, {
        render: `Failed to ${walletAction} wallet: ${errorMessage}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkCredit = async () => {
    if (selectedWallets.length === 0) {
      toast.error("Please select wallets to credit");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setProcessing(true);
    const loadingToast = toast.loading(`Processing bulk credit for ${selectedWallets.length} wallets...`);

    try {
      const results = await Promise.allSettled(
        selectedWallets.map(walletId => 
          postWithAuth(`payments/admin/manage-user-wallet/${walletId}/fund_wallet/`, {
            balance: parseFloat(amount)
          })
        )
      );

      const successful = results.filter(r => r.status === "fulfilled").length;
      const failed = results.filter(r => r.status === "rejected").length;
      const failedReasons = results
        .filter(r => r.status === "rejected")
        .map(r => r.reason?.message || "Unknown error");

      let message = `Bulk credit completed: ${successful} successful, ${failed} failed`;
      if (failed > 0 && failedReasons.some(r => r.includes("Transaction PIN"))) {
        message += " (Transaction PIN required for admin operations)";
      }

      toast.update(loadingToast, {
        render: message,
        type: successful > 0 ? "success" : "error",
        isLoading: false,
        autoClose: 5000,
      });

      setShowBulkModal(false);
      setSelectedWallets([]);
      setAmount("");
      fetchData();
    } catch (error) {
      console.error("Bulk credit error:", error);
      toast.update(loadingToast, {
        render: "Bulk credit operation failed",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleExportData = () => {
    try {
      const csvData = wallets.map(wallet => ({
        ID: wallet.id,
        User: wallet.user_email,
        Balance: wallet.balance,
        LastUpdated: wallet.last_updated,
        TransactionCount: wallet.transactions?.length || 0
      }));

      const csvContent = [
        Object.keys(csvData[0]).join(","),
        ...csvData.map(row => Object.values(row).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `wallet_data_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Wallet data exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  const filteredWallets = wallets.filter(wallet =>
    wallet.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wallet.id?.toString().includes(searchTerm)
  );

  const filteredTransactions = transactions.filter(tx =>
    tx.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.id?.toString().includes(searchTerm)
  );

  const paginatedWallets = filteredWallets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(
    (activeTab === "User Wallets" ? filteredWallets.length : filteredTransactions.length) / itemsPerPage
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg">Loading wallet management...</span>
      </div>
    );
  }

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
          value={`₦${stats.totalWalletBalance.toLocaleString()}`}
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
              {/* Bulk Actions */}
              {selectedWallets.length > 0 && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-blue-800 font-medium">
                      {selectedWallets.length} wallet(s) selected
                    </span>
                    <button
                      onClick={() => {
                        setBulkAction("credit");
                        setShowBulkModal(true);
                      }}
                      className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Bulk Credit
                    </button>
                    <button
                      onClick={() => setSelectedWallets([])}
                      className="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left p-4">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedWallets(paginatedWallets.map(w => w.id));
                            } else {
                              setSelectedWallets([]);
                            }
                          }}
                          checked={selectedWallets.length === paginatedWallets.length && paginatedWallets.length > 0}
                        />
                      </th>
                      <th className="text-left p-4 font-medium text-gray-900">Wallet ID</th>
                      <th className="text-left p-4 font-medium text-gray-900">User Email</th>
                      <th className="text-left p-4 font-medium text-gray-900">Balance</th>
                      <th className="text-left p-4 font-medium text-gray-900">Last Updated</th>
                      <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedWallets.map((wallet) => (
                      <tr key={wallet.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedWallets.includes(wallet.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedWallets([...selectedWallets, wallet.id]);
                              } else {
                                setSelectedWallets(selectedWallets.filter(id => id !== wallet.id));
                              }
                            }}
                          />
                        </td>
                        <td className="p-4 font-mono text-sm">#{wallet.id}</td>
                        <td className="p-4 text-gray-900">{wallet.user_email}</td>
                        <td className="p-4 font-medium text-green-600">
                          ₦{parseFloat(wallet.balance || 0).toLocaleString()}
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {wallet.last_updated ? new Date(wallet.last_updated).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedWallet(wallet);
                                setWalletAction("credit");
                                setShowWalletModal(true);
                              }}
                              className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                            >
                              <FaPlus className="mr-1" /> Credit
                            </button>
                            <button
                              onClick={() => {
                                setSelectedWallet(wallet);
                                setWalletAction("debit");
                                setShowWalletModal(true);
                              }}
                              className="flex items-center px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                            >
                              <FaMinus className="mr-1" /> Debit
                            </button>
                            <button
                              onClick={() => {
                                // View wallet details functionality
                                console.log("View wallet details:", wallet);
                              }}
                              className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                            >
                              <FaEye className="mr-1" /> View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Transaction History Tab */}
          {activeTab === "Transaction History" && (
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
                      <td className="p-4">{transaction.user_email || `User ${transaction.user}`}</td>
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
                        {transaction.created_at ? new Date(transaction.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4 text-sm">{transaction.reason || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Wallet Operations Tab */}
          {activeTab === "Wallet Operations" && (
            <div className="py-8">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Wallet Operations</h3>
                <p className="text-gray-600 mb-8">Perform bulk operations and manage wallet data</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 border rounded-lg">
                    <FaDownload className="mx-auto mb-4 text-2xl text-blue-600" />
                    <h4 className="font-medium mb-2">Export Data</h4>
                    <p className="text-sm text-gray-600 mb-4">Download wallet and transaction data</p>
                    <button 
                      onClick={handleExportData}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Export CSV
                    </button>
                  </div>
                  <div className="p-6 border rounded-lg">
                    <FaPlus className="mx-auto mb-4 text-2xl text-green-600" />
                    <h4 className="font-medium mb-2">Bulk Credit</h4>
                    <p className="text-sm text-gray-600 mb-4">Credit multiple wallets at once</p>
                    <button 
                      onClick={() => {
                        if (selectedWallets.length === 0) {
                          toast.error("Please select wallets from the User Wallets tab first");
                          return;
                        }
                        setBulkAction("credit");
                        setShowBulkModal(true);
                      }}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Bulk Credit
                    </button>
                  </div>
                  <div className="p-6 border rounded-lg">
                    <FaEdit className="mx-auto mb-4 text-2xl text-purple-600" />
                    <h4 className="font-medium mb-2">Audit Trail</h4>
                    <p className="text-sm text-gray-600 mb-4">View all wallet operations</p>
                    <button 
                      onClick={() => setActiveTab("Transaction History")}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
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
            totalItems={activeTab === "User Wallets" ? filteredWallets.length : filteredTransactions.length}
          />
        </div>
      </div>

      {/* Wallet Operation Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {walletAction === "credit" ? "Credit" : "Debit"} Wallet
              </h3>
              <button
                onClick={() => setShowWalletModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet: #{selectedWallet?.id}
                </label>
                <p className="text-sm text-gray-600">{selectedWallet?.user_email}</p>
                <p className="text-sm text-gray-600">Current Balance: ₦{parseFloat(selectedWallet?.balance || 0).toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₦) *
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
                  Reason *
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

      {/* Bulk Operations Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Bulk Credit Wallets</h3>
              <button
                onClick={() => setShowBulkModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Selected wallets: {selectedWallets.length}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount per wallet (₦) *
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
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowBulkModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleBulkCredit}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                disabled={processing}
              >
                {processing ? "Processing..." : "Bulk Credit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletManagement;
