import { useEffect, useRef, useState } from "react";
import slideImageInstruction from "../../assets/img/home/instructionFrame 2147224734.webp";
import mobileInstructionBg from "../../assets/img/home/instructionmobileframe.webp";
import cornerTriangle from "../../assets/icon/accent-mark.webp";
import leftArrowIcon from "../../assets/icon/arrow-left.webp";
import rightArrowIcon from "../../assets/icon/arrow-right.webp";

const slides = [
  {
    image: slideImageInstruction,
    text: "What will happen to your assets? Will your family inherit them easily, or will there be legal hiccups ?",
  },
  {
    image: slideImageInstruction,
    text: "Can they locate your bank information, insurance policies, and property documents without you ?",
  },
  {
    image: slideImageInstruction,
    text: "Would your family know how your wealth is meant to be distributed ?",
  },
  {
    image: slideImageInstruction,
    text: "Would your family know where to begin ?",
  },
  {
    image: slideImageInstruction,
    text: "Will they remember you for your life or for the paperwork they were left to untangle ?",
  },
];

const TrueLegacyInstructions = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState("next"); // Track animation direction
  const [isAutoScroll, setIsAutoScroll] = useState(true); // Track auto-scroll state
  const currentSlide = slides[activeIndex];
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const autoScrollRef = useRef(null);

  const goNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection("next");
    setActiveIndex((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 800);
    // Pause auto-scroll when user interacts
    setIsAutoScroll(false);
    setTimeout(() => setIsAutoScroll(true), 5000); // Resume after 5 seconds
  };

  const goPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection("prev");
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 800);
    // Pause auto-scroll when user interacts
    setIsAutoScroll(false);
    setTimeout(() => setIsAutoScroll(true), 5000); // Resume after 5 seconds
  };

  const getPosition = (index) => {
    const offset = (index - activeIndex + slides.length) % slides.length;
    if (offset === 0) return "front";
    if (offset === 1) return "middle";
    return "back";
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.35 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (!isAutoScroll || !isVisible || isAnimating) return;

    autoScrollRef.current = setInterval(() => {
      goNext();
    }, 3000); // Auto-scroll every 3 seconds

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isAutoScroll, isVisible, isAnimating]);

  return (
    <section
      ref={sectionRef}
      className={`instruction-section mt-12 md:mt-0 ${isVisible ? "instruction-section-visible" : ""}`}
    >
      {/* Mobile layout */}
      <section
        className="relative w-full h-[386px] flex items-center lg:hidden"
        style={{
          backgroundImage: `url(${mobileInstructionBg})`,
          backgroundSize: "cover",
          backgroundPosition: "bottom left",
          perspective: "1200px", // Enable 3D perspective for flip animations
        }}
      >
        <div className="relative max-w-[375px] mx-auto w-full px-4 pt-1 pb-1">
          {/* Heading on top */}
          <h2 className="font-[Urania] font-bold text-[32px] leading-[36px] text-white max-w-[274px] instruction-heading">
            If you weren't here tomorrow...
          </h2>

          {/* Card stack */}
          <div className="relative mt-20 flex justify-center instruction-stack-mobile">
            {slides.map((slide, index) => {
              const position = getPosition(index);
              const isFront = position === "front";

              return (
                <div
                  key={slide.text}
                  className={`instruction-layer-mobile instruction-card-${position} ${isFront ? "instruction-card" : ""
                    } ${isFront && isAnimating ? (direction === "next" ? "flip-in-next" : "flip-in-prev") : ""
                    }`}
                  style={{
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                  }}
                >
                  {/* Show text on all cards, not just front */}
                  <div className="flex items-center h-full instruction-slide">
                    <div className="border-l-[5px] border-[#F4D57E] pl-7 ml-0">
                      <p className="mt-0 font-[Urania] font-normal text-[18px] sm:text-[20px] lg:text-[32px] leading-[1.5] lg:leading-[45.5px] text-[#132F2C] max-w-[320px] sm:max-w-[360px] lg:max-w-[640px]">
                        {slide.text}
                      </p>
                    </div>
                  </div>

                  {/* YELLOW CORNER - only on front card */}
                  {isFront && (
                    <img
                      src={cornerTriangle}
                      alt="Decorative corner accent"
                      className="absolute bottom-2 right-2 w-6 h-6"
                      loading="lazy"
                      decoding="async"
                      />
                  )}
                </div>
              );
            })}
          </div>

          {/* arrows */}
          <div className="mt-[-130px] md:mt-[-150px] flex justify-center gap-3 relative z-10">
            <button onClick={goPrev} aria-label="Previous">
              <img src={leftArrowIcon} alt="Previous" className="w-7 h-7"
  loading="lazy"
  decoding="async"
  />
            </button>
            <button onClick={goNext} aria-label="Next">
              <img src={rightArrowIcon} alt="Next" className="w-7 h-7"
  loading="lazy"
  decoding="async"
  />
            </button>
          </div>
        </div>
      </section>

      {/* Desktop / tablet layout */}
      <section
        className="relative w-full min-h-[520px] hidden lg:flex items-center justify-center"
        style={{
          backgroundImage: `url(${currentSlide.image})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "left center",
          backgroundRepeat: "no-repeat",
          perspective: "1200px", // Enable 3D perspective for flip animations
        }}
      >
        {/* TOP LEFT HEADING - positioned relative to section */}
        <h2 className="font-[Urania] font-bold text-[28px] sm:text-[32px] lg:text-[40px] leading-[1.2] text-white max-w-[350px] absolute top-10 left-15 text-left instruction-heading">
          If you weren't here tomorrow...
        </h2>

        <div className="relative max-w-[1300px] mx-auto w-full md:px-0 sm:px-6 lg:px-0 pt-10">

          {/* RIGHT CARD AREA */}
          <div className="relative flex justify-center lg:justify-center xl:justify-end mt-10 md:mt-24 instruction-stack-desktop">
            {slides.map((slide, index) => {
              const position = getPosition(index);
              const isFront = position === "front";

              return (
                <div
                  key={slide.text}
                  className={`instruction-layer-desktop instruction-card-${position} ${isFront ? "instruction-card" : ""
                    } ${isFront && isAnimating ? (direction === "next" ? "flip-in-next" : "flip-in-prev") : ""
                    }`}
                  style={{
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                  }}
                >
                  {/* Show text on all cards, not just front */}
                  <div className="flex items-center h-full instruction-slide">
                    {/* Left yellow line matching text height, aligned with card edge */}
                    <div className="border-l-[5px] border-[#F4D57E] pl-7 -ml-2 sm:-ml-0">
                      <p className="font-[Urania] font-normal text-[18px] sm:text-[20px] lg:text-[32px] leading-[1.5] lg:leading-[45.5px] text-[#132F2C] max-w-[640px]">
                        {slide.text}
                      </p>
                    </div>
                  </div>

                  {/* YELLOW CORNER - only on front card */}
                  {isFront && (
                    <img
                      src={cornerTriangle}
                      alt="Decorative corner accent"
                      className="absolute bottom-2 right-2 w-10 h-10"
                      loading="lazy"
                      decoding="async"
                      />
                  )}
                </div>
              );
            })}
          </div>

          {/* ARROWS UNDER CARD */}
          <div className="flex justify-center lg:justify-center xl:justify-end mt-[-50px] lg:pr-0 xl:pr-[370px] gap-1 relative z-10">
            <button onClick={goPrev} aria-label="Previous">
              <img src={leftArrowIcon} alt="Previous" className="w-7 h-7"
  loading="lazy"
  decoding="async"
  />
            </button>
            <button onClick={goNext} aria-label="Next">
              <img src={rightArrowIcon} alt="Next" className="w-7 h-7"
  loading="lazy"
  decoding="async"
  />
            </button>
          </div>

        </div>
      </section>
    </section>
  );
}

export default TrueLegacyInstructions;
