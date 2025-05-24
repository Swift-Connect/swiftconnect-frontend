import React, { useEffect, useState } from "react";
import ConfirmPayment from "./confirmPayment";
import EnterPinModal from "../sendMoney/enterPin";
import SuccessModal from "../sendMoney/successModal";
import Image from "next/image";
import { handleBillsConfirm } from "@/utils/handleBillsConfirm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Airtime = ({ onNext, setBillType }) => {
  const [network, setNetwork] = useState("GLO");
  const [airtimeType, setAirtimeType] = useState("VTU");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isEnteringPin, setIsEnteringPin] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);
  //   const [BT, setPayBillsType] = useState();

  //   useEffect(() => {
  //     setBillType(BT);
  //   }, [BT]);

  const handlePay = () => {
    if (!network || !airtimeType || !phoneNumber || !amount) {
      // console.log({ provider, plan, amount });
      toast.error("Please fill in all fields");
      return;
    }
    setIsConfirming(true);
  };

  const handleBack = () => {
    setIsConfirming(false);
  };

  const handleConfirm = () => {
    console.log({ network, airtimeType, phoneNumber, amount });
    setIsEnteringPin(true);
  };

  const handlePinConfirm = () => {
    const pinString = pin.join(""); // Join the pin array into a single string
    console.log("Entered PIN:", pinString);
    handleBillsConfirm(
      pinString, // Pass the pin as a string
      {
        network,
        phone_number: phoneNumber,
        amount,
      },
      "airtime-topups-transactions/",
      setIsLoading
    );
    // setIsSuccess(true);
  };

  const handleSuccessClose = () => {
    setIsSuccess(false);
    setBillType("dashboard");
    // onNext();
  };

  return isSuccess ? (
    <SuccessModal
      onClose={handleSuccessClose}
      //   setPayBillsType={setBillType}
    />
  ) : isEnteringPin ? (
    <EnterPinModal
      onConfirm={handlePinConfirm}
      onNext={() => setIsEnteringPin(false)}
      onClose={() => setIsEnteringPin(false)}
      setPin={setPin}
      pin={pin}
      from="bills"
    />
  ) : isConfirming ? (
    <ConfirmPayment
      network={network}
      airtimeType={airtimeType}
      phoneNumber={phoneNumber}
      amount={amount}
      onBack={handleBack}
      onConfirm={handleConfirm}
      description={"Airtime"}
    />
  ) : (
    <div className="  flex justify-center items-center">
      <ToastContainer />
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <button
          className="text-sm text-gray-600 mb-4 flex items-center"
          onClick={() => setBillType("dashboard")}
        >
          <Image
            src={"backArrow.svg"}
            alt="confirmation icon"
            width={16}
            height={16}
            className="w-[0.6em]"
          />
          <span className="ml-2">Back</span>
        </button>
        <h2 className="text-xl font-semibold mb-6 text-center">Airtime</h2>

        {/* Select Network */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select a Network
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg p-2"
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
          >
            <option value="GLO">GLO NG</option>
            <option value="MTN">MTN NG</option>
            <option value="AIRTEL">AIRTEL NG</option>
            <option value="9MOBILE">9MOBILE NG</option>
          </select>
        </div>

        {/* Select Airtime Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Airtime Type
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg p-2"
            value={airtimeType}
            onChange={(e) => setAirtimeType(e.target.value)}
          >
            <option value="VTU">VTU</option>
            {/* <option value="Recharge PIN">Recharge PIN</option> */}
          </select>
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            className="w-full border border-gray-300 rounded-lg p-2"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        {/* Amount */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-2"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Pay Button */}
        <button
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
          onClick={handlePay}
        >
          Pay
        </button>
      </div>
    </div>
  );
};

export default Airtime;
