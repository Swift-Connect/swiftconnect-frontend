"use client";
import { useEffect, useState } from "react";
import WalletCard from "@/app/dashboard/components/walletCard";
import TableTabs from "../components/tableTabs";
import TransactionsTable from "../dashboard/components/TransactionsTable";
import api from "@/utils/api";

const BankingServices = () => {
  const [walletData, setWalletData] = useState({ balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("All Transactions");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch wallet balance
        const walletRes = await api.get("/payments/wallet/");
        setWalletData(walletRes.data);

        // Fetch transactions
        const txRes = await api.get("/payments/transactions/");
        setTransactions(txRes.data);

        // Fetch users for mapping
        const usersRes = await api.get("/users/list-users/");
        setUsers(usersRes.data);
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchData();
  }, []);

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : "Unknown";
  };

  const filteredTransactions = transactions.map(tx => ({
    ...tx,
    user: getUserName(tx.user),
    product: tx.reason,
    amount: tx.amount.toLocaleString(),
    date: new Date(tx.created_at).toLocaleDateString()
  }));

  return (
    <div>
      <WalletCard data={walletData} />
      <div className="pt-8 max-md-[400px]:hidden">
        <TableTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={["All Transactions", "Pending", "Failed"]}
          filterOptions={[]}
        />
        <div className="rounded-t-[1em] overflow-hidden border border-gray-200">
          <TransactionsTable data={filteredTransactions} />
        </div>
      </div>
    </div>
  );
};

export default BankingServices;