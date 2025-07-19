import React from "react";
import { ArrowRight, Smartphone, Globe } from "lucide-react";
import Image from "next/image";

export default function SwiftConnectFeatures() {
  return (
    <div className="bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Instant Airtime Section */}
          <div className="flex flex-col bg-[#bebebe5d] px-10 pt-10 rounded-2xl">
            <div className="mb-8">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                {/* <Smartphone className="w-6 h-6 text-white" /> */}
                <Image
                  src={"./airtime.svg"}
                  alt="Watermark Logo"
                  className="w-60 object-contain"
                  width={0}
                  height={0}
                />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Instant Airtime Anytime
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Top up your mobile phone with airtime in seconds—fast, secure,
                and accessible wherever you are.
              </p>
              <button className="flex items-center space-x-2 text-gray-900 font-semibold hover:text-blue-600 transition-colors group">
                <span>Pay Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Phone Mockup 1 - Airtime */}
            <Image
              src={"./mobile_mockup2.svg"}
              alt="Watermark Logo"
              className="w-60 object-contain"
              width={0}
              height={0}
            />
          </div>

          {/* Stay Connected Section */}
          <div className="flex flex-col bg-[#bebebe5d] px-10 pt-10 rounded-2xl">
            <div className="mb-8">
              <div className="w-12 h-12 bg-blue-40 rounded-lg flex items-center justify-center mb-4">
                {/* <Globe className="w-6 h-6 text-white" /> */}
                <Image
                  src={"/internet.svg"}
                  alt="Watermark Logo"
                  className="w-60 object-contain"
                  width={0}
                  height={0}
                />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Stay Connected, Always
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Purchase affordable data plans for your mobile and broadband
                needs, ensuring seamless browsing and streaming anytime,
                anywhere.
              </p>
              <button className="flex items-center space-x-2 text-gray-900 font-semibold hover:text-blue-600 transition-colors group">
                <span>Recharge Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Phone Mockup 2 - Data */}
            <Image
              src={"./mobile_mockup1.svg"}
              alt="Watermark Logo"
              className="w-60 object-contain"
              width={0}
              height={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
