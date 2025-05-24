import { useState, useEffect, useRef } from "react";
import { Oval } from "react-loader-spinner";
import api from "@/utils/api";
import { toast } from "react-toastify";

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
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [paymentChannel, setPaymentChannel] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [banks, setBanks] = useState([]);
  const [isFetchingBanks, setIsFetchingBanks] = useState(false);
  const [isValidatingAccount, setIsValidatingAccount] = useState(false);
  const [accountHolderName, setAccountHolderName] = useState("");
  const [validationError, setValidationError] = useState("");

  const filteredBanks = searchQuery === ''
    ? banks
    : banks.filter((bank) =>
        bank.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getBanks = async () => {
    setIsFetchingBanks(true);
    try {
      const response = await api.get('/payments/available-banks/');
      console.log('Raw API Response:', response);
      console.log('Response Data:', response.data);
      console.log('Banks Array:', response.data?.banks);
      
      if (response.data?.status === 'success' && Array.isArray(response.data.banks)) {
        // Deduplicate banks based on their code
        const uniqueBanks = response.data.banks.reduce((acc, current) => {
          const x = acc.find(item => item.code === current.code);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);

        // Sort banks alphabetically by name
        const sortedBanks = uniqueBanks.sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        console.log('Deduplicated and Sorted Banks:', sortedBanks);
        setBanks(sortedBanks);
      } else {
        console.error('Invalid response format:', {
          status: response.data?.status,
          banks: response.data?.banks,
          isArray: Array.isArray(response.data?.banks)
        });
        toast.error("Failed to load banks. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching banks:", error);
      toast.error("Failed to fetch banks. Please try again.");
    } finally {
      setIsFetchingBanks(false);
    }
  };

  const validateAccountNumber = async (accountNumber, bankCode) => {
    if (!accountNumber || !bankCode) return;
    
    setIsValidatingAccount(true);
    setValidationError("");
    setAccountHolderName("");
    
    try {
      console.log('Validating account:', { accountNumber, bankCode });
      const response = await fetch('/api/verify-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountNumber,
          bankCode
        })
      });

      const data = await response.json();
      console.log('Validation response:', data);
      
      if (data.status === 'success' && data.data?.account_name) {
        setAccountHolderName(data.data.account_name);
        setValidationError("");
        toast.success('Account verified successfully');
      } else {
        const errorMessage = data.message || 'Invalid account number';
        setValidationError(errorMessage);
        setAccountHolderName("");
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error validating account:', error);
      const errorMessage = 'Failed to validate account number';
      setValidationError(errorMessage);
      setAccountHolderName("");
      toast.error(errorMessage);
    } finally {
      setIsValidatingAccount(false);
    }
  };

  useEffect(() => {
    getBanks();
  }, []);

  useEffect(() => {
    if (selectedBank && accountNum && accountHolderName) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [selectedBank, accountNum, accountHolderName]);

  const handleBankSelect = (bank) => {
    setSelectedBank(bank.name);
    setSelectedBankCode(bank.code);
    setBankCode(bank.code);
    setBankName(bank.name);
    setSearchQuery(bank.name);
    setAccountHolderName("");
    setValidationError("");
    setIsDropdownOpen(false);
  };

  // Handle account number change
  const handleAccountNumberChange = (e) => {
    const value = e.target.value;
    setAcctNum(value);
    
    // Clear account holder name when account number changes
    setAccountHolderName("");
    setValidationError("");
    
    // Validate account number when it's 10 digits
    if (value.length === 10 && selectedBankCode) {
      validateAccountNumber(value, selectedBankCode);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white w-[45%] rounded-xl shadow-lg p-6 max-md-[400px]:w-full max-md-[400px]:p-2" onClick={(e) => e.stopPropagation()}>
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
          {/* Bank Selection Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <label
              htmlFor="bank-select"
              className="block text-sm font-medium text-gray-700"
            >
              Select Bank
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Search for a bank"
                className={`w-full mt-1 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none p-4 ${isDropdownOpen ? 'cursor-text' : 'cursor-pointer'}`}
              />
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              >
                <svg
                  className={`h-5 w-5 text-gray-400 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                {isFetchingBanks ? (
                  <div className="p-2 text-center text-gray-500">Loading banks...</div>
                ) : filteredBanks.length === 0 ? (
                  <div className="p-2 text-center text-gray-500">No banks found</div>
                ) : (
                  filteredBanks.map((bank) => (
                    <div
                      key={bank.code}
                      onClick={() => handleBankSelect(bank)}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    >
                      {bank.name}
                    </div>
                  ))
                )}
              </div>
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
            <div className="relative">
              <input
                type="text"
                id="account-number"
                value={accountNum}
                onChange={handleAccountNumberChange}
                placeholder="Input the Account Number"
                className={`w-full mt-1 border ${validationError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none p-4`}
                maxLength={10}
              />
              {isValidatingAccount && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Oval height={20} width={20} color="#4fa94d" />
                </div>
              )}
            </div>
            {validationError && (
              <p className="mt-2 text-sm text-red-600">
                {validationError}
              </p>
            )}
            {accountHolderName && (
              <p className="mt-2 text-sm text-green-600">
                Account Holder: {accountHolderName}
              </p>
            )}
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
