"use client";

import { useState, useEffect } from "react";
import { FaSave, FaTimes, FaUserCog, FaShieldAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const UserForm = ({ data, roles = [], onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "user",
    is_active: true,
    permissions: {
      users: false,
      transactions: false,
      kyc: false,
      support: false,
      finance: false,
      resellers: false,
      marketing: false,
      api: false,
      system: false,
      audit: false,
    },
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setFormData({
        id: data.id,
        username: data.username || "",
        email: data.email || "",
        role: data.role || "user",
        is_active: data.is_active !== undefined ? data.is_active : true,
        permissions: {
          users: data.permissions?.includes('users') || false,
          transactions: data.permissions?.includes('transactions') || false,
          kyc: data.permissions?.includes('kyc') || false,
          support: data.permissions?.includes('support') || false,
          finance: data.permissions?.includes('finance') || false,
          resellers: data.permissions?.includes('resellers') || false,
          marketing: data.permissions?.includes('marketing') || false,
          api: data.permissions?.includes('api') || false,
          system: data.permissions?.includes('system') || false,
          audit: data.permissions?.includes('audit') || false,
        },
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

  const handlePermissionChange = (permission, checked) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: checked
      }
    }));
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
      // Convert permissions object to array
      const permissionsArray = Object.entries(formData.permissions)
        .filter(([key, value]) => value)
        .map(([key]) => key);

      const submitData = {
        ...formData,
        permissions: permissionsArray
      };

      await onSave(submitData);
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPermissionDescription = (permission) => {
    const descriptions = {
      users: "Manage user accounts, roles, and permissions",
      transactions: "View and manage all transaction data",
      kyc: "Handle KYC verification and approval processes",
      support: "Access customer support tools and tickets",
      finance: "Manage financial operations and reports",
      resellers: "Handle reseller management and commissions",
      marketing: "Access marketing tools and campaigns",
      api: "Manage API keys and integrations",
      system: "Access system monitoring and configurations",
      audit: "View audit logs and compliance reports"
    };
    return descriptions[permission] || "Permission description not available";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <FaUserCog className="text-blue-600" />
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
        {/* User Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Information</h3>
          
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
                Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.role ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.name.toLowerCase()}>
                    {role.name}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
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
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <FaShieldAlt className="text-green-600" />
            Permissions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(formData.permissions).map(([permission, checked]) => (
              <div key={permission} className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id={permission}
                  checked={checked}
                  onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <label htmlFor={permission} className="text-sm font-medium text-gray-900 capitalize">
                    {permission.replace('_', ' ')}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    {getPermissionDescription(permission)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

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
