import React from "react";
import UptimeBar from "./components/uptimeBar";
import StatusBreakdown from "./components/statusBreakdown";
import SystemMonitoringTable from "./components/table";

const SystemMonitoring = () => {
  const usersData = [
    {
      alert_log: "Jun 20, 2018 3:37 am",
      reason: "OK",
      duration: "6 days, 17 hours",
    },
    {
      alert_log: "Jun 20, 2018 3:37 am",
      reason: "CRITICAL-Socket timeout after 40 seconds",
      duration: "19 minutes",
    },
    {
      alert_log: "Jun 20, 2018 3:37 am",
      reason: "OK",
      duration: "2 weeks, 2 days",
    },
    {
      alert_log: "Jun 20, 2018 3:37 am",
      reason: "OK",
      duration: "6 days, 17 hours",
    },
  ];
  return (
    <div>
      <UptimeBar />
      <StatusBreakdown />
      <div className="rounded-t-[1em] mt-6 overflow-auto border border-gray-200 min-h-[50vh]">
        <SystemMonitoringTable data={usersData} />
      </div>
    </div>
  );
};

export default SystemMonitoring;
