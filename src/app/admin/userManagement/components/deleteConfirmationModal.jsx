import { FaExclamationTriangle, FaUser, FaTimes, FaTrashAlt } from "react-icons/fa";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, userData }) => {
  if (!isOpen || !userData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FaExclamationTriangle className="text-red-500" />
            Confirm Delete
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-700 mb-2">
              Are you sure you want to delete this user?
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FaUser className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-red-900">{userData?.username}</p>
                  <p className="text-sm text-red-700">{userData?.email}</p>
                  <p className="text-xs text-red-600">ID: {userData?.id}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <FaExclamationTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Warning</p>
                <p className="text-xs text-yellow-700 mt-1">
                  This action cannot be undone. All user data, including KYC information, 
                  referral data, and transaction history will be permanently deleted.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center gap-2"
          >
            <FaTrashAlt className="w-4 h-4" />
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
