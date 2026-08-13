import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FrameourPromise from "../../assets/img/whychooseus/Frameour-promise.webp";
import MobileFrameImage from "../../assets/img/whychooseus/Frame 2147224819.webp";
import StyledButton from "../../ui/StyledButton";

const OurPromise = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById("our-promise-section");
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight * 0.7 && rect.bottom > 0) {
        setIsVisible(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="our-promise-section"
      className="bg-[#F6FFFF] text-black px-6 md:px-4 lg:px-16 py-10 md:py-8 lg:py-16 pb-10 md:pb-16 lg:pb-32"
    >
      <div className="max-w-[1440px] mx-auto md:px-0 sm:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start -mx-4 sm:mx-0 md:mx-0">
          {/* LEFT TEXT CONTENT */}
          <div
            className={`order-1 lg:order-1 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
  <h2 className="font-[Urania] font-semibold text-[32px] md:text-[36px] lg:text-[42px] leading-[49px] text-[#132F2C] mb-4 md:mb-8 lg:mb-12">
    Our Promise
  </h2>

  <p className="font-[Urania] font-bold md:font-medium text-[24px] md:text-[20px] lg:text-[32px] leading-[38px] text-[#132F2C] mb-6 max-w-[525px] lg:tracking-[0.02em]">
    No matter your situation, you are not alone.
    We're here to guide you every step of the way.
  </p>

  <p className="font-[Urania] text-[16px] md:text-[15px] lg:text-[16px] leading-[28px] text-[#2F4F4A] mb-8 max-w-[651px]">
    We help families, NRIs, and individuals plan their inheritance the right
    way. Many of you have worked hard your entire lives and leave behind your
    wealth in confusion because there is no clear Will or plan. We're a team of
    experts in Indian succession laws and cross-border inheritance. Our goal is
    to make succession planning simple, legal, and stress-free—so your legacy
    reaches the right hands, without conflict.
  </p>

  {/* CTA */}
  <div className="mb-10">
    <button
      className="flex items-center justify-center text-[18px] md:text-[16px] lg:text-[18px] font-[Urania] text-white bg-[#132F2C] border border-[#132F2C] rounded-[66px] h-[56px] md:h-[48px] lg:h-[51px] px-6 md:px-8 w-full md:w-auto"
      style={{ fontFamily: 'Urania', fontWeight: '500', fontStyle: 'Medium', fontSize: '18px', lineHeight: '100%', letterSpacing: '0%' }}
      onClick={() => navigate('/succession')}
    >
      Start Estate Planning Today
    </button>
  </div>

  {/* Divider: thin grey line with thicker yellow segment */} 
  <div className="relative w-full max-w-[720px] mb-10 h-[6px]">
    {/* Grey base line (thin, centered) */}
    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#D6E0DE]" />
    {/* Yellow segment (thicker) */}
    <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#F4D57E] rounded-full" />
  </div>

  <p className="font-[Urania] font-normal text-[24px] md:text-[18px] lg:text-[32px] leading-[24px] md:leading-[18px] lg:leading-[32px] text-[#132F2C] max-w-[575px] mt-10 md:mt-0">
    Succession Solutions for all. Tailored for Families, NRIs & Businesses.
  </p>
  
  
          </div>

          {/* RIGHT IMAGE */}
          <div
            className={`order-2 lg:order-2 transition-all duration-700 delay-200 flex justify-end lg:justify-end relative ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Mobile/Tablet Image */}
            <img
              src={MobileFrameImage}
              alt="Our Promise Mobile"
              loading="lazy"
              decoding="async"
              className="lg:hidden rounded-lg object-contain"
              style={{
                width: 'clamp(250px, 70vw, 320px)',
                height: 'auto',
                maxHeight: '320px',
                transform: 'rotate(0deg)',
                opacity: 1,
                zIndex: 10,
                marginRight: '6px'
              }}
            />
            
            {/* Desktop Image */}
            <img
              src={FrameourPromise}
              alt="Our Promise"
              loading="lazy"
              decoding="async"
              className="hidden lg:block rounded-lg object-contain"
              style={{
                width: 'clamp(450px, 55vw, 620px)',
                height: 'auto',
                maxHeight: '620px',
                transform: 'rotate(0deg)',
                opacity: 1,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurPromise;
