"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useState } from "react";

const data = [
  { name: "10k", value: 20 },
  { name: "15k", value: 25 },
  { name: "20k", value: 45 },
  { name: "25k", value: 40 },
  { name: "30k", value: 48 },
  { name: "35k", value: 30 },
  { name: "40k", value: 35 },
  { name: "45k", value: 64 },
  { name: "50k", value: 43 },
  { name: "55k", value: 48 },
  { name: "60k", value: 50 },
  { name: "65k", value: 54 },
  { name: "70k", value: 22 },
];

export default function SalesReport() {
  const [filter, setFilter] = useState("Weekly");

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Sales Report</h2>
        <select
          className="border border-gray-300 text-gray-600 rounded-md px-3 py-1 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>Weekly</option>
          <option>Monthly</option>
          <option>Yearly</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
          <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            fill="#93C5FD"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
