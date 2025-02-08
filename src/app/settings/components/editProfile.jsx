"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function EditProfile({ user }) {
  // Initial values (can be set from an API)
  // console.log(user);

  const initialProfile = {
    name: user.fullname,
    username: user.username,
    email: user.email,
    phoneNumber: user.phone_number,
  };

  // State for input fields
  const [profile, setProfile] = useState(initialProfile);
  const [isChanged, setIsChanged] = useState(false);

  // Handle input change
  const handleInputChange = (field) => (e) => {
    const newValue = e.target.value;
    setProfile((prev) => {
      const updatedProfile = { ...prev, [field]: newValue };

      // Compare updatedProfile with initialProfile
      const hasChanges = Object.keys(initialProfile).some(
        (key) => updatedProfile[key] !== initialProfile[key]
      );

      setIsChanged(hasChanges);
      return updatedProfile;
    });
  };

  // Handle save button
  const handleSave = () => {
    console.log("Updated Profile:", profile);
  };

  return (
    <>
      <div className="mt-6 flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
        <div className="relative w-[6em] h-[5em] mx-auto md:mx-0">
          <Image
            src="https://plus.unsplash.com/premium_photo-1689977927774-401b12d137d6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8fA%3D%3D"
            alt="Profile"
            width={100}
            height={100}
            className="rounded-full w-[6em] h-[5em] object-cover border border-gray-300"
          />
        </div>

        <div className="flex flex-col w-full space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={handleInputChange("name")}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                User Name
              </label>
              <input
                type="text"
                value={profile.username}
                onChange={handleInputChange("username")}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={handleInputChange("email")}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                value={profile.phoneNumber}
                onChange={handleInputChange("phoneNumber")}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className={`bg-black text-white px-6 py-3 rounded-md shadow ${
            !isChanged ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!isChanged}
        >
          Save
        </button>
      </div>
    </>
  );
}
