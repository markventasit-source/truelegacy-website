import { useEffect, useRef, useState, lazy, Suspense } from "react";
import StyledButton from "../../ui/StyledButton";
import secureYourLegacyImage from "../../assets/img/home/Framesecureyourlegacy.webp";
import legacyBackground from "../../assets/img/home/Frame legacybackground.webp";

const RequestDialog = lazy(() => import("./RequestDialog"));

const QuoteComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleRequestCallback = () => {
    // future action
  };

  return (
    <section
      ref={sectionRef}
      className={`w-full bg-[#FFFFFF] py-16 md:py-16 lg:py-20 relative overflow-x-hidden quote-section ${
        isVisible ? "quote-section-visible" : ""
      }`}
    >
      <div className="relative max-w-[1850px] mx-auto px-4 sm:px-5 md:px-12 grid gap-6 lg:grid-cols-2 md:grid-cols-1 text-center lg:text-left items-center">

        {/* LEFT CONTENT — unchanged */}
        <div className="text-left relative z-20 quote-left text-left mx-auto md:text-center md:mx-auto lg:text-left lg:mx-0 md:ml-0 ml-2 pr-4 md:pr-0 md:-mt-8">
          <h2 className="font-[Urania] font-bold text-[32px] md:text-[42px] leading-[36px] md:leading-[49px] text-[#132F2C] quote-heading" style={{fontFamily: 'Urania', fontWeight: '700', fontStyle: 'Bold', letterSpacing: '0%'}}>
            Want to Secure
            <br />
            your Legacy?
          </h2>

          <p className="mt-6 max-w-[450px] md:max-w-xl font-[Urania] text-[16px] md:text-[18px] leading-[26px] text-[#132F2C] quote-body" style={{fontFamily: 'Urania', fontWeight: '400', fontStyle: 'Regular', letterSpacing: '0%'}}>
            "Tomorrow is promised to none. Planning is a gift you can give today. With True Legacy,
            estate and wealth planning becomes more than a financial act; it becomes an act of
            love. The greatest inheritance you can give is peace of mind."
          </p>

          {/* Desktop button */}
          <div className="mt-10 hidden md:block quote-cta">
            <StyledButton
              name="Request a Call Back"
              onClick={() => setIsCallbackOpen(true)}
              variant="primary"
              minWidth="auto"
              className="inline-flex items-center justify-center rounded-full !bg-[#132F2C] px-8 py-3 font-[Urania] text-[18px] font-bold !text-white"
            />
          </div>
        </div>

        {/* RIGHT IMAGE BLOCK */}
        <div className="relative mt-4 md:mt-0 flex justify-center md:justify-center ml-0 md:ml-20 lg:ml-22 quote-right overflow-visible">
          {/* 🔸 DESKTOP decorative background — unchanged */}
          <img
            src={legacyBackground}
            alt="Decorative background pattern"
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="hidden md:block absolute z-10 left-[-300px] bottom-[-1px] w-[420px] pointer-events-none "
          />

          {/* 🔸 MOBILE decorative background */}
          <img
            src={legacyBackground}
            alt="Decorative background pattern"
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="
              md:hidden
              absolute
              z-10
              left-[-50px]
              bottom-[-1px]
              w-[220px]
              pointer-events-none
            "
          />

          {/* 🔹 Image */}
          <div className="relative z-20 w-[320px] h-[320px] md:w-[499px] md:h-[496px] overflow-visible md:ml-1 ml-23 max-[420px]:ml-16 max-[380px]:ml-10 max-[340px]:ml-6 md:relative md:right-auto absolute right-0 sm:right-0 max-[380px]:right-0 sm:w-[320px] sm:h-[320px] max-[380px]:w-[320px] max-[380px]:h-[320px]">
            <img
              src={secureYourLegacyImage}
              alt="Secure your legacy"
              width={499}
              height={496}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer "
            />
          </div>
        </div>

        {/* MOBILE BUTTON — unchanged */}
        <div className="mt-2 md:hidden flex justify-start w-full relative z-20">
          <StyledButton
            name="Request a Call Back"
            onClick={() => setIsCallbackOpen(true)}
            variant="primary"
            minWidth="auto"
            className="inline-flex items-center justify-center rounded-full !bg-[#132F2C] px-8 py-3 font-[Urania] text-[18px] font-bold !text-white"
          />
        </div>

        {/* Request Dialog (lazy — avoids phone-input on main thread until opened) */}
        {isCallbackOpen && (
          <Suspense fallback={null}>
            <RequestDialog
              open={isCallbackOpen}
              title="Request a Call Back"
              onClose={() => setIsCallbackOpen(false)}
            />
          </Suspense>
        )}

      </div>
    </section>
  );
};

export default QuoteComponent;
