import Image from "next/image";
import React, { useState } from "react";
import AddCard from "./components/addCard";
import AddCardForm from "./components/addCardForm";
import EnterPinModal from "../dashboard/components/sendMoney/enterPin";
import SuccessModal from "../dashboard/components/sendMoney/successModal";
import { ArrowBigRight, ChevronRight } from "lucide-react";

const CardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [isEnteringPin, setIsEnteringPin] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const linkedBanks = [
    { bank: "Access Bank", accountNumber: "123453241", name: "Justine Beiber" },
    { bank: "First Bank", accountNumber: "123453241", name: "Juice Wrld" },
  ];

  const handleBankCard = () => {
    setIsModalOpen(true);
  };

  const onClose = () => {
    setIsModalOpen(false);
    setShowAddCardForm(false);
    setIsSuccess(false);
  };

  const onNext = () => {
    setShowAddCardForm(true);
  };

  const handlePayCharges = () => {
    setIsEnteringPin(true);
  };

  const handlePinConfirm = (pin) => {
    console.log("Entered PIN:", pin);
    setIsSuccess(true);
  };

  return isSuccess ? (
    <SuccessModal onClose={onClose} />
  ) : isEnteringPin ? (
    <EnterPinModal
      onConfirm={handlePinConfirm}
      onNext={() => setIsEnteringPin(false)}
      addCard={true}
    />
  ) : showAddCardForm ? (
    <AddCardForm onClose={onClose} handlePayCharges={handlePayCharges} />
  ) : (
    <div
      className={`flex flex-col h-full  ${
        !linkedBanks ? "justify-center items-center" : ""
      } gap-y-[3em] `}
    >
      {linkedBanks.length > 0 ? (
        <div className="h-full flex flex-col gap-[3em]">
          {linkedBanks.map((bank, index) => (
            <div
              key={index}
              className="flex justify-between items-center gap-y-[1em] border p-4 rounded-lg bg-white w-[50%]"
            >
              <div className="flex items-center gap-x-2">
                <div className="w-[3em] h-[3em] rounded-full bg-red-500"></div>
                <h1 className="text-[32px] font-extrabold">{bank.bank}</h1>
              </div>
              <ChevronRight size={32} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-full">
          <Image
            src={"Wallet.svg"}
            alt="mastercard logo"
            width={100}
            height={100}
            className="w-[14em]"
          />
          <p className="text-[#9CA3AF] w-[50%] text-center text-[24px]">
            You haven’t added your card. Tap the plus (+) icon to add one.
          </p>
        </div>
      )}
      <div className="w-full flex justify-end" onClick={handleBankCard}>
        <button>
          <Image
            src={"CrossButton.svg"}
            alt="mastercard logo"
            width={100}
            height={100}
            className="w-[5em] float-right"
          />
        </button>
      </div>
    </div>
  );
};

export default CardPage;
