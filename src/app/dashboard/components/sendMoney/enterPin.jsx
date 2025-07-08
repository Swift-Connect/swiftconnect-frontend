import Image from "next/image";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";

const EnterPinModal = ({
  onClose,
  onConfirm,
  onConfirmTopUp,
  onNext,
  addCard,
  message,
  isLoading,
  setPin,
  pin,
  handleSubmit,
  from,
}) => {
  

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.length <= 1) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin); // Set the pin as an array of strings

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

  const isPinComplete = pin?.every((digit) => digit !== "");

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center w-full bg-black bg-opacity-50"
      onClick={() => onClose()}
    >
      <div
        className="bg-white relative z-50 w-[50%] rounded-xl shadow-lg px-6 py-12 flex items-center justify-center flex-col max-md-[400px]:w-full"
        onClick={(e) => e.stopPropagation()}
      >
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
          className="w-[6em] max-md-[400px]:w-[4em]"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-2 max-md-[400px]:text-xl">
          Enter PIN
        </h2>
        <p className="text-sm text-[#6B7280] w-[80%] max-md-[400px]:w-full text-center mb-6">
          {addCard
            ? "Kindly enter the otp sent to *******2312"
            : "Proceed with your 4 digit pin to complete this process"}
        </p>
        {message && (
          <div className="w-full mb-2 bg-red-100 border border-red-400 text-red-800 px-4 py-2 rounded text-center text-xs">
            {message}
          </div>
        )}
        <div className="flex gap-2 justify-center mb-4">
          {pin?.map((digit, index) => (
            <input
              key={index}
              id={`pin-${index}`}
              type="password"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength="1"
              className={`w-10 h-10 text-center border rounded-md focus:ring-blue-500 focus:border-blue-500 text-base ${
                message ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          ))}
        </div>
        <button
          className={`w-full text-white py-3 rounded-lg shadow-sm text-sm ${
            isPinComplete ? "bg-black hover:bg-[#484848]" : "bg-[#d2d2d2]"
          }`}
          disabled={!isPinComplete || isLoading}
          onClick={
            from === "bills"
              ? onConfirm
              : from === "top up"
              ? onConfirmTopUp
              : (e) => {
                  handleSubmit(e);
                }
          }
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default EnterPinModal;
