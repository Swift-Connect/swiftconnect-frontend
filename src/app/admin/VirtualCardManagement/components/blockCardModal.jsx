import React from "react";
import { FaPlus, FaTrashAlt } from "react-icons/fa";

const BlockCardModal = ({ visible, onClose, onSubmit }) => {
  return (
    <div className="flex w-[40%] flex-col items-center p-4 gap-6 rounded-2xl bg-white shadow-md">
      <h1 className="text-[48px] font-bold">Are You Sure?</h1>
      <p className="text-[#6B7280]  text-center">
        Your transfer was completed successfully, and the recipient will receive
        the funds shortly.
      </p>
      <div className="flex gap-3">
        <button className="bg-[#00613A] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
          Block <FaPlus />
        </button>
        <button className="bg-[#8C1823] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2" onClick={onClose}>
          Cancel <FaTrashAlt />
        </button>
      </div>
    </div>
  );
};

export default BlockCardModal;
