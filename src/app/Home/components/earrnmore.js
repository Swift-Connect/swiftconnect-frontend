import React from "react";
import { ArrowRight, Tv, Zap } from "lucide-react";
import Image from "next/image";

export default function EarnMore() {
  return (
      <div className="bg-white py-16 px-6">
          
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-1 gap-12 lg:gap-16">
          {/* Entertainment Section */}
          <div className="flex bg-[#8080803a] px-8 pt-8 justify-between rounded-3xl">
            <div className="mb-8 ">
              <div className="w-12 h-12 bg-orange-5 rounded-lg flex items-center justify-center mb-4">
                {/* <Tv className="w-6 h-6 text-white" /> */}
                <Image
                  src={"./user_group.svg"}
                  alt="Watermark Logo"
                  className="w-60 object-contain"
                  width={0}
                  height={0}
                />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Track Referrals and Earnings
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Easily monitor your referrals and commissions with a simple,
                user-friendly dashboard.
              </p>
              <button className="flex items-center space-x-2 text-gray-900 font-semibold hover:text-orange-600 transition-colors group">
                <span>Access Your Dashboard Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Phone Mockup 1 - Entertainment */}
            <div>
              <Image
                src={"./referals_mockup.svg"}
                alt="Watermark Logo"
                className="w-[40em] object-contain"
                width={0}
                height={0}
              />
            </div>
          </div>

          {/* Electricity Section */}
          <div className="flex bg-[#afafaf46] px-8 pt-8 justify-between rounded-3xl">
            <div className="mb-8 w-1/2">
              <div className="w-12 h-12 bg-red- rounded-lg flex items-center justify-center mb-4">
                {/* <Zap className="w-6 h-6 text-white" /> */}
                <Image
                  src={"./money_sack.svg"}
                  alt="Watermark Logo"
                  className="w-60 object-contain"
                  width={0}
                  height={0}
                />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Earn More with Every Referral
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Enjoy high commissions and unlock unlimited earning potential as
                you grow your network.
              </p>
              <button className="flex items-center space-x-2 text-gray-900 font-semibold hover:text-red-600 transition-colors group">
                <span>Start Earning Today</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Electricity Bill Interface */}

            <Image
              src={"/earn_more_mockup.svg"}
              alt="Watermark Logo"
              className="w-[30em] object-contain"
              width={0}
              height={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
