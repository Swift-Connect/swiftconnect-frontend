"use client";
import Image from "next/image";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-gray-900 rounded-none md:rounded-full md:m-4 text-white px-4 md:px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* SWIFT_LOGO_White */}
          <Image
            src={"./SWIFT_LOGO_White.svg"}
            alt="Watermark Logo"
            className="w-28 md:w-32 object-contain"
            width={0}
            height={0}
          />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="/Personal"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Personal
          </a>
          <a
            href="/Agent"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Agent
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            About Us
          </a>
        </nav>

        {/* Desktop Login & Sign Up */}
        <div className="hidden md:flex items-center space-x-3">
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors font-semibold"
          >
            Login
          </a>
          <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Sign Up
          </button>
        </div>

        {/* Hamburger Icon */}
        <button
          className="md:hidden flex items-center justify-center focus:outline-none"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? (
            <FiX className="w-8 h-8" />
          ) : (
            <FiMenu className="w-8 h-8" />
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      <div
        className={`md:hidden absolute left-0 right-0 top-[8%] z-50 bg-gray-900 rounded-b-2xl px-6 py-4 shadow-lg transition-all duration-300 ${
          mobileOpen ? "block" : "hidden"
        }`}
      >
        <nav className="flex flex-col space-y-4">
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Personal
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Agent
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            About Us
          </a>
          <div className="flex flex-col gap-2 mt-2">
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors font-semibold"
              onClick={() => setMobileOpen(false)}
            >
              Login
            </a>
            <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Sign Up
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}