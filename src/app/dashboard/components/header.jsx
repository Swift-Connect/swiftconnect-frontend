import { Menu } from "lucide-react";
import Image from "next/image";
import SearchBar from "./SearchBar";

export default function Header({ setHideSideMenu, user, setActiveSidebar }) {
  return (
    <header className="flex max-md-[400px]:w-full justify-between  items-center  bg-white py-4 px-8 max-md-[400px]:px-2 header-shadow max-md-[400px]:gap-4">
      <Menu
        onClick={() => setHideSideMenu(false)}
        className="max-md-[400px]:block hidden cursor-pointer"
      />
      <h1 className="text-[28px] text-[#101828] font-semibold max-md-[400px]:text-[14px]">
        Welcome back, {user?.username}
      </h1>
      <div className="flex items-center gap-4 ">
        <SearchBar setActiveSidebar={setActiveSidebar} />

        <div>
          <Image
            src={"/message.svg"}
            alt="User icon"
            width={100}
            height={100}
            className="w-[2.4em]"
          />
        </div>

        <div>
          <Image
            src={"/notification.svg"}
            alt="User icon"
            width={100}
            height={100}
            className="w-[2.4em]"
          />
        </div>
        {/* <button className="relative">
          <img src="/bell-icon.svg" alt="Notifications" className="h-6 w-6" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            2
          </span>
        </button> */}
      </div>
    </header>
  );
}
