import Image from "next/image";

export default function JoinThousands() {
  return (
    <div className="px-4 md:px-6 py-12 md:py-16 bg-gray-50">
      <div className="bg-[url('/greenBG.svg')] flex items-center justify-center bg-no-repeat bg-cover bg-center py-12 md:py-[8em] rounded-3xl">
        {/* Your content here */}
        <div className="flex flex-col items-center text-center">
          <h1 className="font-bold text-2xl md:text-[45px] text-white">
            Join thousands of people who pay bills with us
          </h1>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <Image
              src={"./google_play.svg"}
              alt="Watermark Logo"
              className="w-40 md:w-60 object-contain"
              width={0}
              height={0}
            />
            <Image
              src={"./apple.svg"}
              alt="Watermark Logo"
              className="w-40 md:w-60 object-contain"
              width={0}
              height={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
