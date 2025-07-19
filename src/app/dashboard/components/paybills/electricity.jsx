"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import ConfirmPayment from "./confirmPayment";
import EnterPinModal from "../sendMoney/enterPin";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleBillsConfirm } from "../../../../utils/handleBillsConfirm";
import api from "@/utils/api";
import html2canvas from "html2canvas";

export default function ElectricityPayment({ setBillType }) {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedMeterType, setSelectedMeterType] = useState("");
  const [metreNumber, setMetreNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationData, setVerificationData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const [isConfirming, setIsConfirming] = useState(false);
  const [isEnteringPin, setIsEnteringPin] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);

  // Fetch user data from local storage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const { phone_number } = JSON.parse(userData);
      setPhoneNumber(phone_number || "");
    }
  }, []);

  // Fetch electricity providers
  useEffect(() => {
    const fetchProviders = async () => {
      setIsLoadingProviders(true);
      try {
        const response = await api.get(
          "/services/electricity-transactions/providers/"
        );
        if (response.data.status === "success") {
          setProviders(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to fetch electricity providers");
        console.error("Error fetching providers:", error);
      } finally {
        setIsLoadingProviders(false);
      }
    };

    fetchProviders();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "selectedProvider") {
      setSelectedProvider(value);
      setSelectedMeterType(""); // Reset meter type when provider changes
      setVerificationData(null); // Reset verification data when provider changes
    }
    if (name === "selectedMeterType") {
      setSelectedMeterType(value);
      setVerificationData(null); // Reset verification data when meter type changes
    }
    if (name === "metreNumber") {
      setMetreNumber(value);
      setVerificationData(null); // Reset verification data when meter number changes
    }
    if (name === "amount") setAmount(value);
    if (name === "phoneNumber") setPhoneNumber(value);
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (
      !selectedProvider ||
      !selectedMeterType ||
      !metreNumber ||
      !amount ||
      !phoneNumber
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Verify meter first
    setIsVerifying(true);
    try {
      const response = await api.post(
        "/services/electricity-transactions/verify_meter/",
        {
          meter_number: metreNumber,
          amount: amount,
          provider: selectedProvider,
          meter_type: selectedMeterType,
          phone_number: phoneNumber,
        }
      );

      if (response.data.status === "success") {
        setVerificationData(response.data.data);
        setShowVerificationModal(true);
        toast.success("Meter verified successfully");
      } else {
        if (Array.isArray(response.data.message)) {
          response.data.message.forEach((message) => {
            toast.error(message);
          });
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error("Verification error:", error);
      if (Array.isArray(error.response?.data)) {
        error.response.data.forEach((message) => {
          toast.error(message);
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to verify meter");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleConfirm = () => {
    setIsEnteringPin(true);
  };

  const handlePinConfirm = async () => {
    const loadingToast = toast.loading("Processing payment...");
    const pinString = pin.join("");
    try {
      const data = await handleBillsConfirm(
        pinString,
        {
          meter_number: metreNumber,
          amount,
          provider: selectedProvider,
          meter_type: selectedMeterType,
          phone_number: phoneNumber,
        },
        "electricity-transactions/",
        setIsLoading
      );

      console.log("Payment response:", data);

      if (data.success) {
        setPaymentData({
          transaction: {
            amount: data.amount,
            meter_number: data.meter_number,
            provider: data.provider,
            id: data.id,
            created_at: data.created_at,
            transaction_id: data.transaction_id,
            status: data.status,
            total_amount: data.total_amount,
            commission: data.commission,
          },
          receipt: {
            token: data.token,
            units: data.units,
            customer_name: data.customer_name,
            customer_address: data.customer_address,
            reference: data.reference,
            meter_category: data.meter_category,
            meter_type: data.meter_type,
            product_name: data.product_name,
          },
        });

        setPin(["", "", "", ""]);
        setIsEnteringPin(false);
        setIsConfirming(false);
        setIsSuccess(true);
      }

      toast.update(loadingToast, {
        render: data?.error || "An error occurred while processing payment",
        type: "error",
        isLoading: false,
        autoClose: false,
      });
    } catch (error) {
      console.error("Payment error:", error);
      setPin(["", "", "", ""]);
      setIsEnteringPin(false);
      setIsConfirming(false);
      toast.update(loadingToast, {
        render: error.message || "An error occurred while processing payment",
        type: "error",
        isLoading: false,
        autoClose: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setIsSuccess(false);
    setPaymentData(null);
    setBillType("dashboard");
  };

  const handleBack = () => {
    setIsConfirming(false);
  };

  const handleVerifyAgain = () => {
    setVerificationData(null);
    setShowVerificationModal(false);
    setIsConfirming(false);
    setMetreNumber("");
    setAmount("");
  };

  const handleDownloadReceipt = async () => {
    const receiptElement = document.getElementById("receipt-container");
    if (receiptElement) {
      try {
        const canvas = await html2canvas(receiptElement);
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `electricity-receipt-${paymentData?.transaction?.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error downloading receipt:", error);
        toast.error("Failed to download receipt");
      }
    }
  };

  const VerificationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Verification Details</h2>
          <button
            onClick={() => setShowVerificationModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
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
                <p className="text-sm text-gray-600">Meter Number</p>
                <p className="font-medium">{verificationData?.meter_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Provider</p>
                <p className="font-medium">{verificationData?.provider_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Meter Type</p>
                <p className="font-medium">{verificationData?.meter_type}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium">
                {verificationData?.customer_address}
              </p>
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

  return (
    <div className="flex justify-center w-full">
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
        style={{ zIndex: 9999 }}
      />
      {showVerificationModal && <VerificationModal />}
      {isSuccess ? (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 w-full">
          <div
            id="receipt-container"
            className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-600">
                Your electricity purchase was successful
              </p>
              <p className="text-sm text-gray-500 mt-2">
                A receipt has been sent to your email
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Transaction Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-medium">
                    ₦{paymentData?.transaction?.amount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Meter Number:</span>
                  <span className="font-medium">
                    {paymentData?.transaction?.meter_number}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Provider:</span>
                  <span className="font-medium">
                    {paymentData?.transaction?.provider}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium">
                    {paymentData?.transaction?.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {new Date(
                      paymentData?.transaction?.created_at
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Receipt Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Token:</span>
                  <span className="font-medium">
                    {paymentData?.receipt?.token}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Units:</span>
                  <span className="font-medium">
                    {paymentData?.receipt?.units}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer Name:</span>
                  <span className="font-medium">
                    {paymentData?.receipt?.customer_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-medium">
                    {paymentData?.receipt?.customer_address}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference:</span>
                  <span className="font-medium">
                    {paymentData?.receipt?.reference}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Wallet Update
              </h3>
              <div className="flex justify-between">
                <span className="text-gray-600">New Balance:</span>
                <span className="font-medium">
                  ₦{paymentData?.wallet?.new_balance}
                </span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleDownloadReceipt}
                className="flex-1 bg-gray-100 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Receipt
              </button>
              <button
                onClick={handleSuccessClose}
                className="flex-1 bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : isEnteringPin ? (
        <div className="w-full">
          <EnterPinModal
            onConfirm={handlePinConfirm}
            onClose={() => setIsEnteringPin(false)}
            setPin={setPin}
            pin={pin}
            from="bills"
          />
        </div>
      ) : isConfirming ? (
        <div className="w-full">
          <ConfirmPayment
            amount={amount}
            description="Electricity"
            onBack={handleBack}
            onConfirm={handleConfirm}
            metreNumber={metreNumber}
            provider={selectedProvider}
            packageType={selectedMeterType}
            setBillType={setBillType}
          />
        </div>
      ) : (
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
          <h1 className="text-xl font-semibold mb-6 text-center">
            Electricity
          </h1>
          <div className="space-y-4">
            {/* Provider Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Provider
              </label>
              <select
                name="selectedProvider"
                value={selectedProvider}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2"
                required
                disabled={isLoadingProviders}
              >
                <option value="">Select a provider</option>
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
              {isLoadingProviders && (
                <div className="mt-2 flex justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                </div>
              )}
            </div>

            {/* Meter Type Selection */}
            {selectedProvider && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meter Type
                </label>
                <select
                  name="selectedMeterType"
                  value={selectedMeterType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                  disabled={isLoadingProviders}
                >
                  <option value="">Select meter type</option>
                  {providers
                    .find((p) => p.id === selectedProvider)
                    ?.meter_types.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Meter Number */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meter Number
              </label>
              <input
                name="metreNumber"
                type="text"
                value={metreNumber}
                onChange={handleInputChange}
                placeholder="Enter meter number"
                className="w-full border border-gray-300 rounded-lg p-2"
                required
                disabled={isVerifying}
              />
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                name="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className="w-full border border-gray-300 rounded-lg p-2"
                required
                disabled={isVerifying}
              />
            </div>

            {/* Amount */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₦)
              </label>
              <input
                type="number"
                name="amount"
                value={amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                className="w-full border border-gray-300 rounded-lg p-2"
                min="0"
                step="0.01"
                required
                disabled={isVerifying}
              />
            </div>

            {/* Pay Button */}
            <button
              onClick={verificationData ? handleConfirm : handlePay}
              disabled={isVerifying || isLoadingProviders}
              className="mt-6 w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : verificationData ? (
                "Proceed to Pay"
              ) : (
                "Verify Meter"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
