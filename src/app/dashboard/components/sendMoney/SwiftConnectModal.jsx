import React, { useState } from "react";

const SwiftConnectModal = ({ onClose, onBack }) => {
  const [sendTo, setSendTo] = useState("Account Number");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg  p-[2em]">
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
            Send to Swift Connect Account
          </h2>
        </div>
        <div className="flex gap-4 mt-4 pb-8">
          <h2
            className={`text-[20px] text-[gray] rounded-[4em] cursor-pointer py-[0.5em] px-[1em] ${
              sendTo === "Account Number"
                ? "bg-[#d2d2d2]   text-[#0E1318] font-bold"
                : "hover:bg-gray-200"
            }`}
            onClick={() => setSendTo("Account Number")}
          >
            Account Number
          </h2>
          <h2
            className={`text-[20px] text-[gray] cursor-pointer rounded-[4em]  py-[0.5em] px-[1em] ${
              sendTo === "username"
                ? "bg-[#d2d2d2]  text-[#0E1318] font-bold"
                : "hover:bg-gray-200"
            }`}
            onClick={() => setSendTo("username")}
          >
            @username
          </h2>
        </div>
        {/* Form */}
        <div className="space-y-4 mt-4">
          {sendTo === "Account Number" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account Number
              </label>
              <input
                type="text"
                placeholder="Type in the Account number of the recipient."
                className="mt-1 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-4"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                placeholder="Type in the username of the recipient."
                className="mt-1 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-4"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="text"
              placeholder="How much do you want to send?"
              className="mt-1 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Narration
            </label>
            <input
              type="text"
              placeholder="What is this transaction for?"
              className="mt-1 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-4"
            />
          </div>

          <button
            className="w-full text-white py-4 bg-[#d2d2d2] rounded-lg shadow-sm hover:bg-blue-600"
            disabled
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwiftConnectModal;
