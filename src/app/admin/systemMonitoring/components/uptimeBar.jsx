import React from "react";

const UptimeBar = () => {
  const days = Array(20).fill("Jan 2"); // Repeat 'Jan 2' as in your image

  return (
    <div className="">
      <h2 className="text-2xl font-semibold mb-4">Uptime</h2>
      <div className="relative w-full h-16 rounded-lg bg-green-300 overflow-hidden">
        {/* Downtime markers */}
        <div className="absolute left-[5%] top-0 bottom-0 w-[2px] bg-red-800" />
        <div className="absolute left-[60%] top-0 bottom-0 w-[2px] bg-red-800" />
      </div>

      {/* Timestamps */}
      <div className="flex justify-between text-sm text-gray-500 mt-2">
        {days.map((day, index) => (
          <span key={index}>{day}</span>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-sm font-medium">
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-green-300 inline-block rounded-sm" />
          <span>Uptime</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-red-800 inline-block rounded-sm" />
          <span>Downtime</span>
        </div>
      </div>
    </div>
  );
};

export default UptimeBar;
