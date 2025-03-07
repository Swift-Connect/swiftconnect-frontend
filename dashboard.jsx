import React from 'react';
// ...existing code...

const TransactionRow = ({ transaction, idx }) => (
  <tr
    key={idx}
    className={`border-t ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
  >
    <td className="py-[1.3em] px-[1.8em] font-semibold text-[#232323]">
      {transaction.reason === "Wallet funding" ? "Transfer" : ""}
    </td>
    <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
      #{transaction.transaction_id}
    </td>
    {/* ...other table cells... */}
  </tr>
);

// ...existing code...

const Dashboard = () => {
  // ...existing code...

  return (
    // ...existing code...
    <thead>
      <tr className="bg-light-gray text-left text-dark-gray">
        <th className="py-4 px-6">Product</th>
        <th className="py-4 px-6">Transaction ID</th>
        <th className="py-4 px-6">Date</th>
        <th className="py-4 px-6">Amount</th>
        <th className="py-4 px-6">Status</th>
        <th className="py-4 px-6">Receipt</th>
      </tr>
    </thead>
    <tbody>
      {filteredTransactions.map((transaction, idx) => (
        <TransactionRow key={idx} transaction={transaction} idx={idx} />
      ))}
    </tbody>
    // ...existing code...
  );
};

// ...existing code...
export default Dashboard;
