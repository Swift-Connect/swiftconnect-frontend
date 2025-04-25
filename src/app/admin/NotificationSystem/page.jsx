'use client';
import Image from "next/image";
import React, { useState } from "react";
import { FaChevronRight, FaPlus, FaTrashAlt } from "react-icons/fa";
import NotificationSystemTable from "./components/table";
import Pagination from "../components/pagination";
import AddNewNotification from "./components/addNewNotification";

const NotificationSystem = () => {
  const [card, setCard] = useState(null);
  const handleCardClick = (cardType) => {
    setCard(cardType);
  };

  const [addNewNotification, setAddNewNotification] = useState(false);

  const data = [
    {
      id: 1,
      subject: "Welcome Message",
      for: "General",
      message:
        "Hi There! You are welcome, we are your one-stop platform for all for bills payment, airtime, data plans, and cable tv subscription. All our services are available to you at a discount rate. Our customer support team is available to you 24/7.",
    },
    {
      id: 2,
      subject: "Account Verification",
      for: "General",
      message: "Please verify your account to access all features.",
    },
  ];
  const fields = ["Subject", "For", "Message"];

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  return (
    <div>
      {card === null && (
        <>
          <h1 className="text-[16px] font-bold">Notification System</h1>
          <div className="flex gap-4 mt-4">
            <div
              className="flex flex-col gap-4 bg-white rounded-2xl p-4 shadow-md"
              onClick={handleCardClick.bind(null, "push notification")}
            >
              <div className="flex gap-4 items-center justify-between">
                <h1 className="text-[24px] font-medium">Push Notification</h1>
                <Image src={"airtime.svg"} width={40} height={40} />
              </div>
              <p className="text-[#9CA3AF] text-[16px] w-[60%]">
                These are the notifications sent to the web app and mobile
              </p>
            </div>
            <div
              className="flex flex-col gap-4 bg-white rounded-2xl p-4 shadow-md "
              onClick={handleCardClick.bind(null, "email alerts")}
            >
              <div className="flex gap-4 items-center justify-between">
                <h1 className="text-[24px] font-medium">Send Email Alerts</h1>
                <Image src={"internet.svg"} width={40} height={40} />
              </div>
              <p className="text-[#9CA3AF] text-[16px] w-[60%]">
                These are the email alerts sent to users and registered emails
              </p>
            </div>
          </div>
        </>
      )}{" "}
      {card === "push notification" && (
        <>
          {addNewNotification ? (
            <AddNewNotification
              setAddNewNotification={setAddNewNotification}
              setCard={setCard}
            />
          ) : (
            <>
             
              <div>
                <div className="flex items-center mb-8 justify-between">
                  <h1 className="text-[16px] font-semibold flex items-center gap-4">
                    <span
                      className="text-[#9CA3AF]"
                      onClick={() => setCard(null)}
                    >
                      Notification System
                    </span>{" "}
                    <FaChevronRight /> Notifications
                  </h1>

                  <div className="flex items-center gap-[3em]">
                    <button
                      className="bg-[#00613A] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2"
                      onClick={() => {
                        setAddNewNotification(true);
                      }}
                    >
                      Add new Notification <FaPlus />
                    </button>
                    <button className="bg-[#8C1823] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
                      Delete <FaTrashAlt />
                    </button>
                  </div>
                </div>

                <div className="rounded-t-[1em] overflow-auto border border-gray-200 min-h-[50vh]">
                  <NotificationSystemTable
                    data={data}
                    fields={fields}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    setShowEdit={(rowData) => console.log("Edit row:", rowData)}
                  />
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </>
      )}
      {card === "email alerts" && (
        <>
          <div>
            <h1 className="text-[16px] font-semibold mb-8 flex items-center gap-4">
              <span className="text-[#9CA3AF]" onClick={() => setCard(null)}>
                Notification System
              </span>{" "}
              <FaChevronRight /> Change plan
            </h1>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationSystem;
