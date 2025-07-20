import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function WhyChooseUs() {
  return (
    <div className="px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
          Why Choose Us
          <br />
        </h2>
        <p>Why Thousands Trusts Us</p>
      </div>

      <div className="flex justify-between gap-6">
        <div className="border-[2px] p-6 flex flex-col gap-6 rounded-2xl bg-[#FAFAFA] w-fit">
          <Image
            src={"./secure.svg"}
            alt="Watermark Logo"
            className="w-20 object-contain"
            width={0}
            height={0}
          />
          <div>
            <h1 className="font-bold text-2xl">Secure</h1>
            <p className="">
              Advanced technology ensures every transaction is protected.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <p className="font-bold">CTA Button</p>
            <ArrowRight />
          </div>
        </div>{" "}
        <div className="border-[2px] p-6 flex flex-col gap-6 rounded-2xl bg-[#FAFAFA] w-fit">
          <Image
            src={"./speedometer.svg"}
            alt="Watermark Logo"
            className="w-20 object-contain"
            width={0}
            height={0}
          />
          <div>
            <h1 className="font-bold text-2xl">Fast</h1>
            <p className="">
              Experience seamless payments and earnings without delays.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <p className="font-bold">CTA Button</p>
            <ArrowRight />
          </div>
        </div>{" "}
        <div className="border-[2px] p-6 flex flex-col gap-6 rounded-2xl bg-[#FAFAFA] w-fit">
          <Image
            src={"./secure.svg"}
            alt="Watermark Logo"
            className="w-20 object-contain"
            width={0}
            height={0}
          />
          <div>
            <h1 className="font-bold text-2xl">Reliable</h1>
            <p className="">
              Count on us for consistent and dependable service.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <p className="font-bold">CTA Button</p>
            <ArrowRight />
          </div>
        </div>
      </div>
    </div>
  );
}
