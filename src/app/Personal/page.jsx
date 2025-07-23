import TestimonialsCarousel from "../Home/components/caroussel";
import EarnMore from "../Home/components/earrnmore";
import Footer from "../Home/components/footer";
import Hero from "../Home/components/hero";
import JoinThousands from "../Home/components/joinThouands";
import Navbar from "../Home/components/navbar";
import SwiftConnectFeatures from "../Home/components/swiftconnectfeatures";
import SwiftConnectUtilities from "../Home/components/SwiftConnectUtilities";
import WhyChooseUs from "../Home/components/whychooseus";

export default function Personal() {
  return (
    <>
      <Navbar />
      <Hero />
      <SwiftConnectFeatures />
      <SwiftConnectUtilities />

      {/* <EarnMore /> */}
      <WhyChooseUs
        header="Benefit Section"
        subHeading="Unlock financial freedom with our rewarding referral program."
      />
      <TestimonialsCarousel />
      <JoinThousands />
      <Footer />
    </>
  );
}
