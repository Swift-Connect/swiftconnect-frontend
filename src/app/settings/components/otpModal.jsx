import { useState, useRef } from "react";
import { X } from "lucide-react";
import Modal from '../../../components/common/Modal';

export default function OtpModal({ isOpen, onClose, ...props }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Allow only numbers
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to next input if a digit is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
      } 
      
      if (newOtp.every((digit) => digit !== "")) {
          console.log("Move To Next step");
          onClose()
          props.onNext()
          
          
      }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      }
      

  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-900 text-center">
            Enter your 6-digit OTP
          </h2>
          <p className="text-gray-500 text-center text-sm mb-6">
            Enter the code sent to{" "}
            <span className="font-medium">Cho********@gmail.com</span>
          </p>

          {/* OTP Input Fields */}
          <div className="flex justify-center space-x-3 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          {/* Resend Code */}
          <p className="text-center text-gray-500 text-sm">
            Didn't get any code?{" "}
            <button className="text-green-700 font-medium hover:underline">
              Resend Code
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
}
