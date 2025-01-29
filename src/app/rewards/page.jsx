"use client";

import {  EyeOff } from "lucide-react";
import Image from "next/image";

export default function Rewards() {
  const earnings = [
    {
      name: "Chiamaka Nwankwo",
      date: "11 Sep, 2024 09:58",
      amount: "₦2000.00",
      image:
        "https://plus.unsplash.com/premium_photo-1689977927774-401b12d137d6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Aisha Abdullahi",
      date: "08 Sep, 2024 09:58",
      amount: "₦2000.00",
      image: "https://plus.unsplash.com/premium_photo-1689977927774-401b12d137d6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Tochukwu Okeke",
      date: "05 Sep, 2024 09:58",
      amount: "₦2000.00",
      image: "https://plus.unsplash.com/premium_photo-1689977927774-401b12d137d6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Zainab Bello",
      date: "03 Sep, 2024 09:58",
      amount: "₦2000.00",
      image: "https://plus.unsplash.com/premium_photo-1689977927774-401b12d137d6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Nneka Umeh",
      date: "18 Aug, 2024 09:58",
      amount: "₦2000.00",
      image: "https://plus.unsplash.com/premium_photo-1689977927774-401b12d137d6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Tolu Ojo",
      date: "12 Aug, 2024 09:58",
      amount: "₦2000.00",
      image: "https://plus.unsplash.com/premium_photo-1689977927774-401b12d137d6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Boluwatife Falade",
      date: "03 Aug, 2024 09:58",
      amount: "₦2000.00",
      image: "https://plus.unsplash.com/premium_photo-1689977927774-401b12d137d6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-screen ">
      {/* Left Section */}
      <div className="w-full lg:w-[50%]">
        <h2 className="text-[18px] text-[#9CA3AF] font-medium flex items-center gap-2 mb-1">
          Reward Balance <EyeOff />
        </h2>
        <p className="text-2xl font-bold">₦12,880.50</p>

        {/* Bonuses */}
        <div className="mt-6">
          <h2 className="text-[18px] text-[#9CA3AF] font-medium">Bonuses</h2>
          <div className="bg-[#fff] border p-4 rounded-xl flex justify-between items-center gap-4">
            <Image
              src={"User-Group.svg"}
              alt="group-icon"
              width={100}
              height={100}
              className="w-[4em]"
            />
            <div>
              <p className="text-[18px] text-[#0E1318] font-semibold">
                View My Referrals
              </p>
              <p className="text-[14px] w-[70%] text-gray-500">
                Track your growing network of referrals in one place.
              </p>
            </div>
            <button className="bg-[#00613A] text-white px-4 py-1 rounded-[2em]">
              View
            </button>
          </div>

          <div className="bg-[#EDF9EB] border border-[#cacaca] pl-4 py-4 rounded-xl mt-4 flex items-center justify-between">
            <div className="flex flex-col items-cente gap-4">
              <div>
                <p className="text-[14px] font-medium">
                  Earn money from your referrals that become agents
                </p>
                <p className="text-[33px] font-bold text-[#00613A]">
                  ₦2,000{" "}
                  <span className="text-[18px] text-[#0E1318]">Cash</span>
                </p>
              </div>
              <button className="bg-[#00613A] text-white w-[65%] px-4 py-1 rounded-[3em]">
                Refer Now
              </button>
            </div>
            <Image
              src={"hand-holding-cash.svg"}
              width={100}
              height={100}
              className="w-[12em]"
              alt={"hand-holding-cash"}
            />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-[50%] bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold">Agent Referral Earning</h2>

        <div className="mt-4">
          <h3 className="text-gray-500 font-bold text-sm">Sept. 2024</h3>
          {earnings.slice(0, 4).map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={item.image}
                  width={100}
                  height={100}
                  className="w-[4em] h-[4em] rounded-full object-cover"
                  alt={item.name}
                />
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
              </div>
              <p className="text-[#00613A]  font-bold">{item.amount}</p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <h3 className="text-gray-500 font-bold text-sm">Aug. 2024</h3>
          {earnings.slice(4).map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={item.image}
                  width={100}
                  height={100}
                  className="w-[4em] h-[4em] rounded-full object-cover"
                  alt={item.name}
                />
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
              </div>
              <p className="text-[#00613A]  font-bold">{item.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
