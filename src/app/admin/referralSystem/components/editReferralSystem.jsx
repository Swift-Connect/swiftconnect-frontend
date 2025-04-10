"use client";

import { useState } from "react";
import {
  FaClipboard,
  FaPlus,
  FaTrashAlt,
  FaUserAlt,
  FaUserCog,
  FaUsers,
  FaUserTag,
} from "react-icons/fa";

const EditReferralSystem = () => {
  const [formData, setFormData] = useState({
    username: "Chosenfolio",
    password: "Chosenfolio",
    userType: "Reseller",
    status: "Approved",
    accountNo: "Chosenfolio",
    permissions: {
      active: false,
      admin: false,
      superUser: false,
    },
  });

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [name]: checked,
      },
    }));
  };

  return (
    <div>
      {
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold mb-4">{formData.username}</h2>
          <p className="bg-[#ACFFDE] rounded-md px-8 py-4 flex items-center gap-2 text-[#00613A]">
            <FaClipboard /> Generate report on referral earnings
          </p>
        </div>
      }
      <div className="flex bg-gray-50">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-[90%]">
          <form className="space-y-4 flex flex-col gap-8">
            {/*User Info*/}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-[6em]">
                <label className="block text-[18px] font-medium text-gray-700 ">
                  <input type="checkbox" className="mr-[2em]" name="" id="" />
                  Refferal username
                </label>
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={formData.username}
                    className="w-full mt-1 p-4 border rounded-[0.8em] focus:outline-none focus:ring-2 focus:ring-gray-400"
                    disabled
                  />
                  <p className="text-[14px] text-gray-500">
                    Requires 50 characters or fewer, digits and @#?/+- only
                  </p>
                </div>
                <p>$10</p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-[6em]">
                <label className="block text-[18px] font-medium text-gray-700 ">
                  <input type="checkbox" className="mr-[2em]" name="" id="" />
                  Refferal username
                </label>
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={formData.username}
                    className="w-full mt-1 p-4 border rounded-[0.8em] focus:outline-none focus:ring-2 focus:ring-gray-400"
                    disabled
                  />
                  <p className="text-[14px] text-gray-500">
                    Requires 50 characters or fewer, digits and @#?/+- only
                  </p>
                </div>
                <p>$700</p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-[6em]">
                <label className="block text-[18px] font-medium text-gray-700 ">
                  <input type="checkbox" className="mr-[2em]" name="" id="" />
                  Refferal username
                </label>
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={formData.username}
                    className="w-full mt-1 p-4 border rounded-[0.8em] focus:outline-none focus:ring-2 focus:ring-gray-400"
                    disabled
                  />
                  <p className="text-[14px] text-gray-500">
                    Requires 50 characters or fewer, digits and @#?/+- only
                  </p>
                </div>
                <p>$60</p>
              </div>
            </div>

            <div className="flex gap-3">
              {/* <button className="bg-[#00613A] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
                Save <FaPlus />
              </button> */}
              <button className="bg-[#8C1823] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
                Delete <FaTrashAlt />
              </button>{" "}
              {/* <button className="bg-[#282EFF] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
                Impersonate <FaUsers />
              </button> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditReferralSystem;
