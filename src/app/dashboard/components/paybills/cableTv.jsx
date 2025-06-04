import React, { useEffect, useState } from "react";
import ConfirmPayment from "./confirmPayment";
import EnterPinModal from "../sendMoney/enterPin";
import SuccessModal from "../sendMoney/successModal";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { handleBillsConfirm } from "../../../../utils/handleBillsConfirm";
import { getData } from "../../../../api/index";
import api from "@/utils/api";

const CableTv = ({ onNext, setBillType }) => {
  const [provider, setProvider] = useState("");
  const [plan, setPlan] = useState("");
  const [availablePlans, setAvailablePlans] = useState([]);
  const [amount, setAmount] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnteringPin, setIsEnteringPin] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [smartcardNumber, setSmartcardNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [planName, setPlanName] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  // Fetch user data from local storage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const { phone_number } = JSON.parse(userData);
      setPhoneNumber(phone_number || "");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "provider") {
      setProvider(value);
      setPlan(""); // Reset plan when provider changes
      setAmount(""); // Reset amount when provider changes
      setPlanName(""); // Reset plan name when provider changes
      setVerificationData(null); // Reset verification data when provider changes
    } else if (name === "plan") {
      const selectedPlan = availablePlans.find((p) => p.id === Number(value));
      setPlan(value);
      setAmount(selectedPlan?.price || "");
      setPlanName(selectedPlan?.name || "");
    } else if (name === "smartcard") {
      setSmartcardNumber(value);
      setVerificationData(null); // Reset verification data when smartcard changes
    }
  };

  const handleVerifySmartcard = async (e) => {
    e.preventDefault();
    if (!provider || !smartcardNumber) {
      toast.error("Please select a provider and enter smartcard number");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch('/api/verify-smartcard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          smartCardNumber: smartcardNumber,
          cableName: provider
        })
      });

      const data = await response.json();
      console.log("Verification response:", data);

      if (data.status === 'success' && !data.data.invalid) {
        setVerificationData({
          customer_name: data.data.name,
          smartcard_number: smartcardNumber,
          status: "Active"
        });
        setShowVerificationModal(true);
        toast.success("Smartcard verified successfully");
      } else {
        toast.error("Invalid smartcard number");
        setVerificationData(null);
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Failed to verify smartcard");
      setVerificationData(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleConfirm = () => {
    setIsEnteringPin(true);
  };

  const handlePinConfirm = async () => {
    const pinString = pin.join("");
    try {
      const data = await handleBillsConfirm(
        pinString,
        {
          cable_name: provider,
          plan_id: plan,
          smart_card_number: smartcardNumber,
          phone_number: phoneNumber
        },
        "cable-recharges-transactions/",
        setIsLoading
      );

      if (data) {
        setPin(["", "", "", ""]);
        setIsEnteringPin(false);
        setIsConfirming(false);
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPin(["", "", "", ""]);
      setIsEnteringPin(false);
      setIsConfirming(false);
    }
  };

  const handleSuccessClose = () => {
    setIsSuccess(false);
    setBillType("dashboard");
  };

  const handleBack = () => {
    setIsConfirming(false);
  };

  const handleVerifyAgain = () => {
    setVerificationData(null);
    setShowVerificationModal(false);
    setIsConfirming(false);
    setSmartcardNumber("");
    setPlan("");
    setAmount("");
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plans = await getData(
          "services/cable-recharges-transactions/get_plans/"
        );
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

  const VerificationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Verification Details</h2>
          <button
            onClick={() => setShowVerificationModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Customer Name</p>
                <p className="font-medium">{verificationData?.customer_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Smartcard Number</p>
                <p className="font-medium">{verificationData?.smartcard_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Provider</p>
                <p className="font-medium">{provider}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium">{verificationData?.status || "Active"}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleVerifyAgain}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Verify Again
            </button>
            <button
              onClick={() => {
                setShowVerificationModal(false);
                setIsConfirming(true);
              }}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return isSuccess ? (
    <SuccessModal onClose={handleSuccessClose} />
  ) : isEnteringPin ? (
    <EnterPinModal
      onConfirm={handlePinConfirm}
      onClose={() => setIsEnteringPin(false)}
      setPin={setPin}
      pin={pin}
      from="bills"
    />
  ) : isConfirming ? (
    <ConfirmPayment
      amount={amount}
      description="Cable TV"
      onBack={handleBack}
      onConfirm={handleConfirm}
      provider={provider}
      plan={planName}
      setBillType={setBillType}
    />
  ) : (
    <div className="flex justify-center">
      <ToastContainer />
      {showVerificationModal && <VerificationModal />}
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

        <form onSubmit={handleVerifySmartcard}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Provider
            </label>
            <select
              name="provider"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={provider}
              onChange={handleInputChange}
              required
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
              value={smartcardNumber}
              onChange={handleInputChange}
              placeholder={`Enter ${provider} smartcard number`}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-green-200"
              required
            />
          </div>

          {verificationData && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Package
                </label>
                <select
                  name="plan"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={plan}
                  onChange={handleInputChange}
                  required
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
            </>
          )}

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Verifying...
              </div>
            ) : verificationData ? (
              "Verify Again"
            ) : (
              "Verify Smartcard"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CableTv;
