import React, { useState } from "react";
import { Sun, Moon, Monitor, Trash2 } from "lucide-react";
import Image from "next/image";
import { FaPlus, FaTrashAlt } from "react-icons/fa";

const AppearanceSettings = () => {
  const [logo, setLogo] = useState(null);
  const [brandColor, setBrandColor] = useState("#2C68F6");
  const [theme, setTheme] = useState("light");

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setLogo(imageUrl);
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
  };

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  const handleSaveChanges = () => {
    console.log({
      logo,
      brandColor,
      theme,
    });
    alert("Changes Saved!");
  };

  return (
    <div className="w-full">
      {/* Company Logo */}
      <div className="mb-8 flex gap-[6em]">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Company Logo</h2>
          <p className="text-[#929292] text-[14px]">Change Company logo</p>
        </div>
        <div className="flex items-center space-x-14">
          {logo ? (
            <img
              src={logo}
              alt="Company Logo"
              className="w-16 h-16 rounded-md object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl p-2 bg-gray-200 flex items-center justify-center text-gray-400">
              No Logo
            </div>
          )}
          <div className="space-x-2 flex">
            <label className="bg-[#00613A] hover:bg-green-800 text-white px-4 py-2 rounded cursor-pointer">
              Replace Logo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
            </label>

            <button
              className="border border-[#8C1823] font-medium text-[#8C1823] px-4 py-2 rounded-lg flex items-center gap-2"
              onClick={handleRemoveLogo}
            >
              Remove Logo <FaTrashAlt />
            </button>
          </div>
        </div>
      </div>

      <hr className="my-8" />

      {/* Brand Color */}
      <div className="mb-8 flex gap-[6em]">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Brand Color</h2>
          <p className="text-[#929292] text-[14px]">
            Customize your brand color
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={brandColor}
            onChange={(e) => setBrandColor(e.target.value)}
            className="border rounded px-3 py-2 w-40"
          />
          <input
            type="color"
            value={brandColor}
            onChange={(e) => setBrandColor(e.target.value)}
            className="w-10 h-10 p-0 border rounded-full"
          />
        </div>
      </div>

      <hr className="my-8" />

      {/* Interface Theme */}
      <div className="mb-8 flex gap-[6em]">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Interface Theme</h2>
          <p className="text-[#929292] text-[14px]">
            Select your preferred theme
          </p>
        </div>
        <div className="flex space-x-6">
          <div>
            <div
              className={`border rounded-xl p-1 w- text-cente cursor-pointer ${
                theme === "system" ? "border-green-600" : "border-none"
              }`}
              onClick={() => handleThemeChange("system")}
            >
              <Image
                src={"systemPref.svg"}
                className="w-full"
                width={100}
                height={100}
              />
            </div>
            <div className="text-sm font-bold mt-4">System Preference</div>
          </div>

          <div>
            <div
              className={`border rounded-xl p-1 text-center cursor-pointer ${
                theme === "light" ? "border-green-600" : "border-gray-300"
              }`}
              onClick={() => handleThemeChange("light")}
            >
              {" "}
              <Image
                src={"systemPref.svg"}
                className="w-full"
                width={100}
                height={100}
              />
            </div>
            <div className="text-sm font-bold mt-4">Light Mode</div>
          </div>

          <div>
            <div
              className={`border rounded-xl p-1 text-center cursor-pointer ${
                theme === "dark" ? "border-green-600" : "border-gray-300"
              }`}
              onClick={() => handleThemeChange("dark")}
            >
              <Image
                src={"systemPref.svg"}
                className="w-full"
                width={100}
                height={100}
              />
            </div>
            <div className="text-sm font-bold mt-4">Dark Mode</div>
          </div>
        </div>
      </div>

      {/* Save Changes Button */}
      <div className="flex items-end justify-end gap-[3em] mb-8">
        <button className="bg-[#00613A] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
          Save Changes <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default AppearanceSettings;
