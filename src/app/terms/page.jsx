import React from 'react';
import { 
  Home, 
  CreditCard, 
  Wallet, 
  Gift, 
  Settings, 
  Code, 
  Search,
  MessageCircle,
  Bell,
  Shield,
  Calendar
} from 'lucide-react';
import Sidebar from '../dashboard/components/sidebar';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
     <Sidebar/>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-gray-600">Welcome back</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search for something" 
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
              />
            </div>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <MessageCircle size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 relative">
              <Bell size={20} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>
          </div>
        </div>

        {/* Last Updated Date */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar size={16} />
            <span>Last updated: January 15, 2025</span>
          </div>
        </div>

        {/* Privacy Policy Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="text-green-600" size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Privacy Policy for SwiftConnect</h2>
                <p className="text-gray-600 mt-1">Protecting your privacy and personal information</p>
              </div>
            </div>

            {/* Introduction */}
            <div className="prose max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed">
                SwiftConnect is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our website (https://swiftconnect.com.ng/), mobile application, or services related to telecommunications and financial technology (fintech) in Nigeria, including mobile payments, data services, and other value-added services.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                This Privacy Policy complies with the Nigerian Data Protection Act (NDPA) 2023, regulations from the Nigerian Communications Commission (NCC), the National Information Technology Development Agency (NITDA), and Google Play Store's Developer Program Policies.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-blue-800 font-medium">
                  By using our services, you agree to the collection and use of your information in accordance with this Privacy Policy. If you do not agree with this policy, please do not use our services.
                </p>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
              {/* Section 1: Information We Collect */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h3>
                <p className="text-gray-700 mb-4">We collect information to provide and improve our telecommunications and fintech services. The types of information we collect include:</p>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">1.1 Personal Information</h4>
                    <ul className="text-gray-700 space-y-1 ml-4">
                      <li>• <strong>Identity Data:</strong> Name, date of birth, gender, and other identifiers</li>
                      <li>• <strong>Contact Data:</strong> Phone number, email address, billing address, and other contact details</li>
                      <li>• <strong>Financial Data:</strong> Bank account details, payment card information, transaction history, and mobile money account details</li>
                      <li>• <strong>Government-Issued Identifiers:</strong> National Identification Number (NIN), SIM card details, or other identifiers required for compliance</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">1.2 Device and Usage Data</h4>
                    <ul className="text-gray-700 space-y-1 ml-4">
                      <li>• <strong>Device Information:</strong> Device type, operating system, unique device identifiers (IMEI, SIM card serial number), IP address, and mobile network information</li>
                      <li>• <strong>Usage Data:</strong> Information about how you use our website, app, or services, including call logs, SMS activity, data usage, and browsing history</li>
                      <li>• <strong>Location Data:</strong> Geolocation data (with your consent) to provide location-based services</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 2: How We Collect Information */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">2. How We Collect Information</h3>
                <p className="text-gray-700 mb-4">We collect information through:</p>
                <ul className="text-gray-700 space-y-2 ml-4">
                  <li>• <strong>Direct Interactions:</strong> When you register for an account, subscribe to our services, make payments, or contact customer support</li>
                  <li>• <strong>Automated Technologies:</strong> Through cookies, server logs, and similar technologies when you use our website or app</li>
                  <li>• <strong>Third Parties:</strong> From partners such as mobile network operators, payment processors, or analytics providers</li>
                  <li>• <strong>Device Permissions:</strong> With your consent, we may access device features like location, call logs, or SMS for specific functionalities</li>
                </ul>
              </section>

              {/* Section 3: How We Use Your Information */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h3>
                <p className="text-gray-700 mb-4">We use your information to provide, improve, and secure our services, in compliance with Nigerian laws and Google Play policies. Purposes include:</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">Service Delivery</h4>
                    <ul className="text-green-800 text-sm space-y-1">
                      <li>• Provide telecommunications services</li>
                      <li>• Process mobile payments and transfers</li>
                      <li>• Personalize your experience</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Compliance & Verification</h4>
                    <ul className="text-blue-800 text-sm space-y-1">
                      <li>• Verify your identity</li>
                      <li>• Comply with NCC's SIM registration requirements</li>
                      <li>• Meet KYC and AML obligations</li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-900 mb-2">Security & Fraud Prevention</h4>
                    <ul className="text-red-800 text-sm space-y-1">
                      <li>• Detect and prevent fraud</li>
                      <li>• Prevent cyberattacks or unauthorized access</li>
                      <li>• Ensure transaction security</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-900 mb-2">Analytics & Improvements</h4>
                    <ul className="text-purple-800 text-sm space-y-1">
                      <li>• Analyze usage patterns</li>
                      <li>• Improve our services and app functionality</li>
                      <li>• Conduct research and develop new features</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 4: Your Rights */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">8. Your Rights</h3>
                <p className="text-gray-700 mb-4">Under the NDPA and applicable laws, you have the following rights:</p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-yellow-900 mb-2">Data Access & Control</h4>
                      <ul className="text-yellow-800 text-sm space-y-1">
                        <li>• <strong>Access:</strong> Request a copy of your personal data</li>
                        <li>• <strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                        <li>• <strong>Erasure:</strong> Request deletion of your data</li>
                        <li>• <strong>Data Portability:</strong> Receive your data in a structured format</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-yellow-900 mb-2">Processing Control</h4>
                      <ul className="text-yellow-800 text-sm space-y-1">
                        <li>• <strong>Restriction:</strong> Limit processing of your data</li>
                        <li>• <strong>Object:</strong> Object to processing for marketing purposes</li>
                        <li>• <strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-yellow-800 text-sm mt-4 font-medium">
                    To exercise these rights, contact us at privacy@swiftconnect.com.ng. We will respond within 30 days as required by the NDPA.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section className="bg-gray-900 text-white rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">14. Contact Us</h3>
                <p className="mb-4">If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Data Protection Officer:</p>
                <div className="space-y-2">
                  <p><strong>SwiftConnect</strong></p>
                  <p>No 119, Oke-Amola, Ikirun, Osun State Nigeria</p>
                  <p>Email: <a href="mailto:privacy@swiftconnect.com.ng" className="text-green-400 hover:text-green-300">privacy@swiftconnect.com.ng</a></p>
                  <p>Phone: <a href="tel:+2349040940090" className="text-green-400 hover:text-green-300">+234 904 094 0090</a></p>
                </div>
                <p className="mt-4 text-sm text-gray-300">
                  You may also lodge a complaint with the Nigeria Data Protection Commission (NDPC) if you believe we have not addressed your concerns adequately.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;