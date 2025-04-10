import React, { useState } from "react";
import { FaChevronRight } from "react-icons/fa";

const AddNewNotification = ({ setAddNewNotification, setCard }) => {
  return (
    <div>
      <div className="flex items-center mb-8 justify-between">
        <h1 className="text-[16px] font-semibold flex items-center gap-4">
          <span className="text-[#9CA3AF]" onClick={() => setCard(null)}>
            Notification System
          </span>{" "}
          <FaChevronRight />{" "}
          <span
            className="text-[#9CA3AF]"
            onClick={() => setAddNewNotification(false)}
          >
            Notifications
          </span>{" "}
          <FaChevronRight /> Add Notifications
        </h1>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-[6em]">
          <label className="block text-[18px] font-medium text-gray-700 w-[150px]">
            Subject
          </label>

          <div className="flex flex-col gap-1">
            <input
              type="text"
              defaultValue={"ChosenFolio"}
              className="w-full mt-1 p-4 border rounded-[0.8em] focus:outline-none focus:ring-2 focus:ring-gray-400"
              disabled
            />
            <p className="text-[14px] text-gray-500">
              Requires 50 characters or fewer, digits and @#?/+- only
            </p>
          </div>
        </div>{" "}
        <div className="flex items-center gap-[6em]">
          <label className="block text-[18px] font-medium text-gray-700 w-[150px]">
            Message for
          </label>

          <div className="flex flex-col gap-1">
            <input
              type="text"
              defaultValue={"ChosenFolio"}
              className="w-full mt-1 p-4 border rounded-[0.8em] focus:outline-none focus:ring-2 focus:ring-gray-400"
              disabled
            />
            <p className="text-[14px] text-gray-500">
              Requires 50 characters or fewer, digits and @#?/+- only
            </p>
          </div>
        </div>{" "}
        <div className="flex items-center gap-[6em]">
          <label className="block text-[18px] font-medium text-gray-700 w-[150px]">
            Message
          </label>

          <div className="flex flex-col gap-1">
            <textarea
              name=""
              id=""
              cols="40"
              defaultValue={"ChosenFolio"}
              className="w-full mt-1 p-4 border rounded-[0.8em] focus:outline-none focus:ring-2 focus:ring-gray-400"
              style={{ resize: "none" }}
            //   disabled
            ></textarea>

            <p className="text-[14px] text-gray-500">
              Requires 50 characters or fewer, digits and @#?/+- only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewNotification;
