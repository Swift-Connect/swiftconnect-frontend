"use client";
import api from "@/utils/api";
import DashboardOverview from "./components/dashboardOverview";
import LastSection from "./components/lastSectiion";
import SalesReport from "./components/salesReport";
import ServiceRevenue from "./components/servicesRevenue";
import { use, useEffect } from "react";
export default function ReporstAndAnalytics() {
  // const fetchAllPages = async (endpoint) => {
  //   let allData = [];

  //   try {
  //     const res = await api.get(endpoint);
  //     // allData = allData.concat(res.data.results || res.data);
  //     console.log(res.data);
      
  //     // nextPage = res.data.next || null;
  //   } catch (error) {
  //     // toast.error(`Error fetching data from /api/analytics/`);
  //     console.error(`Error fetching /api/analytics/:`, error);
  //   }

  //   return allData;
  // };
  // useEffect(() => {
  //   fetchAllPages("https://swiftconnect-backend.onrender.com/api/analytics/");
  // }, []);
  return (
    <main className="min-h-screen bg-[#F5FBF7] ">
      <DashboardOverview />
      <SalesReport />
      <ServiceRevenue />
      <LastSection />
    </main>
  );
}
