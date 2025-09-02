import { Apple, Play } from "lucide-react";
 
import Image from "next/image";

export default function Hero() {
    return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            <span className="text-[#1c451c]">Fast Payments,</span>
            <br />
            <span className="text-gray-900">Endless Rewards.</span>
          </h1>

          <p className="text-gray-600 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Pay utility bills with ease, or earn big
            <br />
            by referring users as an agent.
          </p>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-16 px-4">
            <button className="flex items-center space-x-2 bg-gray-900 text-white px-4 sm:px-6 py-3 rounded-full hover:bg-gray-800 transition-colors text-sm sm:text-base">
              <Apple className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Get on iPhone</span>
            </button>
            <button className="flex items-center space-x-2 bg-gray-900 text-white px-4 sm:px-6 py-3 rounded-full hover:bg-gray-800 transition-colors text-sm sm:text-base">
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Get on Android</span>
            </button>
          </div>
        </div>

        {/* Phone Mockup Section */}
        <div className="flex flex-col lg:flex-col items-center gap-8 sm:gap-12">
          {/* Phone Mockup */}
          <Image
            src={"./mobile_mockup1.svg"}
            alt="Watermark Logo"
            className="w-48 sm:w-64 object-contain"
            width={0}
            height={0}
          />

          {/* Content */}
          <div className="flex-1 max-w-lg px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-center font-bold text-gray-900 mb-4">
              Effortless Utility Bill Management
            </h2>
            <p className="text-gray-600 text-center text-base sm:text-lg leading-relaxed">
              Manage your electricity, water, internet, and mobile recharge
              payments all in one place.
            </p>
          </div>
        </div>
      </main>
    );
}