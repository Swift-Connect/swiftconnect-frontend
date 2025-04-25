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

  const allData = {
    "Data Subscription Plans": [
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
        id: 1,
        network: "GLO",
        plan_type: "Gifting",
        plan_size: "1.0GB",
        plan_amount: "200",
        user_amount: "180",
        agent_amount: "20",
      },
      // ...other data subscription plans
    ],
    "Airtime Recharge Plans": [
      {
        id: 1,
        network: "MTN",
        plan_size: "Small",
        plan_amount: "100",
        user_amount: "90",
        agent_amount: "10",
      },
      // ...other airtime recharge plans
    ],
    "Cable TV Packages": [
      {
        id: 1,
        cable: "DSTV",
        plan_type: "Compact",
        plan_amount: "5000",
        frequency: "Monthly",
        user_amount: "4500",
        agent_amount: "500",
      },
      // ...other cable TV packages
    ],
    "Electricity Bill": [
      {
        id: 1,
        provider: "PHCN",
        plan_type: "Prepaid",
        unit: "100 kWh",
        amount: "2000",
        user_amount: "1800",
        agent_amount: "200",
      },
      // ...other electricity bills
    ],
    "Education  Cards": [
      {
        id: 1,
        examination: "WAEC",
        plan_type: "Standard",
        amount: "2000",
        user_amount: "1800",
        agent_amount: "200",
      },
      // ...other education cards
    ],
  };

  const tableFields = {
    "Data Subscription Plans": [
      "Network",
      "Plan Type",
      "Plan Size",
      "Plan Amount",
      "User Amount",
      "Agent Amount",
    ],
    "Airtime Recharge Plans": [
      "Network",
      "Plan Size",
      "Plan Amount",
      "User Amount",
      "Agent Amount",
    ],
    "Cable TV Packages": [
      "Cable",
      "Plan Type",
      "Plan Amount",
      "Frequency",
      "User Amount",
      "Agent Amount",
    ],
    "Electricity Bill": [
      "Provider",
      "Plan Type",
      "Unit",
      "Amount",
      "User Amount",
      "Agent Amount",
    ],
    "Education  Cards": [
      "Examination",
      "Plan Type",
      "Amount",
      "User Amount",
      "Agent Amount",
    ],
  };

  const data = allData[activeTabPending];
  const fields = tableFields[activeTabPending];

  const editReferral = false;
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleEditClick = (rowData) => {
    setEditData(rowData);
    console.log(rowData);

    setShowEdit(true);
  };

  return (
    <div className="overflow-hidden ">
      <div className="max-md-[400px]:hidden">
        {showEdit ? (
          <EditSAM
            rowData={editData}
            onSave={(updatedData) => {
              console.log("Updated Data:", updatedData);
              setShowEdit(false);
            }}
            onCancel={() => setShowEdit(false)}
          />
        ) : (
          <>
            <div className="flex items-center mb-8 justify-between">
              <h1 className="text-[16px] font-semibold mb-8">
                Service Management API
              </h1>
              <div className="flex items-center gap-[3em]">
                {/* <button
            className="bg-[#00613A] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2"
            // onClick={() => {
            //   setAddNewNotification(true);
            // }}
          >
            Add new Notification <FaPlus />
          </button> */}
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
              onPress={() => {}}
              from={"SMA"}
            />
            <div className="rounded-t-[1em] overflow-auto border border-gray-200 min-h-[50vh]">
              <SAMTable
                data={data}
                fields={fields}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                setShowEdit={(rowData) => handleEditClick(rowData)}
              />
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SMA;
