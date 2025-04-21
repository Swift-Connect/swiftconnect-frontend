import { useState } from "react";
import { FaLock, FaPlus, FaSlidersH, FaTrashAlt } from "react-icons/fa";
import TableTabs from "../../components/tableTabs";
import TransactionsTable from "../../dashboard/components/TransactionsTable";
import BlockCardModal from "./blockCardModal";
import TransactionLimitModal from "./trasactionLimitModal";

export default function EditVCM() {
  const data = [
    { month: "Aug", amount: 4000 },
    { month: "Sep", amount: 6000 },
    { month: "Oct", amount: 5000 },
    { month: "Nov", amount: 3000 },
    { month: "Dec", amount: 12500 },
    { month: "Jan", amount: 5000 },
  ];
  const [formData, setFormData] = useState({
    username: "Chosenfolio",
    password: "Chosenfolio",
    userType: "Reseller",
    status: "Approved",
    accountNo: "Chosenfolio",
    permissions: {
      active: false,
      admin: false,
      superUser: false,
    },
  });

  const [activeTabTransactions, setActiveTabTransactions] =
    useState("All Transactions");

  const [showBlockCard, setShowBlockCard] = useState(false);
  const [showTrxLimit, setShowTrxLimit] = useState(false);
  return (
    <>
      {showBlockCard && (
        <div
          className="absolute top-0 bottom-0 flex items-center justify-center right-0 left-0 bg-[#00000000]"
          onClick={() => {
            setShowBlockCard(false);
          }}
        >
          <BlockCardModal onClose={() => setShowBlockCard(false)} />
        </div>
      )}
      {showTrxLimit && (
        <div
          className="absolute top-0 bottom-0 z-10 flex items-center justify-center right-0 left-0 bg-[#00000000]"
          onClick={() => {
            setShowTrxLimit(false);
          }}
        >
          <TransactionLimitModal />
        </div>
      )}
      <div className="flex flex-col gap-8">
        <div className="flex justify-between w-[80%] mb-6">
          <h1 className="text-2xl font-bold text-[#0F172A] ">Chosenfolio</h1>

          <div className="flex gap-3">
            <button className="bg-[#00613A] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
              Save <FaPlus />
            </button>
            <button className="bg-[#8C1823] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
              Delete <FaTrashAlt />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white p-6 rounded-2xl w-full md:w-1/3 shadow-lg">
            <p className="text-sm">Balance</p>
            <h2 className="text-2xl font-bold">$5,756</h2>
            <div className="flex justify-between mt-6 text-sm">
              <div>
                <p className="opacity-70">CARD HOLDER</p>
                <p className="font-semibold">Eddy Cusuma</p>
              </div>
              <div>
                <p className="opacity-70">VALID THRU</p>
                <p className="font-semibold">12/22</p>
              </div>
            </div>
            <div className="mt-6 text-lg tracking-widest font-mono">
              3778 **** **** 1234
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md w-full md:w-1/3">
            <h2 className="text-lg font-semibold text-[#334155] mb-4">
              Expense
            </h2>
            <div className="flex items-end justify-between h-40">
              {data.map((d, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className={`w-6 rounded-full ${
                      d.amount === 12500 ? "bg-teal-400" : "bg-gray-200"
                    }`}
                    style={{ height: `${(d.amount / 13000) * 100}%` }}
                  />
                  <p className="text-sm mt-2 text-gray-600">{d.month}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md w-full md:w-1/3">
            <h2 className="text-lg font-semibold text-[#334155] mb-4">
              Card Setting
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-xl">
                  <FaLock className="text-yellow-600" />
                </div>
                <div onClick={() => setShowBlockCard(true)}>
                  <p className="font-medium">Block Card</p>
                  <p className="text-sm text-gray-400">
                    Instantly block this card
                  </p>
                </div>
              </div>

              <div
                className="flex items-center gap-4"
                onClick={() => setShowTrxLimit(true)}
              >
                <div className="bg-blue-100 p-3 rounded-xl">
                  <FaSlidersH className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Set Transaction Limit</p>
                  <p className="text-sm text-gray-400">
                    Set daily transaction limit
                  </p>
                </div>
              </div>
            </div>
          </div>{" "}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-[80%]">
          <form className="space-y-4 flex flex-col gap-8">
            {/*User Info*/}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-[2em]">
                <label className="block text-[18px] font-medium text-gray-700 w-[150px]">
                  Holder:
                </label>
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={formData.username}
                    className="w-full mt-1 p-4 border rounded-[0.8em] focus:outline-none focus:ring-2 focus:ring-gray-400"
                    disabled
                  />
                  <p className="text-[14px] text-gray-500">
                    Requires 50 characters or fewer, digits and @#?/+- only
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-[2em]">
                <label className="block text-[18px] font-medium text-gray-700 w-[150px]">
                  Card Number
                </label>
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={formData.password}
                    className="w-full mt-1 p-4 border rounded-[0.8em] focus:outline-none focus:ring-2 focus:ring-gray-400"
                    disabled
                  />
                  <p className="text-[14px] text-gray-500">
                    Raw passwords are not stored, so there is no way to see this
                    user’s password
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-[2em]">
                <label className="block text-[18px] font-medium text-gray-700 w-[150px]">
                  Expiry Date
                </label>
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={formData.password}
                    className="w-full mt-1 p-4 border rounded-[0.8em] focus:outline-none focus:ring-2 focus:ring-gray-400"
                    disabled
                  />
                  <p className="text-[14px] text-gray-500">
                    Raw passwords are not stored, so there is no way to see this
                    user’s password
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-[2em]">
                <label className="block text-[18px] font-medium text-gray-700 w-[150px]">
                  CVV
                </label>
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={formData.password}
                    className="w-full mt-1 p-4 border rounded-[0.8em] focus:outline-none focus:ring-2 focus:ring-gray-400"
                    disabled
                  />
                  <p className="text-[14px] text-gray-500">
                    Raw passwords are not stored, so there is no way to see this
                    user’s password
                  </p>
                </div>
              </div>

              {/* <div className="flex items-center gap-[2em]">
                <label className="block text-[18px] font-medium text-gray-700 w-[150px]">
                  Account no
                </label>
                <div>
                  <input
                    type="text"
                    value={formData.accountNo}
                    className="w-full mt-1 p-4 border rounded-[0.8em] focus:outline-none focus:ring-2 focus:ring-gray-400"
                    disabled
                  />
                  <p className="text-[14px] text-gray-500">
                    Raw passwords are not stored, so there is no way to see this
                    user’s password
                  </p>
                </div>
              </div> */}
            </div>
          </form>
        </div>

        <div className="pt-8 max-md-[400px]:hidden">
          <TableTabs
            header={"Recent Transactions"}
            setActiveTab={setActiveTabTransactions}
            activeTab={activeTabTransactions}
            tabs={["All Transactions", "Credit", "Debit"]}
            from="VCM"
            filterOptions={[
              { label: "MTN", value: "MTN" },
              { label: "Airtel", value: "Airtel" },
              { label: "Glo", value: "Glo" },
              { label: "9mobile", value: "9mobile" },
            ]}
            onPress={() => {}}
          />
          <div className="rounded-t-[1em] overflow-hidden border border-gray-200">
            <TransactionsTable />
          </div>
        </div>
      </div>
    </>
  );
}
