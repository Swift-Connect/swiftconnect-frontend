"use client";

import { useState } from "react";
import { X, Mic, Image, Paperclip, Smile, Type } from "lucide-react";

export default function TicketModal({ onClose }) {
  const [priority, setPriority] = useState("High");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            🎟️ Create New Ticket
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* LEFT SIDE - MESSAGE */}
          <div className="p-6 border-r">
            <label className="block text-sm text-gray-500 mb-2">From</label>
            <select className="w-full border rounded px-3 py-2 text-sm mb-6">
              <option>Swift Connect Support</option>
            </select>

            <textarea
              placeholder='Comment or Type "/" for Comment'
              className="w-full h-48 border rounded-lg p-4 text-sm resize-none"
            />

            <div className="flex items-center gap-4 mt-4 text-gray-500">
              <Type className="w-5 h-5" />
              <Smile className="w-5 h-5" />
              <Image className="w-5 h-5" />
              <Paperclip className="w-5 h-5" />
              <Mic className="w-5 h-5" />
            </div>
          </div>

          {/* RIGHT SIDE - FORM */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Ticket Subject
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 text-sm"
                defaultValue="Help me Cancel My Order"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Priority
              </label>
              <div className="flex gap-3">
                {["Low", "Medium", "High"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setPriority(level)}
                    className={`px-4 py-1 rounded-full border ${
                      priority === level
                        ? "bg-green-100 border-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    <span
                      className={`mr-2 inline-block w-2 h-2 rounded-full ${
                        level === "Low"
                          ? "bg-green-500"
                          : level === "Medium"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    />
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Ticket Type
              </label>
              <select className="w-full border rounded px-3 py-2 text-sm">
                <option>Incident</option>
                <option>Request</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Requester
              </label>
              <select className="w-full border rounded px-3 py-2 text-sm">
                <option>Praise Chosen</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Customer support personnel
              </label>
              <select className="w-full border rounded px-3 py-2 text-sm">
                <option>Jerome Bell</option>
              </select>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end items-center p-6 border-t gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md border text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button className="px-5 py-2 rounded-md bg-black text-white hover:bg-gray-800">
            Submit as New
          </button>
        </div>
      </div>
    </div>
  );
}
