"use client";

import { useState, useEffect } from "react";
import { FaSave, FaTimes, FaUser, FaEnvelope, FaShieldAlt, FaPhone, FaCalendar, FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const UserForm = ({ data, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    fullname: "",
    date_of_birth: "",
    gender: "",
    residential_address: "",
    role: "user",
    is_active: true,
    is_staff: false,
    is_superuser: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setFormData({
        id: data.id,
        username: data.username || "",
        email: data.email || "",
        phone_number: data.phone_number || "",
        fullname: data.fullname || "",
        date_of_birth: data.date_of_birth || "",
        gender: data.gender || "",
        residential_address: data.residential_address || "",
        role: data.role || "user",
        is_active: data.is_active !== undefined ? data.is_active : true,
        is_staff: data.is_staff || false,
        is_superuser: data.is_superuser || false,
      });
    }
  }, [data]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    }

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Full name is required";
    }
    
    if (!formData.role) {
      newErrors.role = "Role is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before saving");
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: "user", label: "User", description: "Regular user with basic access" },
    { value: "admin", label: "Admin", description: "Administrative access to manage users and content" },
    { value: "manager", label: "Manager", description: "Team management and oversight capabilities" },
    { value: "superadmin", label: "Super Admin", description: "Full system access and control" },
  ];

  const genders = [
    { value: "", label: "Select Gender" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <FaUser className="text-blue-600" />
          {data ? `Edit User: ${data.username}` : 'Add New User'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 p-2"
          title="Cancel"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <FaUser className="text-blue-600" />
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter username"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullname}
                onChange={(e) => handleInputChange('fullname', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.fullname ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter full name"
              />
              {errors.fullname && (
                <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone_number}
                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.phone_number ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter phone number"
              />
              {errors.phone_number && (
                <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {genders.map(gender => (
                  <option key={gender.value} value={gender.value}>
                    {gender.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Residential Address
            </label>
            <input
              type="text"
              value={formData.residential_address}
              onChange={(e) => handleInputChange('residential_address', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter residential address"
            />
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <FaShieldAlt className="text-green-600" />
            Account Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.role ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {roles.find(r => r.value === formData.role)?.description}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Status
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                  Active Account
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Inactive accounts cannot access the system
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Staff Access
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_staff"
                  checked={formData.is_staff}
                  onChange={(e) => handleInputChange('is_staff', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_staff" className="ml-2 text-sm text-gray-700">
                  Staff Member
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Staff members have administrative access
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Super User
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_superuser"
                  checked={formData.is_superuser}
                  onChange={(e) => handleInputChange('is_superuser', e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="is_superuser" className="ml-2 text-sm text-gray-700">
                  Super User
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Super users have full system access
              </p>
            </div>
          </div>
        </div>

        {/* Current User Information (Read-only) */}
        {data && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <FaEnvelope className="text-blue-600" />
              Current Verification Status
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Verification</label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  data.email_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {data.email_verified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Verification</label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  data.phone_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {data.phone_verified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">KYC Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  data.kyc_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {data.kyc_verified ? 'Approved' : data.kyc_status?.has_kyc ? 'Pending' : 'Not Submitted'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Transaction PIN</label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  data.has_transaction_pin ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {data.has_transaction_pin ? 'Set' : 'Not Set'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <FaSave className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
