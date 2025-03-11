import React, { useState } from "react";

const BecomeAnAgent = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Become an Agent</h2>
          <button onClick={onClose} className="text-gray-500 text-xl">
            &times;
          </button>
        </div>

        {/* Select Input */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Reseller Package
          </label>
          <select className="mt-1 block w-full p-3 border rounded-lg bg-gray-100 text-gray-600">
            <option>Select a Reseller Package</option>
          </select>
        </div>

        {/* Warning Message */}
        <p className="text-orange-600 flex items-center mt-2 text-sm">
          ⚠ This will attract a fee of <b className="ml-1">₦1500</b>
        </p>

        {/* Upgrade Button */}
        <button className="mt-4 w-full bg-black text-white py-3 rounded-lg text-lg">
          Upgrade Package
        </button>
      </div>
    </div>
  );
};

export default BecomeAnAgent;
