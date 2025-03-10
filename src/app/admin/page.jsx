"use client";
import React, { useState } from "react";
import Header from "../dashboard/components/header";
import Sidebar from "../dashboard/components/sidebar";
import Dashboard from "./components/dashboard";
import UserManagement from "./components/user_management";

const AdminPage = () => {
  const [hideSideMenu, setHideSideMenu] = useState(true);
  const [activeSidebar, setActiveSidebar] = useState("Dashboard");
  const [data, setData] = useState(null);
  const user = {
    username: "Super_Admin",
  };

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
      <main className="flex-1 ">
        <Header setHideSideMenu={setHideSideMenu} user={user} />
        <section className="p-6">
          {renderComponent()}
        </section>
      </main>
    </div>
  );
};

export default AdminPage;
