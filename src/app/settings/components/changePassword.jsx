import { useState } from "react";
import { Eye, EyeOffIcon, X } from "lucide-react";
import { updateUserProfile } from '../../../api/index.js'

export default function ChangePasswordModal({ onClose }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const isDisabled = !oldPassword || !newPassword || loading;

  const handleChangePassword = async () => {
    setLoading(true);
    setSuccess('');
    setError('');
    setFieldErrors({});
    try {
      await updateUserProfile({ current_password: oldPassword, new_password: newPassword });
      setSuccess('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      // Use err.data for backend field errors
      if (err && err.data && typeof err.data === 'object') {
        setFieldErrors(err.data);
        if (err.data.non_field_errors) setError(err.data.non_field_errors[0]);
        else setError('Failed to change password.');
      } else if (err && err.message && err.message.toLowerCase().includes('current password')) {
        setFieldErrors({ current_password: ['Current password is incorrect.'] });
        setError('Current password is incorrect.');
      } else {
        setError('Failed to change password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" style={{backdropFilter: 'blur(2px)'}}>
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Change Password
        </h2>

        {/* Password Fields */}
        <div className="space-y-6">
          {/* Old Password */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                placeholder="Enter your current password"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00613A] focus:outline-none text-base bg-[#F9FAFB] ${fieldErrors.current_password ? 'border-red-500' : 'border-gray-200'}`}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-700"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? (
                  <EyeOffIcon className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {fieldErrors.current_password && (
              <div className="text-red-600 text-xs mt-1">{fieldErrors.current_password[0]}</div>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter your new password"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00613A] focus:outline-none text-base bg-[#F9FAFB] ${fieldErrors.new_password ? 'border-red-500' : 'border-gray-200'}`}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-700"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOffIcon className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {fieldErrors.new_password && (
              <div className="text-red-600 text-xs mt-1">{fieldErrors.new_password[0]}</div>
            )}
          </div>
        </div>

        {/* Change Password Button */}
        <button
          className={`w-full mt-8 py-3 rounded-lg text-white font-semibold transition text-base ${
            isDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#00613A] hover:bg-[#004d29]"
          }`}
          disabled={isDisabled}
          onClick={handleChangePassword}
        >
          {loading ? 'Changing...' : 'Change Password'}
        </button>
        {success && <div className="text-green-600 text-sm mt-4 text-center">{success}</div>}
        {error && <div className="text-red-600 text-sm mt-4 text-center">{error}</div>}
      </div>
    </div>
  );
}
