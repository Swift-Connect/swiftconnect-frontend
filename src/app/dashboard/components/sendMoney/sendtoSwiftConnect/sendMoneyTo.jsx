import Image from "next/image";
import React, { useEffect, useState } from "react";

const SwiftConnectModal = ({
  onClose,
  onBack,
  onNext,
  setNarrationn,
  setUsername,
  setInputValue,
  setAmount,
  inputValue,
  amount,
  narration,
  error,
  isLoadingRecipient = false,
  setIsLoadingRecipient = () => {},
}) => {
  const [sendTo, setSendTo] = useState("Account Number");
  
  
  
  const [isLoading, setIsLoading] = useState(false);
  const [matchedAccount, setMatchedAccount] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    // setIsLoading(true);
  };

  useEffect(() => {
    if (inputValue && amount && !isLoadingRecipient) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [inputValue, amount, isLoadingRecipient]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white max-w-lg w-full mx-auto rounded-2xl shadow-2xl p-6 max-md:p-4 flex flex-col gap-6" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center gap-2 pb-4 border-b">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-base sm:text-lg px-2 py-1 rounded-md focus:outline-none"
            disabled={isLoadingRecipient}
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
            Send to Swift Connect Account
          </h2>
        </div>
        {/* Optionally add a switch for sendTo type here if needed */}
        {/* Form */}
        <div className="space-y-6 mt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {sendTo === "email" ? "" : "email"}
            </label>
            <input
              type="email"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={`Type in the email of the recipient.`}
              className="mt-1 block w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3 text-base"
              disabled={isLoadingRecipient}
            />
            <div className="flex mt-2 gap-2 items-center min-h-[1.5em]">
              {isLoadingRecipient && <span className="text-blue-500 animate-pulse">Validating recipient...</span>}
              {/* Show recipient after validation if available */}
              {!isLoadingRecipient && inputValue && !error && (
                <span className="text-green-600 text-sm">Recipient email looks valid.</span>
              )}
              {error && !isLoadingRecipient && (
                <span className="text-red-500 text-sm">{error}</span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="How much do you want to send?"
              className="mt-1 block w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3 text-base"
              disabled={isLoadingRecipient}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Narration
            </label>
            <input
              type="text"
              value={narration}
              onChange={(e) => setNarrationn(e.target.value)}
              placeholder="What is this transaction for?"
              className="mt-1 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-4"
              disabled={isLoadingRecipient}
            />
          </div>

          {/* Footer */}
          <div className="px-6 py-4">
            <button
              className={`w-full text-white py-4 rounded-lg shadow-sm ${
                isButtonDisabled || isLoadingRecipient
                  ? "bg-[#d2d2d2] cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
              }`}
              disabled={isButtonDisabled || isLoadingRecipient}
              onClick={onNext}
            >
              {isLoadingRecipient ? (
                <span className="flex items-center justify-center"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>Validating...</span>
              ) : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwiftConnectModal;
