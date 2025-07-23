"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./globals.css";
import SwiftConnectLanding from "./Home/page";

export default function Home() {
  const router = useRouter();
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      router.push("/dashboard");
    } else {
      setCheckedAuth(true);
    }
  }, [router]);

  // Only show landing page if not authenticated
  if (!checkedAuth) {
    return null;
  }

  return <SwiftConnectLanding />;
}
