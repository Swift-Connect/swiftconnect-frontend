
"use client";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import Form from "./components/form";
import AppearanceSettings from "./components/appearaanceSSettings";
import PricingPlans from "./components/billing";
 
import EditorPage from "./components/termsAndCondition";

export default function ProfileSettings() {
  const [formData, setFormData] = useState({
    name: "Charlene Reed",
    username: "Charlene Reed",
    email: "charlenereed@gmail.com",
    dob: "1990-01-25",
    address: "San Jose, California, USA",
    city: "San Jose",
    country: "USA",
    password: "password",
  });

  const [activeTab, setActiveTab] = useState(0); // Track the active tab

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Edit Profile
        return <Form formData={formData} />;
      case 1: // Appearance
        return <AppearanceSettings />;
      case 2: // Billing
        return <PricingPlans />;
      case 3: // Terms & Conditions
        return <EditorPage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-8">
        <h2 className="text-2xl font-semibold mb-6">Settings</h2>

        {/* Tabs */}
        <div className="flex space-x-8 border-b mb-8">
          {["Edit Profile", "Appearance", "Billing", "Terms & Conditions"].map(
            (tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)} // Update active tab on click
                className={`pb-2 ${
                  index === activeTab
                    ? "border-b-2 border-green-600 text-green-600 font-medium"
                    : "text-gray-400"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Render Tab Content */}
        <div className="flex gap-8">{renderTabContent()}</div>
      </div>
    </div>
  );
}
