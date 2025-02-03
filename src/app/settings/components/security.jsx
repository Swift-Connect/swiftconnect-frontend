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
    <div>
      <div className="mt-6 space-y-6">
        {/* Two-Factor Authentication */}
        <div className="flex flex-col">
          {" "}
          <h3 className="text-sm font-medium mb-6 text-gray-900">
            Two-factor Authentication
          </h3>
          <div className="flex items-center space-x-4">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer-checked:bg-green-500"></div>
            </label>
            <p className="text-gray-500 text-sm">
              Enable or disable two factor authentication
            </p>
          </div>
        </div>

        {/* Change Password */}
        <div className="flex items-center w-[60%] justify-between">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium text-gray-900">
              Update Password
            </h3>
            <p className="text-gray-500 text-sm">
              Change your old password to a new one
            </p>
          </div>
          <button
            className="text-green-700 font-medium hover:underline"
            onClick={() => setShowModal(true)}
          >
            Change Password
          </button>
        </div>

        {/* Change PIN */}
        <div className="flex items-center w-[60%] justify-between">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium text-gray-900">Update PIN</h3>
            <p className="text-gray-500 text-sm">
              Change or reset your Swiftconnect PIN
            </p>
          </div>
          <button
            className="text-green-700 font-medium hover:underline"
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
            // console.log(otp);
          }}
        />
      )}

      {nextStep === "new pin" && (
        <ChangePinModal
          onClose={() => setNextStep("")}
          text={"new pin"}
          // onNext={(nextStep) => {
          //   setNextStep(nextStep);
          //   setShowModalPin(false);
          //   // console.log(otp);
          // }}
        />
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
