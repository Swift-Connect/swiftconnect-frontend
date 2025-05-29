"use client";

import { useState, useEffect } from "react";
import { X, Copy, Share2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EnterPinModal from "./sendMoney/enterPin";
import { fetchWithAuth, postWithAuth } from "@/utils/api";

const ReceiveMoneyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState("bank"); // "bank" or "form"
  const [accounts, setAccounts] = useState([]);
  const [bvn, setBvn] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    payment_type: "",
    currency: "NGN",
    reason: "",
  });
  const [pin, setPin] = useState(["", "", "", ""]);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const paymentTypes = ["flutterwave", "monify", "paystack"];

  // Fetch reserved accounts on mount
  useEffect(() => {
    if (!isOpen || mode !== "bank") return;

    const fetchAccounts = async () => {
      const loadingToast = toast.loading("Fetching bank accounts...");
      try {
        const data = await fetchWithAuth("payments/account-numbers/");
        setAccounts(data?.accounts || []);
        toast.update(loadingToast, {
          render: "Bank accounts fetched successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } catch (error) {
        toast.update(loadingToast, {
          render: `Error: ${error.message || "Failed to fetch accounts"}`,
          type: "error",
          isLoading: false,
          autoClose: 4000,
        });
      }
    };

    fetchAccounts();
  }, [isOpen, mode]);

  const handleCreateAccount = async () => {
    if (!bvn) return toast.error("Enter a valid BVN");

    const loadingToast = toast.loading("Creating bank account...");
    setLoading(true);
    try {
      const response = await postWithAuth("payments/create-reserved-account/", {
        bvn,
      });
      if (!response?.account) throw new Error("No account returned");

      setAccounts((prev) => [...prev, response.account]);
      setBvn("");
      toast.update(loadingToast, {
        render: "Bank account created!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      toast.update(loadingToast, {
        render: `Error: ${err.message}`,
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsPinModalOpen(true);
  };

  const handlePinConfirm = async (e) => {
    e.preventDefault();
    const pinString = pin.join("");
    const loadingToast = toast.loading("Processing payment...");
    setIsSubmitting(true);
    try {
      const response = await fetch(
        "https://swiftconnect-backend.onrender.com/payments/credit-wallet/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Transaction-PIN": pinString,
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();

      if (response.ok) {
        toast.update(loadingToast, {
          render: "Payment processed successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        window.location.href = data.payment_link;
      } else {
        toast.update(loadingToast, {
          render: data.detail || "Failed to process payment",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.update(loadingToast, {
        render: `Fetch error: ${err.message}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const CreateAccountForm = ({ bvn, setBvn, loading, handleCreateAccount }) => (
    <div>
      <input
        type="text"
        placeholder="Enter your BVN"
        value={bvn}
        onChange={(e) => setBvn(e.target.value)}
        className="w-full border rounded-md p-2 mb-2"
      />
      <button
        onClick={handleCreateAccount}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        {loading ? "Creating..." : "Create Account"}
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <ToastContainer />
      <div
        className="bg-white rounded-xl p-6 w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X />
        </button>

        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Receive Money</h2>
        </div>
        <button
          onClick={() => setMode(mode === "bank" ? "form" : "bank")}
          className="px-4 py-2 bg-white border border-black text-black font-semibold rounded-md hover:bg-blue-50 transition mb-4"
        >
          {mode === "bank" ? "Use Form Instead" : "Use Bank Account Instead"}
        </button>

        {mode === "bank" ? (
          <>
            {accounts.length === 0 ? (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  No account found. Create one below:
                </p>
                <CreateAccountForm
                  bvn={bvn}
                  setBvn={setBvn}
                  loading={loading}
                  handleCreateAccount={handleCreateAccount}
                />
              </div>
            ) : (
              <>
                {accounts.map((acc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-xl mb-3 hover:shadow-md transition"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={acc.bank_logo || "/default-logo.png"}
                        alt={`${acc.bank_name} logo`}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="text-sm text-gray-600">
                          {acc.account_name} • {acc.bank_name}
                        </p>
                        <p className="font-semibold text-lg">
                          {acc.account_number}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2 text-gray-500">
                      <Share2 className="w-5 h-5 cursor-pointer" />
                      <Copy className="w-5 h-5 cursor-pointer" />
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="w-full bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition mb-4"
                >
                  + Add Another Account
                </button>

                {showCreateForm && (
                  <CreateAccountForm
                    bvn={bvn}
                    setBvn={setBvn}
                    loading={loading}
                    handleCreateAccount={handleCreateAccount}
                  />
                )}
              </>
            )}
          </>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleFormChange}
                required
                className="w-full p-2 border rounded-md"
                disabled={isSubmitting}
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium">Payment Type</label>
              <select
                name="payment_type"
                value={formData.payment_type}
                onChange={handleFormChange}
                required
                className="w-full p-2 border rounded-md"
                disabled={isSubmitting}
              >
                <option value="">Select Payment Type</option>
                {paymentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div> */}

            <div>
              <label className="block text-sm font-medium">Currency</label>
              <input
                type="text"
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
                onChange={handleFormChange}
                required
                className="w-full p-2 border rounded-md"
                placeholder="Enter reason"
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-[#000000ad]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Submit"}
            </button>
          </form>
        )}
      </div>

      {isPinModalOpen && (
        <EnterPinModal
          onConfirmTopUp={handlePinConfirm}
          onClose={() => setIsPinModalOpen(false)}
          setPin={setPin}
          pin={pin}
          from="top up"
        />
      )}
    </div>
  );
};

export default ReceiveMoneyModal;
