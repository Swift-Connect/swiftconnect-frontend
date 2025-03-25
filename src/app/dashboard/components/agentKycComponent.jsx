import Image from "next/image";
import React, { useState } from "react";
import BecomeAnAgent from "./becomeAnAgent";

const AgentKycComponent = ({ setActiveSidebar, kycVerified }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      {isOpen && <BecomeAnAgent onClose={() => setIsOpen(false)} />}
      <div className="space-y-4 pt-4 bg-gray-5 w-[90%] max-md-[400px]:w-full">
        {/* Become an Agent Card */}
        <div
          className="flex items-center justify-between bg-white shadow-lg rounded-[1.4em] p-4 border border-gray-200"
          onClick={() => setIsOpen(true)}
        >
          <div className="flex items-start space-x-4 w-[60%] max-md-[400px]:w-full">
            <Image
              src="/rocket.svg"
              alt="Agent Icon"
              width={100}
              height={100}
              className="h-[4em] w-[4em] max-md-[400px]:w-[2em] max-md-[400px]:h-[2em]"
            />
            <div>
              <h2 className="text-[18px]  font-bold text-[#000000] max-md-[400px]:text-[14px]">
                Become an Agent{" "}
                <span className="max-md-[400px]:hidden">
                  {" "}
                  — Unlock More Earnings!{" "}
                </span>
              </h2>
              <p className="text-[14px] text-[#525252] max-md-[400px]:text-[10px]">
                Earn commissions, grow your network, and access exclusive tools.
                Upgrade now to maximize your potential!
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-black text-white p-4 rounded-lg w-[20%]  max-md-[400px]:hidden  hover:bg-gray-800"
          >
            Become an Agent
          </button>
        </div>

        {/* Complete KYC Card */}
        <div
          className={`flex items-center justify-between bg-white shadow-lg rounded-[1.4em] p-4 border border-gray-200 ${
            kycVerified ? "hidden" : ""
          }`}
        >
          <div className="flex items-start space-x-4">
            <Image
              src="/rounded-exclamation.svg"
              alt="Agent Icon"
              width={100}
              height={100}
              className="h-[4em] w-[4em] max-md-[400px]:w-[2em] max-md-[400px]:h-[2em]"
            />
            <div>
              <h2 className="text-[18px]  font-bold text-[#000000]  max-md-[400px]:text-[14px]">
                Complete KYC
              </h2>
              <p className="text-[14px] text-[#525252] max-md-[400px]:text-[10px]">
                Complete your KYC to receive your Swift Connect account number.{" "}
                <span
                  onClick={() => setActiveSidebar("KYC")}
                  className="text-orange-500 hover:underline"
                >
                  Click here to complete
                </span>
              </p>
            </div>
          </div>
          <button
            className="bg-orange-500 text-white w-[20%] rounded-lg hover:bg-orange-600 p-4 max-md-[400px]:hidden  "
            onClick={() => setActiveSidebar("KYC")}
          >
            Complete KYC
          </button>
        </div>
      </div>
    </>
  );
};

export default AgentKycComponent;
