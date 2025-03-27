import Image from "next/image";
import React, { useState } from "react";
import Pagination from "../components/pagination";
import TableTabs from "../components/tableTabs";
import { FaChevronRight } from "react-icons/fa";
import ReferralSystemTable from "./components/referrralSystemTable";
import EditReferralSystem from "./components/editReferralSystem";

const ReferralSystem = () => {
  const [activeTabPending, setActiveTabPending] = React.useState("Active");
  const data = [
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      fullname: "John Doe",
      referralUser: "Kann77y67",
      date: "2/4/2025",
    },
    {
      id: 2,
      username: "John Doe",
      account_id: 5777,
      fullname: "John Doe",
      referralUser: "Kann77y67",
      date: "2/4/2025",
    },
    {
      id: 3,
      username: "John Doe",
      account_id: 5777,
      fullname: "John Doe",
      referralUser: "Kann77y67",
      date: "2/4/2025",
    },
    {
      id: 4,
      username: "John Doe",
      account_id: 5777,
      fullname: "John Doe",
      referralUser: "Kann77y67",
      date: "2/4/2025",
    },
    {
      username: "John Doe",
      account_id: 5777,
      fullname: "John Doe",
      referralUser: "Kann77y67",
      date: "2/4/2025",
    },
  ];

  const editReferral = true;
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
            <EditReferralSystem />
          </>
        ) : (
          <>
            <div className="flex items-center mb-8 justify-between">
              <h1 className="text-[16px] font-semibold ">Referral System</h1>

              <div className="flex items-center gap-[3em]">
                <p>Referral commission</p>

                <div>
                  <input className="p-4 border rounded-lg" value={"0.3%"} />
                  <p className="text-gray-500">on every referral transaction</p>
                </div>
              </div>
            </div>
            <TableTabs
              header={""}
              setActiveTab={setActiveTabPending}
              activeTab={activeTabPending}
              tabs={["Active", "Inactive", "Recently Deleted"]}
              from="referralSystem"
            />
            <div className="rounded-t-[1em] overflow-auto border border-gray-200 min-h-[50vh]">
              <ReferralSystemTable
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

export default ReferralSystem;
