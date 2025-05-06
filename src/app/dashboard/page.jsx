"use client";

import { useEffect, useState } from "react";
import Dashboard from "./components/dashboard";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import PayBills from "../payBills/page";
import CardPage from "../card/page";
import Rewards from "../rewards/page";
import SettingsPage from "../settings/page";
import KYC from "../kyc/kyc";
import { useRouter } from "next/navigation";
import axiosInstance from "../../utils/axiosInstance";
import "../globals.css";

export default function Home() {
  const [activeSidebar, setActiveSidebar] = useState("Dashboard");
  const [hideSideMenu, setHideSideMenu] = useState(true);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [user, setUser] = useState({});

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        router.push("/dashboard");
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } else {
        router.push("/account/login");
      }
    }
  }, [router]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/payments/wallet/");

        console.log("dddddddd", response.data);

        setData(response.data);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // console.log(data);

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
      case "Pay Bills":
        return <PayBills setActiveSidebar={setActiveSidebar} />;
      case "Cards":
        return <CardPage />;
      case "Reward":
        return <Rewards />;
      case "Settings":
        return <SettingsPage user={user} />;
      case "KYC":
        return <KYC user={user} setActiveSidebar={setActiveSidebar} />;
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
        data={data}
        user={user}
        role="user"
      />
      <main className="flex-1 ">
        <Header setHideSideMenu={setHideSideMenu} user={user} />
        <section className="py-6 px-10 max-md-[400px]:px-5 h-[80vh] max-md-[400px]:h-[90vh] fixed max-md-[400px]:w-full w-[80%] overflow-y-auto custom-scroll bg-[#F6FCF5]">
          {renderComponent()}
        </section>
      </main>
    </div>
  );
}
