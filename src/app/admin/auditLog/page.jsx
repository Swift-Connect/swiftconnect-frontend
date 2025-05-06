"use client";

import React, { useEffect, useState } from "react";

import Pagination from "../components/pagination";
import TableTabs from "../components/tableTabs";

import AudtiLogTable from "./component/table";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UsersTable from "./component/usersTable";

const AuditLog = () => {
  const [activeTab, setActiveTab] = useState("Admin");
  const [rawData, setRawData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const usersData = await fetchAllPages("/users/list-users/");
        setUsers(usersData);

        const transactionEndpoints = [
          "/services/cable-recharges-transactions/",
          "/services/data-plan-transactions/",
          "/payments/transactions/",
          "/services/airtime-topups-transactions/"
        ];

        const transactionPromises = transactionEndpoints.map(async (endpoint) => {
          try {
            const data = await fetchAllPages(endpoint);
            return data;
          } catch (error) {
            toast.error(`Error fetching ${endpoint}`);
            return [];
          }
        });

        const transactionResults = await Promise.all(transactionPromises);
        const allTransactions = transactionResults.flat();
        setRawData(allTransactions);
      } catch (error) {
        toast.error("Failed to fetch data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const processData = () => {
      return rawData.map((tx) => {
        const user = users.find((u) => u.id === tx.user);
        return {
          id: tx.id,
          user: user ? user?.username : "System",
          product: getProductName(tx),
          amount: formatCurrency(tx.amount, tx.currency),
          date: new Date(tx.created_at).toLocaleDateString(),
          status: tx.status ? capitalizeFirstLetter(tx.status) : "Completed",
        };
      });
    };

    setProcessedData(processData());
  }, [rawData, users]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleEdit = async (updatedData) => {
    setIsLoading(true);
    try {
      await api.put(`/services/transactions/${updatedData.id}/`, updatedData);
      toast.success("Transaction updated successfully.");
      const updatedRawData = rawData.map((tx) =>
        tx.id === updatedData.id ? updatedData : tx
      );
      setRawData(updatedRawData);
    } catch (error) {
      toast.error("Failed to update transaction. Please try again.");
    } finally {
      setIsLoading(false);
      setShowEdit(false);
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      await api.delete(`/services/transactions/${id}/`);
      toast.success("Transaction deleted successfully.");
      const updatedRawData = rawData.filter((tx) => tx.id !== id);
      setRawData(updatedRawData);
    } catch (error) {
      toast.error("Failed to delete transaction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllPages = async (endpoint) => {
    let allData = [];
    let nextPage = endpoint;
    while (nextPage) {
      try {
        const res = await api.get(nextPage);
        allData = allData.concat(res.data.results || res.data);
        nextPage = res.data.next || null;
      } catch (error) {
        toast.error(`Error fetching data from ${nextPage}`);
        break;
      }
    }
    return allData;
  };

  const getProductName = (transaction) => {
    if (transaction.reason) return transaction.reason;
    if (transaction.network) return `${transaction.network} Airtime`;
    if (transaction.cable_name) return `${transaction.cable_name} Cable`;
    return "Service Transaction";
  };

  const formatCurrency = (amount, currency = "NGN") => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const totalPages =
    activeTab === "Admin"
      ? Math.ceil(processedData.length / itemsPerPage)
      : Math.ceil(users.length / itemsPerPage);

  const paginatedData =
    activeTab === "Admin"
      ? processedData.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )
      : users.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        );

  return (
    <div className="overflow-hidden">
      <div className="max-md-[400px]:hidden">
        <h1 className="text-[16px] font-semibold mb-8">Audit Log</h1>

        <TableTabs
          header={""}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          tabs={["Admin", "Users"]}
          from="transactionManagement"
        />

        {isLoading ? (
          <div className="text-center py-8">Loading data, please wait...</div>
        ) : (
          <>
            <div className="rounded-t-[1em] overflow-auto border border-gray-200 min-h-[50vh]">
              {activeTab === "Admin" ? (
                <AudtiLogTable
                  data={processedData}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  setShowEdit={(rowData) => {
                    setEditData(rowData);
                    setShowEdit(true);
                  }}
                  handleDelete={handleDelete}
                />
              ) : (
                <UsersTable data={users}   
                 currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                setShowEdit={(rowData) => {
                  setEditData(rowData);
                  setShowEdit(true);
                }}
                handleDelete={handleDelete}  />
              )}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </div>
    </div>
  );
};

export default AuditLog;