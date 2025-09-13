"use client";
import React from 'react';
import { 
  Smartphone, 
  User, 
  Trash2, 
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import image from 'next/image';
import { createWhatsAppLink, SUPPORT_MESSAGES } from '@/utils/whatsappSupport';
const AccountDeletionPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* Logo and Back Button */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-40 h-40 rounded-full flex items-center justify-center mr-3">
                <a href="/">
                <img 
                  src="/logo.svg" 
                  alt="SwiftConnect Logo" 
                  className="w-full h-full " 
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                </a>
                
              </div>
             
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Deletion Instructions</h1>
            <p className="text-gray-600">To delete your account, please follow these steps:</p>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Smartphone className="text-blue-600" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 1: Log In</h3>
                <p className="text-gray-600 leading-relaxed">
                  Ensure you are logged in to the SwiftConnect mobile application or web platform using your registered credentials.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="text-green-600" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 2: Navigate to Profile</h3>
                <p className="text-gray-600 leading-relaxed">
                  Access your profile settings within the app. You can find this in the main menu under "Settings" or by tapping your profile picture.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Trash2 className="text-red-600" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 3: Find 'Delete Account'</h3>
                <p className="text-gray-600 leading-relaxed">
                  Locate and select the "Delete Account" option in your profile settings. This is usually found under "Account Management" or "Privacy Settings".
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="text-purple-600" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 4: Complete Deletion</h3>
                <p className="text-gray-600 leading-relaxed">
                  Follow the prompts to complete the account deletion process. You may be required to verify your identity and confirm your decision.
                </p>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-900 mb-1">Important Notice</h4>
                <p className="text-yellow-800 text-sm">
                  Account deletion is permanent and cannot be undone. All your data, transaction history, and account information will be permanently removed from our systems within 30 days.
                </p>
              </div>
            </div>
          </div>

          {/* Data Retention Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">What happens to your data?</h4>
            <ul className="text-blue-800 text-sm space-y-1 ml-4">
              <li>• Personal information will be deleted within 30 days</li>
              <li>• Transaction records may be retained for regulatory compliance (up to 7 years)</li>
              <li>• Anonymized usage data may be retained for service improvement</li>
              <li>• You can request a copy of your data before deletion</li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              If you encounter any issues, please contact our support team for assistance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
              <a 
                href="mailto:support@swiftconnect.com.ng" 
                className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium"
              >
                <span>support@swiftconnect.com.ng</span>
              </a>
              <a 
                href={createWhatsAppLink(SUPPORT_MESSAGES.ACCOUNT)} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium"
              >
                <FaWhatsapp className="text-green-500" />
                <span>WhatsApp Support</span>
              </a>
            </div>
          </div>

          {/* Alternative Options */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Need a break instead?</h4>
            <p className="text-gray-600 text-sm mb-4">
              If you're not ready to permanently delete your account, consider these alternatives:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <button className="p-3 bg-white border border-gray-200 rounded-lg text-left hover:border-green-300 transition-colors">
                <h5 className="font-medium text-gray-900 text-sm">Deactivate Account</h5>
                <p className="text-gray-600 text-xs mt-1">Temporarily disable your account</p>
              </button>
              <button className="p-3 bg-white border border-gray-200 rounded-lg text-left hover:border-green-300 transition-colors">
                <a href="privacy"><h5 className="font-medium text-gray-900 text-sm">Privacy Settings</h5>
                <p className="text-gray-600 text-xs mt-1">Control what data we collect</p></a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDeletionPage;