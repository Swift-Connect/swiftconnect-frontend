import React from "react";
import DashboardCard from "./daasboardCard";
import Sidebar from "./sidebar";
import Header from "./header";
import WalletCard from "./walletCard";
import TransactionsTable from "./transactionTable";
import AgentKycComponent from "./agentKycComponent";

const Dashboard = () => {
  return (
    <>
      <div className=" flex gap-4">
        <WalletCard />
        <div className="grid grid-cols-2 gap-4">
          <DashboardCard
            title="Airtime"
            icon="/airtime.svg"
            bgColor="primary"
          />
          <DashboardCard
            title="Internet"
            icon="/internet.svg"
            bgColor="secondary"
          />
          <DashboardCard
            title="Electricity"
            icon="/electricity.svg"
            bgColor="red-500"
          />
          <DashboardCard
            title="Cable TV"
            icon="/cable-tv.svg"
            bgColor="yellow-400"
          />
        </div>
      </div>
      <AgentKycComponent />
      <TransactionsTable />
    </>
  );
};

export default Dashboard;
