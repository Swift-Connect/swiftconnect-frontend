import Image from "next/image";

export default function Header() {
  return (
    <header className="flex justify-between items-center  bg-white py-4 px-8 header-shadow" >
      <h1 className="text-[28px] text-[#101828] font-semibold">
        Welcome back, Chosenfolio
      </h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center  border rounded-md px-3 py-1 bg-[#D3F1CC33]">
          <Image
            src={"/search.svg"}
            alt="search icon"
            width={100}
            height={100}
            className="w-[2.4em]"
          />
          <input
            type="text"
            placeholder="Search for something"
            className="border-none outline-none rounded-md px-3 py-1 text-sm bg-transparent"
          />
        </div>

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
