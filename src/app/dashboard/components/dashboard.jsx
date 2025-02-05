import React, { useEffect, useState } from "react";
import DashboardCard from "./daasboardCard";
import Sidebar from "./sidebar";
import Header from "./header";
import WalletCard from "./walletCard";
import TransactionsTable from "./transactionTable";
import AgentKycComponent from "./agentKycComponent";
import Airtime from "./paybills/airtime";

const Dashboard = () => {
  const [payBillsType, setPayBillsType] = useState("dashboard");

  useEffect(() => {
    console.log(payBillsType);
  }, [payBillsType]);

  // const payBills = (billType) => {
  switch (payBillsType) {
    case "Airtime":
      return <Airtime setBillType={setPayBillsType} />;
    case "Internet":
      return <p>{payBillsType}</p>;
    case "Electricity":
      return <p>{payBillsType}</p>;
    case "Cable TV":
      return <p>{payBillsType}</p>;
    case "dashboard":
      return (
        <>
          <div className=" flex gap-4 w-[90%] justify-between">
            <WalletCard />
            <div className="grid grid-cols-2 gap-4">
              <DashboardCard
                title="Airtime"
                icon="/airtime.svg"
                bgColor="primary"
                setPayBillsType={setPayBillsType}
              />
              <DashboardCard
                title="Internet"
                icon="/internet.svg"
                bgColor="secondary"
                setPayBillsType={setPayBillsType}
              />
              <DashboardCard
                title="Electricity"
                icon="/electricity.svg"
                bgColor="red-500"
                setPayBillsType={setPayBillsType}
              />
              <DashboardCard
                title="Cable TV"
                icon="/cable-tv.svg"
                bgColor="yellow-400"
                setPayBillsType={setPayBillsType}
              />
            </div>
          </div>
          <AgentKycComponent />
          <TransactionsTable />
        </>
      );
    // }
  }
};

export default Dashboard;
