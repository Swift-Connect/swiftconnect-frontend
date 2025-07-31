
"use client";
import React, { useState, useCallback } from "react";
import { FaClipboard, FaPlus, FaTrashAlt, FaCalendar } from "react-icons/fa";
import Image from "next/image";
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
  onSearchChange,
  onDateRangeChange,
  selectedRows = [],
  onDelete,
  searchValue = "",
  dateRange = { start: "", end: "" }
}) => {
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchValue);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [localDateRange, setLocalDateRange] = useState(dateRange);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setLocalSearch(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  }, [onSearchChange]);

  const handleDateChange = (field, value) => {
    const newRange = { ...localDateRange, [field]: value };
    setLocalDateRange(newRange);
    if (onDateRangeChange) {
      onDateRangeChange(newRange);
    }
  };

  const formatDateRange = () => {
    if (localDateRange.start && localDateRange.end) {
      return `${new Date(localDateRange.start).toLocaleDateString()} - ${new Date(localDateRange.end).toLocaleDateString()}`;
    }
    return "Select date range";
  };

  return (
    <div>
      <h1 className="text-[22px] font-semibold mb-4">{header}</h1>
      <div className="flex flex-col justify-between mb-4">
        <div className="overflow-auto flex justify-between items-center mb-4">
          <ul className="flex items-center gap-[2em] border-b-[1px] border-gray-200">
            {tabs.map((tab) => (
              <li
                key={tab}
                className={`font-medium text-[16px] whitespace-nowrap px-2 py-3 cursor-pointer transition-colors ${
                  activeTab === tab
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>

          {from !== "dashboard" && from !== "VCM" && from !== "SAMM" && from !== "SMA" && (
            <div className="flex gap-3">
              {!["transactionManagement", "referralSystem", "SAM", "bankingServices", "RBAC"].includes(from) && (
                <button
                  className="bg-[#00613A] whitespace-nowrap font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#004d2e] transition-colors"
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
              {!["SAM", "APIManage", "customersupport"].includes(from) && (
                <button
                  className="bg-[#8C1823] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 hover:bg-[#7a1520] transition-colors"
                  disabled={selectedRows.length === 0}
                  onClick={onDelete}
                >
                  {from === "RBAC" ? "Block" : "Delete"} <FaTrashAlt />
                </button>
              )}
            </div>
          )}

          {from === "VCM" && (
            <button className="bg-[#ACFFDE] rounded-md px-8 py-4 flex items-center gap-2 text-[#00613A] hover:bg-[#9bffd6] transition-colors">
              <FaClipboard /> Generate report transactions
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center w-[50%] border rounded-[4em] px-3 py-1 bg-white">
            <Image
              src="/search.svg"
              alt="search icon"
              width={20}
              height={20}
              className="w-[1.5em] opacity-50"
            />
            <input
              type="text"
              placeholder="Search for something..."
              className="border-none outline-none rounded-md px-3 py-2 text-sm bg-transparent w-full"
              value={localSearch}
              onChange={handleSearchChange}
            />
          </div>

          <div className="relative flex items-center space-x-2">
            {from !== "APIManage" && (
              <div className="relative">
                <button 
                  className="flex items-center text-gray-500 text-sm gap-3 px-4 py-3 border rounded-[4em] hover:bg-gray-50 transition-colors"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                >
                  <FaCalendar className="w-[1.2em]" />
                  <span className="ml-1 text-[16px]">{formatDateRange()}</span>
                </button>
                
                {showDatePicker && (
                  <div className="absolute top-full right-0 mt-2 bg-white border rounded-lg shadow-lg p-4 z-50 min-w-[300px]">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Start Date</label>
                        <input
                          type="date"
                          value={localDateRange.start}
                          onChange={(e) => handleDateChange('start', e.target.value)}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">End Date</label>
                        <input
                          type="date"
                          value={localDateRange.end}
                          onChange={(e) => handleDateChange('end', e.target.value)}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => setShowDatePicker(false)}
                          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                        >
                          Close
                        </button>
                        <button
                          onClick={() => {
                            setLocalDateRange({ start: "", end: "" });
                            if (onDateRangeChange) onDateRangeChange({ start: "", end: "" });
                          }}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              className="relative text-gray-500 text-sm flex items-center gap-3 px-4 py-3 border rounded-[4em] hover:bg-gray-50 transition-colors"
              onClick={() => setShowFilterOptions(!showFilterOptions)}
            >
              <Image
                src="/filter.svg"
                alt="filter"
                width={16}
                height={16}
                className="w-[1.2em]"
              />
              <span className="ml-1">Filter</span>
            </button>

            {showFilterOptions && filterOptions && (
              <Filter
                onFilterChange={onFilterChange}
                filterOptions={filterOptions}
                onClose={() => setShowFilterOptions(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableTabs;
