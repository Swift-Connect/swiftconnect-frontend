"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function EditMonthlyPlanModal({open, setOpen}) {
  

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-lg relative">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Edit Monthly Plan
        </h2>

        {/* Form */}
        <div className="space-y-4">
          {/* Plan Type */}
          <div>
            <label className="block text-gray-700 text-sm mb-2">
              Plan type
            </label>
            <select className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>Basic</option>
              <option>Standard</option>
              <option>Premium</option>
            </select>
          </div>

          {/* Plan Price */}
          <div>
            <label className="block text-gray-700 text-sm mb-2">
              Plan price
            </label>
            <input
              type="text"
              placeholder="$20"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Plan Features */}
          <div>
            <label className="block text-gray-700 text-sm mb-2">
              Plan features
            </label>
            <input
              type="text"
              placeholder="separate features with comma"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl text-sm font-medium">
            Save Changes
            <Trash2 size={18} />
          </button>
        </div>

        {/* Close Button (Optional) */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
