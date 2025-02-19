"use client";
import { useState } from "react";
import ChangePasswordModal from "./changePassword";
import ChangePinModal from "./changePin";
import OtpModal from "./otpModal";

export default function Security() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModalPin, setShowModalPin] = useState(false);
  const [nextStep, setNextStep] = useState("");

  return (
    <div className=" sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        {/* Two-Factor Authentication */}
        <div className="flex flex-col">
          <h3 className="text-sm font-medium mb-4 text-gray-900">
            Two-factor Authentication
          </h3>
          <div className="flex items-center space-x-4">
            {/* Improved Toggle Button */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className="sr-only peer"
              />
              <div className="w-12 h-7 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition duration-300 relative">
                <div
                  className={`absolute top-[3px] left-[4px] w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                    twoFactorEnabled ? "translate-x-5" : ""
                  }`}
                ></div>
              </div>
            </label>
            <p className="text-gray-500 text-sm">
              Enable or disable two-factor authentication
            </p>
          </div>
        </div>

        {/* Change Password */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full md:w-[80%] lg:w-[60%]">
          <div className="flex flex-col gap-2 sm:gap-4">
            <h3 className="text-sm font-medium text-gray-900">
              Update Password
            </h3>
            <p className="text-gray-500 text-sm">
              Change your old password to a new one
            </p>
          </div>
          <button
            className="text-green-700 font-medium hover:underline mt-2 sm:mt-0"
            onClick={() => setShowModal(true)}
          >
            Change Password
          </button>
        </div>

        {/* Change PIN */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full md:w-[80%] lg:w-[60%]">
          <div className="flex flex-col gap-2 sm:gap-4">
            <h3 className="text-sm font-medium text-gray-900">Update PIN</h3>
            <p className="text-gray-500 text-sm">
              Change or reset your Swiftconnect PIN
            </p>
          </div>
          <button
            className="text-green-700 font-medium hover:underline mt-2 sm:mt-0"
            onClick={() => setShowModalPin(true)}
          >
            Change PIN
          </button>
        </div>
      </div>

      {showModalPin && (
        <ChangePinModal
          onClose={() => setShowModalPin(false)}
          onNext={(nextStep) => {
            setNextStep(nextStep);
            setShowModalPin(false);
          }}
        />
      )}

      {nextStep === "new pin" && (
        <ChangePinModal onClose={() => setNextStep("")}   text={"new pin"} />
      )}

      {nextStep === "OTP" && (
        <OtpModal
          onClose={() => setNextStep("")}
          onNext={() => setNextStep("new pin")}
        />
      )}

      {showModal && <ChangePasswordModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
