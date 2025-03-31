"use client";

import { useState } from "react";
import {
  FaPlus,
  FaTrashAlt,
  FaUserAlt,
  FaUserCog,
  FaUsers,
  FaUserTag,
} from "react-icons/fa";

const EditSAM = ({ fields, data }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">1GB -- #30</h2>
      <div className="flex bg-gray-50">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-[90%]">
          <form className="space-y-4 flex flex-col gap-4">
            {fields.map((field, index) => (
              <div key={index} className="flex flex-col gap-6">
                <div className="flex items-center gap-[6em]">
                  <label className="block text-[18px] font-medium text-gray-700 w-[150px]">
                    {field}
                  </label>
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      defaultValue={
                        data
                          ? data[field.toLowerCase().replace(/\s+/g, "_")]
                          : ""
                      }
                      className="w-full mt-1 p-4 border rounded-[0.8em] focus:outline-none focus:ring-2 focus:ring-gray-400"
                      disabled
                    />
                    <p className="text-[14px] text-gray-500">
                      Requires 50 characters or fewer, digits and @#?/+- only
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex gap-3">
              <button className="bg-[#00613A] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
                Save <FaPlus />
              </button>
              <button className="bg-[#8C1823] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
                Delete <FaTrashAlt />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSAM;
