import Image from "next/image";
import React from "react";

const SendMoneyModal = ({ isOpen, onClose, onNext, setView, setIsInternal }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg p-6 max-md-[400px]:p-4" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 ">
          <h2 className="text-lg font-bold text-gray-800">Send Money</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Options */}
        <div className="space-y-4 mt-4">
          {/* Option 1 */}
          <div
            className="flex items-center justify-between p-4 border-[0.5px] border-[#efefef] rounded-[1.5em] cursor-pointer hover:bg-gray-200"
            onClick={() => {setView("swiftConnect"); setIsInternal(true)}}
          >
            <div className="flex items-center space-x-4">
              <Image
                src="/swiftconnect-favicon.svg"
                alt="Agent Icon"
                width={100}
                height={100}
                className="h-[4em] w-[4em] max-md-[400px]:w-[2em] max-md-[400px]:h-[2em]  "
              />
              <div>
                <h3 className="font-semibold text-gray-800" >
                  Send to Swift Connect Account
                </h3>
                <p className="text-sm text-gray-600">
                  Send to any Swift Connect account, for free.
                </p>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>

          {/* Option 2 */}
          <div
            className="flex items-center justify-between p-4  border-[0.5px] border-[#efefef] rounded-[1.5em] cursor-pointer hover:bg-gray-200"
            onClick={() => {setView("toOtherBank");  setIsInternal(false)}}
          >
            <div className="flex items-center space-x-4">
              <Image
                src="/sender.svg"
                alt="Agent Icon"
                width={100}
                height={100}
                className="h-[4em] w-[4em] max-md-[400px]:w-[2em] max-md-[400px]:h-[2em]"
              />
              <div>
                <h3 className="font-semibold text-gray-800">
                  Send to Any Bank Account
                </h3>
                <p className="text-sm text-gray-600">
                  Send to a local bank account.
                </p>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        {/* Recent */}
        <div className="mt-6">
          <h4 className="font-semibold text-gray-800">Recent</h4>
          <div className="mt-4 flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg">
            <Image
              src="/recents.svg"
              alt="Agent Icon"
              width={100}
              height={100}
              className="h-[4em] w-[4em] max-md-[400px]:w-[2em] max-md-[400px]:h-[2em] "
            />
            <p className="text-sm text-gray-600 mt-2">Nothing to see yet.</p>
            <p className="text-sm text-gray-500">
              Send some money and we'll show you your recent transactions here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMoneyModal;
