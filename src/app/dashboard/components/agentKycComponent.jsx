import Image from "next/image";
import React from "react";

const AgentKycComponent = () => {
  return (
    <div className="space-y-4 p-4 bg-gray-50">
      {/* Become an Agent Card */}
      <div className="flex items-center justify-between  bg-white shadow-lg rounded-lg p-4 border border-gray-200">
        <div className="flex items-start space-x-4 w-[60%]">
          <Image
            src="/rocket.svg"
            alt="Agent Icon"
            width={100}
            height={100}
            className="h-[4em] w-[4em]"
          />
          <div>
            <h2 className="text-[18px]  font-bold text-[#000000]">
              Become an Agent — Unlock More Earnings!
            </h2>
            <p className="text-sm text-gray-600">
              Earn commissions, grow your network, and access exclusive tools.
              Upgrade now to maximize your potential!
            </p>
          </div>
        </div>
        <button className="bg-black text-white p-4 rounded-lg w-[20%]  hover:bg-gray-800">
          Become an Agent
        </button>
      </div>

      {/* Complete KYC Card */}
      <div className="flex items-center justify-between bg-white shadow-lg rounded-lg p-4 border border-gray-200">
        <div className="flex items-start space-x-4">
          <Image
            src="/rounded-exclamation.svg"
            alt="Agent Icon"
            width={100}
            height={100}
            className="h-[4em] w-[4em]"
          />
          <div>
            <h2 className="text-lg font-bold text-gray-800">Complete KYC</h2>
            <p className="text-sm text-gray-600">
              Complete your KYC to receive your Swift Connect account number.{" "}
              <a href="/kyc" className="text-orange-500 hover:underline">
                Click here to complete
              </a>
            </p>
          </div>
        </div>
        <button className="bg-orange-500 text-white w-[20%] rounded-lg hover:bg-orange-600 p-4">
          Complete KYC
        </button>
      </div>
    </div>
  );
};

export default AgentKycComponent;
