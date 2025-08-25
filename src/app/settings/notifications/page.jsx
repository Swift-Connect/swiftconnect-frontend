'use client';

import React, { useState, useEffect } from 'react';
import { FaBell, FaEnvelope, FaMobile, FaSave, FaCheck } from 'react-icons/fa';
import { useNotifications, NOTIFICATION_CATEGORIES } from '@/hooks/useNotifications';
import { toast } from 'react-toastify';

const NotificationPreferences = () => {
  const { preferences, updatePreferences, loading } = useNotifications(false);
  const [formData, setFormData] = useState({
    email_enabled: true,
    in_app_enabled: true,
    sms_enabled: false,
    categories: {}
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (preferences) {
      setFormData({
        email_enabled: preferences.email_enabled || true,
        in_app_enabled: preferences.in_app_enabled || true,
        sms_enabled: preferences.sms_enabled || false,
        categories: preferences.categories || {}
      });
    }
  }, [preferences]);

  const handleGlobalToggle = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleCategoryToggle = (category, type) => {
    setFormData(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: {
          ...prev.categories[category],
          [type]: !(prev.categories[category]?.[type] || false)
        }
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await updatePreferences(formData);
      if (success) {
        toast.success('Notification preferences updated successfully');
      } else {
        toast.error('Failed to update preferences');
      }
    } catch (error) {
      toast.error('An error occurred while saving preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (preferences) {
      setFormData({
        email_enabled: preferences.email_enabled || true,
        in_app_enabled: preferences.in_app_enabled || true,
        sms_enabled: preferences.sms_enabled || false,
        categories: preferences.categories || {}
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notification Preferences</h1>
        <p className="text-gray-600">Manage how you receive notifications from SwiftConnect</p>
      </div>

      <div className="bg-white rounded-lg shadow border">
        {/* Global Settings */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Global Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaEnvelope className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
              </div>
              <button
                onClick={() => handleGlobalToggle('email_enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.email_enabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.email_enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaBell className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">In-App Notifications</h3>
                  <p className="text-sm text-gray-600">Receive notifications within the app</p>
                </div>
              </div>
              <button
                onClick={() => handleGlobalToggle('in_app_enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.in_app_enabled ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.in_app_enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaMobile className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">SMS Notifications</h3>
                  <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                </div>
              </div>
              <button
                onClick={() => handleGlobalToggle('sms_enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.sms_enabled ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.sms_enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Category Settings */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Category Settings</h2>
          <p className="text-sm text-gray-600 mb-6">
            Choose which types of notifications you want to receive for each category
          </p>

          <div className="space-y-6">
            {Object.entries(NOTIFICATION_CATEGORIES).map(([key, category]) => (
              <div key={key} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${category.color}`}>
                      {category.label}
                    </span>
                    <h3 className="font-medium text-gray-900">{category.label} Notifications</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Email</span>
                    </div>
                    <button
                      onClick={() => handleCategoryToggle(key, 'email')}
                      disabled={!formData.email_enabled}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        formData.categories[key]?.email && formData.email_enabled ? 'bg-blue-600' : 'bg-gray-200'
                      } ${!formData.email_enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          formData.categories[key]?.email && formData.email_enabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FaBell className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">In-App</span>
                    </div>
                    <button
                      onClick={() => handleCategoryToggle(key, 'in_app')}
                      disabled={!formData.in_app_enabled}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        formData.categories[key]?.in_app && formData.in_app_enabled ? 'bg-green-600' : 'bg-gray-200'
                      } ${!formData.in_app_enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          formData.categories[key]?.in_app && formData.in_app_enabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FaMobile className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium">SMS</span>
                    </div>
                    <button
                      onClick={() => handleCategoryToggle(key, 'sms')}
                      disabled={!formData.sms_enabled}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        formData.categories[key]?.sms && formData.sms_enabled ? 'bg-purple-600' : 'bg-gray-200'
                      } ${!formData.sms_enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          formData.categories[key]?.sms && formData.sms_enabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="w-4 h-4" />
                  Save Preferences
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">About Notifications</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• <strong>System:</strong> Important system updates and maintenance notifications</p>
          <p>• <strong>Account:</strong> Account-related notifications like verification and security alerts</p>
          <p>• <strong>Transaction:</strong> Payment confirmations and transaction updates</p>
          <p>• <strong>Security:</strong> Security alerts and login notifications</p>
          <p>• <strong>Referral:</strong> Referral program updates and earnings notifications</p>
          <p>• <strong>KYC:</strong> KYC verification status and document updates</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;
