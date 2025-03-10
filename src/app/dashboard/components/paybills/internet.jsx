import Image from "next/image";
import React, { useState } from "react";
import SuccessModal from "../sendMoney/successModal";
import EnterPinModal from "../sendMoney/enterPin";
import ConfirmPayment from "./confirmPayment";
import { handleBillsConfirm } from "../../../../utils/handleBillsConfirm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Internet = ({ onNext, setBillType }) => {
  const [network, setNetwork] = useState("");
  const [dataPlan, setDataPlan] = useState("");
  const [dataType, setDataType] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [isEnteringPin, setIsEnteringPin] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // setIsConfirming(true);
    // console.log(dataPlan);
    if (!network || !dataPlan || !dataType || !phoneNumber || !amount) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsConfirming(true);
    console.log({ network, dataPlan, dataType, phoneNumber, amount });
  };

  const handleConfirm = () => {
    console.log({ network, dataPlan, dataType, phoneNumber, amount });
    setIsEnteringPin(true);
  };

  const handleSuccessClose = () => {
    setIsSuccess(false);
    setBillType("dashboard");
    // onNext();
  };
  const handleBack = () => {
    setIsConfirming(false);
  };

  const handlePinConfirm = async (pin) => {
   
    handleBillsConfirm(
      pin,
      {
        network,
        phone_number: phoneNumber,
        amount,
      },
      "data-plan-transactions/",
      setIsLoading,
      isLoading
    );
  };

  return isSuccess ? (
    <SuccessModal
      onClose={handleSuccessClose}
      //   setPayBillsType={setBillType}
    />
  ) : isEnteringPin ? (
    <EnterPinModal
      onConfirm={handlePinConfirm}
      // onNext={() => setIsEnteringPin(false)}
      onClose={() => setIsEnteringPin(false)}
      isLoading={isLoading}
    />
  ) : isConfirming ? (
    <ConfirmPayment
      network={network}
      dataPlan={dataPlan}
      phoneNumber={phoneNumber}
      amount={amount}
      description={"Data"}
      onBack={handleBack}
      onConfirm={handleConfirm}
    />
  ) : (
    <div className="min-h-screen flex justify-center items-center">
      <ToastContainer />
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <button
          className="text-gray-500 mb-4 flex items-center"
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
        <h2 className="text-xl font-semibold mb-6 text-center">Internet</h2>

        <form onSubmit={handleSubmit}>
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
              <option value="Select a Network">Select a Network</option>
              <option value="GLO">GLO NG</option>
              <option value="MTN">MTN NG</option>
              <option value="AIRTEL">AIRTEL NG</option>
              <option value="9MOBILE">9MOBILE NG</option>
            </select>
          </div>

          {/* Select Airtime Type
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Airtime Type
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2"
              value={airtimeType}
              onChange={(e) => setAirtimeType(e.target.value)}
            >
              <option value="">--Select Airtime Type--</option>
              <option value="prepaid">Prepaid</option>
              <option value="postpaid">Postpaid</option>
            </select>
          </div> */}

          {/* Select Data Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Data Type
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2"
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
            >
              <option value="Select a Data Type">Select a Data Type</option>
              <option value="VTU">VTU</option>
              <option value="VTU">VTU</option>
              <option value="VTU">VTU</option>
            </select>
          </div>
          {/* Select Data Plan*/}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Data Plan
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2"
              value={dataPlan}
              onChange={(e) => setDataPlan(e.target.value)}
            >
              <option value="Select a Data Plan">Select a Data Plan</option>
              <option value="1.35GB for 7 days #500">
                1.35GB for 7 days #500
              </option>
              <option value="2.9GB for 30 days #1000">
                2.9GB for 30 days #1000
              </option>
              <option value="4.5GB for 30 days #2000">
                4.5GB for 30 days #2000
              </option>
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
            // onClick={handlePay}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Internet;
