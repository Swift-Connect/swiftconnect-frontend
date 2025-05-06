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
// import AddNewNotification from "./components/addNewNotification";

const SMAA = () => {
  const [card, setCard] = useState(null);
  const handleCardClick = (cardType) => {
    setCard(cardType);
  };

  const fetchAllPages = async (endpoint, maxPages = 50) => {
    let allData = [];
    // let nextPage = endpoint;
    // let pageCount = 0;

    try {
      // while (nextPage && pageCount < maxPages) {
      const res = await api.get("/services/configure/cable-recharges/");
      //   allData = allData.concat(res.data.results || res.data);
      //   nextPage = res.data.next || null;
      //   pageCount++;
      // }
      console.log("the dede", res);

      // if (pageCount >= maxPages) {
      //   console.warn(`Reached max page limit (${maxPages}) for ${endpoint}`);
      // }
    } catch (error) {
      toast.error(`Error fetching data from ${endpoint}`);
      console.error(`Error fetching ${endpoint}:`, error);
    }

    // return allData;
  };

  fetchAllPages();

  return (
    <div>
      {card === null && (
        <>
          <h1 className="text-[16px] font-bold">Service Management API</h1>
          <div className="grid grid-cols-2 gap-8">
            <div
              className="flex  gap-4 bg-white rounded-2xl p-4 shadow-md"
              onClick={handleCardClick.bind(null, "paystack")}
            >
              <Image src={"paystack.svg"} width={100} height={40} />
              <div className="flex flex-col gap-4   justify-between">
                <h1 className="text-[24px] flex-col font-medium">
                  Paystack API
                </h1>
                <p className="text-[#9CA3AF] text-[16px] w-[60%]">
                  Configure Paystack Api to your payment gateway
                </p>
              </div>
            </div>
            <div
              className="flex  gap-4 bg-white rounded-2xl p-4 shadow-md"
              onClick={handleCardClick.bind(null, "monnify")}
            >
              <Image src={"airtime.svg"} width={100} height={40} />
              <div className="flex flex-col gap-4   justify-between">
                <h1 className="text-[24px] flex-col font-medium">
                  Monnify API
                </h1>
                <p className="text-[#9CA3AF] text-[16px] w-[60%]">
                  Configure monnify Api to your payment gateway
                </p>
              </div>
            </div>
            <div
              className="flex gap-4 items-center bg-white rounded-2xl p-4 shadow-md"
              onClick={handleCardClick.bind(null, "flutterwave")}
            >
              <Image
                src={"/flutterwave.png"}
                width={100}
                height={100}
                className="w-[6em] h-[6em]"
              />
              <div className="flex flex-col gap-4   justify-between">
                <h1 className="text-[24px] flex-col font-medium">
                  Flutterwave API
                </h1>
                <p className="text-[#9CA3AF] text-[16px] w-[60%]">
                  Configure flutterwave Api to your payment gateway
                </p>
              </div>
            </div>
          </div>
        </>
      )}{" "}
      {card === "paystack" && (
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
      )}
    </div>
  );
};

export default SMAA;
