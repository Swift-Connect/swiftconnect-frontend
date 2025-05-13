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
  setAmount
}) {
  const [narration, setNarration] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white w-[45%] rounded-xl shadow-lg p-6 max-md-[400px]:w-full" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center gap-10 px-4 py-3 border-b ">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-gray-600 flex items-center space-x-2 text-[24px] max-md-[400px]:text-[18px]"
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
            </svg>{" "}
            Back
          </button>
          <h2 className="text-[24px] font-bold text-gray-800 max-md-[400px]:text-[18px]">
            Send to other banks
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Bank Dropdown */}
          <div className="flex items-center gap-5">
            <div className="w-[4em] h-[4em] bg-slate-300 rounded-full"></div>{" "}
            <div>
              <h1 className="text-[24px] font-bold text-[#101010] max-md-[400px]:text-[18px]">
                {name}
              </h1>
              <p className="text-[18px] text-[#6B7280] max-md-[400px]:text-[14px]">
                {acctNum} | {bank}
              </p>
            </div>
          </div>
          {/* Account Number Input */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount
            </label>
            <input
              type="text"
              id="amount"
              onChange={(e)=>setAmount(e.target.value)}
              placeholder="Input the Amount"
              className="w-full mt-1 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none p-4"
            />
          </div>{" "}
          {/* Narration Input */}
          <div>
            <label
              htmlFor="narration"
              className="block text-sm font-medium text-gray-700"
            >
              Narration
            </label>
            <input
              type="text"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              id="narration"
              placeholder="What is this transaction for?"
              className="w-full mt-1 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none p-4"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4">
          <button
            className={
              "w-full text-white py-4 rounded-lg shadow-sm bg-[#000]  "
            }
            onClick={() => {
              setUsername(name);
              setNarrationn(narration);
              onNext();
            }}
            // disabled={isButtonDisabled}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
