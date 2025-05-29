"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "@/utils/api";

const ElectricityTransaction = () => {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedMeterType, setSelectedMeterType] = useState("");
  const [meterNumber, setMeterNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Fetch electricity providers
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await api.get("/services/electricity-transactions/providers/");
        if (response.data.status === "success") {
          setProviders(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to fetch electricity providers");
        console.error("Error fetching providers:", error);
      }
    };

    fetchProviders();
  }, []);

  // Handle provider selection
  const handleProviderChange = (e) => {
    setSelectedProvider(e.target.value);
    setSelectedMeterType(""); // Reset meter type when provider changes
  };

  // Handle meter type selection
  const handleMeterTypeChange = (e) => {
    setSelectedMeterType(e.target.value);
  };

  // Handle meter verification
  const handleVerifyMeter = async (e) => {
    e.preventDefault();
    
    if (!selectedProvider || !selectedMeterType || !meterNumber || !amount) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await api.post("/services/electricity-transactions/verify_meter/", {
        meter_number: meterNumber,
        amount: amount,
        provider: selectedProvider,
        meter_type: selectedMeterType
      });

      if (response.data.status === "success") {
        toast.success("Meter verified successfully");
        // Handle successful verification (e.g., proceed to payment)
      } else {
        toast.error(response.data.message || "Verification failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify meter");
      console.error("Error verifying meter:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Buy Electricity</h2>
      
      <form onSubmit={handleVerifyMeter} className="space-y-6">
        {/* Provider Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Select Provider
          </label>
          <select
            value={selectedProvider}
            onChange={handleProviderChange}
            className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#00613A] focus:ring-1 focus:ring-[#00613A] outline-none"
            required
          >
            <option value="">Select a provider</option>
            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>

        {/* Meter Type Selection */}
        {selectedProvider && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Meter Type
            </label>
            <select
              value={selectedMeterType}
              onChange={handleMeterTypeChange}
              className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#00613A] focus:ring-1 focus:ring-[#00613A] outline-none"
              required
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

        {/* Meter Number Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Meter Number
          </label>
          <input
            type="text"
            value={meterNumber}
            onChange={(e) => setMeterNumber(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#00613A] focus:ring-1 focus:ring-[#00613A] outline-none"
            placeholder="Enter meter number"
            required
          />
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Amount (₦)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#00613A] focus:ring-1 focus:ring-[#00613A] outline-none"
            placeholder="Enter amount"
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          disabled={isVerifying}
          className="w-full bg-[#00613A] text-white py-3 rounded-lg font-medium hover:bg-[#004d2d] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isVerifying ? "Verifying..." : "Verify Meter"}
        </button>
      </form>
    </div>
  );
};

export default ElectricityTransaction; 