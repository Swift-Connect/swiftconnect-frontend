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

  return (
    <>

      {/* Original Card Page Content Below */}
      {isSuccess ? (
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
        <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] w-full">
          <div className="bg-white rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center gap-4 max-w-xs w-full border-t-4 border-blue-500 animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <div className="text-2xl font-bold text-gray-800">Coming Soon</div>
            <div className="text-gray-500 text-center text-sm">The Cards feature is almost here. Stay tuned for something amazing!</div>
          </div>
        </div>
      )}
    </>
  );
};

export default CardPage;
