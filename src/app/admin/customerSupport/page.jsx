"use client"
import Image from "next/image";
import React, { useState } from "react";

import Pagination from "../components/pagination";
import TableTabs from "../components/tableTabs";

import CustomerSupportTable from "./components/table";
import TicketModal from "./components/createNewTicket";

const CustomerSupport = () => {
  const [activeTabPending, setActiveTabPending] = React.useState("All Tickets");
  const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [showModal, setShowModal] = useState(false)
  const usersData = [
    {
      id: 1,
      ticket_id: "#TC-191",
      subject: "Help, 1 order wrong product...",
      priority: "Low",
      type: "suggestion",
      requester: "Santa Carloza",
      customer_support: "Santa Caloza",
      req_date: "2/4/2025",
      platform: "mail.png",
    },
    {
      id: 1,
      ticket_id: "#TC-191",
      subject: "Help, 1 order wrong product...",
      priority: "Low",
      type: "suggestion",
      requester: "Santa Carloza",
      customer_support: "Santa Caloza",
      req_date: "2/4/2025",
      platform: "mail.png",
    },
    {
      id: 1,
      ticket_id: "#TC-191",
      subject: "Help, 1 order wrong product...",
      priority: "Low",
      type: "suggestion",
      requester: "Santa Carloza",
      customer_support: "Santa Caloza",
      req_date: "2/4/2025",
      platform: "mail.png",
    },
    {
      id: 1,
      ticket_id: "#TC-191",
      subject: "Help, 1 order wrong product...",
      priority: "Medium",
      type: "suggestion",
      requester: "Santa Carloza",
      customer_support: "Santa Caloza",
      req_date: "2/4/2025",
      platform: "mail.png",
    },
    {
      id: 1,
      ticket_id: "#TC-191",
      subject: "Help, 1 order wrong product...",
      priority: "High",
      type: "suggestion",
      requester: "Santa Carloza",
      customer_support: "Santa Caloza",
      req_date: "2/4/2025",
      platform: "mail.png",
    },
    {
      id: 1,
      ticket_id: "#TC-191",
      subject: "Help, 1 order wrong product...",
      priority: "Medium",
      type: "suggestion",
      requester: "Santa Carloza",
      customer_support: "Santa Caloza",
      req_date: "2/4/2025",
      platform: "whatsap.png",
    },
    {
      id: 1,
      ticket_id: "#TC-191",
      subject: "Help, 1 order wrong product...",
      priority: "Low",
      type: "suggestion",
      requester: "Santa Carloza",
      customer_support: "Santa Caloza",
      req_date: "2/4/2025",
      platform: "whatsap.png",
    },
    {
      id: 1,
      ticket_id: "#TC-191",
      subject: "Help, 1 order wrong product...",
      priority: "High",
      type: "suggestion",
      requester: "Santa Carloza",
      customer_support: "Santa Caloza",
      req_date: "2/4/2025",
      platform: "mail.png",
    },
    {
      id: 1,
      ticket_id: "#TC-191",
      subject: "Help, 1 order wrong product...",
      priority: "High",
      type: "suggestion",
      requester: "Santa Carloza",
      customer_support: "Santa Caloza",
      req_date: "2/4/2025",
      platform: "whatsap.png",
    },
    {
      id: 1,
      ticket_id: "#TC-191",
      subject: "Help, 1 order wrong product...",
      priority: "Medium",
      type: "suggestion",
      requester: "Santa Carloza",
      customer_support: "Santa Caloza",
      req_date: "2/4/2025",
      platform: "whatsap.png",
    },
    {
      id: 1,
      ticket_id: "#TC-191",
      subject: "Help, 1 order wrong product...",
      priority: "Low",
      type: "suggestion",
      requester: "Santa Carloza",
      customer_support: "Santa Caloza",
      req_date: "2/4/2025",
      platform: "mail.png",
    },
    // Add more users...
  ];

  const editUser = true;
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(usersData.length / itemsPerPage);

  const handleEditClick = (rowData) => {
    setEditData(rowData);
    setShowEdit(true);
    console.log("shit");
  };
  return (
    <div className="overflow-hidden ">
      <div className="max-md-[400px]:hidden">
        <>
          <h1 className="text-[16px] font-semibold mb-8">Support Tickets</h1>

          <TableTabs
            header={""}
            setActiveTab={setActiveTabPending}
            activeTab={activeTabPending}
            tabs={["All Tickets", "Assigned", "Unasigned", "Closed"]}
            onPress={() => setShowModal(true)}
            from={"customersupport"}
          />
          <div className="rounded-t-[1em] overflow-auto border border-gray-200 min-h-[50vh]">
            <CustomerSupportTable
              data={usersData}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              setShowEdit={handleEditClick}
            />
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      </div>
      {showModal && <TicketModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default CustomerSupport;
