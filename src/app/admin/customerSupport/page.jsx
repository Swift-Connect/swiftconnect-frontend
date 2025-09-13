"use client"
import Image from "next/image";
import React, { useState } from "react";
import { FaWhatsapp, FaPhone, FaEnvelope } from "react-icons/fa";
import { openWhatsAppSupport, SUPPORT_MESSAGES, getSupportPhone } from "@/utils/whatsappSupport";

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
          <h1 className="text-[16px] font-semibold mb-8">Customer Support</h1>

          {/* WhatsApp Support Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="text-center">
              <div className="mb-4">
                <FaWhatsapp className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">WhatsApp Support</h2>
                <p className="text-gray-600 mb-6">
                  All customer support is now handled through WhatsApp for faster response times and better customer experience.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <FaWhatsapp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                  <p className="text-sm text-gray-600 mb-2">{getSupportPhone()}</p>
                  <button
                    onClick={() => openWhatsAppSupport(SUPPORT_MESSAGES.GENERAL)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                  >
                    Open WhatsApp
                  </button>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <FaEnvelope className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-sm text-gray-600 mb-2">support@swiftconnect.com.ng</p>
                  <a
                    href="mailto:support@swiftconnect.com.ng"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm inline-block text-center"
                  >
                    Send Email
                  </a>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <FaPhone className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <p className="text-sm text-gray-600 mb-2">{getSupportPhone()}</p>
                  <a
                    href={`tel:${getSupportPhone().replace(/\s/g, '')}`}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm inline-block text-center"
                  >
                    Call Now
                  </a>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">Support Guidelines</h4>
                <ul className="text-sm text-yellow-800 text-left space-y-1">
                  <li>• WhatsApp is the preferred support channel for fastest response</li>
                  <li>• Support hours: Monday - Friday, 9:00 AM - 6:00 PM</li>
                  <li>• For urgent issues, use WhatsApp or call directly</li>
                  <li>• Email support may take 24-48 hours for response</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Legacy Support Data (Optional - can be removed) */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <div className="text-sm text-gray-600">WhatsApp Response Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">&lt;5min</div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600">Availability</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">95%</div>
                <div className="text-sm text-gray-600">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default CustomerSupport;
