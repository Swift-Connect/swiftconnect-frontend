import React from "react";
import { FaPlus, FaTrashAlt } from "react-icons/fa";

const TransactionLimitModal = ({ visible, onClose, onSubmit }) => {
  return (
    <div
      className="flex w-[40%] flex-col items-center py-4 px-10 gap-6 rounded-2xl bg-white shadow-md"
    
    >
      <h1 className="text-[48px] font-bold">Transaction Limit</h1>
      <p className="text-[#6B7280]  text-center">
        The daily limit for this user card is $300,000,000
      </p>
      <div className="flex flex-col gap-3 text-[#A7A7A7]   w-full">
        <div className="flex justify-between items-center">
          <p>min</p>
          <p>max</p>
        </div>
        <input type="range" className="w-full accent-green-500" />
        <div className="flex justify-between items-center">
          <p>$0</p>
          <p>$250,000</p>
          <p>$500,000</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionLimitModal;
