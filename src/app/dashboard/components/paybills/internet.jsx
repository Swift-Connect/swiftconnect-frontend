import Image from "next/image";
import React, { useEffect, useState } from "react";
import SuccessModal from "../sendMoney/successModal";
import EnterPinModal from "../sendMoney/enterPin";
import ConfirmPayment from "./confirmPayment";
import { handleBillsConfirm } from "../../../../utils/handleBillsConfirm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getData } from "@/api";

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
  const [pin, setPin] = useState(["", "", "", ""]);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [planId, setPlanId] = useState("");
  const [planName, setPlanName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
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

  const handlePinConfirm = async () => {
    const pinString = pin.join(""); // Join the pin array into a single string
    console.log("Entered PIN:", pinString);
    handleBillsConfirm(
      pinString,
      {
        network,
        phone_number: phoneNumber,
        plan_id: planId,
        amount,
      },
      "data-plan-transactions/",
      setIsLoading,
      isLoading
    );
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plans = await getData(
          "services/data-plan-transactions/get_plans/"
        );
        // console.log("...plans returned", plans);
        setAvailablePlans(plans);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    fetchPlans();
  }, []);

  const filteredPlans = availablePlans?.filter(
    (plan) =>
      network && plan.description.toLowerCase().includes(network.toLowerCase())
  );

  // console.log(filteredPlans);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "provider") {
      setDataPlan(value);
      setPlanId(""); // Reset plan when provider changes
      setAmount(""); // Reset amount when provider changes
      setPlanName(""); // Reset plan name when provider changes
    } else if (name === "plan") {
      const selectedPlan = availablePlans.find((p) => p.id === Number(value));
      console.log("selected plan...", selectedPlan);
      setPlanId(value);
      setAmount(selectedPlan?.price || "");
      setPlanName(selectedPlan?.name || "");
      setDataPlan(selectedPlan?.name || ""); // Set dataPlan state
    } else if (name === "smartcard") {
      setSmartcardNumber(value);
    }
  };
  // console.log(filteredPlans);

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
      setPin={setPin}
      pin={pin}
      from="bills"
    />
  ) : isConfirming ? (
    <ConfirmPayment
      network={network}
      dataPlan={planName}
      phoneNumber={phoneNumber}
      amount={amount}
      description={"Data"}
      onBack={handleBack}
      onConfirm={handleConfirm}
      setBillType={setBillType}
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
              <option value="">Select a Network</option>
              <option value="GLO">GLO NG</option>
              <option value="MTN">MTN NG</option>
              <option value="AIRTEL">AIRTEL NG</option>
              <option value="9MOBILE">9MOBILE NG</option>
            </select>
          </div>

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
              <option value="">Select a Data Type</option>
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
              name="plan"
              value={planId}
              onChange={handleInputChange}
            >
              <option value="">Select a Data Plan</option>
              {filteredPlans.map((planItem, index) => (
                <option key={index} value={planItem.id}>
                  {planItem.name} - ₦{planItem.price}
                </option>
              ))}
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
