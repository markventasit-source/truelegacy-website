import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

/** Stable public URLs — avoid tiny shared-asset JS chunks on the critical path. */
const questionIcon = "/accent-mark.webp";
const arrowLeft = "/arrow-left.webp";
const arrowRight = "/arrow-right.webp";

/** Stable public URLs — must match index.html preload links for LCP discovery. */
const HERO_SLIDE_1_MOBILE = "/hero-slide-1-mobile.webp";
const HERO_SLIDE_1_DESKTOP = "/hero-slide-1-desktop.webp";

const slideContent = [
  {
    eyebrow: "Succession Planning",
    questionPrefix: "Are you comfortable \nwith the third person deciding",
    questionPrefixMobile: "Are you comfortable with \nthe third person deciding",
    questionHighlight: "your family's future for you?",
    questionHighlightMobile: "your family's \nfuture for you?",
    description:
      "With the right guidance, you can protect what you've built and give your family lasting peace of mind.",
  },
  {
    eyebrow: "Succession Planning",
    questionPrefix: "How do you ensure your \nwealth remains with your  ",
    questionPrefixMobile: "How do you ensure your \nwealth remains with your ",
    questionHighlight: "children in your absence?",
    questionHighlightMobile: "children in your \nabsence?",
    description:
      "Proper planning protects your wealth and guarantees it reaches your children without complications.",
  },
  {
    eyebrow: "Succession Planning",
    questionPrefix: "Do you know who will \nget your wealth if  ",
    questionPrefixMobile: "Do you know who will \nget your wealth if ",
    questionHighlight: "something happens to you?",
    questionHighlightMobile: "something \nhappens to you?",
    description:
      "If your wishes aren't documented, your wealth may go to someone you didn't intend.",
  },
];

const MOBILE_IMG_W = 800;
const MOBILE_IMG_H = 1079;

const renderQuestionWithIcon = (text) => {
  if (!text.includes("?")) return text;

  const parts = text.split("?");
  if (parts.length !== 2) return text;

  const isMultiLine = text.includes("\n");

  return (
    <>
      {parts[0]}
      <span className="relative inline-block">
        <img
          src={questionIcon}
          alt=""
          width={22}
          height={22}
          className={`absolute ${
            isMultiLine
              ? "top-6 sm:top-6 lg:top-12 -right-5 sm:-right-6 lg:-right-7"
              : "top-3 sm:top-3 lg:top-9 -right-5 sm:-right-5 lg:-right-6"
          } w-[18px] sm:w-[20px] lg:w-[22px] h-[18px] sm:h-[20px] lg:h-[22px]`}
          loading="lazy"
          decoding="async"
        />
        ?
      </span>
      {parts[1]}
    </>
  );
};

const HeroBackground = ({ mobileSrc, desktopSrc, visible, priority = false }) => (
  <picture
    className={`absolute inset-0 transition-opacity duration-700 ${
      visible ? "opacity-100" : "opacity-0"
    }`}
    aria-hidden="true"
  >
    <source media="(min-width: 1024px)" srcSet={desktopSrc} />
    <img
      src={mobileSrc}
      alt=""
      width={MOBILE_IMG_W}
      height={MOBILE_IMG_H}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      className="absolute inset-0 h-full w-full object-cover object-[right_bottom] lg:top-[60px] lg:h-[calc(100%-60px)] xl:top-[60px] min-[1700px]:!top-0 min-[1700px]:!h-full"
    />
  </picture>
);

