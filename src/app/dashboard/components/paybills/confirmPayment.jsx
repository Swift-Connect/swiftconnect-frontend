import { Image } from "lucide-react";
import React from "react";

const ConfirmPayment = ({
  network,
  airtimeType,
  phoneNumber,
  amount,
  onBack,
  onConfirm,
}) => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <button
          className="text-gray-500 mb-4 flex items-center"
          onClick={onBack}
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
          <span className="ml-2">Back</span>
        </button>
        <h2 className="text-xl font-semibold mb-6 text-center">
          Confirm Payment
        </h2>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700">Network:</p>
          <p className="text-lg">{network}</p>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700">Airtime Type:</p>
          <p className="text-lg">{airtimeType}</p>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700">Phone Number:</p>
          <p className="text-lg">{phoneNumber}</p>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700">Amount:</p>
          <p className="text-lg">{amount}</p>
        </div>

        <button
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
          onClick={onConfirm}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmPayment;
