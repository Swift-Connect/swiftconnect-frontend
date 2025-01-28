import Image from "next/image";
import React from "react";

const CardPage = () => {
  return (
    <div className="flex flex-col justify-center gap-y-[3em] items-center">
      <div className="flex flex-col justify-center items-center">
        <Image
          src={"Wallet.svg"}
          alt="mastercard logo"
          width={100}
          height={100}
          className="w-[14em]"
        />
        <p className="text-[#9CA3AF] w-[50%] text-center text-[24px]">
          You haven’t added your card Tap the plus (+) icon to add one.
        </p>
      </div>
      <div className="w-full">
        {" "}
        <Image
          src={"CrossButton.svg"}
          alt="mastercard logo"
          width={100}
          height={100}
          className="w-[5em] float-right"
        />
      </div>
    </div>
  );
};

export default CardPage;
