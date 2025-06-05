"use client"
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
  const [planName, setPlanName] = useState("");
  const [availablePlans, setAvailablePlans] = useState([]);
  const [amount, setAmount] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnteringPin, setIsEnteringPin] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [smartcardNumber, setSmartcardNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
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
      const selectedPlan = availablePlans.find((p) => p.name === value);
      setPlan(value);
      setAmount(selectedPlan?.price || "");
      setPlanName(selectedPlan?.name || "");
    } else if (name === "smartcard") {
      setSmartcardNumber(value);
      setVerificationData(null); // Reset verification data when smartcard changes
    } else if (name === "phoneNumber") {
      setPhoneNumber(value);
    }
  };

  const handleVerifySmartcard = async () => {
    if (!smartcardNumber) {
      toast.error("Please enter your smartcard number");
      return;
    }

    if (!provider) {
      toast.error("Please select a provider");
      return;
    }

    setIsVerifying(true);
    const loadingToast = toast.loading("Verifying smartcard...");
    
    try {
      const response = await fetch("/api/verify-smartcard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          smart_card_number: smartcardNumber,
          cablename: provider,
        }),
      });

      const data = await response.json();
      console.log("Verification response:", data);

      toast.dismiss(loadingToast);

      if (data.status === 'success' && !data.data.invalid) {
        setVerificationData({
          customer_name: data.data.name,
          smartcard_number: smartcardNumber,
          provider: provider,
          status: "Active"
        });
        setShowVerificationModal(true);
        toast.success("Smartcard verified successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        const errorMessage = data.message || "Failed to verify smartcard";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setVerificationData(null);
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to verify smartcard", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setVerificationData(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePay = () => {
    if (!provider) {
      toast.error("Please select a provider");
      return;
    }
    if (!plan) {
      toast.error("Please select a plan");
      return;
    }
    if (!smartcardNumber) {
      toast.error("Please enter your smartcard number");
      return;
    }
    if (!amount) {
      toast.error("Please enter an amount");
      return;
    }
    handleVerifySmartcard();
  };

  const handleConfirm = () => {
    setIsEnteringPin(true);
  };

  const handlePinConfirm = async () => {
    const pinString = pin.join("");
    try {
      const response = await handleBillsConfirm(
        pinString,
        {
          cable_name: provider,
          plan_id: plan,
          smart_card_number: smartcardNumber,
        },
        "cable-recharges-transactions/",
        setIsLoading
      );

      console.log("Payment response:", response);

      if (response.error) {
        console.log("Payment error:", response.error);
        setIsConfirming(true);
        return;
      }

      if (response.data) {
        setIsConfirming(false);
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPin(["", "", "", ""]);
      setIsEnteringPin(false);
      setIsConfirming(false);
    } finally {
      setIsLoading(false);
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
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
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
                <p className="font-medium">{verificationData?.provider}</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleVerifyAgain}
              className="flex-1 bg-gray-100 text-gray-800 py-1 px-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              Verify Again
            </button>
            <button
              onClick={() => {
                setShowVerificationModal(false);
                setIsConfirming(true);
              }}
              className="flex-1 bg-black text-white py-1 px-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ConfirmationModal = () => {
    // Find the selected plan's details
    const selectedPlanData = availablePlans.find(p => p.name === plan);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Confirm Payment</h2>
            <button
              onClick={() => setIsConfirming(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Provider</p>
                  <p className="font-medium">{provider}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Plan</p>
                  <p className="font-medium">{selectedPlanData?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Smartcard Number</p>
                  <p className="font-medium">{smartcardNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-medium">₦{amount}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <button
                onClick={() => setIsConfirming(false)}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-2.5 bg-black text-white rounded-md hover:bg-gray-800 transition-all duration-200 font-medium"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handlePlanChange = (e) => {
    const selectedPlan = e.target.value;
    setPlanName(selectedPlan);
    // Find the selected plan's amount and ID from the plans array
    const selectedPlanData = availablePlans.find(p => p.name === selectedPlan);
    if (selectedPlanData) {
      setAmount(selectedPlanData.price);
      setPlan(selectedPlanData.id);
    }
  };

  const handleProviderChange = (e) => {
    const selectedProvider = e.target.value;
    setProvider(selectedProvider);
    setPlan(""); // Reset plan ID
    setPlanName(""); // Reset plan name
    setAmount(""); // Reset amount
    setVerificationData(null); // Reset verification data
  };

  return (
    <div className="flex justify-center">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {showVerificationModal && <VerificationModal />}
      {isSuccess ? (
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
        <ConfirmationModal />
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
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
          <h2 className="text-xl font-semibold mb-6 text-center">Cable TV</h2>
          <form onSubmit={(e) => { e.preventDefault(); handlePay(); }}>
            <div className="space-y-4">
              <div>
                <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">
                  Provider
                </label>
                <select
                  id="provider"
                  value={provider}
                  onChange={handleProviderChange}
                  className="w-full py-1.5 px-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                >
                  <option value="">Select a provider</option>
                  <option value="dstv">DSTV</option>
                  <option value="gotv">GOTV</option>
                  <option value="startimes">Startimes</option>
                </select>
              </div>

              {provider && (
                <div>
                  <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Plan
                  </label>
                  <select
                    id="plan"
                    value={planName}
                    onChange={handlePlanChange}
                    className="w-full py-1.5 px-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  >
                    <option value="">Select a plan</option>
                    {filteredPlans?.map((plan) => (
                      <option key={plan.id} value={plan.name}>
                        {plan.name} - ₦{plan.price}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Smartcard Number
                </label>
                <input
                  type="text"
                  name="smartcard"
                  value={smartcardNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your smartcard number"
                  required
                />
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
                  placeholder="Amount will be set based on plan"
                  disabled
                  required
                />
              </div>

              <div className="mt-6">
                <button
                  onClick={handlePay}
                  disabled={isVerifying || isLoading}
                  className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                    isVerifying || isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800"
                  }`}
                >
                  {isVerifying ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </div>
                  ) : isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    "Pay Now"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CableTv;
