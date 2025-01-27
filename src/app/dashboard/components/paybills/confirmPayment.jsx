import Image from "next/image";
import React from "react";

const ConfirmPayment = ({
  network,
  dataPlan,
  airtimeType,
  phoneNumber,
  amount,
  onBack,
  onConfirm,
  description,
  service,
  provider,
  plan,
  metreNumber,
  packageType,
}) => {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[70%] bg-white rounded-lg shadow-md p-6">
        <button
          className="text-gray-500 mb-4 flex items-center"
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

        {description === "Airtime" || description === "Data" ? (
          <>
            {" "}
            <div className="mb-4 flex justify-between text-[24px]">
              <p className="text-[#6B7280] font-medium">To:</p>
              <p className="text-[#0E1318] text-[24px]">{phoneNumber}</p>
            </div>
            <div className="mb-4 flex justify-between text-[24px]">
              <p className="text-[#6B7280] font-medium">Network:</p>
              <p className="text-[#0E1318] text-[24px]">{network}</p>
            </div>
            {dataPlan && (
              <div className="mb-4 flex justify-between text-[24px]">
                <p className="text-[#6B7280] font-medium">Data Plan</p>
                <p className="text-[#0E1318] text-[24px]">{dataPlan}</p>
              </div>
            )}
            <div className="mb-4 flex justify-between text-[24px]">
              <p className="text-[#6B7280] font-medium">Amount:</p>
              <p className="text-[#0E1318] text-[24px]">{amount}</p>
            </div>
            <div className="mb-4 flex justify-between text-[24px]">
              <p className="text-[#6B7280] font-medium">Description:</p>
              <p className="text-[#0E1318] text-[24px]">{description}</p>
            </div>
          </>
        ) : description === "Cable TV" || description === "Electricity" ? (
          <>
            {description === "Electricity" && (
              <div className="mb-4 flex justify-between text-[24px]">
                <p className="text-[#6B7280] font-medium">Meter Number</p>
                <p className="text-[#0E1318] text-[24px]">{metreNumber}</p>
              </div>
            )}
            <div className="mb-4 flex justify-between text-[24px]">
              <p className="text-[#6B7280] font-medium">Service:</p>
              <p className="text-[#0E1318] text-[24px]">{description}</p>
            </div>
            <div className="mb-4 flex justify-between text-[24px]">
              <p className="text-[#6B7280] font-medium">Provider:</p>
              <p className="text-[#0E1318] text-[24px]">{provider}</p>
            </div>
            <div className="mb-4 flex justify-between text-[24px]">
              <p className="text-[#6B7280] font-medium">
                {description === "Electricity" ? "Package" : "Plan"}
              </p>
              <p className="text-[#0E1318] text-[24px]">
                {description === "Electricity" ? packageType : plan}
              </p>
            </div>
            <div className="mb-4 flex justify-between text-[24px]">
              <p className="text-[#6B7280] font-medium">Amount</p>
              <p className="text-[#0E1318] text-[24px]">{amount}</p>
            </div>
          </>
        ) : null}

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
