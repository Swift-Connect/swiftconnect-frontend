"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Replace "token" with your actual token key
    if (!token) {
      router.push("/dashboard"); // Redirect to the dashboard if token is present
    } else {
      router.push("/account/login"); // Redirect to the login page if no token
    }
  }, [router]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      SWIFT CONNECT
    </div>
  );
}
