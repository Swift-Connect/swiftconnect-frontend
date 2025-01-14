import DashboardCard from "./components/daasboardCard";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import TransactionsTable from "./components/transactions/transactionTable";
import WalletCard from "./components/walletCard";

export default function Home() {
  return (
    <div className="flex bg-[#F6FCF5]">
      <Sidebar />
      <main className="flex-1 bg-secondary">
        <Header />
        <div className="py-6 px-10">
          <div className=" flex gap-4">
            <WalletCard />
            <div className="grid grid-cols-2 gap-4">
              <DashboardCard
                title="Airtime"
                icon="/airtime.svg"
                bgColor="primary"
              />
              <DashboardCard
                title="Internet"
                icon="/internet.svg"
                bgColor="secondary"
              />
              <DashboardCard
                title="Electricity"
                icon="/electricity.svg"
                bgColor="red-500"
              />
              <DashboardCard
                title="Cable TV"
                icon="/cable-tv.svg"
                bgColor="yellow-400"
              />
            </div>
          </div>
          <TransactionsTable />
        </div>
      </main>
    </div>
  );
}
