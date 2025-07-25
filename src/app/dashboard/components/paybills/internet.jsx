import Image from "next/image";
import React, { useEffect, useState } from "react";
import SuccessModal from "../sendMoney/successModal";
import EnterPinModal from "../sendMoney/enterPin";
import ConfirmPayment from "./confirmPayment";
import { handleBillsConfirm } from "../../../../utils/handleBillsConfirm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getData } from "@/api";
import html2canvas from "html2canvas";
import { useTransactionContext } from '../../../../contexts/TransactionContext';

const Internet = ({ onNext, setBillType }) => {
  const { refetch } = useTransactionContext();
  const [network, setNetwork] = useState("");
  const [dataPlan, setDataPlan] = useState("");
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
  const [isFetchingPlans, setIsFetchingPlans] = useState(false); // Add loading state
  const [paymentData, setPaymentData] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!network || !dataPlan || !phoneNumber || !amount) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsConfirming(true);
    console.log({ network, dataPlan, phoneNumber, amount });
  };

  const handleConfirm = () => {
    console.log({ network, dataPlan, phoneNumber, amount });
    setIsEnteringPin(true);
  };

  const handleSuccessClose = () => {
    setIsSuccess(false);
    setPaymentData(null);
    setBillType("dashboard");
  };

  const handleBack = () => {
    setIsConfirming(false);
  };

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const getOrdinalSuffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${getOrdinalSuffix(
      day
    )} ${month} ${year}, ${hours}:${minutes}`;
  };

  const handlePinConfirm = async () => {
    const loadingToast = toast.loading("Processing payment...");
    const pinString = pin.join("");
    try {
      const response = await handleBillsConfirm(
        pinString,
        {
          network,
          phone_number: phoneNumber,
          plan_id: planId,
          amount,
        },
        "data-plan-transactions/",
        setIsLoading
      );

      if (
        response?.success === true &&
        (response?.data?.status === "success" || response?.data?.status === "completed")
      ) {
        const transactionData = response.data.transaction || response.data;
        setPaymentData({
          transaction: {
            amount: transactionData.amount,
            network: transactionData.network,
            phone_number: transactionData.phone_number,
            reference: transactionData.reference,
            status: transactionData.status,
            service_name: transactionData.service_name,
            created_at: transactionData.created_at,
            wallet_balance: transactionData.wallet_balance,
          },
        });
        setPin(["", "", "", ""]);
        setIsConfirming(false);
        setIsEnteringPin(false);
        setIsSuccess(true);
        refetch();
        toast.update(loadingToast, {
          render: "Data plan purchase successful!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        setPin(["", "", "", ""]);
        setIsEnteringPin(false);
        setIsConfirming(false);
        toast.update(loadingToast, {
          render:
            response?.error || response?.message || "An error occurred while processing payment",
          type: "error",
          isLoading: false,
          autoClose: false,
        });
      }
    } catch (error) {
      setPin(["", "", "", ""]);
      setIsEnteringPin(false);
      setIsConfirming(false);
      let backendMsg = error?.response?.data?.message || error?.response?.data?.error;
      toast.update(loadingToast, {
        render: backendMsg || error.message || "An error occurred while processing payment",
        type: "error",
        isLoading: false,
        autoClose: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReceipt = async () => {
    const receiptElement = document.getElementById("receipt-container");
    if (receiptElement) {
      try {
        const canvas = await html2canvas(receiptElement);
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `internet-receipt-${paymentData?.transaction?.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error downloading receipt:", error);
        toast.error("Failed to download receipt");
      }
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      setIsFetchingPlans(true); // Set loading to true
      try {
        const plans = await getData(
          `services/data-plan-transactions/get_plans/`
        );
        setAvailablePlans(plans);
      } catch (error) {
        console.error("Error fetching plans:", error);
        toast.error("Failed to fetch plans. Please try again.");
      } finally {
        setIsFetchingPlans(false); // Set loading to false
      }
    };

    fetchPlans();
  }, []); // Fetch plans only once on component mount

  // Normalize network and plan name for robust matching
  function normalizeNetwork(str) {
    return str.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  }

  const filteredPlans = availablePlans?.filter((plan) => {
    if (!network) return false;
    // Extract the network part from the plan name (e.g., 'MTN' from 'MTN (SME) 1000MB 7 DAYS')
    const planNetwork = plan.name.split(" ")[0];
    return normalizeNetwork(planNetwork) === normalizeNetwork(network);
  });

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

  return (
    <div className="flex  justify-center w-full">
     
      <ToastContainer
        position="bottom-center"
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 9999 }}
      />

      {isSuccess ? (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 w-full">
          <div
            id="receipt-container"
            className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg sm:max-w-[80%]"
            style={{ minWidth: 0, transform: 'scale(1)', transformOrigin: 'top center' }}
          >
            <style jsx>{`
              @media (max-width: 500px) {
                #receipt-container {
                  transform: scale(0.85);
                  width: 100vw !important;
                  min-width: 0 !important;
                }
              }
            `}</style>
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
              <h2 className="text-2xl font-bold text-gray-800 mb-2 max-sm:text-lg">Payment Successful!</h2>
              <p className="text-gray-600 max-sm:text-sm">
                Your data plan purchase was successful
              </p>
              <p className="text-sm text-gray-500 mt-2 max-sm:text-xs">
                A receipt has been sent to your email
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 max-sm:text-base">Transaction Details</h3>
              <div className="space-y-3">
                {/* Responsive row with ellipsis for overflow */}
                <div className="flex flex-wrap justify-between sm:items-center gap-1 sm:gap-0">
                  <span className="text-gray-600 text-sm sm:text-base">Amount:</span>
                  <span className="font-medium text-nowrap text-ellipsis overflow-hidden text-sm sm:text-base">₦{paymentData?.transaction?.amount}</span>
                </div>
                <div className="flex flex-wrap justify-between sm:items-center gap-1 sm:gap-0">
                  <span className="text-gray-600 text-sm sm:text-base">Network:</span>
                  <span className="font-medium text-nowrap text-ellipsis overflow-hidden text-sm sm:text-base">{paymentData?.transaction?.network}</span>
                </div>
                <div className="flex flex-wrap justify-between sm:items-center gap-1 sm:gap-0">
                  <span className="text-gray-600 text-sm sm:text-base">Phone Number:</span>
                  <span className="font-medium text-nowrap text-ellipsis overflow-hidden text-sm sm:text-base">{paymentData?.transaction?.phone_number}</span>
                </div>
                <div className="flex flex-wrap justify-between sm:items-center gap-1 sm:gap-0">
                  <span className="text-gray-600 text-sm sm:text-base">Reference:</span>
                  <span className="font-medium text-nowrap text-ellipsis overflow-hidden text-sm sm:text-base">{paymentData?.transaction?.reference}</span>
                </div>
                <div className="flex flex-wrap justify-between sm:items-center gap-1 sm:gap-0">
                  <span className="text-gray-600 text-sm sm:text-base">Service:</span>
                  <span className="font-medium text-nowrap text-ellipsis overflow-hidden text-sm sm:text-base">{paymentData?.transaction?.service_name}</span>
                </div>
                <div className="flex flex-wrap justify-between sm:items-center gap-1 sm:gap-0">
                  <span className="text-gray-600 text-sm sm:text-base">Date:</span>
                  <span className="font-medium text-nowrap text-ellipsis overflow-hidden text-sm sm:text-base">{paymentData?.transaction?.created_at}</span>
                </div>
                <div className="flex flex-wrap justify-between sm:items-center gap-1 sm:gap-0">
                  <span className="text-gray-600 text-sm sm:text-base">Status:</span>
                  <span className="font-medium text-nowrap text-ellipsis overflow-hidden capitalize text-sm sm:text-base">{paymentData?.transaction?.status}</span>
                </div>
                <div className="flex flex-wrap justify-between sm:items-center gap-1 sm:gap-0">
                  <span className="text-gray-600 text-sm sm:text-base">Wallet Balance:</span>
                  <span className="font-medium text-nowrap text-ellipsis overflow-hidden text-sm sm:text-base">₦{paymentData?.transaction?.wallet_balance}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 sm:space-x-4">
              <button
                onClick={handleDownloadReceipt}
                className="w-full sm:flex-1 bg-gray-100 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center text-sm sm:text-base"
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
                className="w-full sm:flex-1 bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors text-sm sm:text-base"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : isEnteringPin ? (
        <EnterPinModal
          onConfirm={handlePinConfirm}
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
        <div className="min-h-screen flex justify-center w-full  px-3 items-center max-md-[400px]:items-start">
          {" "}
          <div className="sm:w-[50%] md:w-[80%] lg:w-[55%] w-full bg-white rounded-lg shadow-md p-6">
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
                  <option value="MTN">MTN NG</option>
                  <option value="GLO">GLO NG</option>
                  <option value="AIRTEL">AIRTEL NG</option>
                  <option value="9MOBILE">9MOBILE NG</option>
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
                  disabled={isFetchingPlans} // Disable dropdown while loading
                >
                  <option value="">
                    {isFetchingPlans
                      ? "Loading plans..."
                      : "Select a Data Plan"}
                  </option>
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
                  readOnly // Make the input readonly
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
      )}
    </div>
  );
};

export default Internet;
