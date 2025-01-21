"use client";

import Image from "next/image";
import { useState } from "react";
import SendMoneyModal from "./sendMoney/sendToSwiftConnectAccount";
import SwiftConnectModal from "./sendMoney/sendMoneyTo";
import ConfirmDetials from "./sendMoney/confirmDetails";
import EnterPinModal from "./sendMoney/enterPin";
// import { FaChevronDown } from "react-icons/fa";

export default function WalletCard() {
  const [cardNumber] = useState("**** 3241");
  const [balance] = useState("N22,880.50");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState("main");
  const [narration, setNarration] = useState();
  const [username, setUsername] = useState();

  return (
    <div className="p-8 bg-[#ffffff] rounded-[1.5em] border-[0.5px] border-[#efefef] max-w-s w-[50%] flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-[18px]">Total Balance</p>
          <p className="text-[36px] font-semibold text-gray-900">{balance}</p>
        </div>
        <div className="flex items-center gap-2">
          <Image
            src={"mastercard.svg"}
            alt="mastercard logo"
            width={100}
            height={100}
            className="
         w-[2.4em]"
          />
          <span className="text-gray-500 text-[18px]">{cardNumber}</span>
          {/* <FaChevronDown className="text-gray-500 text-sm" /> */}
        </div>
      </div>
      <div className="flex gap-4 mt-4 text-[#104F01] ">
        <button
          className="flex-1 bg-[#D3F1CC] py-4  rounded-lg font-bold shadow hover:bg-green-200"
          onClick={() => setIsModalOpen(true)}
        >
          Send <span className="ml-1">↑</span>
        </button>
        <button className="flex-1 bg-[#D3F1CC] py-2 rounded-lg font-bold shadow hover:bg-green-200">
          Receive <span className="ml-1">↓</span>
        </button>
      </div>
      {isModalOpen && (
        <>
          {currentView === "main" && (
            <SendMoneyModal
              isOpen={isModalOpen}
              onNext={() => setCurrentView("swiftConnect")}
              onClose={() => setIsModalOpen(false)}
            />
          )}
          {currentView === "swiftConnect" && (
            <SwiftConnectModal
              onClose={isModalOpen}
              onBack={() => setCurrentView("main")}
              onNext={() => setCurrentView("confirmDetails")}
              setNarrationn={setNarration}
              setUsername={setUsername}
            />
          )}
          {currentView === "confirmDetails" && (
            <ConfirmDetials
              onClose={isModalOpen}
              onBack={() => setCurrentView("swiftConnect")}
              narration={narration}
              username={username}
              onNext={() => setCurrentView("enterPin")}
            />
          )}
          {currentView === "enterPin" && (
            <EnterPinModal
            //   onClose={isModalOpen}
            //   onBack={() => setCurrentView("swiftConnect")}
            //   narration={narration}
            //   username={username}
            //   onNext={() => setCurrentView("enterPin")}
            />
          )}
        </>
      )}
    </div>
  );
}
