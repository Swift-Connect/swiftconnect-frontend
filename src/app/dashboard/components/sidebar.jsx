"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Sidebar({
  setActiveSidebar,
  setHideSideMenu,
  hideSideMenu,
}) {
  const [active, setActive] = useState("Dashboard");

  // const handleHideSideMenu = () => {
  //   setHideSideMenu(true);
  // };

  const MenutItems = [
    {
      label: "Dashboard",
      icon: "/home.svg",
    },
    { label: "Pay Bills", icon: "Pay.svg" },
    { label: "Cards", icon: "Card.svg" },
    { label: "Reward", icon: "Gift.svg" },
    { label: "Settings", icon: "settings.svg" },
    { label: "Developer API", icon: "code-tags.svg" },
  ];

  return (
    <aside
      className={`w-[18%]  bg-white shadow-md h-screen flex flex-col justify-between ${
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
          <X  className="max-[400px]:block hidden"/>
          
        </p>
        {/* <span className="ml-2 font-bold text-xl">Swift Connect</span> */}
      </div>
      <div className="overflow-y-scroll custom-scroll">
        <div>
          <nav className="mt-4 flex flex-col gap-5">
            {MenutItems.map(({ label, icon }) => (
              <button
                key={label}
                onClick={() => {
                  setActive(label);
                  setActiveSidebar(label);
                }}
                className={`flex px-4 py-2 text-[18px] text-gray-600 hover:bg-gray-200 hover:text-primary items-center gap-4 w-full rounded-r-md ${
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
            ))}
          </nav>
        </div>
        <div className="p-1 mt-12">
          <div className="bg-secondary p-4 rounded-lg text-[#00613A] bg-[#F6FCF5]">
            <h1 className="text-[16px] font-semibold mb-1">
              Pay Your Bills in Seconds
            </h1>
            <p className="text-[12px]">
              Set up your utility, phone, and internet bill payments through our
              app, and earn loyalty points with every payment.
            </p>
            <div className="w-full py-5 flex items-center justify-center">
              <Image src={"avatar.svg"} alt="avatar" width={100} height={100} />
            </div>
          </div>
        </div>
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
              <p className="text-sm font-bold text-[#525252]">Chosenfolio</p>
              <p className="text-xs text-gray-500">Agent | N22,880.50</p>
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
