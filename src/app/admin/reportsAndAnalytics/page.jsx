"use client";
import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "@/utils/api";
import DashboardOverview from "./components/dashboardOverview";
import LastSection from "./components/lastSectiion";
import SalesReport from "./components/salesReport";
import ServiceRevenue from "./components/servicesRevenue";

export default function ReporstAndAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchWithAuth("/api/analytics/");
        setAnalytics(data);
      } catch (err) {
        setError("Failed to load analytics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading analytics...</div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <main className="min-h-screen bg-[#F5FBF7] ">
      <DashboardOverview analytics={analytics} />
      <SalesReport analytics={analytics} />
      <ServiceRevenue analytics={analytics} />
      <LastSection analytics={analytics} />
    </main>
  );
}
