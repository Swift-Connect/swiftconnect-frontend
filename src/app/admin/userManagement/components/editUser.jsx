"use client";

import { useState } from "react";
import { FaPlus, FaTrashAlt, FaUserAlt, FaUserCog, FaUsers, FaUserTag } from "react-icons/fa";

const UserForm = () => {
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
                  User type
                </label>
                <select
                  value={formData.userType}
                  className="w-[66%] mt-1 p-4 border rounded-[0.8em] focus:outline-none focus:ring-2 focus:ring-gray-400"
                  disabled
                >
                  <option>Reseller</option>
                  <option>Admin</option>
                  <option>User</option>
                </select>
              </div>

              <div className="flex items-center gap-[2em]">
                <label className="block text-[18px] font-medium text-gray-700 w-[150px]">
                  Status
                </label>
                <select
                  value={formData.status}
                  className="w-[66%] mt-1 p-4 border rounded-[0.8em] focus:outline-none focus:ring-2 focus:ring-gray-400"
                  disabled
                >
                  <option>Approved</option>
                  <option>Pending</option>
                  <option>Rejected</option>
                </select>
              </div>

              <div className="flex items-center gap-[2em]">
                <label className="block text-[18px] font-medium text-gray-700 w-[150px]">
                  Account no
                </label>
                <div>
                  <input
                    type="text"
                    value={formData.accountNo}
                    className="w-full mt-1 p-4 border rounded-[0.8em] focus:outline-none focus:ring-2 focus:ring-gray-400"
                    disabled
                  />
                  <p className="text-[14px] text-gray-500">
                    Raw passwords are not stored, so there is no way to see this
                    user’s password
                  </p>
                </div>
              </div>
            </div>
            {/* Personal Info */}
            <div className="flex flex-col gap-6 mt-4">
              <h1 className="font-bold text-[28px] mb-4">
                Personal Information
              </h1>
              <div className="flex items-center gap-[2em]">
                <label className="block text-[18px] font-medium text-gray-700 w-[150px]">
                  First name
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
                  Last name
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
                  Email
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
                  DOB
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
                  Gender
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
                  State of Origin
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
                    <span className="font-semibold text-[22px]">Active</span>
                    <p className="text-sm text-gray-500">
                      Designates whether this user should be treated as active.
                      Unselect this instead of deleting account.
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
                    <span className="font-semibold text-[22px]">Admin</span>
                    <p className="text-sm text-gray-500">
                      Designates whether the user can log into this admin site.
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
                    <span className="font-semibold text-[22px]">SuperUser</span>
                    <p className="text-sm text-gray-500">
                      Designates that this user has all permissions without
                      explicitly assigning them.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="bg-[#00613A] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
                Add User <FaPlus />
              </button>
              <button className="bg-[#8C1823] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
                Delete <FaTrashAlt />
              </button>{" "}
              <button className="bg-[#282EFF] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
                Impersonate <FaUsers />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
