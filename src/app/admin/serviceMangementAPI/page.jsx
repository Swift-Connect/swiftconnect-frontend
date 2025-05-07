"use client";
import Image from "next/image";
import React, { useState } from "react";
import { FaChevronRight, FaPlus, FaTrashAlt } from "react-icons/fa";
// import NotificationSystemTable from "./components/table";
import Pagination from "../components/pagination";
import PaystackSettings from "./components/paystackSettings";
import MonnifySettings from "./components/monifySettings";
import FlutterwaveSettings from "./components/flutterwaveSettings";
import api from "@/utils/api";
import ApiDetails from "./components/ApiDetails";
// import AddNewNotification from "./components/addNewNotification";

const SMAA = () => {
  const [card, setCard] = useState(null);
  const [url, setUrl] = useState(null);
  const handleCardClick = (cardType, url) => {
    setCard(cardType);
    setUrl(url)
  };

 const cardData = [
   {
     title: "Education API",
     description: "Configure Paystack Api to your payment gateway",
     image: "paystack.svg",
     path: "education",
   },
   {
     title: "Cable TV API",
     description: "Configure Paystack Api to your payment gateway",
     image: "paystack.svg",
     path: "cable-recharges",
   },
   {
     title: "Airtime API",
     description: "Configure Paystack Api to your payment gateway",
     image: "paystack.svg",
     path: "airtime-topup",
   },
   {
     title: "Bulk SMS API",
     description: "Configure monnify Api to your payment gateway",
     image: "airtime.svg",
     path: "bult-sms",
   },
   {
     title: "Electricity API",
     description: "Configure monnify Api to your payment gateway",
     image: "airtime.svg",
     path: "bult-sms",
   },
   {
     title: "Data Plans API",
     description: "Configure monnify Api to your payment gateway",
     image: "airtime.svg",
     path: "bult-sms",
   },
   // Add more cards here if needed
 ];


  return (
    <div>
      {card === null && (
        <>
          <h1 className="text-[16px] font-bold">Service Management API</h1>
          <div className="grid grid-cols-2 gap-8">
            {cardData.map((cardItem, index) => (
              <div
                key={index}
                className="flex gap-4 bg-white rounded-2xl p-4 shadow-md cursor-pointer"
                onClick={() => handleCardClick(cardItem.title, cardItem.path)}
              >
                <Image
                  src={cardItem.image}
                  width={100}
                  height={40}
                  alt={cardItem.title}
                />
                <div className="flex flex-col gap-4 justify-between">
                  <h1 className="text-[24px] font-medium">{cardItem.title}</h1>
                  <p className="text-[#9CA3AF] text-[16px] w-[60%]">
                    {cardItem.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {card !== null && (
        <ApiDetails title={card} setCard={setCard} path={url} />
      )}

      {/* {card === "paystack" && (
        <>
          <>
            <PaystackSettings setCard={setCard} />
          </>
        </>
      )}
      {card === "monnify" && (
        <>
          <MonnifySettings setCard={setCard} />
        </>
      )}{" "}
      {card === "flutterwave" && (
        <>
          <FlutterwaveSettings setCard={setCard} />
        </>
      )} */}
    </div>
  );
};

export default SMAA;
