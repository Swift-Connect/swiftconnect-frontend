"use client";

import Image from "next/image";
import React, { useState } from "react";
import Pagination from "../components/pagination";
import TableTabs from "../components/tableTabs";
import { FaChevronRight, FaTrashAlt } from "react-icons/fa";
import SAMTable from "./components/table";
import EditSAM from "./components/edit";

const SMA = () => {
  const [activeTabPending, setActiveTabPending] = React.useState(
    "Data Subscription Plans"
  );
  const data = [
    {
      id: 1,
      network: "MTN",
      plan_type: "Gifting",
      plan_size: "1.0GB",
      plan_amount: "200",
      user_amount: "180",
      agent_amount: "20",
    },
    {
      id: 2,
      network: "MTN",
      plan_type: "Gifting",
      plan_size: "2.0GB",
      plan_amount: "400",
      user_amount: "360",
      agent_amount: "40",
    },
    {
      id: 3,
      network: "MTN",
      plan_type: "Gifting",
      plan_size: "5.0GB",
      plan_amount: "1000",
      user_amount: "900",
      agent_amount: "100",
    },
    {
      id: 4,
      network: "MTN",
      plan_type: "Gifting",
      plan_size: "10.0GB",
      plan_amount: "2000",
      user_amount: "1800",
      agent_amount: "200",
    },
    {
      id: 5,
      network: "MTN",
      plan_type: "Gifting",
      plan_size: "20.0GB",
      plan_amount: "4000",
      user_amount: "3600",
      agent_amount: "400",
    },
  ];

  const editReferral = false;
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  return (
    <div className="overflow-hidden ">
      <div className="max-md-[400px]:hidden">
        {editReferral ? (
          <>
            <div>
              <h1 className="text-[16px] font-semibold mb-8 flex items-center gap-4">
                Referral System <FaChevronRight /> Edit User Transaction
              </h1>
            </div>
            <EditSAM />
          </>
        ) : (
          <>
            <div className="flex items-center mb-8 justify-between">
              <h1 className="text-[16px] font-semibold ">Referral System</h1>

              <div className="flex items-center gap-[3em]">
                {/* <p>Referral commission</p>

                <div>
                  <input className="p-4 border rounded-lg" value={"0.3%"} />
                  <p className="text-gray-500">on every referral transaction</p>
                </div> */}
                <button className="bg-[#8C1823] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  Delete <FaTrashAlt />
                </button>
              </div>
            </div>
            <TableTabs
              header={""}
              setActiveTab={setActiveTabPending}
              activeTab={activeTabPending}
              tabs={[
                "Data Subscription Plans",
                "Airtime Recharge Plans",
                "Cable TV Packages",
                "Electricity Bill",
                "Education  Cards",
              ]}
              from="SAM"
            />
            <div className="rounded-t-[1em] overflow-auto border border-gray-200 min-h-[50vh]">
              <SAMTable
                data={data}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
              />
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SMA;
