import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="bg-red-500">
      <div className="flex flex-col items-center justify-center text-center">
        <p className="text-gray-600">
          New to Swift Connect?{" "}
          <Link
            href="/signup"
            className="text-green-700 hover:text-green-800 font-medium"
          >
            Create an Account
          </Link>
        </p>
        <p className="mt-4 text-sm text-gray-500 max-w-md text-center">
          By entering and clicking Continue, you agree to the{" "}
          <Link href="/terms" className="underline">
            Terms
          </Link>
          ,{" "}
          <Link href="/e-sign" className="underline">
            E-Sign Consent
          </Link>
          {" & "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default Footer;
