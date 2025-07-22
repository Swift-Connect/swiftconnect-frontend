import React from "react";
import { ArrowRight, Tv, Zap } from "lucide-react";
import Image from "next/image";

export default function SwiftConnectUtilities() {
  return (
    <div className="bg-white py-10 px-4 md:py-16 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-8 md:gap-16">
          {/* Entertainment Section */}
          <div className="flex flex-col md:flex-row bg-[#8080803a] px-4 md:px-8 pt-8 justify-between rounded-3xl">
            <div className="mb-8 md:mb-0 md:w-1/2">
              <div className="w-12 h-12 bg-orange-5 rounded-lg flex items-center justify-center mb-4">
                {/* <Tv className="w-6 h-6 text-white" /> */}
                <Image
                  src={"./cable-tv.svg"}
                  alt="Watermark Logo"
                  className="w-32 md:w-60 object-contain"
                  width={0}
                  height={0}
                />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Entertainment Without Interruptions
              </h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                Renew your TV cable subscriptions in just a few clicks and never
                miss your favorite shows again.
              </p>
              <button className="flex items-center space-x-2 text-gray-900 font-semibold hover:text-orange-600 transition-colors group">
                <span>Pay Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            {/* Phone Mockup 1 - Entertainment */}
            <div className="flex justify-center items-center md:items-end">
              <Image
                src={"./mobile_mockup3.svg"}
                alt="Watermark Logo"
                className="w-40 md:w-60 object-contain"
                width={0}
                height={0}
              />
            </div>
          </div>

          {/* Electricity Section */}
          <div className="flex flex-col md:flex-row bg-[#afafaf46] px-4 md:px-8 pt-8 justify-between rounded-3xl">
            <div className="mb-8 md:mb-0 md:w-1/2">
              <div className="w-12 h-12 bg-red- rounded-lg flex items-center justify-center mb-4">
                {/* <Zap className="w-6 h-6 text-white" /> */}
                <Image
                  src={"./electricity.svg"}
                  alt="Watermark Logo"
                  className="w-32 md:w-60 object-contain"
                  width={0}
                  height={0}
                />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Keep the Lights On with Ease
              </h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                Pay your electricity bills instantly, avoid disruptions, and
                enjoy the convenience of stress-free power management from your
                fingertips.
              </p>
              <button className="flex items-center space-x-2 text-gray-900 font-semibold hover:text-red-600 transition-colors group">
                <span>Pay Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            {/* Electricity Bill Interface */}
            <div className="flex flex-col sm:flex-row items-center md:items-end gap-2">
              <Image
                src={"/electricity_mockup1.svg"}
                alt="Watermark Logo"
                className="w-32 md:w-[30em] object-contain"
                width={0}
                height={0}
              />
              <Image
                src={"/ibedc.svg"}
                alt="Watermark Logo"
                className="w-24 md:w-60 object-contain"
                width={0}
                height={0}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 