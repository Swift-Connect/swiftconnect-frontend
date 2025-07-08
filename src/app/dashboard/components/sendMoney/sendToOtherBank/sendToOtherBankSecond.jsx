import { useState, useEffect } from "react";
import Image from "next/image";

export default function SendToOtherBanksModalSecondStep({
  onBack,
  onClose,
  onNext,
  name,
  bank,
  acctNum,
  setNarrationn,
  setUsername,
  setAmount,
  error,
  onDismissError
}) {
  const [narration, setNarration] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white max-w-md w-full mx-auto rounded-2xl shadow-2xl p-6 max-md:p-4 flex flex-col gap-6" onClick={(e) => e.stopPropagation()}>
        {error && (
          <div className="w-full mb-4 bg-red-100 border border-red-400 text-red-800 px-4 py-2 rounded text-center text-xs flex items-center justify-between">
            <span>{error}</span>
            <button onClick={onDismissError} className="ml-2 text-red-600 font-bold">x</button>
          </div>
        )}
        {/* Header */}
        <div className="flex items-center gap-2 pb-4 border-b">
          <button
            onClick={onBack}
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
            Send to other banks
          </h2>
        </div>
        {/* Content */}
        <div className="flex flex-col gap-4 py-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center text-lg font-bold text-gray-700">
              {/* Optionally show bank logo here */}
            </div>
            <div>
              <h1 className="text-base font-bold text-[#101010]">{name}</h1>
              <p className="text-sm text-[#6B7280]">{acctNum} | {bank}</p>
            </div>
          </div>
          <div className="flex justify-between text-[#232323] text-sm sm:text-base">
            <span>Bank</span>
            <span className="font-semibold">{bank}</span>
          </div>
          <div className="flex justify-between text-[#232323] text-sm sm:text-base">
            <span>Account Number</span>
            <span className="font-semibold">{acctNum}</span>
          </div>
          <div className="flex justify-between text-[#232323] text-sm sm:text-base">
            <span>Recipient</span>
            <span className="font-semibold">{name}</span>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="amount" className="block text-xs font-medium text-gray-700">Amount</label>
            <input
              type="text"
              id="amount"
              onChange={(e)=>setAmount(e.target.value)}
              placeholder="Input the Amount"
              className="w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none p-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="narration" className="block text-xs font-medium text-gray-700">Narration</label>
            <input
              type="text"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              id="narration"
              placeholder="What is this transaction for?"
              className="w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none p-2 text-sm"
            />
          </div>
          <div className="flex justify-between text-[#232323] text-sm sm:text-base">
            <span>Fee</span>
            <span className="font-semibold">Free</span>
          </div>
        </div>
        {/* Footer */}
        <button
          className="w-full text-white py-3 rounded-lg shadow-md text-base font-semibold bg-black hover:bg-gray-800 transition-colors duration-200 mt-2"
          onClick={() => {
            setUsername(name);
            setNarrationn(narration);
            onNext({ username: name, accountNumber: acctNum, bankName: bank });
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
