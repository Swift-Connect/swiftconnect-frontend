import React, { useEffect, useState } from "react";
import DashboardCard from "./daasboardCard";
import Sidebar from "./sidebar";
import Header from "./header";
import WalletCard from "./walletCard";
import TransactionsTable from "./transactionTable";
import AgentKycComponent from "./agentKycComponent";
import Airtime from "./paybills/airtime";
import Internet from "./paybills/internet";
import ElectricityPayment from "./paybills/electricity";
import CableTv from "./paybills/cableTv";

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
      return <Internet setBillType={setPayBillsType} />;
    case "Electricity":
      return <ElectricityPayment setBillType={setPayBillsType} />;
    case "Cable TV":
      return <CableTv setBillType={setPayBillsType} />;
    case "dashboard":
      return (
        <>
          <div className="flex gap-4 justify-between max-md-[400px]:flex-col max-md-[400px]:w-full w-[90%] ">
            <WalletCard />
            <div className="grid grid-cols-2 gap-4 max-md-[400px]:grid-cols-2">
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
