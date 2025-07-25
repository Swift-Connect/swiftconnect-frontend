import Image from "next/image";
import React from "react";
import Modal from '../../../../components/common/Modal';

export default function SuccessModal({ isOpen, onClose, header, subtext, setActiveSidebar }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white w-[45%] rounded-xl shadow-lg px-6 py-16 flex items-center justify-center flex-col max-md-[400px]:w-full">
          <Image
            src={"hurray.svg"}
            alt="success icon"
            width={100}
            height={100}
            className="w-[8em] max-md-[400px]:w-[6em]"
          />
          <h2 className="text-[48px] text-center max-md-[400px]:text-[32px] font-bold text-gray-800 mb-4">
            {header ? header : "Successful"}
          </h2>
          <p className="text-[16px] text-[#6B7280] w-[50%] text-center mb-10 max-md-[400px]:w-full">
            {subtext
              ? subtext
              : " Your transfer was completed successfully, and the recipient will receive the funds shortly."}
          </p>
          <div className="flex w-full gap-6">
            {header ? null : (
              <button
                className="w-full text-black font-bold py-4 rounded-lg shadow-sm bg-[#e9e8e8] hover:bg-blue-700"
                // onClick={onClose}
              >
                Share Reciept
              </button>
            )}
            <button
              className="w-full text-white py-4 rounded-lg shadow-sm bg-black hover:bg-[#8f8f8f]"
              onClick={() => {
                header ? setActiveSidebar("Dashboard") : onClose();
              }}
            >
              {header ? "Done" : " Back to Home"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
