import React, { useState } from "react";
import { FaChevronRight, FaPlus, FaTrashAlt } from "react-icons/fa";
import TableTabs from "../../components/tableTabs";
import Table from "./table";
import Pagination from "../../components/pagination";

const MonnifySettings = ({ setCard }) => {
  const [activeTabPending, setActiveTabPending] =
    React.useState("All Transaction");

  const data = [
    {
      id: 1,
      user: "John Doe",
      product: "Airtime",
      amount: "50,000",
      date: "2024-03-01",
      status: "Completed",
    },
    {
      id: 2,
      user: "Jane Smith",
      product: "Internet",
      amount: "10,000",
      date: "2024-03-02",
      status: "Pending",
    },
    {
      id: 3,
      user: "Alice Johnson",
      product: "Transfer",
      amount: "20,000",
      date: "2024-03-03",
      status: "Failed",
    },
    {
      id: 4,
      user: "Bob Brown",
      product: "Cable",
      amount: "15,000",
      date: "2024-03-04",
      status: "Refunded",
    },
    {
      id: 5,
      user: "Charlie Davis",
      product: "Electricity",
      amount: "30,000",
      date: "2024-03-05",
      status: "Completed",
    },
  ];
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  return (
    <div>
      <div className="flex items-center mb-8 justify-between">
        <h1 className="text-[16px] font-semibold flex items-center gap-4">
          <span className="text-[#9CA3AF]" onClick={() => setCard(null)}>
            Service Management API
          </span>
          <FaChevronRight /> Monnify Settings
        </h1>
      </div>

      <h1 className="text-[16px] font-semibold mb-8">Monify API</h1>
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-[80%] mb-8">
        <form className="space-y-4 flex flex-col gap-8">
          {/*User Info*/}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-[2em]">
              <label className="block text-[18px] font-medium text-gray-700 w-[150px]">
                Monnify Api Key
              </label>
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  value={"live_67c0e372a9bd4538140c98fa10cd2271e93483c8"}
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
                Monnify Secret Key
              </label>
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  value={"live_67c0e372a9bd4538140c98fa10cd2271e93483c8"}
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
                Monnify Contract Address
              </label>
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  value={"live_67c0e372a9bd4538140c98fa10cd2271e93483c8"}
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
                Wallet Topup Charges (In Percentage %)
              </label>
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  value={1.5}
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
                Monnify Activation
              </label>
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  value={"On"}
                  className="w-full mt-1 p-4 border rounded-[0.8em] focus:outline-none focus:ring-2 focus:ring-gray-400"
                  disabled
                />
                <p className="text-[14px] text-gray-500">
                  Raw passwords are not stored, so there is no way to see this
                  user’s password
                </p>
              </div>
            </div>{" "}
            <div className="flex items-center gap-[2em]">
              <label className="block text-[18px] font-medium text-gray-700 w-[150px]">
                Wema Bank Activation
              </label>
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  value={"On"}
                  className="w-full mt-1 p-4 border rounded-[0.8em] focus:outline-none focus:ring-2 focus:ring-gray-400"
                  disabled
                />
                <p className="text-[14px] text-gray-500">
                  Raw passwords are not stored, so there is no way to see this
                  user’s password
                </p>
              </div>
            </div>{" "}
            <div className="flex items-center gap-[2em]">
              <label className="block text-[18px] font-medium text-gray-700 w-[150px]">
                Sterling Bank Activation
              </label>
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  value={"On"}
                  className="w-full mt-1 p-4 border rounded-[0.8em] focus:outline-none focus:ring-2 focus:ring-gray-400"
                  disabled
                />
                <p className="text-[14px] text-gray-500">
                  Raw passwords are not stored, so there is no way to see this
                  user’s password
                </p>
              </div>
            </div>{" "}
            <div className="flex items-center gap-[2em]">
              <label className="block text-[18px] font-medium text-gray-700 w-[150px]">
                GT Bank Activation
              </label>
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  value={"On"}
                  className="w-full mt-1 p-4 border rounded-[0.8em] focus:outline-none focus:ring-2 focus:ring-gray-400"
                  disabled
                />
                <p className="text-[14px] text-gray-500">
                  Raw passwords are not stored, so there is no way to see this
                  user’s password
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="flex items-center gap-[3em] mb-8">
        <button className="bg-[#00613A] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
          Save <FaPlus />
        </button>
        <button className="bg-[#8C1823] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
          Delete <FaTrashAlt />
        </button>
      </div>
      <div className="pt-8 max-md-[400px]:hidden">
        <TableTabs
          header={"Payment Log"}
          setActiveTab={setActiveTabPending}
          activeTab={activeTabPending}
          tabs={["All Transaction", "Inactive", "Recently Added"]}
          from="SAMM"
          onPress={() => {}}
        />
        <div className="rounded-t-[1em] overflow-auto border border-gray-200 min-h-[50vh]">
          <Table
            data={data}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}

            //   setShowEdit={handleEditClick}
          />
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default MonnifySettings;
