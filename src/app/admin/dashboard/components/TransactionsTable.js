
const TransactionsTable = () => {
  const columns = ["ID", "User", "Product", "Amount", "Date", "Status"];
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

  return (
    <>
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No Transactions yet
        </div>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#F9F8FA] text-left text-[#525252]">
              <th className="py-[1.3em] px-[1.8em]">Product</th>
              <th className="py-[1.3em] px-[1.8em]">Transaction ID</th>
              <th className="py-[1.3em] px-[1.8em]">Date</th>
              <th className="py-[1.3em] px-[1.8em]">Amount</th>
              <th className="py-[1.3em] px-[1.8em]">Status</th>
              <th className="py-[1.3em] px-[1.8em]">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {data.map((transaction, idx) => (
              <tr
                key={idx}
                className={`border-t ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="py-[1.3em] px-[1.8em] font-semibold text-[#232323]">
                  {transaction.product}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  #{transaction.id}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {new Date(transaction.date).toLocaleDateString("en-GB")}
                </td>
                <td
                  className={`py-[1.3em] px-[1.8em] font-medium text-${
                    transaction.status === "Completed" ? "green" : "red"
                  }-600`}
                >
                  {transaction.status === "Completed" ? "+" : "-"}₦
                  {transaction.amount}
                </td>
                <td className="py-[1.3em] px-[1.8em]">
                  <div
                    className={`py-1 text-center text-xs font-medium rounded-full ${
                      transaction.status === "Completed"
                        ? "bg-green-100 text-green-600"
                        : transaction.status === "Failed"
                        ? "bg-red-100 text-red-600"
                        : transaction.status === "Pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : transaction.status === "Refunded"
                        ? "bg-[#52525233] text-[#525252]"
                        : ""
                    }`}
                  >
                    {transaction.status}
                  </div>
                </td>
                <td className="py-[1.3em] px-[1.8em]">
                  <button className="text-green-600 text-sm font-semibold">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default TransactionsTable;
