"use client";
import React, { useState } from "react";
import EditProfile from "./components/editProfile";
import Security from "./components/security"; // Make sure to import Security

const SettingsPage = ({user}) => {
  const [activeTab, setActiveTab] = useState("editProfile");

  return (
    <div className=" bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="border-b flex space-x-6">
        <button
          className={`font-medium pb-1 ${
            activeTab === "editProfile"
              ? "text-black border-b-2 border-black"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("editProfile")}
        >
          Edit Profile
        </button>
        <button
          className={`font-medium pb-1 ${
            activeTab === "security"
              ? "text-black border-b-2 border-black"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("security")}
        >
          Security
        </button>
      </div>

      {activeTab === "editProfile" ? <EditProfile user={user} /> : <Security />}
    </div>
  );
};

export default SettingsPage;
