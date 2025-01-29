import Image from "next/image";
import React, { useEffect, useState } from "react";

const AddCard = ({ onClose, onBack, narration, username, onNext }) => {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-[45%] p-6">
        <div>
          <div className="flex flex-col mb-8">
            <h1 className="text-[#0E1318] text-[32px] font-bold">Add Card</h1>
            <p className="text-[#9CA3AF] tetx-[24px] w-[80%]">
              To add and verify your card, ₦100 will be charged and saved into
              your plan.
            </p>
          </div>

          <div className="flex justify-between items-center gap-8">
            <button
              className="w-full text-black font-bold border-[1px] border-[#979797] py-4 bg-[#fff] cursor-pointer rounded-lg shadow-sm hover:bg-[#6c6c6c]"
              onClick={onClose}
            >
              Cancel
            </button>{" "}
            <button
              className="w-full text-white py-4 bg-[#000] cursor-pointer rounded-lg shadow-sm hover:bg-[#6c6c6c]"
              onClick={onNext}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCard;
