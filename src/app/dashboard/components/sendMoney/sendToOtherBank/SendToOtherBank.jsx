import { useState, useEffect } from "react";
import { Oval } from "react-loader-spinner";

export default function SendToOtherBanksModal({
  onBack,
  onClose,
  onNext,
  setName,
  setAcctNum,
  setchannel,
  setBankCode,
  accountNum,
  setBankName,
}) {
  const [selectedBank, setSelectedBank] = useState("");
  const [paymentChannel, setPaymentChannel] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [banks, setBanks] = useState([]);
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [isFetchingBanks, setIsFetchingBanks] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const getBanks = async () => {
    setIsFetchingBanks(true);
    try {
      const response = await fetch(
        `https://swiftconnect-backend.onrender.com/payments/available-banks/?payment_type=${paymentChannel}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch banks");
      }

      const data = await response.json();
      setBanks(data.banks);
      setFilteredBanks(data.banks);
    } catch (error) {
      console.error("Error fetching banks:", error);
    } finally {
      setIsFetchingBanks(false);
    }
  };

  useEffect(() => {
    if (selectedBank && accountNum) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [selectedBank, accountNum]);

  useEffect(() => {
    if (paymentChannel) {
      getBanks();
    }
  }, [paymentChannel]);

  // Handle bank search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      const filtered = banks.filter((bank) =>
        bank.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredBanks(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  // Handle bank selection
  const handleSelectBank = (bank) => {
    setSelectedBank(bank.name);
    setSearchTerm(bank.name);
    setBankCode(bank.code);
    setBankName(bank.name);
    setShowDropdown(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-[45%] rounded-xl shadow-lg p-6 max-md-[400px]:w-full max-md-[400px]:p-2">
        {/* Header */}
        <div className="flex items-center gap-10 px-4 py-3 border-b">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-gray-600 flex items-center space-x-2 text-[24px] max-md-[400px]:text-[18px]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>{" "}
            Back
          </button>
          <h2 className="text-[24px] font-bold text-gray-800 max-md-[400px]:text-[18px]">
            Send to other banks
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Payment Channel Dropdown */}
          <div>
            <label
              htmlFor="payment-channel"
              className="block text-sm font-medium text-gray-700"
            >
              Payment Channel
            </label>
            <select
              id="payment-channel"
              value={paymentChannel}
              onChange={(e) => {
                setPaymentChannel(e.target.value);
                setchannel(e.target.value);
              }}
              className="w-full mt-1 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none p-4"
            >
              <option value="">Select payment channel</option>
              <option value="flutterwave">Flutterwave</option>
              <option value="monify">Monify</option>
              <option value="paystack">Paystack</option>
            </select>
          </div>

          {/* Bank Search Input */}
          <div className="relative">
            <label
              htmlFor="bank-search"
              className="block text-sm font-medium text-gray-700"
            >
              Select Bank
            </label>
            <input
              type="text"
              id="bank-search"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search for a bank..."
              className="w-full mt-1 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none p-4"
              onFocus={() => setShowDropdown(true)}
            />
            {isFetchingBanks && (
            <div className="absolute right-3 top-0">
              <Oval height={20} width={20} color="#4fa94d" />
            </div>
            )}

            {/* Dropdown for bank selection */}
            {showDropdown && filteredBanks.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto mt-1">
                {filteredBanks.map((bank) => (
                  <li
                    key={bank.code}
                    onClick={() => handleSelectBank(bank)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {bank.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Account Number Input */}
          <div>
            <label
              htmlFor="account-number"
              className="block text-sm font-medium text-gray-700"
            >
              Account Number
            </label>
            <input
              type="text"
              id="account-number"
              value={accountNum}
              onChange={(e) => {
                setAcctNum(e.target.value);
              }}
              placeholder="Input the Account Number"
              className="w-full mt-1 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none p-4"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4">
          <button
            className={`w-full text-white py-4 rounded-lg shadow-sm ${
              isButtonDisabled
                ? "bg-[#d2d2d2]"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isButtonDisabled}
            onClick={() => {
              onNext();
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
