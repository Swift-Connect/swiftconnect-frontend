"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import SendMoneyModal from "./sendMoney/sendMoney";
import SwiftConnectModal from "./sendMoney/sendtoSwiftConnect/sendMoneyTo";
import ConfirmDetials from "./sendMoney/confirmDetails";
import EnterPinModal from "./sendMoney/enterPin";
import SuccessModal from "./sendMoney/successModal";
import SendToOtherBanksModal from "./sendMoney/sendToOtherBank/SendToOtherBank";
import SendToOtherBanksModalSecondStep from "./sendMoney/sendToOtherBank/sendToOtherBankSecond";
import ReceiveMoneyModal from "./recieveMoney";

export default function WalletCard() {
  const [cardNumber] = useState("**** 3241");
  const [balance] = useState("N22,880.50");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState("main");
  const [narration, setNarration] = useState();
  const [username, setUsername] = useState();
  const [name, setName] = useState();
  const [acctNum, setAcctNum] = useState();
    const [isRecieveMoneyModalOpen, setIsRecieveMoneyModalOpen] =
      useState(false);

  useEffect(() => {
    console.log(currentView);
  }, [currentView]);

  const onConfirm = (pin) => {
    console.log(pin);
  };

  const renderModalContent = () => {
    switch (currentView) {
      case "main":
        return (
          <SendMoneyModal
            isOpen={isModalOpen}
            setView={setCurrentView}
            onClose={() => setIsModalOpen(false)}
          />
        );
      case "swiftConnect":
        return (
          <SwiftConnectModal
            onClose={() => setIsModalOpen(false)}
            onBack={() => setCurrentView("main")}
            onNext={() => setCurrentView("confirmDetails")}
            setNarrationn={setNarration}
            setUsername={setUsername}
          />
        );
      case "toOtherBank":
        return (
          <SendToOtherBanksModal
            onClose={() => setIsModalOpen(false)}
            onBack={() => setCurrentView("main")}
            onNext={() => setCurrentView("ToOtherBankSecondStep")}
            setName={setName}
            setAcctNum={setAcctNum}
          />
        );
      case "ToOtherBankSecondStep":
        return (
          <SendToOtherBanksModalSecondStep
            onClose={() => setIsModalOpen(false)}
            onBack={() => setCurrentView("toOtherBank")}
            name={name}
            acctNum={acctNum}
            setNarrationn={setNarration}
            setUsername={setUsername}
            onNext={() => setCurrentView("confirmDetails")}
          />
        );
      case "confirmDetails":
        return (
          <ConfirmDetials
            onClose={() => setIsModalOpen(false)}
            onBack={() =>
              currentView === "swiftConnect"
                ? setCurrentView("swiftConnect")
                : setCurrentView("toOtherBank")
            }
            narration={narration}
            username={username}
            onNext={() => setCurrentView("enterPin")}
          />
        );
      case "enterPin":
        return (
          <EnterPinModal
            onConfirm={onConfirm}
            onNext={() => setCurrentView("success")}
          />
        );
      case "success":
        return <SuccessModal onClose={() => setIsModalOpen(false)} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-md-[400px]:p-4 bg-[#ffffff]  rounded-[1.5em] border-[0.5px] border-[#efefef] max-w-s w-[50%] max-md-[400px]:w-full  flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-[18px]">Total Balance</p>
          <p className="text-[36px] font-semibold text-gray-900 max-md-[400px]:text-[24px]">
            {balance}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Image
            src={"mastercard.svg"}
            alt="mastercard logo"
            width={100}
            height={100}
            className="w-[2.4em]"
          />
          <span className="text-gray-500 text-[18px]">{cardNumber}</span>
        </div>
      </div>
      <div className="flex gap-4 mt-4 text-[#104F01] ">
        <button
          className="flex-1 bg-[#D3F1CC] py-4 rounded-lg font-bold shadow hover:bg-green-200 max-md-[400px]:py-2"
          onClick={() => setIsModalOpen(true)}
        >
          Send <span className="ml-1">↑</span>
        </button>
        <button
          className="flex-1 bg-[#D3F1CC] py-2 rounded-lg font-bold shadow hover:bg-green-200"
          onClick={() => setIsRecieveMoneyModalOpen(true)}
        >
          Receive <span className="ml-1">↓</span>
        </button>
      </div>
      {isModalOpen && renderModalContent()}
      <ReceiveMoneyModal
        isOpen={isRecieveMoneyModalOpen}
        onClose={() => setIsRecieveMoneyModalOpen(false)}
      />
    </div>
  );
}
