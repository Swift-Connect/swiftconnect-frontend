"use client";
import React, { useState } from "react";
import Header from "../dashboard/components/header";
import Sidebar from "../dashboard/components/sidebar";
import UserManagement from "./userManagement/user_management";
import Dashboard from "./dashboard/page";
import TransactionManagement from "./transactionManagement/transactionManagement";
import WalletManagement from "./walletManagement/page";
import ReferralSystem from "./referralSystem/page";
import SMA from "./serviceApiManagement/page";
import BankingServices from "./bankingServices/page";
import NotificationSystem from "./NotificationSystem/page";
import VCManagement from "./VirtualCardManagement/page";
import SMAA from "./serviceMangementAPI/page";
import AuditLog from "./auditLog/page";
import ReporstAndAnalytics from "./reportsAndAnalytics/page";
import ProfileSettings from "./settings/page";
import RoleBasedAccessControl from "./roleBaseAccessControl/page";
import KYCManagement from "./kycManagement/page";
import "../globals.css";
import ResellerManagement from "./resellerManagement/page";
import APIManagement from "./APIManagement/page";
import SystemMonitoring from "./systemMonitoring/page";
import CustomerSupport from "./customerSupport/page";
import MarketingTools from "./MarketingTools/page";
import APIManagementTable from "./APIManagement/components/table";

const AdminPage = () => {
  const [hideSideMenu, setHideSideMenu] = useState(true);
  const [activeSidebar, setActiveSidebar] = useState("Dashboard");
  const [data, setData] = useState(null);
  let user = null;

  if (typeof window !== "undefined") {
    const userString = localStorage.getItem("user");

    if (userString) {
      user = JSON.parse(userString);
    }
  }

  const renderComponent = () => {
    switch (activeSidebar) {
      case "Dashboard":
        return (
          <Dashboard
            setActiveSidebar={setActiveSidebar}
            data={data}
            user={user}
          />
        );
      case "User Management":
        return (
          <UserManagement
            setActiveSidebar={setActiveSidebar}
            data={data}
            user={user}
          />
        );
      case "Transaction Management":
        return (
          <TransactionManagement
            setActiveSidebar={setActiveSidebar}
            data={data}
            user={user}
          />
        );
      case "Wallet Management":
        return (
          <WalletManagement
            setActiveSidebar={setActiveSidebar}
            data={data}
            user={user}
          />
        );
      case "KYC Management":
        return (
          <KYCManagement
            setActiveSidebar={setActiveSidebar}
            data={data}
            user={user}
          />
        );
      case "Referral System":
        return (
          <ReferralSystem
            setActiveSidebar={setActiveSidebar}
            data={data}
            user={user}
          />
        );
      case "Service Management API":
        return (
          <SMAA />
          // <SMAA />
        );
      case "Payment Gateway Integration":
        return <APIManagementTable />;
      case "Banking Services":
        return <BankingServices />;
      case "Notification System":
        return <NotificationSystem />;
      case "Virtual Card Management":
        return <VCManagement />;
      case "Audit Logs":
        return <AuditLog />;
      case "Reports and Analytics":
        return <ReporstAndAnalytics />;
      case "Settings":
        return <ProfileSettings />;
      case "Role-Based Access Control":
        return <RoleBasedAccessControl />;
      case "Reseller Management":
        return <ResellerManagement />;
      case "API Management":
        return <APIManagement />;
      case "System Monitoring":
        return <SystemMonitoring />;
      case "Customer Support":
        return <CustomerSupport />;
      case "Marketing Tools":
        return <MarketingTools />;

      default:
        return "LOL";
    }
  };

  const searchItems = [
    "Dashboard",
    "User Management",
    "Transaction Management",
    "Referral System",
    "Service Management API",
    "Payment Gateway Integration",
    "Banking Services",
    "Notification System",
    "Virtual Card Management",
    "Audit Logs",
    "Reports and Analytics",
    "Settings",
    "Role-Based Access Control",
    "Reseller Management",
    "API Management",
    "System Monitoring",
    "Customer Support",
    "Marketing Tools",
  ];

  return (
    <div className="flex  bg-[#F6FCF5] ">
      <Sidebar
        setActiveSidebar={setActiveSidebar}
        setHideSideMenu={setHideSideMenu}
        hideSideMenu={hideSideMenu}
        data={data}
        user={user}
        role="admin"
      />
      <main className="w-[80%] flex-1 ml-[20%] max-md:ml-0 max-md:w-full">
        <Header
          setHideSideMenu={setHideSideMenu}
          user={user}
          searchItems={searchItems}
        />
        <section className="p-6 h-[80vh] overflow-y-auto">
          {renderComponent()}
        </section>
      </main>
    </div>
  );
};

export default AdminPage;
