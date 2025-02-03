import { useState } from "react";
import { X, CreditCard, Calendar, Lock, Eye, EyeOff } from "lucide-react";

export default function AddCardForm({ onClose,  handlePayCharges}) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardPin, setCardPin] = useState("");
  const [showCardPin, setShowCardPin] = useState(false);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="bg-white p-6 rounded-lg  shadow-lg relative">
        {/* Close Button */}
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={20} onClick={() => onClose()} />
        </button>

        <h2 className="text-lg font-semibold mb-4">
          Enter your card details to pay
        </h2>

        {/* Card Number */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Card Number
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              className="w-full p-3 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
            <CreditCard
              className="absolute right-3 top-3 text-gray-400"
              size={20}
            />
          </div>
        </div>

        {/* Expiry Date & CVV */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-600">
              Expiry Date
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full p-3 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
              <Calendar
                className="absolute right-3 top-3 text-gray-400"
                size={20}
              />
            </div>
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-600">
              CVV
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="123"
                className="w-full p-3 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
              />
              <Lock
                className="absolute right-3 top-3 text-gray-400"
                size={20}
              />
            </div>
          </div>
        </div>
        <div className="my-4">
          <label className="block text-sm font-medium text-gray-600">
            Enter Card Pin
          </label>
          <div className="relative">
            <input
              type={`${showCardPin ? "text" : "password"}`}
              placeholder="e.g 123"
              className="w-full p-3 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={cardPin}
              onChange={(e) => setCardPin(e.target.value)}
            />
            {showCardPin ? (
              <EyeOff
                className="absolute right-3 top-3 text-gray-400"
                size={20}
                onClick={() => setShowCardPin(!showCardPin)}
              />
            ) : (
              <Eye
                className="absolute right-3 top-3 text-gray-400"
                size={20}
                onClick={() => setShowCardPin(!showCardPin)}
              />
            )}
          </div>
        </div>
        {/* Pay Button */}
        <button
          className="mt-6 w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
          onClick={() => handlePayCharges()}
        >
          Pay NGN 100
        </button>
      </div>
    </div>
  );
}
