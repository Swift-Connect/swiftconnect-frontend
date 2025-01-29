import { useState } from "react";
import DashboardCard from "../dashboard/components/daasboardCard";
import Airtime from "../dashboard/components/paybills/airtime";
import Internet from "../dashboard/components/paybills/internet";
import ElectricityPayment from "../dashboard/components/paybills/electricity";
import CableTv from "../dashboard/components/paybills/cableTv";
import AgentKycComponent from "../dashboard/components/agentKycComponent";
import TransactionsTable from "../dashboard/components/transactionTable";

const PayBills = () => {
  const [payBillsType, setPayBillsType] = useState("dashboard");

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
          <div className=" flex gap-4 w-[90%] justify-between">
            <div className="grid grid-cols-2 w-full gap-4">
              <DashboardCard
                title="Airtime"
                icon="/airtime.svg"
                bgColor="primary"
                setPayBillsType={setPayBillsType}
                description="Single and multiple airtime options "
              />
              <DashboardCard
                title="Internet"
                icon="/internet.svg"
                bgColor="secondary"
                setPayBillsType={setPayBillsType}
                description="Single and multiple internet options "
              />
              <DashboardCard
                title="Electricity"
                icon="/electricity.svg"
                bgColor="red-500"
                setPayBillsType={setPayBillsType}
                description="Recharge preferred cable easily"
              />
              <DashboardCard
                title="Cable TV"
                icon="/cable-tv.svg"
                bgColor="yellow-400"
                setPayBillsType={setPayBillsType}
                description="Pay for electricity bill fast and easy"
              />
            </div>
          </div>
          <AgentKycComponent />
              <TransactionsTable />
        </>
      );
  }
};

export default PayBills;
