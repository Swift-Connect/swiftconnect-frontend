import Image from "next/image";
import React, { useEffect, useState } from "react";

const ConfirmDetials = ({
  onClose,
  onBackSwift,
  onBack,
  narration,
  username,
  accountNumber,
  bankName,
  onNext,
  transferType,
  error,
  onDismissError
}) => {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white max-w-md w-full mx-auto rounded-2xl shadow-2xl p-6 max-md:p-4 flex flex-col gap-6" >
        {/* Header */}
        <div className="flex items-center gap-2 pb-4 border-b">
          <button
            onClick={transferType === 1 ? onBack : onBackSwift}
            className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-base sm:text-lg px-2 py-1 rounded-md focus:outline-none"
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5"
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
            <span className="ml-1">Back</span>
          </button>
          <h2 className="text-base sm:text-lg font-bold text-gray-800">
            Confirm Details
          </h2>
        </div>
        <div className="flex flex-col gap-4 py-2">
          {/* Show all actual details here, pass them as props from previous step */}
          {error && (
            <div className="w-full mb-4 bg-red-100 border border-red-400 text-red-800 px-4 py-2 rounded text-center text-xs flex items-center justify-between">
              <span>{error}</span>
              <button onClick={onDismissError} className="ml-2 text-red-600 font-bold">x</button>
            </div>
          )}
          <div className="flex justify-between text-[#232323] text-sm sm:text-base">
            <span>Recipient</span>
            <span className="font-semibold">{username}</span>
          </div>
          <div className="flex justify-between text-[#232323] text-sm sm:text-base">
            <span>Bank</span>
            <span className="font-semibold">{bankName}</span>
          </div>
          <div className="flex justify-between text-[#232323] text-sm sm:text-base">
            <span>Account Number</span>
            <span className="font-semibold">{accountNumber}</span>
          </div>
          <div className="flex justify-between text-[#232323] text-sm sm:text-base">
            <span>Narration</span>
            <span className="font-semibold">{narration}</span>
          </div>
          <div className="flex justify-between text-[#232323] text-sm sm:text-base">
            <span>Fee</span>
            <span className="font-semibold">Free</span>
          </div>
        </div>
        <button
          className="w-full text-white py-3 rounded-lg shadow-md text-base font-semibold bg-black hover:bg-gray-800 transition-colors duration-200"
          onClick={onNext}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ConfirmDetials;
