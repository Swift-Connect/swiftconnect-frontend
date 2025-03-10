"use client";

import { X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
const MenuItems = {
  user: [
    { label: "Dashboard", icon: "home.svg" },
    { label: "Pay Bills", icon: "Pay.svg" },
    { label: "Cards", icon: "Card.svg" },
    { label: "Reward", icon: "Gift.svg" },
    { label: "Settings", icon: "settings.svg" },
    { label: "Developer API", icon: "code-tags.svg" },
  ],
  admin: [
    { label: "Dashboard", icon: "home.svg" },
    { label: "User Management", icon: "home.svg" },
    { label: "Role-Based Access Control", icon: "home.svg" },
    { label: "Transaction Management", icon: "home.svg" },
    { label: "Banking Services", icon: "home.svg" },
    { label: "Payment Gateway Integration", icon: "home.svg" },
    { label: "Virtual Card Management", icon: "home.svg" },
    { label: "Reseller Management", icon: "home.svg" },
    { label: "Service Management API", icon: "home.svg" },
    { label: "Referral System", icon: "home.svg" },
    { label: "Marketing Tools", icon: "home.svg" },
    { label: "Notification System", icon: "home.svg" },
    { label: "Reports and Analytics", icon: "home.svg" },
    { label: "System Monitoring", icon: "home.svg" },
    { label: "API Management", icon: "home.svg" },
    { label: "Audit Logs", icon: "home.svg" },
    { label: "Settings", icon: "home.svg" },
    { label: "Customer Support", icon: "home.svg" },
  ],
};
export default function Sidebar({
  setActiveSidebar,
  setHideSideMenu,
  hideSideMenu,
  data,
  user,
  role,
}) {
  const [active, setActive] = useState("Dashboard");

  // const handleHideSideMenu = () => {
  //   setHideSideMenu(true);
  // };

  const menuList = MenuItems[role] || [];
  return (
    <aside
      className={`${
        role === "admin" ? "w-[25%]" : "w-[18%]"
      } bg-white shadow-md h-screen flex flex-col justify-between ${
        hideSideMenu
          ? "max-md-[400px]:hidden "
          : "max-md-[400px]:absolute max-md-[400px]:w-[70%] max-md-[400px]:z-20"
      }`}
    >
      <div className="flex items-center p-4 gap-4">
        <img src="/logo.svg" alt="Logo" className=" w-30" />
        <p
          onClick={() => {
            setHideSideMenu(true);
            console.log(hideSideMenu);
          }}
        >
          <X className="max-[400px]:block hidden" />
        </p>
        {/* <span className="ml-2 font-bold text-xl">Swift Connect</span> */}
      </div>
      <div className="overflow-y-scroll custom-scroll">
        <div>
          <nav className="mt-4 flex flex-col gap-5">
            {menuList.map(({ label, icon }, index) => (
              <React.Fragment key={label}>
                <button
                  onClick={() => {
                    setActive(label);
                    setActiveSidebar(label);
                  }}
                  className={`flex px-4 py-2 text-[16px] text-gray-600 hover:bg-gray-200 hover:text-primary items-center gap-4 w-full rounded-r-md ${
                    active === label ? "bg-[#0E1318] text-white" : ""
                  }`}
                >
                  <Image
                    src={
                      active === label
                        ? `sidebar/white/${icon}`
                        : `sidebar/gray/${icon}`
                    }
                    width={100}
                    height={100}
                    className={`w-[1.6em] ${
                      active === label ? "text-white" : "text-gray-600"
                    }`}
                    alt={`${label} icon`}
                  />
                  {label}
                </button>
                {role === "admin"
                  ? (index === 2 ||
                      index === 6 ||
                      index === 8 ||
                      index === 11 ||
                      index === 13 ||
                      label === "Customer Support") && (
                      <hr className="border-t border-gray-300 my-8 w-[90%] mx-auto" />
                    )
                  : ""}
              </React.Fragment>
            ))}
          </nav>
        </div>
        {role === "admin" ? (
          ""
        ) : (
          <div className="p-1 mt-12">
            <div className="bg-secondary p-4 rounded-lg text-[#00613A] bg-[#F6FCF5]">
              <h1 className="text-[16px] font-semibold mb-1">
                Pay Your Bills in Seconds
              </h1>
              <p className="text-[12px]">
                Set up your utility, phone, and internet bill payments through
                our app, and earn loyalty points with every payment.
              </p>
              <div className="w-full py-5 flex items-center justify-center">
                <Image
                  src={"avatar.svg"}
                  alt="avatar"
                  width={100}
                  height={100}
                />
              </div>
            </div>
          </div>
        )}
        <div className="p-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div>
              <Image
                src={
                  "https://plus.unsplash.com/premium_photo-1689977927774-401b12d137d6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                alt="DP"
                width={100}
                height={100}
                className="w-[3em] h-[3em] rounded-full object-cover"
              />
            </div>
            <div>
              {" "}
              <p className="text-sm font-bold text-[#525252]">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500">Agent | ₦{data?.balance}</p>
            </div>
          </div>
          <div>
            <Image
              src={"logout.svg"}
              alt="logout"
              width={100}
              height={100}
              className="w-[2em]"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
