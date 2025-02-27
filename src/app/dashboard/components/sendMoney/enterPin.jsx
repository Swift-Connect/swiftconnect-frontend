import Image from "next/image";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EnterPinModal = ({
  onClose,
  onConfirm,
  onNext,
  addCard,
  message,
  isLoading,
}) => {
  const [pin, setPin] = useState(
    addCard ? ["", "", "", "", "", ""] : ["", "", "", ""]
  );

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.length <= 1) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      // Move to the next input box if the current one is filled
      if (value && index < (addCard ? 5 : 3)) {
        document.getElementById(`pin-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      document.getElementById(`pin-${index - 1}`).focus();
    }
  };

  const isPinComplete = pin.every((digit) => digit !== "");
  if (message) {
    toast.error(message);
  }

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
      // onClick={() => onClose()}
    >
      <ToastContainer />
      <div className="bg-white relative z-50 w-[45%] rounded-xl shadow-lg px-6 py-16 flex items-center justify-center flex-col max-md-[400px]:w-full">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => onClose()}
        >
          <FaTimes size={20} />
        </button>
        <Image
          src={"padlock.svg"}
          alt="padlock"
          width={100}
          height={100}
          className="w-[8em] max-md-[400px]:w-[6em]"
        />
        <h2 className="text-[48px] font-bold text-gray-800 mb-4 max-md-[400px]:text-[32px]">
          Enter PIN
        </h2>
        <p className="text-[16px] text-[#6B7280] w-[50%] max-md-[400px]:w-full text-center mb-10">
          {addCard
            ? "Kindly enter the otp sent to *******2312"
            : "Proceed with your 4 digit pin to complete this process"}
        </p>
        <div className="flex gap-2 justify-center mb-4">
          {pin.map((digit, index) => (
            <input
              key={index}
              id={`pin-${index}`}
              type="password"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength="1"
              className="w-12 h-12 text-center border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-xl"
            />
          ))}
        </div>
        <button
          className={`w-full text-white py-4 rounded-lg shadow-sm ${
            isPinComplete ? "bg-black hover:bg-[#484848]" : "bg-[#d2d2d2]"
          }`}
          disabled={!isPinComplete || isLoading}
          onClick={() => {
            onConfirm(pin.join(""));
            // onNext();
          }}
        >
          Send Funds
        </button>
        {/* <button
          className="w-full text-gray-700 py-4 mt-2 rounded-lg shadow-sm bg-gray-200 hover:bg-gray-300"
          onClick={onClose}
        >
          Cancel
        </button> */}
      </div>
    </div>
  );
};

export default EnterPinModal;
