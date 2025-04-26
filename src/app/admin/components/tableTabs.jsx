"use client";
import Image from "next/image";
import React, { useState } from "react";
import { FaClipboard, FaPlus, FaTrashAlt } from "react-icons/fa";
import Filter from "./filter";

const TableTabs = ({
  setActiveTab,
  activeTab,
  header,
  tabs,
  from,
  filterOptions,
  onPress,
  onFilterChange,
}) => {
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  return (
    <div>
      <h1 className="text-[22px] font-semibold mb-4">{header}</h1>
      <div className="flex flex-col justify-between mb-4">
        <div className="overflow-auto flex justify-between items-center mb-4">
          <ul className="flex items-center gap-[2em] border-b-[1px] border-gray-200">
            {tabs.map((tab) => (
              <li
                key={tab}
                className={`font-medium text-[16px] whitespace-nowrap px-2 cursor-pointer ${
                  activeTab === tab
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>
          {from === "dashboard" ||
          from === "VCM" ||
          from == "SAMM" ||
          from === "SMA" ? (
            ""
          ) : (
            <div className="flex  gap-3">
              {from === "transactionManagement" ||
              from === "referralSystem" ||
              from === "SAM" ||
              from === "bankingServices" ||
              from === "RBAC" ? null : (
                <button
                  className="bg-[#00613A] whitespace-nowrap font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  onClick={onPress}
                >
                  {from === "VCM"
                    ? "Create New Card"
                    : from === "resellerMan"
                    ? "Add Agent"
                    : from === "APIManage"
                    ? "Create new API Key"
                    : from === "customersupport"
                    ? "Add Ticket"
                    : "Add User"}
                  <FaPlus />
                </button>
              )}
              {from === "SAM" ||
              from === "APIManage" ||
              from === "customersupport" ? null : (
                <button className="bg-[#8C1823]  font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  {from === "RBAC" ? "Block" : "Delete"} <FaTrashAlt />
                </button>
              )}
            </div>
          )}

          {from === "VCM" ? (
            <p className="bg-[#ACFFDE] rounded-md px-8 py-4 flex items-center gap-2 text-[#00613A]">
              <FaClipboard /> Generate report transactions
            </p>
          ) : (
            ""
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center w-[50%] border rounded-[4em] px-3 py-1">
            <Image
              src={"/search.svg"}
              alt="search icon"
              width={100}
              height={100}
              className="w-[2.4em]"
            />
            <input
              type="text"
              placeholder="Search for something"
              className="border-none outline-none rounded-md px-3 py-1 text-sm bg-transparent w-full"
            />
          </div>
          <div className="relative flex items-center space-x-2">
            {from === "APIManage" ? null : (
              <button className="flex items-center text-gray-500 text-sm gap-3 px-4 py-3 border rounded-[4em]">
                <Image
                  src={"/calendar.svg"}
                  alt="calendar"
                  width={100}
                  height={100}
                  className="w-[1.6em]"
                />
                <span className="ml-1 text-[16px]">
                  Nov 1, 2024 - Nov 24, 2024
                </span>
              </button>
            )}

            <button
              className="relative text-gray-500 text-sm flex items-center gap-3 px-4 py-3 border rounded-[4em]"
              onClick={() => {
                setShowFilterOptions(!showFilterOptions);
                console.log("fff");
              }}
            >
              <Image
                src={"/filter.svg"}
                alt="calendar"
                width={100}
                height={100}
                className="w-[1.6em]"
              />
              <span className="ml-1">Filter</span>
            </button>
            {showFilterOptions && filterOptions ? (
              <Filter
                onFilterChange={onFilterChange}
                filterOptions={filterOptions}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableTabs;
