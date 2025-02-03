"use client";
import { useState } from "react";
import Image from "next/image";

export default function EditProfile() {
  const [profileImage, setProfileImage] = useState("/profile-image.png");

  return (
    <>
      <div className="mt-6 flex space-x-6">
        <div className="relative w-[6em] h-[5em]">
          <Image
            src={
              "https://plus.unsplash.com/premium_photo-1689977927774-401b12d137d6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt="Profile"
            width={100}
            height={100}
            className="rounded-full w-[6em] h-[5em] object-cover border border-gray-300"
          />
          <label className="absolute bottom-0 right-0 w-[1em] h-[1em] fle bg-black text-white rounded-full p-1 cursor-pointer">
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
    </>
  );
}
