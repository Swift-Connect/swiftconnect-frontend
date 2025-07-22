import React from "react";
import { ArrowRight, Tv, Zap } from "lucide-react";
import Image from "next/image";

export default function EarnMore() {
  return (
    <>
      {/* Content */}
      <div className="flex-1 text-center w-full">
        <h2 className="text-4xl text-center font-bold text-gray-900 mb-4">
          Earn More as an Agent
        </h2>
        <p className="text-gray-600 text-center text-lg leading-relaxed">
          Unlock financial freedom with our rewarding referral program.
        </p>
      </div>
      <div className="bg-white py-10 px-4 md:py-16 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-8 md:gap-16">
            {/* Referrals Section */}
            <div className="flex flex-col md:flex-row bg-[#8080803a] px-4 md:px-8 pt-8 justify-between rounded-3xl">
              <div className="mb-8 md:mb-0 md:w-1/2">
                <div className="w-12 h-12 bg-orange-5 rounded-lg flex items-center justify-center mb-4">
                  {/* <Tv className="w-6 h-6 text-white" /> */}
                  <Image
                    src={"./user_group.svg"}
                    alt="Watermark Logo"
                    className="w-32 md:w-60 object-contain"
                    width={0}
                    height={0}
                  />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Track Referrals and Earnings
                </h2>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                  Easily monitor your referrals and commissions with a simple,
                  user-friendly dashboard.
                </p>
                <button className="flex items-center space-x-2 text-gray-900 font-semibold hover:text-orange-600 transition-colors group">
                  <span>Access Your Dashboard Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              {/* Phone Mockup 1 - Referrals */}
              <div className="flex justify-center items-center md:items-end">
                <Image
                  src={"./referals_mockup.svg"}
                  alt="Watermark Logo"
                  className="w-40 md:w-[40em] object-contain"
                  width={0}
                  height={0}
                />
              </div>
            </div>

            {/* Earn More Section */}
            <div className="flex flex-col md:flex-row bg-[#afafaf46] px-4 md:px-8 pt-8 justify-between rounded-3xl">
              <div className="mb-8 md:mb-0 md:w-1/2">
                <div className="w-12 h-12 bg-red- rounded-lg flex items-center justify-center mb-4">
                  {/* <Zap className="w-6 h-6 text-white" /> */}
                  <Image
                    src={"./money_sack.svg"}
                    alt="Watermark Logo"
                    className="w-32 md:w-60 object-contain"
                    width={0}
                    height={0}
                  />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Earn More with Every Referral
                </h2>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                  Enjoy high commissions and unlock unlimited earning potential
                  as you grow your network.
                </p>
                <button className="flex items-center space-x-2 text-gray-900 font-semibold hover:text-red-600 transition-colors group">
                  <span>Start Earning Today</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              {/* Earn More Mockup */}
              <div className="flex justify-center items-center md:items-end">
                <Image
                  src={"/earn_more_mockup.svg"}
                  alt="Watermark Logo"
                  className="w-40 md:w-[30em] object-contain"
                  width={0}
                  height={0}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
