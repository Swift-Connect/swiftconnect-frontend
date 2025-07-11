import React from 'react';

export default function SwiftConnectReceiptModal({ isOpen, onClose, receiptData, recipient, narration, amount }) {
  if (!isOpen) return null;

  // Fallbacks for receiptData
  const txn = receiptData || {};
  const date = txn.created_at ? new Date(txn.created_at).toLocaleString() : new Date().toLocaleString();
  const txnId = txn.transaction_id || txn.id || 'N/A';

  const handleDownloadReceipt = async () => {
    const receiptElement = document.getElementById('swiftconnect-receipt-container');
    if (receiptElement) {
      try {
        const canvas = await window.html2canvas(receiptElement);
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `swiftconnect-receipt-${txnId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        alert('Failed to download receipt');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg" id="swiftconnect-receipt-container">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Transfer Successful!</h2>
          <p className="text-gray-600">Your Swift Connect transfer was successful</p>
          <p className="text-sm text-gray-500 mt-2">A receipt has been sent to your email</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Transaction Details</h3>
          <div className="space-y-3">
            <div className="flex flex-wrap justify-between sm:items-center gap-1 sm:gap-0">
              <span className="text-gray-600 text-sm sm:text-base">Amount:</span>
              <span className="font-medium text-nowrap text-ellipsis overflow-hidden text-sm sm:text-base">₦{amount}</span>
            </div>
            <div className="flex flex-wrap justify-between sm:items-center gap-1 sm:gap-0">
              <span className="text-gray-600 text-sm sm:text-base">Recipient:</span>
              <span className="font-medium text-nowrap text-ellipsis overflow-hidden text-sm sm:text-base">{recipient}</span>
            </div>
            <div className="flex flex-wrap justify-between sm:items-center gap-1 sm:gap-0">
              <span className="text-gray-600 text-sm sm:text-base">Narration:</span>
              <span className="font-medium text-nowrap text-ellipsis overflow-hidden text-sm sm:text-base">{narration}</span>
            </div>
            <div className="flex flex-wrap justify-between sm:items-center gap-1 sm:gap-0">
              <span className="text-gray-600 text-sm sm:text-base">Transaction ID:</span>
              <span className="font-medium text-nowrap text-ellipsis overflow-hidden text-sm sm:text-base">{txnId}</span>
            </div>
            <div className="flex flex-wrap justify-between sm:items-center gap-1 sm:gap-0">
              <span className="text-gray-600 text-sm sm:text-base">Date:</span>
              <span className="font-medium text-nowrap text-ellipsis overflow-hidden text-sm sm:text-base">{date}</span>
            </div>
            <div className="flex flex-wrap justify-between sm:items-center gap-1 sm:gap-0">
              <span className="text-gray-600 text-sm sm:text-base">Status:</span>
              <span className="font-medium text-green-600 text-sm sm:text-base">Completed</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 sm:space-x-4">
          <button
            onClick={handleDownloadReceipt}
            className="w-full sm:flex-1 bg-gray-100 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center text-sm sm:text-base"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Receipt
          </button>
          <button
            onClick={onClose}
            className="w-full sm:flex-1 bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors text-sm sm:text-base"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
} 