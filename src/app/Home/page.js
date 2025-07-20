import React from "react";
import { Smartphone, Play, Apple } from "lucide-react";
import Image from "next/image";
import SwiftConnectFeatures from "./components/swiftconnectfeatures";
import SwiftConnectUtilities from "./components/SwiftConnectUtilities";
import EarnMore from "./components/earrnmore";
import TestimonialsCarousel from "./components/caroussel";
import WhyChooseUs from "./components/whychooseus";

export default function SwiftConnectLanding() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 rounded-full mx-10 my-4 text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* SWIFT_LOGO_White */}
            <Image
              src={"./SWIFT_LOGO_White.svg"}
              alt="Watermark Logo"
              className="w-32 object-contain"
              width={0}
              height={0}
            />
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Personal
            </a>
            <a
              href="#"
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
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Login
            </a>
          </nav>

          <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            <span className="text-[#1c451c]">Fast Payments,</span>
            <br />
            <span className="text-gray-900">Endless Rewards.</span>
          </h1>

          <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Pay utility bills with ease, or earn big
            <br />
            by referring users as an agent.
          </p>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
              <Apple className="w-5 h-5" />
              <span>Get on iPhone</span>
            </button>
            <button className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
              <Play className="w-5 h-5" />
              <span>Get on Android</span>
            </button>
          </div>
        </div>

        {/* Phone Mockup Section */}
        <div className="flex flex-col lg:flex-col items-center gap-12">
          {/* Phone Mockup */}
          <Image
            src={"./mobile_mockup1.svg"}
            alt="Watermark Logo"
            className="w-64 object-contain"
            width={0}
            height={0}
          />

          {/* Content */}
          <div className="flex-1 max-w-lg">
            <h2 className="text-4xl text-center font-bold text-gray-900 mb-4">
              Effortless Utility Bill Management
            </h2>
            <p className="text-gray-600 text-center text-lg leading-relaxed">
              Manage your electricity, water, internet, and mobile recharge
              payments all in one place.
            </p>
          </div>
        </div>
      </main>

      <SwiftConnectFeatures />
      <SwiftConnectUtilities />
      {/* Content */}
      <div className="flex-1 text-center w-full">
        <h2 className="text-4xl text-center font-bold text-gray-900 mb-4">
          Earn More as an Agent
        </h2>
        <p className="text-gray-600 text-center text-lg leading-relaxed">
          Unlock financial freedom with our rewarding referral program.
        </p>
      </div>
          <EarnMore />
          <TestimonialsCarousel />
          <WhyChooseUs/>

      {/* Footer Spacer */}
      <div className="h-16"></div>
    </div>
  );
}
