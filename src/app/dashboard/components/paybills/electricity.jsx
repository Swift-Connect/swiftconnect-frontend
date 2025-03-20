import Image from "next/image";
import { useState } from "react";
import ConfirmPayment from "./confirmPayment";
import EnterPinModal from "../sendMoney/enterPin";
import SuccessModal from "../sendMoney/successModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleBillsConfirm } from "../../../../utils/handleBillsConfirm";

export default function ElectricityPayment({ setBillType }) {
  const [serviceProvider, setServiceProvider] = useState("");
  const [packageType, setPackageType] = useState("");
  const [metreNumber, setMetreNumber] = useState("");
  const [amount, setAmount] = useState("");

  const [isConfirming, setIsConfirming] = useState(false);
  const [isEnteringPin, setIsEnteringPin] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
     const [pin, setPin] = useState(["", "", "", ""]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "serviceProvider") setServiceProvider(value);
    if (name === "packageType") setPackageType(value);
    if (name === "metreNumber") setMetreNumber(value);
    if (name === "amount") setAmount(value);
  };

  const handlePay = (e) => {
    e.preventDefault();
    if (!serviceProvider || !packageType || !metreNumber || !amount) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsConfirming(true);
  };

  const handleConfirm = () => {
    console.log({
      serviceProvider,
      packageType,
      metreNumber,
      amount,
    });
    setIsEnteringPin(true);
  };

  const handlePinConfirm = (pin) => {
    console.log("Entered PIN:", pin);
    handleBillsConfirm(
      pin,
      {
        meter_number: metreNumber,
        // phone_number: phoneNumber,w
        amount,
      },
      "electricity-transactions/",
      setIsLoading,
      isLoading
    );
  };

  const handleSuccessClose = () => {
    setIsSuccess(false);
    setBillType("dashboard");
  };

  const handleBack = () => {
    setIsConfirming(false);
  };

  return isSuccess ? (
    <SuccessModal onClose={handleSuccessClose} />
  ) : isEnteringPin ? (
    <EnterPinModal
      onConfirm={handlePinConfirm}
      // onNext={() => setIsEnteringPin(false)}
      onClose={() => setIsEnteringPin(false)}
      setPin={setPin}
      pin={pin}
    />
  ) : isConfirming ? (
    <ConfirmPayment
      amount={amount}
      description="Electricity"
      onBack={handleBack}
      onConfirm={handleConfirm}
      metreNumber={metreNumber}
      provider={serviceProvider}
      packageType={packageType}
      setBillType={setBillType}
    />
  ) : (
    <div className="flex justify-center">
      <ToastContainer />
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
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
        <h1 className="text-xl font-semibold mb-6 text-center">Electricity</h1>
        <div className="space-y-4">
          {/* Service Provider */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Provider
            </label>
            <select
              name="serviceProvider"
              value={serviceProvider}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="" disabled>
                Select Provider
              </option>
              <option value="AEDC NG">ABUJA ELECTRICITY DISTRIBUTION</option>
            </select>
          </div>

          {/* Package */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select a Package
            </label>
            <select
              name="packageType"
              value={packageType}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="" disabled>
                Select Package
              </option>
              <option value="AEDC Prepaid Meter">AEDC Prepaid Meter</option>
            </select>
          </div>

          {/* Metre Number */}
          <div className="mb-4">
            <label
              className="block text-sm text-gray-700 mb-2"
              htmlFor="smartcard"
            >
              Metre Number
            </label>
            <input
              name="metreNumber"
              type="text"
              value={metreNumber}
              onChange={handleInputChange}
              placeholder="Enter Metre Number"
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label
              className="block text-sm text-gray-700 mb-2"
              htmlFor="smartcard"
            >
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={amount}
              onChange={handleInputChange}
              placeholder="Enter Amount"
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePay}
            className="mt-6 w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
          >
            Pay
          </button>
        </div>
      </div>
    </div>
  );
}
