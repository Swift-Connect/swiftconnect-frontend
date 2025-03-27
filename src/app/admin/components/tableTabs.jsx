import Image from "next/image";
import React from "react";
import { FaPlus, FaTrash, FaTrashAlt } from "react-icons/fa";

const TableTabs = ({ setActiveTab, activeTab, header, tabs, from }) => {
  return (
    <div>
      <h1 className="text-[22px] font-semibold mb-4">{header}</h1>
      <div className="flex  flex-col justify-between mb-4">
        <div className="flex justify-between items-center  mb-4">
          <ul className="flex items-center gap-[5em]  border-b-[1px] border-gray-200">
            {tabs.map((tab) => (
              <>
                <li
                  className={`font-medium text-[16px] px-2 cursor-pointer ${
                    activeTab === tab
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </li>
              </>
            ))}
          </ul>
          {from === "dashboard" ? (
            ""
          ) : (
            <div className="flex gap-3">
              {from === "transactionManagement" ||
              from === "referralSystem" ? null : (
                <button className="bg-[#00613A] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  Add User <FaPlus />
                </button>
              )}

              <button className="bg-[#8C1823] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
                Delete <FaTrashAlt />
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center w-[50%] border rounded-[4em] px-3 py-1 ">
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
          <div className="flex items-center space-x-2 ">
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
            <button className="text-gray-500 text-sm flex items-center gap-3 px-4 py-3 border rounded-[4em]">
              <Image
                src={"/filter.svg"}
                alt="calendar"
                width={100}
                height={100}
                className="w-[1.6em]"
              />
              <span className="ml-1">Filter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableTabs;
