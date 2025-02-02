import { useState, useRef } from "react";
import { Lock, X } from "lucide-react";
import { FaLock } from "react-icons/fa";

export default function ChangePinModal({ onClose }) {
  const [pin, setPin] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Allow only numbers
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Move focus to the next input field if a digit is entered
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon */}
        <div className="flex justify-center mb-4">
          <Lock className="w-[5em] h-[5em] text-gray-700"/>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 text-center">
          Change PIN
        </h2>
        <p className="text-gray-500 text-center text-sm mb-6">
          Enter your old Swiftconnect PIN
        </p>

        {/* PIN Input Fields */}
        <div className="flex justify-center space-x-3 mb-4">
          {pin.map((digit, index) => (
            <input
              key={index}
              type="password"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        {/* Forgot PIN */}
        <p className="text-center text-gray-500 text-sm">
          Forgot PIN?{" "}
          <button className="text-green-700 font-medium hover:underline">
            Reset your PIN
          </button>
        </p>

        {/* Next Button */}
        <button
          className={`w-full mt-6 py-2 rounded-lg text-white font-semibold transition ${
            pin.includes("")
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={pin.includes("")}
        >
          Next
        </button>
      </div>
    </div>
  );
}
