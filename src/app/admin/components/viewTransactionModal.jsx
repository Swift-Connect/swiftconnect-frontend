import Image from "next/image";

const ViewTransactionModal = ({ transaction, onClose }) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="relative bg-white p-8 rounded-lg max-w-md w-full shadow-xl overflow-hidden">
        {/* Watermark */}
        <div className="absolute inset-0 flex justify-center items-center opacity-10 pointer-events-none">
          <Image
            src={"logo.svg"}
            alt="Watermark Logo"
            className="w-32 h-32 object-contain"
            width={0}
            height={0}
          />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-6 border-b pb-3">
          Transaction Receipt
        </h2>

        <div className="space-y-3 text-sm text-gray-800 relative z-10">
          <div className="flex justify-between">
            <span className="font-medium">Transaction ID:</span>
            <span>#{transaction.id || transaction.transaction_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Product:</span>
            <span>
              {transaction.product ||
              transaction.reason === "Wallet funding" ||
              transaction.reason === "Bank Transfer" ||
              transaction.reason === "Internal Transfer"
                ? "Transfer"
                : ""}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Amount:</span>
            <span className="font-semibold text-green-600">
              {transaction.amount}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Status:</span>
            <span
              className={`font-semibold ${
                transaction.status === "Completed"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {transaction.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Date:</span>
            <span>
              {transaction.date ||
                new Date(transaction.created_at).toLocaleDateString("en-GB")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Type:</span>
            <span>{transaction.transaction_type}</span>
          </div>
        </div>

        <div className="mt-6 text-right relative z-10">
          <button
            className="bg-gray-700 text-white px-5 py-2 rounded-md hover:bg-gray-800 transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTransactionModal;
