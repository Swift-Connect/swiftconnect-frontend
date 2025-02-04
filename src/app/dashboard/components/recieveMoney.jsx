"use client";

import { useState } from "react";
import { FaTimes, FaShareAlt, FaCopy } from "react-icons/fa";

const ReceiveMoneyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const accounts = [
    { bank: "GTB", account: "239 118 5161" },
    { bank: "UBA", account: "239 118 5161" },
    { bank: "ACCESS BANK", account: "239 118 5161" },
    { bank: "SWIFT CONNECT", account: "239 118 5161" },
    { bank: "SWIFT CONNECT", account: "239 118 5161" },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Receive Money</h2>
          <button onClick={onClose}>
            <FaTimes className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <p className="text-gray-600 mb-4">Receive funds from any Local Bank</p>

        <div className="space-y-4">
          {accounts.map((account, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-100 p-4 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center">
                  <div className="w-6 h-6 border-4 border-green-600 border-opacity-50 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    PRAISE AKINDE • {account.bank}
                  </p>
                  <p className="text-lg font-bold">{account.account}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button>
                  <FaShareAlt className="text-gray-500 hover:text-gray-700" />
                </button>
                <button>
                  <FaCopy className="text-gray-500 hover:text-gray-700" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReceiveMoneyModal;
