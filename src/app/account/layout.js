import { Poppins } from "next/font/google";
import "../globals.css";
import Footer from "@/app/account/components/Footer";
import Image from "next/image";

const poppins = Poppins({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    
      <div
        className={`${poppins.className} antialiased`}
      >
              {/* Logo */}
      <div className="w-full items-center m-auto">
        <Image
          src="/logo.svg"
          alt="Swift Connect"
          width={180}
          height={48}
          priority
        />
      </div>
      <div className="">

        {children}
      </div>
      <div className="items-center">
        <Footer />
      </div>
      </div>
  );
}
