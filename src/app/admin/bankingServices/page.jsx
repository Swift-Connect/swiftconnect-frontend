import WalletCard from "@/app/dashboard/components/walletCard";
import React from "react";
import TableTabs from "../components/tableTabs";
import TransactionsTable from "../dashboard/components/TransactionsTable";

const BankingServices = () => {
  const data = { balance: 1000 }; // Example data, replace with actual data as needed
    const [activeTabTransactions, setActiveTabTransactions] =
      React.useState("All Transactions");
    return (
    <div>
      <WalletCard data={data} />
      <div className="pt-8 max-md-[400px]:hidden">
        <TableTabs
          header={""}
          setActiveTab={setActiveTabTransactions}
          activeTab={activeTabTransactions}
          tabs={["All Transactions", "Inactive", "Recently Deleted"]}
          from="bankingServices"
          filterOptions={[
            { label: "MTN", value: "MTN" },
            { label: "Airtel", value: "Airtel" },
            { label: "Glo", value: "Glo" },
            { label: "9mobile", value: "9mobile" },
          ]}
        />
        <div className="rounded-t-[1em] overflow-hidden border border-gray-200">
          <TransactionsTable />
        </div>
      </div>
    </div>
  );
};

export default BankingServices;
