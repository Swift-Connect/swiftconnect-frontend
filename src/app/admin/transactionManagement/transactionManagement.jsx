import Image from "next/image";
import React, { useState } from "react";
// import TrxManagementTable from "./components/TrxManagementTable";
import Pagination from "../components/pagination";
import TableTabs from "../components/tableTabs";
import EditUserTrx from "./components/editUserTransaction";
import { FaChevronRight } from "react-icons/fa";
import TrxManagementTable from "./components/trxManagementTable";

const TransactionManagement = () => {
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

  const editTrx = true;
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleEditClick = (rowData) => {
    setEditData(rowData);
    setShowEdit(true);
    console.log("shit");
    
  };

  return (
    <div className="overflow-hidden ">
      <div className="max-md-[400px]:hidden">
        {showEdit ? (
          <>
            <div>
              <h1 className="text-[16px] font-semibold mb-8 flex items-center gap-4">
                Transaction Management <FaChevronRight /> Edit User Transaction
              </h1>
            </div>
            <EditUserTrx fields={Object.keys(editData || {})} data={editData} />
          </>
        ) : (
          <>
            <h1 className="text-[16px] font-semibold mb-8">
              Transaction Management
            </h1>

            <TableTabs
              header={""}
              setActiveTab={setActiveTabPending}
              activeTab={activeTabPending}
              tabs={["All Transaction", "Inactive", "Recently Added"]}
              from="transactionManagement"
            />
            <div className="rounded-t-[1em] overflow-auto border border-gray-200 min-h-[50vh]">
              <TrxManagementTable
                data={data}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                setShowEdit={handleEditClick}
              />
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionManagement;
