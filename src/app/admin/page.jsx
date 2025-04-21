"use client";
import React, { useState } from "react";
import Header from "../dashboard/components/header";
import Sidebar from "../dashboard/components/sidebar";
import UserManagement from "./userManagement/user_management";
import Dashboard from "./dashboard/page";
import TransactionManagement from "./transactionManagement/transactionManagement";
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

const AdminPage = () => {
  const [hideSideMenu, setHideSideMenu] = useState(true);
  const [activeSidebar, setActiveSidebar] = useState("Dashboard");
  const [data, setData] = useState(null);
  let user = null;

  if (window) {
    const userString = localStorage.getItem('user');
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
          // <SMA setActiveSidebar={setActiveSidebar} data={data} user={user} />
        );
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

      default:
        return "LOL";
    }
  };

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
      <main className="flex-1 w-[70%]">
        <Header setHideSideMenu={setHideSideMenu} user={user} />
        <section className="p-6 h-[80vh] overflow-y-auto">
          {renderComponent()}
        </section>
      </main>
    </div>
  );
};

export default AdminPage;
