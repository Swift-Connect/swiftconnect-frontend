"use client";

import Image from "next/image";
import { useState } from "react";

const searchItems = [
  "Dashboard",
  "Pay Bills",
  "Cards",
  "Reward",
  "Settings",
  "KYC",
  "Developer API",
];

export default function SearchBar({ setActiveSidebar }) {
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  const handleSearch = (value) => {
    setQuery(value);
    const results = searchItems.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredResults(value ? results : []);
  };

  const handleSelect = (item) => {
    setActiveSidebar(item);
    setQuery("");
    setFilteredResults([]);
  };

  return (
    <div className="relative w-full max-w-sm">
      <div className="flex items-center  border rounded-md px-3 py-1 max-md-[400px]:hidden bg-[#D3F1CC33]">
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
          className="border-none outline-none rounded-md px-3 py-1 text-sm bg-transparent"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {filteredResults.length > 0 && (
        <ul className="absolute z-50 bg-white shadow-md rounded-md w-full mt-2 max-h-60 overflow-auto">
          {filteredResults.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 cursor-pointer hover:bg-green-100 text-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
