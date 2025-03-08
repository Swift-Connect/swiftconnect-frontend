import React, { useEffect, useState } from "react";
import ConfirmPayment from "./confirmPayment";
import EnterPinModal from "../sendMoney/enterPin";
import SuccessModal from "../sendMoney/successModal";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { handleBillsConfirm } from "../../../../utils/handleBillsConfirm";
import { getData, validateSmartCard } from "../../../../api/index";

const CableTv = ({ onNext, setBillType }) => {
  const [provider, setProvider] = useState("");
  const [plan, setPlan] = useState("");
  const [availablePlans, setAvailablePlans] = useState([]);
  const [amount, setAmount] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnteringPin, setIsEnteringPin] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [smartcardNumber, setSmartcardNumber] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [planName, setPlanName] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "provider") {
      setProvider(value);
      setPlan(""); // Reset plan when provider changes
      setAmount(""); // Reset amount when provider changes
      setPlanName(""); // Reset plan name when provider changes
    } else if (name === "plan") {
      const selectedPlan = availablePlans.find((p) => p.id === Number(value));
      console.log("selected plan...", selectedPlan);
      setPlan(value);
      setAmount(selectedPlan?.price || "");
      setPlanName(selectedPlan?.name || "");
    } else if (name === "smartcard") {
      setSmartcardNumber(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!provider || !plan || !amount || !smartcardNumber) {
      console.log({ provider, plan, amount });
      toast.error("Please fill in all fields");
      return;
    }
    setIsConfirming(true);
  };

  const handleConfirm = () => {
    console.log({ provider, plan, amount });
    setIsEnteringPin(true);
  };

  const handlePinConfirm = (pin) => {
    console.log("Entered PIN:", pin);
    handleBillsConfirm(
      pin,
      {
        cable_name: provider,
        plan_id: plan,
        smart_card_number: smartcardNumber,
      },
      "cable-recharges-transactions/",
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

  const validateSmartcardNumber = async () => {
    if (!smartcardNumber || !provider) {
      setCustomerName("");
      return;
    }
    try {
      const data = await validateSmartCard(smartcardNumber, provider);

      setCustomerName(data.customer_name);
    } catch (error) {
      toast.error("Invalid smart card number");
      setCustomerName("");
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plans = await getData(
          "services/cable-recharges-transactions/get_plans/"
        );
        console.log("...plans returned", plans);
        setAvailablePlans(plans);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    fetchPlans();
  }, []);

  const filteredPlans = availablePlans?.filter(
    (plan) =>
      provider && plan.name.toLowerCase().includes(provider.toLowerCase())
  );

  return isSuccess ? (
    <SuccessModal onClose={handleSuccessClose} />
  ) : isEnteringPin ? (
    <EnterPinModal
      onConfirm={handlePinConfirm}
      onClose={() => setIsEnteringPin(false)}
    />
  ) : isConfirming ? (
    <ConfirmPayment
      amount={amount}
      description="Cable TV"
      onBack={handleBack}
      onConfirm={handleConfirm}
      provider={provider}
      plan={planName}
    />
  ) : (
    <div className="flex justify-center">
      <ToastContainer />
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
              <option value="">Select a Provider</option>
              <option value="DSTV">DSTV NG</option>
              <option value="GOTV">GOTV</option>
              <option value="STARTIME">Startimes</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              className="block text-sm text-gray-700 mb-2"
              htmlFor="smartcard"
            >
              Smartcard Number
            </label>
            <input
              type="text"
              id="smartcard"
              name="smartcard"
              onChange={handleInputChange}
              placeholder={`Enter ${provider} smartcard number`}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-green-200"
            />
            {customerName != "" ? (
              <p className="text-green-600 text-sm mt-2">✔ {customerName}</p>
            ) : (
              ""
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Package
            </label>
            <select
              name="plan"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={plan}
              onChange={handleInputChange}
            >
              <option value="">Select Package</option>
              {filteredPlans.map((planItem, index) => (
                <option key={index} value={planItem.id}>
                  {planItem.name} - ₦{planItem.price}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="text"
              name="amount"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="₦ 0.00"
              value={amount}
              disabled
              onChange={handleInputChange}
            />
          </div>

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
