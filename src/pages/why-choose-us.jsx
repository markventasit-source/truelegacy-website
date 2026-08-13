import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { lazy, Suspense } from "react";
import WhyChooseImage from "../assets/img/whychooseus/Frame whychoosepng.webp";
import WhyChooseMobileImage from "../assets/img/Frame whychoseusmobile.webp";

const Description = lazy(() => import("../components/whychooseus/Description"));
const WhyChoose = lazy(() => import("../components/whychooseus/WhyChoose"));
const OurPromise = lazy(() => import("../components/whychooseus/OurPromise"));

const WhyChooseUs = () => {
  return (
    <div
      className="relative"
      style={{
        background: "linear-gradient(264.41deg, #132F2C 4.24%, #132F2C 98.47%)",
      }}
    >
      <div className="fixed top-0 left-0 right-0 z-[60] bg-[#132F2C]">
        <Navbar />
      </div>

      <div className="h-[64px] md:h-[72px]" />

      <Header
        title="Why Choose Us"
        subtitle="Discover why families trust True Legacy for their succession planning needs."
        mobileImage={WhyChooseMobileImage}
        desktopImage={WhyChooseImage}
      />

      <main className="flex-grow bg-white text-black">
        <Suspense fallback={null}>
          <Description />
        </Suspense>
        <Suspense fallback={null}>
          <WhyChoose />
        </Suspense>
        <Suspense fallback={null}>
          <OurPromise />
        </Suspense>
      </main>
    </div>
  );
};

export default WhyChooseUs;
