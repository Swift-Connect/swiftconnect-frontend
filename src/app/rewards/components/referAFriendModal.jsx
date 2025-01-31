import { useState } from "react";
import { ClipboardCopy, Copy } from "lucide-react";
import Image from "next/image";

export default function ReferralModal({ isOpen, onClose }) {
  // if (!isOpen) return null;

  const referralCode = "AKINDEPR";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    alert("Referral code copied!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white w-[90%] max-w-[40%] p-8 rounded-2xl shadow-lg text-center">
        <div className="flex flex-col items-center justify-center mx-[2em]">
          {/* Gift Icon */}
          <div className="flex justify-center mb-4">
            <Image
              src={"giftt.svg"}
              alt="confirmation icon"
              width={16}
              height={16}
              className="w-[8em]"
            />
          </div>

          {/* Title */}
          <h2 className="text-[48px]  font-bold text-gray-900">
            Refer a Friend, Earn Rewards
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-[18px] mt-2">
            Inviting friends to SwiftConnect is easy! Share your unique link and
            earn <strong>₦4,200</strong> for every friend who joins.
          </p>

          {/* Referral Code Box */}
          <div className="flex items-center justify-center w-full gap-4 bg-green-100 rounded-md py-4 mt-4">
            <span className="font-semibold">{referralCode}</span>
            <button
              onClick={copyToClipboard}
              className="text-gray-700 hover:text-black"
            >
              <Copy size={18} />
            </button>
          </div>
        </div>

        {/* Okay Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full bg-black text-white py-4 rounded-md hover:bg-gray-800"
        >
          Okay
        </button>
      </div>
    </div>
  );
}
