"use client"
import DashboardOverview from "./components/dashboardOverview";
import LastSection from "./components/lastSectiion";
import SalesReport from "./components/salesReport";
import ServiceRevenue from "./components/servicesRevenue";
export default function ReporstAndAnalytics() {
  return (
      <main className="min-h-screen bg-[#F5FBF7] ">
          <DashboardOverview />
          <SalesReport />
          <ServiceRevenue />
          <LastSection />
    </main>
  );
}
