"use client";

import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { useState } from "react";
import { FaTimes, FaShareAlt, FaCopy } from "react-icons/fa";

const ReceiveMoneyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [formData, setFormData] = useState({
    amount: "",
    payment_type: "",
    currency: "NGN",
    reason: "",
  });

  const paymentTypes = ["flutterwave", "monify", "paystack"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    console.log("the token ", localStorage.getItem("access_token"));

    e.preventDefault();
    fetch("https://swiftconnect-backend.onrender.com/payments/credit-wallet/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Transaction-PIN": "9999",
        Authorization: `Bearer ${localStorage.getItem("access_token")}
        `,
      },
      body: JSON.stringify({
        amount: "400",
        payment_type: "paystack",
        currency: "NGN",
        reason: "eewewew",
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error("Fetch error:", err));

    // try {
    //   const response = await axios.post(
    //     "https://swiftconnect-backend.onrender.com/payments/credit-wallet/",
    //     formData,
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //         "X-Transaction-PIN": 1234,
    //         Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Replace with actual token
    //       },
    //     }
    //   );
    //   console.log(response.data);
    //   // toast.update(loadingToast, {
    //   //   render: "KYC Submitted Successfully!",
    //   //   type: "success",
    //   //   isLoading: false,
    //   //   autoClose: 3000,
    //   // });
    //   // setMessage("KYC Submitted Successfully!");
    //   setStep(3); // Move to success step
    // } catch (error) {
    //   // toast.update(loadingToast, {
    //   //   render: error.response?.data?.detail || "Submission failed",
    //   //   type: "error",
    //   //   isLoading: false,
    //   //   autoClose: 3000,
    //   // });
    //   // setMessage(
    //   //   "Error: " + (error.response?.data?.detail || "Submission failed")
    //   // );
    //   console.error("Full Error:", error.response?.data || error);
    //   //  alert("Failed to credit wallet.");
    // } finally {
    //   // setLoading(false);
    // }
    //  try {
    //    console.log(formData);

    //    const response = await axiosInstance.post("/payments/credit-wallet/", formData);
    //    console.log("Response:", response.data);
    //    alert("Payment credited successfully!");
    //  } catch (error) {
    //    console.error("Error:", error);
    //    alert("Failed to credit wallet.");
    //  }
  };

  const accounts = [
    { bank: "GTB", account: "239 118 5161" },
    { bank: "UBA", account: "239 118 5161" },
    { bank: "ACCESS BANK", account: "239 118 5161" },
    { bank: "SWIFT CONNECT", account: "239 118 5161" },
    { bank: "SWIFT CONNECT", account: "239 118 5161" },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Credit Wallet</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Payment Type</label>
            <select
              name="payment_type"
              value={formData.payment_type}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Payment Type</option>
              {paymentTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Currency</label>
            <input
              type="text"
              name="currency"
              value="NGN"
              readOnly
              className="w-full p-2 border rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Reason</label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
              placeholder="Enter reason"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
        {/* <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Receive Money</h2>
          <button onClick={onClose}>
            <FaTimes className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <p className="text-gray-600 mb-4">Receive funds from any Local Bank</p>

        <div className="space-y-4">
          {accounts.map((account, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-100 p-4 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center">
                  <div className="w-6 h-6 border-4 border-green-600 border-opacity-50 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    PRAISE AKINDE • {account.bank}
                  </p>
                  <p className="text-lg font-bold">{account.account}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button>
                  <FaShareAlt className="text-gray-500 hover:text-gray-700" />
                </button>
                <button>
                  <FaCopy className="text-gray-500 hover:text-gray-700" />
                </button>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default ReceiveMoneyModal;
