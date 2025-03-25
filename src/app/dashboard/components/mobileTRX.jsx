import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";

export default function MobileTransactions() {
  // const transactions = [
  //   {
  //     id: 1,
  //     type: "Airtime Recharge",
  //     amount: 200,
  //     date: "Dec 8th, 11:21pm",
  //     status: "Success",
  //     statusColor: "text-green-500",
  //      icon: "/mtn.png", // Replace with actual MTN logo
  //     amountColor: "text-red-500",
  //   },
  //   {
  //     id: 2,
  //     type: "credit",
  //     amount: 20000,
  //     date: "Dec 6th, 10:00am",
  //     status: "Success",
  //     statusColor: "text-green-500",
  //      icon: "/mtn.png", // Replace with actual GTCO logo
  //     amountColor: "text-green-500",
  //   },
  //   {
  //     id: 3,
  //     type: "debit",
  //     amount: 200,
  //     date: "Dec 6th, 12:00am",
  //     status: "Pending",
  //     statusColor: "text-yellow-500",
  //      icon: "/mtn.png", // Replace with actual Wema logo
  //     amountColor: "text-red-500",
  //   },
  //   {
  //     id: 4,
  //     type: "debit",
  //     amount: 200,
  //     date: "Dec 6th, 12:00am",
  //     status: "Pending",
  //     statusColor: "text-yellow-500",
  //      icon: "/mtn.png",
  //     amountColor: "text-red-500",
  //   },
  //   {
  //     id: 5,
  //     type: "debit",
  //     amount: 200,
  //     date: "Dec 6th, 12:00am",
  //     status: "Pending",
  //     statusColor: "text-yellow-500",
  //      icon: "/mtn.png",
  //     amountColor: "text-red-500",
  //   },
  // ];

  const [activeTransactionTab, setActiveTransactionTab] = useState("all");
    const [transactions, setTransactions] = useState([]);
  
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/payments/transactions/");
        console.log("Transactions For Mobile:", response.data);
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);
    const filteredTransactions =
      activeTransactionTab === "all"
        ? transactions
        : activeTransactionTab === "Credit"
        ? transactions.filter((transaction) =>
            // String(transaction?.amount).startsWith("+")
            transaction.transaction_type === "credit" ? transaction.amount : ""
          )
        : transactions.filter((transaction) =>
            transaction.transaction_type === "debit" ? transaction.amount : ""
        );
  
  
  return (
    <div className="max-w-md mx-auto  p-4 md-[400px]:hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Transactions</h2>
        <a href="#" className="text-blue-500 text-sm">
          View All
        </a>
      </div>
      <div className="space-y-4">
        {filteredTransactions.map((transaction, idx) => (
          <div key={idx} className="flex items-center space-x-4">
            <img
              src={transaction.icon}
              alt={transaction.type}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <h3 className="text-sm font-medium">{transaction.type}</h3>
              <p className="text-xs text-gray-500">{transaction.date}</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${transaction.amountColor}`}>
                ₦{transaction.amount.toLocaleString()}
              </p>
              <p
                className={`text-[10px]  ${
                  transaction.type === "debit"
                    ? "bg-[#f9d9d9] text-red-500"
                    : "bg-[#dcfcdc] text-green-500"
                } rounded-full py-[0.3em] px-2 border`}
              >
                {transaction.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
