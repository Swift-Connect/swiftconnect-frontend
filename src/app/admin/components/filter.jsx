import React from "react";

const Filter = ({ onFilterChange, filterOptions }) => {
  return (
    <div className="rounded-xl bg-white p-4 shadow-md mb-4 top-[110%] absolute z-10 right-0 left-0  ">
      <h2 className="font-bold text-[22px]">Filter:</h2>

      <div className="grid grid-cols-2 gap-4 mt-2">
        {filterOptions.map((option, index) => (
          <button
            className="border rounded-3xl px-4 py-2"
            key={index}
            value={option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="flex border-t mt-8 gap-2 py-4">
        <p className="w-1/2">*You can choose multiple Order Status</p>
        <button className="bg-[#00613A] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default Filter;
