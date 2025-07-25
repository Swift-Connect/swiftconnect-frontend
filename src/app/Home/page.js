import React from "react";
import { Smartphone, Play, Apple } from "lucide-react";
import Image from "next/image";
import SwiftConnectFeatures from "./components/swiftconnectfeatures";
import SwiftConnectUtilities from "./components/SwiftConnectUtilities";
import EarnMore from "./components/earrnmore";
import TestimonialsCarousel from "./components/caroussel";
import WhyChooseUs from "./components/whychooseus";
import JoinThousands from "./components/joinThouands";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import Hero from "./components/hero";

export default function SwiftConnectLanding() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <Hero />

      <SwiftConnectFeatures />
      <SwiftConnectUtilities />

      <EarnMore />
      <TestimonialsCarousel />
      <WhyChooseUs
        header="Why Choose Us"
        subHeading="Why Thousands Trusts Us."
      />
      <JoinThousands />

      {/* Footer Spacer */}
      <Footer />
    </div>
  );
}
