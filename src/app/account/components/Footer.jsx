"use client"
import Link from "next/link";
import React from "react";
import { usePathname } from 'next/navigation';

const Footer = () => {
  const router = usePathname(); // Get the router object
  const isLoginPage = router.includes('login'); 
  const isSignupPage = router.includes('signup'); 


  return (
    <div className="">
      <div className="flex flex-col items-center justify-center text-center">
      
        {isLoginPage ? (
          <p className="text-gray-600">
            New to Swift Connect?{" "}
            <Link
              href="/account/signup"
              className="text-green-700 hover:text-green-800 font-medium"
            >
              Create an Account
            </Link>
          </p>
        ) : isSignupPage ? (
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              href="/account/login"
              className="text-green-700 hover:text-green-800 font-medium"
            >
              Log In
            </Link>
          </p>
        ) : null}
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
