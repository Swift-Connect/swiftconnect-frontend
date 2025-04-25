"use client"

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import ActionPopUp from "../../components/actionPopUp";

const SystemMonitoringTable = ({ data }) => {
  const columns = ["Alert Log", "Reason", "Duration"];
 
  const [activeRow, setActiveRow] = useState(null);
 

  const handleActionClick = (index) => {
    setActiveRow(activeRow === index ? null : index);
  };

  
  return (
    <>
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No Users yet</div>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#F9F8FA] text-left text-[#525252]">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="py-[1.3em] px-[1.8em] whitespace-nowrap"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((user, idx) => (
              <tr
                key={idx}
                className={`border-t ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="py-[1.3em] px-[1.8em] font-semibold whitespace-nowrap flex items-center gap-4">
                  <div
                    className={`w-[1em] h-[1em] ${
                      user.reason === "OK" ? "bg-green-600" : "bg-red-600 "
                    } rounded-full`}
                  ></div>{" "}
                  {user.alert_log}
                </td>
                <td
                  className={`py-[1.3em] px-[1.8em]  ${
                    user.reason === "OK" ? "text-green-400" : "text-red-500"
                  }`}
                >
                  {user.reason}
                </td>

                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {user.duration}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default SystemMonitoringTable;
