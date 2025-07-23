import Image from "next/image";
import Footer from "../Home/components/footer";
import JoinThousands from "../Home/components/joinThouands";
import Navbar from "../Home/components/navbar";
import OurTeam from "./components/OurTeams";

export default function AboutUs() {
  return (
    <>
      {" "}
      <Navbar />
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl  text-gray-900 mb-4 py-12">
          <span className="text-[#1c451c] font-bold">Redefining Payments,</span>
          <br />
          <span className="text-gray-900">Empowering Growth</span>
        </h1>

        <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Streamline your utility payments and unlock earning potential with our
          trusted platform.
        </p>

        {/* Download Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
            {/* <Apple className="w-5 h-5" /> */}
            <span>Star Paying Bills</span>
          </button>
        </div>
      </div>
      <div className="px-4 md:px-6 py-12 md:py-16">
        <div className="bg-[#FAFAFA] rounded-2xl flex flex-col gap-36 p-16">
          {" "}
          <div className="flex justify-between gap-10">
            <h1 className="font-bold text-[36px]">
              The Journey That Brought Us Here
            </h1>
            <div>
              <p>
                It all started with the vision to solve everyday payment
                challenges and empower communities.
              </p>
              <br />
              <p>
                Since our inception, we’ve grown into a trusted platform
                transforming how people handle payments and referrals.
              </p>
            </div>
          </div>

          <div className="flex justify-between gap-14">
            <Image
              src={"./mission.svg"}
              alt="Watermark Logo"
              className="w-full object-contain"
              width={0}
              height={0}
            />
            <Image
              src={"./values.svg"}
              alt="Watermark Logo"
              className="w-full object-contain"
              width={0}
              height={0}
            />
          </div>
        </div>
      </div>

      <OurTeam/>
      <JoinThousands />
      <Footer />
    </>
  );
}
