"use client";
import { useState } from "react";
import Image from "next/image";

export default function EditProfile() {
  const [profileImage, setProfileImage] = useState("/profile-image.png");

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="border-b pb-2 flex space-x-6">
        <button className="text-black font-medium border-b-2 border-black pb-2">
          Edit Profile
        </button>
        <button className="text-gray-400 font-medium">Security</button>
      </div>

      <div className="mt-6 flex items-center space-x-6">
        <div className="relative w-20 h-20">
          <Image
            src={profileImage}
            alt="Profile"
            width={80}
            height={80}
            className="rounded-full object-cover border border-gray-300"
          />
          <label className="absolute bottom-0 right-0 bg-black text-white rounded-full p-1 cursor-pointer">
            ✎
            <input type="file" className="hidden" onChange={() => {}} />
          </label>
        </div>

        <div className="flex flex-col w-full space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                value="Akinde Praise"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                User Name
              </label>
              <input
                type="text"
                value="Chosenfolio"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value="Chosenfolio@gmail.com"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                value="(1) 8976 4567 666"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="bg-black text-white px-6 py-3 rounded-md shadow">
          Save
        </button>
      </div>
    </div>
  );
}
