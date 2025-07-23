import Image from "next/image";
import TestimonialsCarousel from "../Home/components/caroussel";
import EarnMore from "../Home/components/earrnmore";
import Footer from "../Home/components/footer";
import JoinThousands from "../Home/components/joinThouands";
import Navbar from "../Home/components/navbar";
import WhyChooseUs from "../Home/components/whychooseus";

export default function Agent() {
  return (
    <>
      <Navbar />
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 py-12">
          <span className="text-[#1c451c]">
            Maximize your Earnings as an agent
          </span>
          <br />
          {/* <span className="text-gray-900">Endless Rewards.</span> */}
        </h1>

        <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Unlock high commissions, grow your network, and manage referrals with
          ease
        </p>

        {/* Download Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
            {/* <Apple className="w-5 h-5" /> */}
            <span>Join as an Agent Now</span>
          </button>
          {/* <button className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
            <Play className="w-5 h-5" />
            <span>Get on Android</span>
          </button> */}
        </div>
      </div>
      <Image
        src={"./large_screen.svg"}
        alt="Watermark Logo"
        className="w-[70%] object-contain m-auto"
        width={0}
        height={0}
      />
      <div className="py-10 px-4 md:py-16 md:px-6 ">
        <div className="bg-black flex flex-col md:flex-row justify-between p-6 md:p-32 rounded-3xl text-white gap-8 md:gap-0">
          <div>
            <h1 className="font-bold text-2xl md:text-[36px]">Why Become an Agent</h1>
            <p className="text-[#878787] mt-2 text-base md:text-lg">
              Unlock a world of earning potential with our agent program.
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full md:w-auto">
            <div className="flex items-center gap-4">
              <Image
                src={"./money_sack.svg"}
                alt="Watermark Logo"
                className="w-12 object-contain"
                width={0}
                height={0}
              />
              <div>
                <h1 className="font-bold text-lg md:text-[24px]">Earn Big</h1>
                <p className="text-[#878787] mt-1 text-sm md:text-base">
                  Competitive commission rates on every transaction.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Image
                src={"./user_group.svg"}
                alt="Watermark Logo"
                className="w-12 object-contain"
                width={0}
                height={0}
              />
              <div>
                <h1 className="font-bold text-lg md:text-[24px]">Empower Your Growth</h1>
                <p className="text-[#878787] mt-1 text-sm md:text-base">
                  Tools and resources to build a successful referral network.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Image
                src={"./user_group.svg"}
                alt="Watermark Logo"
                className="w-12 object-contain"
                width={0}
                height={0}
              />
              <div>
                <h1 className="font-bold text-lg md:text-[24px]">Empower Your Growth</h1>
                <p className="text-[#878787] mt-1 text-sm md:text-base">
                  Tools and resources to build a successful referral network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EarnMore hideHeader={true} />
      <TestimonialsCarousel />
      <WhyChooseUs
        header="Why Choose Us"
        subHeading="Why Thousands Trusts Us."
      />
      <JoinThousands />
      <Footer />
    </>
  );
}
