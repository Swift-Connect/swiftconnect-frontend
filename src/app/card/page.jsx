"use client";
import Image from "next/image";
import React, { useState } from "react";
import AddCard from "./components/addCard";
import AddCardForm from "./components/addCardForm";
import EnterPinModal from "../dashboard/components/sendMoney/enterPin";
import SuccessModal from "../dashboard/components/sendMoney/successModal";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [isEnteringPin, setIsEnteringPin] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
   const [pin, setPin] = useState(["", "", "", ""]);

  const linkedBanks = [
    { bank: "Access Bank", accountNumber: "123453241", name: "Justine Beiber" },
    { bank: "First Bank", accountNumber: "123453241", name: "Juice Wrld" },
  ];

  const handleBankCard = () => {
    setIsModalOpen(true);
    console.log("Add Card");
  };

  const onClose = () => {
 
    setIsEnteringPin(false);
    setIsModalOpen(false);
    setShowAddCardForm(false);
    setIsSuccess(false);
    setSelectedBank(null);
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

  const handleCardClick = (bank) => {
    setSelectedBank(bank);
  };

  return isSuccess ? (
    <SuccessModal onClose={onClose} />
  ) : isEnteringPin ? (
    <EnterPinModal
      onConfirm={handlePinConfirm}
      onNext={() => setIsEnteringPin(false)}
      addCard={true}
      onClose={onClose}
      setPin={setPin}
      pin={pin}
    />
  ) : showAddCardForm ? (
    <AddCardForm onClose={onClose} handlePayCharges={handlePayCharges} />
  ) : isModalOpen ? (
    <AddCard onClose={onClose} onNext={onNext} />
  ) : (
    <div
      className={`flex flex-col h-full  ${
        !linkedBanks ? "justify-center items-center" : ""
      } gap-y-[3em] `}
    >
      {selectedBank ? (
        <div className="flex flex-col  h-full">
          <button
            className="text-sm text-gray-600 mb-4 flex items-center"
            onClick={onClose}
          >
            <ChevronLeft size={32} />
            Back
          </button>
          <div className="flex items-center  gap-x-2 mb-6">
            <div className="w-[3em] h-[3em] rounded-full bg-red-500"></div>
            <h1 className="text-[42px] font-bold ">{selectedBank.bank}</h1>
          </div>
          <div className="flex gap-[4em] max-md-[400px]:flex-col max-md-[400px]:gap-2">
            <p className="font-bold">Account Details</p>
            <div className="bg-white p-4 w-[30%] rounded-lg border border-[#c7c7c7] max-md-[400px]:w-fit">
              <p className="text-[24px] ">{selectedBank.accountNumber}</p>
              <p className="text-[14px] mb-2 uppercase">{selectedBank.name}</p>
            </div>
          </div>
        </div>
      ) : linkedBanks.length > 0 ? (
        <div className="h-full flex flex-col gap-[3em] w-full  ">
          {linkedBanks.map((bank, index) => (
            <div
              key={index}
              className="flex justify-between hover:cursor-pointer hover:bg-[#dedede] items-center gap-y-[1em] border px-4 py-8 rounded-lg bg-white w-[50%] max-md-[400px]:w-full"
              onClick={() => handleCardClick(bank)}
            >
              <div className="flex items-center gap-x-2 ">
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

      {/* Add Card Button */}
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