const HeaderHome = () => {
  const location = useLocation();
  const [slideImages, setSlideImages] = useState([
    { mobile: HERO_SLIDE_1_MOBILE, desktop: HERO_SLIDE_1_DESKTOP },
    null,
    null,
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const [fadePhase, setFadePhase] = useState(false);
  const extraSlidesLoaded = useRef(false);

  const slides = useMemo(
    () =>
      slideContent.map((content, index) => {
        const images = slideImages[index] || slideImages[0];
        return {
          ...content,
          mobileBackground: images.mobile,
          desktopBackground: images.desktop,
        };
      }),
    [slideImages]
  );

  const currentSlide = slides[activeIndex];
  const prevSlide = slides[prevIndex];

  const loadRemainingSlides = useCallback(async () => {
    if (extraSlidesLoaded.current) return;
    extraSlidesLoaded.current = true;

    const [s2m, s2d, s3m, s3d] = await Promise.all([
      import("../../assets/img/home/hero-slide-2-mobile.webp"),
      import("../../assets/img/home/hero-slide-2-desktop.webp"),
      import("../../assets/img/home/hero-slide-3-mobile.webp"),
      import("../../assets/img/home/hero-slide-3-desktop.webp"),
    ]);
    setSlideImages([
      { mobile: HERO_SLIDE_1_MOBILE, desktop: HERO_SLIDE_1_DESKTOP },
      { mobile: s2m.default, desktop: s2d.default },
      { mobile: s3m.default, desktop: s3d.default },
    ]);
  }, []);

  const goNext = useCallback(() => {
    if (isAnimating) return;
    void loadRemainingSlides();
    setIsAnimating(true);
    setFadePhase(false);
    setPrevIndex(activeIndex);
    setTransitioning(true);
    setActiveIndex((prev) => (prev + 1) % slides.length);
    setTimeout(() => setFadePhase(true), 20);
    setTimeout(() => {
      setTransitioning(false);
      setFadePhase(false);
      setIsAnimating(false);
    }, 700);
  }, [activeIndex, isAnimating, loadRemainingSlides, slides.length]);

  const goPrev = useCallback(() => {
    if (isAnimating) return;
    void loadRemainingSlides();
    setIsAnimating(true);
    setFadePhase(false);
    setPrevIndex(activeIndex);
    setTransitioning(true);
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setFadePhase(true), 20);
    setTimeout(() => {
      setTransitioning(false);
      setFadePhase(false);
      setIsAnimating(false);
    }, 700);
  }, [activeIndex, isAnimating, loadRemainingSlides, slides.length]);

  useEffect(() => {
    if (location.pathname !== "/") return;
    setActiveIndex(0);
    setPrevIndex(0);
    setTransitioning(false);
    setIsAnimating(false);
  }, [location.pathname]);

  // Mark hero mounted. CSS hides spacer/shell/SEO block when css-ready + hero-ready
  // (same style pass) so #root never appears unstyled or double-stacked (CLS ~1).
  useLayoutEffect(() => {
    document.documentElement.classList.add("hero-ready");
    // Drop nodes after paint once CSS has taken over (memory only; not CLS-critical).
    const drop = () => {
      document.getElementById("hero-lcp-shell")?.remove();
      document.getElementById("lcp-hero-spacer")?.remove();
      document.getElementById("seo-static-content")?.remove();
    };
    if (document.documentElement.classList.contains("css-ready")) {
      requestAnimationFrame(drop);
      return;
    }
    const onCss = () => requestAnimationFrame(drop);
    document.addEventListener("tl-css-ready", onCss, { once: true });
    return () => document.removeEventListener("tl-css-ready", onCss);
  }, []);

  // Delay autoplay so Lighthouse measures slide 1 as LCP, not slide 2/3.
  useEffect(() => {
    if (paused) return;

    let intervalId;
    const startId = window.setTimeout(() => {
      void loadRemainingSlides();
      intervalId = window.setInterval(goNext, 5000);
    }, 12000);

    return () => {
      window.clearTimeout(startId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [paused, goNext, loadRemainingSlides]);

  const renderStackedLines = (text, extra = "", baseDelay = 0) => {
    const parts = String(text).split("\n");
    return (
      <span className="block carousel-text">
        {parts.map((line, idx) => (
          <span
            key={idx}
            className={`block whitespace-pre ${extra} reveal-line`}
            style={{ animationDelay: `${baseDelay + idx * 110}ms` }}
          >
            {line}
          </span>
        ))}
      </span>
    );
  };

  const showCurrent = !transitioning || fadePhase;
  const showPrev = transitioning && !fadePhase;
  const isLcpSlide = activeIndex === 0 && showCurrent && !transitioning;

  const carouselButtons = (
    <>
      <button
        type="button"
        className="h-6 w-6 transition-transform hover:scale-105"
        onClick={goPrev}
        aria-label="Previous slide"
      >
        <img
          src={arrowLeft}
          alt=""
          width={24}
          height={24}
          loading="lazy"
          decoding="async"
        />
      </button>
      <button
        type="button"
        className="h-6 w-6 transition-transform hover:scale-105"
        onClick={goNext}
        aria-label="Next slide"
      >
        <img
          src={arrowRight}
          alt=""
          width={24}
          height={24}
          loading="lazy"
          decoding="async"
        />
      </button>
    </>
  );

  return (
    <section
      className="home-hero relative w-full min-h-[640px] overflow-hidden sm:h-[700px] md:h-[700px] lg:h-[600px] xl:h-[640px] mt-[-50px] sm:mt-[-80px] md:mt-[-80px] lg:mt-0 xl:mt-0 pt-[260px] sm:pt-0 mb-0 lg:mb-8 xl:mb-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0">
        {showPrev && (
          <HeroBackground
            mobileSrc={prevSlide.mobileBackground}
            desktopSrc={prevSlide.desktopBackground}
            visible
          />
        )}
        <HeroBackground
          mobileSrc={currentSlide.mobileBackground}
          desktopSrc={currentSlide.desktopBackground}
          visible={showCurrent}
          priority={isLcpSlide}
        />
      </div>

      {/*
        All breakpoints: title → description → arrows in normal flow
        so arrows never sit between / on top of the copy.
      */}
      <div className="relative z-10 mx-auto flex max-w-[1900px] items-start pb-8 pl-4 pr-4 pt-[46px] sm:h-[661px] sm:pb-14 sm:pl-8 sm:pr-8 sm:pt-[375px] md:pt-[375px] lg:h-full lg:items-end lg:pb-10 lg:pl-5 lg:pr-16 lg:pt-0 xl:max-w-[2200px] xl:pb-12 xl:pl-7 xl:pr-24 min-[1700px]:pb-16">
        <div className="flex w-full items-stretch gap-3 sm:gap-8">
          <div className="self-stretch border-l-[4px] border-[#F4D57E]" />

          <div className="flex w-full min-w-0 flex-col text-left text-white lg:max-w-[760px] xl:max-w-[840px] min-[1700px]:max-w-[920px]">
            <h1 className="home-hero__title w-full max-w-[340px] animate-fade-up break-words font-[Urania] sm:min-h-[220px] sm:w-1/2 sm:max-w-none lg:min-h-0 lg:w-full">
              {/* Mobile / tablet only */}
              <span
                className="block lg:hidden"
                style={{
                  fontFamily: "Urania",
                  fontWeight: "300",
                  fontSize: "28px",
                  lineHeight: "35px",
                }}
              >
                {renderStackedLines(currentSlide.questionPrefixMobile)}
              </span>
              {/* Desktop: single node — size scales via CSS (avoids duplicate breakpoints) */}
              <span className="home-hero__prefix-desktop hidden font-[Urania] font-light lg:block">
                {renderStackedLines(currentSlide.questionPrefix)}
              </span>
              <span className="mt-2 block max-w-[180px] font-bold text-[#F4D57E] sm:mt-0 md:max-w-none lg:max-w-none">
                <span className="block carousel-text">
                  <span className="block lg:hidden">
                    {String(currentSlide.questionHighlightMobile)
                      .split("\n")
                      .map((line, idx, arr) => (
                        <span
                          key={idx}
                          className="block whitespace-pre break-words reveal-left-line"
                          style={{
                            animationDelay: `${120 + idx * 110}ms`,
                            fontFamily: "Urania",
                            fontWeight: "700",
                            fontSize: "36px",
                            lineHeight: "42px",
                          }}
                        >
                          {idx === arr.length - 1
                            ? renderQuestionWithIcon(line)
                            : line}
                        </span>
                      ))}
                  </span>
                  <span className="home-hero__highlight-desktop hidden lg:block">
                    {String(currentSlide.questionHighlight)
                      .split("\n")
                      .map((line, idx, arr) => (
                        <span
                          key={idx}
                          className="block whitespace-pre break-words reveal-left-line font-[Urania] font-bold text-[#F4D57E]"
                          style={{ animationDelay: `${120 + idx * 110}ms` }}
                        >
                          {idx === arr.length - 1
                            ? renderQuestionWithIcon(line)
                            : line}
                        </span>
                      ))}
                  </span>
                </span>
              </span>
            </h1>

            <p className="mt-3 max-w-[250px] animate-fade-in sm:mt-4 sm:max-w-[350px] md:max-w-[660px] lg:mt-4 lg:max-w-[640px] xl:mt-5 xl:max-w-[720px] min-[1700px]:mt-8 min-[1700px]:max-w-[800px]">
              <span
                className="block lg:hidden"
                style={{
                  animationDelay: "180ms",
                  fontFamily: "Urania",
                  fontWeight: "200",
                  fontSize: "16px",
                  lineHeight: "140%",
                }}
              >
                {currentSlide.description}
              </span>
              <span
                className="hidden lg:block"
                style={{
                  animationDelay: "180ms",
                  fontFamily: "Urania",
                  fontWeight: "300",
                  fontSize: "18px",
                  lineHeight: "140%",
                }}
              >
                {currentSlide.description}
              </span>
            </p>

            {/* Always below description — all screen sizes */}
            <div className="home-hero__carousel mt-5 flex items-center gap-3 sm:mt-6 lg:mt-8">
              {carouselButtons}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeaderHome;
