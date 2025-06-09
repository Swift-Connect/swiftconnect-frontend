import React, { useEffect, useState } from "react";
import ConfirmPayment from "./confirmPayment";
import EnterPinModal from "../sendMoney/enterPin";
import Image from "next/image";
import { handleBillsConfirm } from "@/utils/handleBillsConfirm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import html2canvas from 'html2canvas';

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
  const [paymentData, setPaymentData] = useState(null);

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    const getOrdinalSuffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${day}${getOrdinalSuffix(day)} ${month} ${year}, ${hours}:${minutes}`;
  };

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
    setIsEnteringPin(true);
  };

  const handlePinConfirm = async () => {
    const pinString = pin.join("");
    try {
      const response = await handleBillsConfirm(
        pinString,
        {
          network,
          phone_number: phoneNumber,
          amount,
        },
        "airtime-topups-transactions/",
        setIsLoading
      );

      console.log("Payment response:", response);
      
      if (response?.status === "success" && response?.transaction) {
        const transactionData = response.transaction;
        
        // Build payment data from response
        setPaymentData({
          transaction: {
            amount: transactionData.amount,
            network: transactionData.network,
            phone_number: transactionData.phone_number,
            // transaction_id: transactionData.transaction_id,
            reference: transactionData.reference,
            status: transactionData.status,
            service_name: transactionData.service_name,
            created_at: transactionData.created_at,
            wallet_balance: transactionData.wallet_balance
          }
        });

        // Reset states and show success
        setPin(["", "", "", ""]);
        setIsConfirming(false);
        setIsEnteringPin(false);
        setIsSuccess(true); // This will trigger showing the success modal
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
    setPaymentData(null);
    setBillType("dashboard");
  };

  const handleDownloadReceipt = async () => {
    const receiptElement = document.getElementById('receipt-container');
    if (receiptElement) {
      try {
        const canvas = await html2canvas(receiptElement);
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `airtime-receipt-${paymentData?.transaction?.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading receipt:', error);
        toast.error('Failed to download receipt');
      }
    }
  };

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
      {isSuccess ? (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 w-full">
          <div id="receipt-container" className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
              <p className="text-gray-600">Your airtime purchase was successful</p>
              <p className="text-sm text-gray-500 mt-2">A receipt has been sent to your email</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Transaction Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">₦{paymentData?.transaction?.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Network:</span>
                  <span className="font-medium">{paymentData?.transaction?.network}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone Number:</span>
                  <span className="font-medium">{paymentData?.transaction?.phone_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium">{paymentData?.transaction?.transaction_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference:</span>
                  <span className="font-medium">{paymentData?.transaction?.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">{paymentData?.transaction?.service_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{formatDate(new Date(paymentData?.transaction?.created_at))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium capitalize">{paymentData?.transaction?.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wallet Balance:</span>
                  <span className="font-medium">₦{paymentData?.transaction?.wallet_balance}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleDownloadReceipt}
                className="flex-1 bg-gray-100 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
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
            network={network}
            airtimeType={airtimeType}
            phoneNumber={phoneNumber}
            amount={amount}
            onBack={handleBack}
            onConfirm={handleConfirm}
            description={"Airtime"}
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
      )}
    </div>
  );
};

export default Airtime;
