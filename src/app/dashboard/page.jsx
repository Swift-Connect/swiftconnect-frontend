"use client";

import { useState } from "react";
import DashboardCard from "./components/daasboardCard";
import Dashboard from "./components/dashboard";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import TransactionsTable from "./components/transactionTable";
import WalletCard from "./components/walletCard";
import PayBills from "../payBills/page";
import CardPage from "../card/page";
import Rewards from "../rewards/page";
import SettingsPage from "../settings/page";
import { Settings } from "lucide-react";

export default function Home() {
  const [activeSidebar, setActiveSidebar] = useState("Dashboard");
  const [hideSideMenu, setHideSideMenu] = useState(true);

  const renderComponent = () => {
    switch (activeSidebar) {
      case "Dashboard":
        return <Dashboard />;
      case "Pay Bills":
        return <PayBills />;
      case "Cards":
        return <CardPage />;
      case "Reward":
        return <Rewards />;
      case "Settings":
        return <SettingsPage />;
      case "Developer API":
        return <p>Developer API</p>;
    }
  };
  return (
    <div className="flex bg-full bg-[#F6FCF5] ">
      <Sidebar
        setActiveSidebar={setActiveSidebar}
        setHideSideMenu={setHideSideMenu}
        hideSideMenu={hideSideMenu}
      />
      <main className="flex-1 ">
        <Header setHideSideMenu={setHideSideMenu} />
        <div className="py-6 px-10 max-md-[400px]:px-5 h-[80vh] max-md-[400px]:h-[90vh] fixed  overflow-y-auto custom-scroll bg-[#F6FCF5]">
          {renderComponent()}
        </div>
      </main>
    </div>
  );
}
