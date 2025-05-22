import Image from "next/image";
import React, { useEffect, useState } from "react";
// import TrxManagementTable from "./components/TrxManagementTable";
import Pagination from "../components/pagination";
import TableTabs from "../components/tableTabs";
import EditUserTrx from "./components/editUserTransaction";
import { FaChevronRight } from "react-icons/fa";
import TrxManagementTable from "./components/trxManagementTable";
import { toast } from "react-toastify";
import api from "@/utils/api";
import ViewTransactionModal from "../components/viewTransactionModal";

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

  // const [activeTabPending, setActiveTabPending] = useState("Approve KYC");
  const [activeTabTransactions, setActiveTabTransactions] =
    useState("All Transactions");

  const [isLoading, setIsLoading] = useState(true);
  const [allTransactionData, setAllTransaactionData] = useState([]);
  const [transactionFilter, setTransactionFilter] = useState("All");
  const [checkedItems, setCheckedItems] = useState([]); // Track selected rows
  // Filtered transaction data based on the selected filter
  console.log("Clicked Filtered Optiom", transactionFilter);

  const filteredTransactionData = allTransactionData.filter((tx) => {
    if (transactionFilter === "All") return true;
    if (transactionFilter === "Success")
      return tx.status.toLowerCase() === "completed";
    return tx.status.toLowerCase() === transactionFilter.toLowerCase();
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch all transactions
        const transactionEndpoints = [
          "/payments/transactions/",
          "/services/airtime-topups-transactions/",
          "/services/data-plan-transactions/",
          "/services/cable-recharges-transactions/",
          "/services/education-transactions/",
          "/services/electricity-transactions/",
          "/services/bulk-sms-transactions/",
        ];

        const transactionPromises = transactionEndpoints.map(
          async (endpoint) => {
            try {
              return await fetchAllPages(endpoint);
            } catch (error) {
              toast.error(`Error fetching ${endpoint}`);
              console.error(`Error fetching ${endpoint}:`, error);
              return [];
            }
          }
        );

        const transactionResults = await Promise.all(transactionPromises);
        const allTransactions = transactionResults.flat();
        console.log("Fetched transactions:", allTransactions);
        // Filter valid transactions
        const validTransactions = allTransactions.filter(
          (tx) =>
            tx.id &&
            tx.amount &&
            tx.created_at &&
            tx.status &&
            typeof tx.amount === "number" // Ensure amount is a number
        );
        console.log("Fetched transactions:", allTransactions);
        console.log("Valid transactions:", validTransactions);

        // Process transactions
        const processedDataTrx = allTransactions.map((tx) => {
          console.log("dsdsxsxs", tx);

          // const user = validUsers.find((u) => u.id === tx.user);
          // console.log("uddd", user);

          return {
            id: tx.id,
            // user: user ? "user?.username" : "System",
            product: getProductName(tx),
            amount: formatCurrency(tx.amount, tx.currency),
            date: new Date(tx.created_at).toLocaleDateString("en-GB"),
            status: tx.status ? capitalizeFirstLetter(tx.status) : "Completed",
          };
        });

        setAllTransaactionData(processedDataTrx);
      } catch (error) {
        toast.error("Failed to fetch dashboard data. Please try again later.");
        console.error("Fetch dashboard data error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const fetchAllPages = async (endpoint, maxPages = 50) => {
    let allData = [];
    let nextPage = endpoint;
    let pageCount = 0;

    try {
      while (nextPage && pageCount < maxPages) {
        const res = await api.get(nextPage);
        allData = allData.concat(res.data.results || res.data);
        nextPage = res.data.next || null;
        pageCount++;
      }

      if (pageCount >= maxPages) {
        console.warn(`Reached max page limit (${maxPages}) for ${endpoint}`);
      }
    } catch (error) {
      toast.error(`Error fetching data from ${endpoint}`);
      console.error(`Error fetching ${endpoint}:`, error);
    }

    return allData;
  };

  const formatCurrency = (amount, currency = "NGN") => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getProductName = (transaction) => {
    if (transaction.reason) return transaction.reason;
    if (transaction.network) return `${transaction.network} Airtime`;
    if (transaction.cable_name) return `${transaction.cable_name} Cable`;
    return "Service Transaction";
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const editTrx = true;
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredTransactionData.length / itemsPerPage);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleEditClick = (rowData) => {
    setEditData(rowData);
    setShowEdit(true);
    console.log("shit");
  };

  const handleCheckedItemsChange = (newCheckedItems) => {
    setCheckedItems(newCheckedItems);
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
              onPress={() => {}}
              selectedRows={checkedItems} // Pass selected rows
            />
            <div className="rounded-t-[1em] overflow-auto border border-gray-200 min-h-[50vh]">
              <TrxManagementTable
                data={filteredTransactionData}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                setShowEdit={handleEditClick}
                isLoading={isLoading}
                onCheckedItemsChange={handleCheckedItemsChange} // Handle checked items
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
