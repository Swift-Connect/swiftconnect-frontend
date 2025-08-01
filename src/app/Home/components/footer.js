import { X } from "lucide-react";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-white px-4 py-8 md:px-12 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <div className="flex flex-col gap-4 mb-4 items-start">
            <Image
              src={"./logo_alone.svg"}
              alt="Watermark Logo"
              className="w-10 object-contain"
              width={0}
              height={0}
            />
            <h1 className="font-bold text-xl">Swift Connect</h1>
          </div>
          <p>
            Pay utility bills with ease, or earn big by referring users as an
            agent.
          </p>
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:gap-12">
          <div className="flex flex-col gap-4">
            <p className="text-[#A0A0A0] text-[18px] md:text-[21px]">
              Quick Links
            </p>
            <ul className="flex flex-col gap-2 md:gap-4">
              <li className="list-none">
                <a href="/" className="no-underline text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="Personal">Personal</a>
              </li>
              <li>
                <a href="Agent">Agent</a>
              </li>
              <li>
                <a href="AboutUs">About Us</a>
              </li>
              <li>
                <a href="delete">Account Deletion Instructions</a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-[#A0A0A0] text-[18px] md:text-[21px]">
              Contact Info
            </p>
            <ul className="flex flex-col gap-2 md:gap-4">
              <li className="list-none">Email: info@architectura.com</li>
              <li>Phone: +1 123-456-7890</li>
              <li>Address: 123 Architecture Lane, Design City, Country</li>
            </ul>
          </div>
        </div>
      </div>

      <hr />
      <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
        <p className="text-center md:text-left">
          © 2024 Swift Connect. All Rights Reserved.
        </p>
        <div className="flex gap-4 items-center justify-center">
          <FaYoutube className="cursor-pointer hover:text-[#69e169]" />
          <FaInstagram className="cursor-pointer hover:text-[#69e169]" />
          <FaTwitter className="cursor-pointer hover:text-[#69e169]" />
          <FaFacebook className="cursor-pointer hover:text-[#69e169]" />
        </div>
      </div>
    </footer>
  );
}
