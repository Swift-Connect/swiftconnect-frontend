import Image from "next/image";

export default function Navbar() {
    return (
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
    );
}