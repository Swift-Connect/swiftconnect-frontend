import Image from "next/image";
import React from "react";

const ConfirmPayment = ({
  network,
  airtimeType,
  phoneNumber,
  amount,
  onBack,
  onConfirm,
  description,
  // Data Plan
  dataPlan,
  metreNumber,
  provider,
  packageType,
  // Caable TV
  plan,
}) => {
  return (
    <div className="min-h-screen  flex justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <button
          className="text-sm text-gray-600 mb-4 flex items-center"
          onClick={onBack}
        >
          <Image
            src={"backArrow.svg"}
            alt="confirmation icon"
            width={16}
            height={16}
            className="w-[0.6em]"
          />
          <span className="ml-2">Back</span>
        </button>
        <h2 className="text-xl font-semibold mb-6 text-center">
          Confirm Payment
        </h2>
        {description === "Cable TV" ? (
          <></>
        ) : (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              {description === "Electricity" ? "Meter Number" : "To"}:
            </p>
            <p className="text-lg">
              {description === "Electricity" ? metreNumber : phoneNumber}
            </p>
          </div>
        )}

        {description === "Electricity" ? (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Service:</p>
            <p className="text-lg">{description}</p>
          </div>
        ) : description === "Cable TV" ? (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Service:</p>
            <p className="text-lg">{description}</p>
          </div>
        ) : (
          <></>
        )}

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">
            {description === "Electricity" || description === "Cable TV"
              ? "Provider"
              : "Network"}
            :
          </p>
          <p className="text-lg">
            {description === "Electricity"
              ? provider
              : description === "Cable TV"
              ? provider
              : network}
          </p>
        </div>

        {description === "Electricity" ||
          description ===
            "Cable TV" ? (
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">
                  {description === "Electricity" ? "Package" : "Plan"}
                </p>
                <p className="text-lg">
                  {description === "Electricity" ? packageType : plan}
                </p>
              </div>
            ):""}

        {description === "Airtime" && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              {description === "Data" ? "Data Plan" : ""}
            </p>
            <p className="text-lg">
              {description === "Data" ? dataPlan : airtimeType}
            </p>
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">Amount:</p>
          <p className="text-lg">{amount}</p>
        </div>
        {description === "Electricity" || description === "Cable TV" ? (
          <></>
        ) : (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Description:</p>
            <p className="text-lg">{description}</p>
          </div>
        )}
        <button
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
          onClick={onConfirm}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmPayment;
