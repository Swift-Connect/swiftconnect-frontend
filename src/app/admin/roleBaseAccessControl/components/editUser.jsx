"use client";

import { useState } from "react";
import { FaPlus, FaTrashAlt, FaUserAlt, FaUserCog, FaUsers, FaUserTag } from "react-icons/fa";

const UserForm = ({ fields, data }) => {
  const [formData, setFormData] = useState({
    username: "Chosenfolio",
    password: "Chosenfolio",
    role: "support",
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
      <h2 className="text-2xl font-semibold mb-4">{formData.username}</h2>
      <div className="flex bg-gray-50">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-[80%]">
          <form className="space-y-4 flex flex-col gap-8">
            {/*User Info*/}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-[2em]">
                <label className="block text-[18px] font-medium text-gray-700 w-[150px]">
                  Username:
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
              </div>

              <div className="flex items-center gap-[2em]">
                <label className="block text-[18px] font-medium text-gray-700 w-[150px]">
                  Password
                </label>
                <div className="flex flex-col gap-1">
                  <input
                    type="password"
                    value={formData.password}
                    className="w-full mt-1 p-4 border rounded-[0.8em] focus:outline-none focus:ring-2 focus:ring-gray-400"
                    disabled
                  />
                  <p className="text-[14px] text-gray-500">
                    Raw passwords are not stored, so there is no way to see this
                    user’s password
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-[2em]">
                <label className="block text-[18px] font-medium text-gray-700 w-[150px]">
                  Role
                </label>
                <select
                  value={formData.role}
                  className="w-[66%] mt-1 p-4 border rounded-[0.8em] focus:outline-none focus:ring-2 focus:ring-gray-400"
                  disabled
                >
                  <option>Support</option>
                  <option>Finance</option>
                  <option>Super admin</option>
                </select>
              </div>
            </div>

            {/* Permissions */}
            <div className="mt-6 ">
              <h1 className="font-bold text-[28px] mb-4">Permissions</h1>
              <div className="mt-2 space-y-8">
                <label className="flex items-start gap-3 space-x-2">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.permissions.active}
                    onChange={handleCheckboxChange}
                    className="mt-1 w-6 h-6"
                  />
                  <div>
                    <span className="font-semibold text-[22px]">
                      Super Admin
                    </span>
                    <p className="text-sm text-gray-500">
                      Full control over all settings, users, and transactions.
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-3 space-x-2">
                  <input
                    type="checkbox"
                    name="admin"
                    checked={formData.permissions.admin}
                    onChange={handleCheckboxChange}
                    className="mt-1 w-6 h-6"
                  />
                  <div>
                    <span className="font-semibold text-[22px]">
                      Finance Admin
                    </span>
                    <p className="text-sm text-gray-500">
                      Handles financial activities including transactions,
                      withdrawals, and refunds.
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-3 space-x-2">
                  <input
                    type="checkbox"
                    name="superUser"
                    checked={formData.permissions.superUser}
                    onChange={handleCheckboxChange}
                    className="mt-1 w-6 h-6"
                  />
                  <div>
                    <span className="font-semibold text-[22px]">
                      Support/Admin Staff
                    </span>
                    <p className="text-sm text-gray-500">
                      Handles user queries, support tickets, and KYC
                      verification.
                    </p>
                  </div>
                </label>{" "}
                <label className="flex items-start gap-3 space-x-2">
                  <input
                    type="checkbox"
                    name="superUser"
                    checked={formData.permissions.superUser}
                    onChange={handleCheckboxChange}
                    className="mt-1 w-6 h-6"
                  />
                  <div>
                    <span className="font-semibold text-[22px]">
                      Transaction Manager
                    </span>
                    <p className="text-sm text-gray-500">
                      Monitors and manages all transaction-related activities
                    </p>
                  </div>
                </label>{" "}
                <label className="flex items-start gap-3 space-x-2">
                  <input
                    type="checkbox"
                    name="superUser"
                    checked={formData.permissions.superUser}
                    onChange={handleCheckboxChange}
                    className="mt-1 w-6 h-6"
                  />
                  <div>
                    <span className="font-semibold text-[22px]">
                      Reseller Managerser
                    </span>
                    <p className="text-sm text-gray-500">
                      Handles reseller onboarding, commissions, and tracking
                    </p>
                  </div>
                </label>{" "}
                <label className="flex items-start gap-3 space-x-2">
                  <input
                    type="checkbox"
                    name="superUser"
                    checked={formData.permissions.superUser}
                    onChange={handleCheckboxChange}
                    className="mt-1 w-6 h-6"
                  />
                  <div>
                    <span className="font-semibold text-[22px]">
                      Marketing Admin
                    </span>
                    <p className="text-sm text-gray-500">
                      Responsible for marketing campaigns and customer
                      engagement.
                    </p>
                  </div>
                </label>{" "}
                <label className="flex items-start gap-3 space-x-2">
                  <input
                    type="checkbox"
                    name="superUser"
                    checked={formData.permissions.superUser}
                    onChange={handleCheckboxChange}
                    className="mt-1 w-6 h-6"
                  />
                  <div>
                    <span className="font-semibold text-[22px]">API Admin</span>
                    <p className="text-sm text-gray-500">
                      Handles API security, keys, and integration monitoring.
                    </p>
                  </div>
                </label>{" "}
                <label className="flex items-start gap-3 space-x-2">
                  <input
                    type="checkbox"
                    name="superUser"
                    checked={formData.permissions.superUser}
                    onChange={handleCheckboxChange}
                    className="mt-1 w-6 h-6"
                  />
                  <div>
                    <span className="font-semibold text-[22px]">
                      System Admin
                    </span>
                    <p className="text-sm text-gray-500">
                      Manages system health, uptime monitoring, and
                      configurations.
                    </p>
                  </div>
                </label>{" "}
                <label className="flex items-start gap-3 space-x-2">
                  <input
                    type="checkbox"
                    name="superUser"
                    checked={formData.permissions.superUser}
                    onChange={handleCheckboxChange}
                    className="mt-1 w-6 h-6"
                  />
                  <div>
                    <span className="font-semibold text-[22px]">
                      Compliance & Audit Admin
                    </span>
                    <p className="text-sm text-gray-500">
                      Responsible for tracking admin activities and ensuring
                      compliance.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button className="bg-[#00613A] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
              Save <FaPlus />
              </button>
              {/* <button className="bg-[#8C1823] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
                Delete <FaTrashAlt />
              </button>{" "}
              <button className="bg-[#282EFF] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
                Impersonate <FaUsers />
              </button> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
