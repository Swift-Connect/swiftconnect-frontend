import React, { useState } from "react";

const BecomeAnAgent = ({ onClose }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}> 
      {/* First Modal */}
      {!showConfirmation ? (
        <div
          className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
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
          <button
            onClick={() => setShowConfirmation(true)}
            className="mt-4 w-full bg-black text-white py-3 rounded-lg text-lg"
          >
            Upgrade Package
          </button>
        </div>
      ) : (
        // Second Confirmation Modal
        <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg relative">
          {/* Animated Icon */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
            <img
              src="/rocket.svg"
              alt="Rocket"
              className="w-20 h-20 rounded-full shadow-lg"
            />
          </div>

          <div className="text-center mt-10">
            <h2 className="text-xl font-bold">Become an Agent</h2>
            <p className="text-gray-600 mt-2">
              Pay a one-time fee of <b>₦1500</b> to access the rewards page.
            </p>
          </div>

          {/* Confirmation Button */}
          <button
            onClick={onClose}
            className="mt-6 w-full bg-black text-white py-3 rounded-lg text-lg"
          >
            Ok, Let’s go
          </button>
        </div>
      )}
    </div>
  );
};

export default BecomeAnAgent;
