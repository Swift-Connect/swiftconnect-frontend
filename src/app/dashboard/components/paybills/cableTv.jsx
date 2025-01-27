import React, { useState } from "react";
import ConfirmPayment from "./confirmPayment";
import EnterPinModal from "../sendMoney/enterPin";
import SuccessModal from "../sendMoney/successModal";
import Image from "next/image";

const CableTv = ({ onNext, setBillType }) => {
  const [service, setService] = useState("");
  const [provider, setProvider] = useState("");
  const [plan, setPlan] = useState("");
  const [amount, setAmount] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [isEnteringPin, setIsEnteringPin] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "service") setService(value);
    if (name === "provider") setProvider(value);
    if (name === "plan") setPlan(value);
    if (name === "amount") setAmount(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsConfirming(true);
  };

  const handleConfirm = () => {
    console.log({ service, provider, plan, amount });
    setIsEnteringPin(true);
  };

  const handlePinConfirm = (pin) => {
    console.log("Entered PIN:", pin);
    setIsSuccess(true);
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
      onNext={() => setIsEnteringPin(false)}
    />
  ) : isConfirming ? (
    <ConfirmPayment
      amount={amount}
      description="Cable TV"
      onBack={handleBack}
      onConfirm={handleConfirm}
      service={service}
      provider={provider}
      plan={plan}
    />
  ) : (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
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
        <h2 className="text-xl font-semibold mb-6 text-center">Cable TV</h2>

        <form onSubmit={handleSubmit}>
          {/* Select Service */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Provider
            </label>
            <select
              name="service"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={service}
              onChange={handleInputChange}
            >
              <option value="">Select Service</option>
              <option value="service1">Service 1</option>
              <option value="service2">Service 2</option>
              <option value="service3">Service 3</option>
            </select>
          </div>

          {/* Select Provider */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Provider
            </label>
            <select
              name="provider"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={provider}
              onChange={handleInputChange}
            >
              <option value="">--Select Provider--</option>
              <option value="provider1">Provider 1</option>
              <option value="provider2">Provider 2</option>
              <option value="provider3">Provider 3</option>
            </select>
          </div>

          {/* Select Plan */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Plan
            </label>
            <select
              name="plan"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={plan}
              onChange={handleInputChange}
            >
              <option value="">--Select Plan--</option>
              <option value="plan1">Plan 1</option>
              <option value="plan2">Plan 2</option>
              <option value="plan3">Plan 3</option>
            </select>
          </div>

          {/* Amount */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="text"
              name="amount"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter amount"
              value={amount}
              onChange={handleInputChange}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CableTv;
