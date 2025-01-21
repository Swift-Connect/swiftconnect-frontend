import Image from "next/image";
import React, { useEffect, useState } from "react";

const ConfirmDetials = ({ onClose, onBack, narration, username }) => {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-[45%] p-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-12 pb-8">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-gray-600 flex items-center space-x-2 text-[24px]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Back</span>
          </button>
          <h2 className="text-[24px] font-bold text-gray-800">
            Confirm Details
          </h2>
        </div>
        <div>
          <div className="flex flex-col gap-[3em]">
            <div className="flex justify-between text-[#6B7280] text-[24px]">
              <p>To </p>
              <p>{username}</p>
            </div>{" "}
            <div className="flex justify-between text-[#6B7280] text-[24px]">
              <p>Bank </p>
              <p>Swiftconnect</p>
            </div>
            <div className="flex justify-between text-[#6B7280] text-[24px]">
              <p>Narration </p>
              <p>{narration}</p>
            </div>{" "}
            <div className="flex justify-between text-[#6B7280] text-[24px]">
              <p>Fee </p>
              <p>Free</p>
            </div>
            <div className="flex items-center mb-8 justify-between w-full">
              <p className="text-[#6B7280] text-[24px]">Add as Beneficiary</p>
              <button
                className={`relative w-12 h-6 rounded-full ${
                  isEnabled ? "bg-[#000000]" : "bg-gray-300"
                }`}
                onClick={() => setIsEnabled(!isEnabled)}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                    isEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                ></span>
              </button>
            </div>
          </div>
          <button
            className="w-full text-white py-4 bg-[#000] cursor-pointer rounded-lg shadow-sm hover:bg-[#6c6c6c]"
            disabled
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDetials;
