import { useState, useEffect } from "react";
import Image from "next/image";

export default function SendToOtherBanksModal({
  onBack,
  onClose,
  onNext,
  setName,
  setAcctNum,
}) {
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [matchedAccount, setMatchedAccount] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const userAccounts = [
    {
      name: "John Doe",
      username: "@johndoe",
      accountNumber: "123456789",
    },
    {
      name: "Jane Smith",
      username: "@janesmith",
      accountNumber: "987654321",
    },
    {
      name: "Alice Johnson",
      username: "@alicej",
      accountNumber: "567890123",
    },
  ];

  useEffect(() => {
    if (selectedBank && accountNumber) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [selectedBank, accountNumber]);

  const handleAccountNumberChange = (e) => {
    const value = e.target.value;
    setAccountNumber(value);
    setIsLoading(true);

    setTimeout(() => {
      const account = userAccounts.find(
        (account) => account.accountNumber === value
      );
      setMatchedAccount(account || null);
      setIsLoading(false);
    }, 500); // Simulates loading delay
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
          {/* Bank Dropdown */}
          <div>
            <label
              htmlFor="banks"
              className="block text-sm font-medium text-gray-700"
            >
              Banks
            </label>
            <select
              id="banks"
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none p-4"
            >
              <option value="">Select Bank</option>
              <option value="Bank A">Guaranty Trust Bank</option>
              <option value="Bank B">Bank B</option>
            </select>
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
              value={accountNumber}
              onChange={handleAccountNumberChange}
              placeholder="Input the Account Number"
              className="w-full mt-1 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none p-4"
            />
            <div className="flex mt-2 gap-2 items-center">
              {isLoading && <p>Loading...</p>}
              {!isLoading && matchedAccount && (
                <div className="flex gap-2 items-center">
                  <Image
                    src={"green-checked.svg"}
                    alt="confirmation icon"
                    width={16}
                    height={16}
                    className="w-[1em]"
                  />
                  <p>{matchedAccount.name}</p>
                </div>
              )}
              {!isLoading && !matchedAccount && accountNumber && (
                <p className="text-red-500">No Account Found</p>
              )}
            </div>
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
              setName(matchedAccount.name);
              setAcctNum(accountNumber);
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
