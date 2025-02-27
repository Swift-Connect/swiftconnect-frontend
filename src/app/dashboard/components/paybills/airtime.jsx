import React, { useEffect, useState } from "react";
import ConfirmPayment from "./confirmPayment";
import EnterPinModal from "../sendMoney/enterPin";
import SuccessModal from "../sendMoney/successModal";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Airtime = ({ onNext, setBillType }) => {
  const [network, setNetwork] = useState("GLO");
  const [airtimeType, setAirtimeType] = useState("VTU");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [isEnteringPin, setIsEnteringPin] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  //   const [BT, setPayBillsType] = useState();

  //   useEffect(() => {
  //     setBillType(BT);
  //   }, [BT]);

  const handlePay = () => {
    if (!network || !airtimeType || !phoneNumber || !amount) {
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

  // const handlePinConfirm = (pin) => {
  //   console.log("Entered PIN:", pin);
  //   setIsSuccess(true);
  // };
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  // const [transactionPin, setTransactionPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handlePinConfirm = async (pin) => {
    console.log("Entered PIN:", pin);
    // setTransactionPin(pin);
    // setIsPinModalOpen(false);

    // Make the API request with the entered PIN
    setIsLoading(true);
    const loadingToast = toast.loading("Processing payment...");
    try {
      const response = await fetch(
        "https://swiftconnect-backend.onrender.com/services/airtime-topups-transactions/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Transaction-PIN": pin,
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            network,

            phone_number: phoneNumber,
            amount,
          }),
        }
      );
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        toast.update(loadingToast, {
          render: "Payment processed successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        // window.location.href = data.payment_link;
      } else {
        console.log(data);

        toast.update(loadingToast, {
          render: data.detail || "Failed to process payment",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
      console.log(data);
    } catch (err) {
      toast.update(loadingToast, {
        render: "Fetch error: " + err.message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
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
      // onNext={() => setIsEnteringPin(false)}
      onClose={() => setIsEnteringPin(false)}
    />
  ) : isConfirming ? (
    <ConfirmPayment
      network={network}
      airtimeType={airtimeType}
      phoneNumber={phoneNumber}
      amount={amount}
      onBack={handleBack}
      onConfirm={handleConfirm}
    />
  ) : (
    <div className="min-h-screen flex justify-center items-center">
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
            <option value="GLO">GLO</option>
            <option value="MTN">MTN</option>
            <option value="AIRTEL">AIRTEL</option>
            <option value="9MOBILE">9MOBILE</option>
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
            <option value="Recharge PIN">Recharge PIN</option>
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
