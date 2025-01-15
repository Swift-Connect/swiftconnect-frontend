"use client";

import { useState } from "react";
import DashboardCard from "./components/daasboardCard";
import Dashboard from "./components/dashboard";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import TransactionsTable from "./components/transactionTable";
import WalletCard from "./components/walletCard";

export default function Home() {
  const [activeSidebar, setActiveSidebar] = useState("Dashboard");

  const renderComponent = () => {
    switch (activeSidebar) {
      case "Dashboard":
        return <Dashboard />;
      case "Pay Bills":
        return <p>Pay Bills</p>;
      case "Cards":
        return <p>Cards</p>;
      case "Reward":
        return <p>Reward</p>;
      case "Settings":
        return <p>Settings</p>;
      case "Developer API":
        return <p>Developer API</p>;
    }
  };
  return (
    <div className="flex bg-[#F6FCF5]">
      <Sidebar setActiveSidebar={setActiveSidebar} />
      <main className="flex-1 bg-secondary">
        <Header />
        <div className="py-6 px-10 h-[80vh] overflow-y-auto custom-scroll">
          {renderComponent()}
        </div>
      </main>
    </div>
  );
}
