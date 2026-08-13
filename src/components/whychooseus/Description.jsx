import { useEffect, useRef, useState } from "react";
import Framedescription from "../../assets/img/whychooseus/Framedescription.webp";
import legacyBg from "../../assets/img/home/Frame legacybackground.webp";

const Description = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Scroll-triggered entrance
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <section
      ref={sectionRef}
      className={`w-full bg-[#F6FFFF] py-16 lg:py-27 relative overflow-hidden description-section ${isVisible ? "description-section-visible" : ""
        }`}
    >
      {/* Top background graphic */}
      <img
        src={legacyBg}
        alt="Decorative background pattern"
        aria-hidden
        loading="lazy"
        decoding="async"
        className="absolute opacity-100 pointer-events-none lg:hidden"
        style={{
          width: '302px',
          height: '254px',
          top: '356px',
          left: '2px',
          transform: 'rotate(0deg)'
        }}
      />

      {/* Desktop background graphic */}
      <img
        src={legacyBg}
        alt="Decorative background pattern"
        aria-hidden
        loading="lazy"
        decoding="async"
        className="absolute opacity-100 pointer-events-none hidden"
        style={{
          width: '440.1653747558594px',
          height: '373.3304443359375px',
          top: '200px',
          left: '310px',
          transform: 'rotate(0deg)'
        }}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-20">

          {/* LEFT TEXT */}
          <div className="lg:col-span-7 max-w-[750px] -mt-8 lg:-mt-58 description-text">
            <p className="font-[Urania]  text-[26px] sm:text-[28px] lg:text-[42px] leading-[30px] sm:leading-[35px] lg:leading-[48px] leading-[33px] text-[#132F2C] " style={{ fontWeight: 500 }} >
              We're not here to hand you a document and send you on your way.
              We're here to understand your story, your struggles, and your
              wishes—then make sure they're honoured exactly as you intended.
            </p>
          </div>

          {/* RIGHT IMAGE STACK */}
          <div className="lg:col-span-5 relative flex justify-end lg:justify-end ml-auto lg:ml-0 description-image">

            {/* Thin line graphic - desktop only */}
            <img
              src={legacyBg}
              alt="Decorative background pattern"
              aria-hidden
              loading="lazy"
              decoding="async"
              className="hidden md:block absolute left-0 -bottom-1 w-[320px] h-[200px] opacity-70 pointer-events-none lg:-translate-x-16"
            />

            {/* Main image */}
            <div className="relative z-10 w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[444px] lg:h-[442px] rounded-[8px] mr-0 lg:translate-x-16">
              {/* Mobile triangle line graphic - behind main image */}
              
              <img
                src={Framedescription}
                alt="Client consultation"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover relative z-10 rounded-[8px]"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Description;
