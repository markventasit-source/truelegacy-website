import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import cardImageWill from "../../assets/img/home/Framewhoarewe1.webp";
import cardImageTrust from "../../assets/img/home/Framewhoarewe2.webp";
import cardImageFamily from "../../assets/img/home/Framewhoarewe3.webp";
import questionIcon from "../../assets/icon/accent-mark.webp";
import quoteDotsBg from "../../assets/img/home/Group55.webp";
import group2Bg from "../../assets/img/home/Group 2.webp";
import StyledButton from "../../ui/StyledButton";

const cards = [
  {
    image: cardImageWill,
    title: "Family Will",
    description: "Don't let your legacy fall into the wrong hands.",
    btn: "Draft your Will",
    tab: "will",
  },
  {
    image: cardImageTrust,
    title: "Private Family Trust",
    description: "Build a fortress to protect what matters.",
    btn: "Form your Trust",
    tab: "trust",
  },
  {
    image: cardImageFamily,
    title: "Family Office",
    description: "Keep your wealth guided, guarded, and growing.",
    btn: "Coming Soon",
    tab: null,
  },
];

const WhoweAreNew = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Scroll-triggered entrance (early trigger)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const buttonClassName = (hasLink) =>
    `rounded-[66px] px-8 py-3.5 font-[Urania] text-[14px] lg:text-[18px] font-medium whitespace-nowrap !bg-[#132F2C] !text-white !opacity-100 transition inline-flex items-center justify-center w-[375px] h-[52px] md:w-auto md:h-auto ${
      hasLink ? "hover:!bg-[#0D241E]" : "cursor-not-allowed"
    }`;

  const buttonStyle = {
    fontFamily: "Urania",
    fontWeight: "500",
    fontStyle: "normal",
    fontSize: "18px",
    lineHeight: "100%",
    letterSpacing: "0%",
  };

  return (
    <section
      ref={sectionRef}
      className={`w-full bg-[#F6FFFF] pt-7 md:pt-11 lg:pt-15 pb-10 md:pb-32 lg:pb-20 who-section ${
        isVisible ? "who-section-visible" : ""
      }`}
    >
      {/* Container */}
      <div className="max-w-[1450px] mx-auto px-4 lg:px-8 md:px-4">
        {/* Top section */}
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-4 lg:gap-3 items-start">
          {/* Left content */}
          <div className="who-heading-block md:mx-auto md:max-w-[600px] lg:mx-0 lg:max-w-none">
            <h2 className="font-[Urania] font-bold text-[32px] md:text-[42px] leading-[36px] md:leading-[49px] text-[#132F2C] mb-0 lg:mb-4 who-heading">
              Who are We?
            </h2>
            <p
              className="font-[Urania] font-normal text-[16px] leading-[24px] text-[#132F2C] max-w-[520px] md:max-w-[600px] lg:max-w-[600px] who-text text-justify md:text-center lg:text-justify"
              style={{
                fontFamily: "Urania",
                fontWeight: "400",
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0%",
              }}
            >
              We are a specialized estate planning and cross-border succession
              advisory firm. Our work focuses on enabling Indian and NRI
              families to achieve a clear, enforceable, and tax-efficient
              transfer of wealth through Wills, private trusts, and structured
              family governance.
            </p>
          </div>

          {/* Right quote with dots background */}
          <div className="relative max-w-[480px] lg:max-w-[900px] lg:ml-auto -mt-6 lg:mt-6 pb-30 pt-0 who-quote-block z-10 md:mx-auto">
            {/* Mobile dots background - separate section */}
            <div
              className="lg:hidden absolute inset-0"
              style={{
                backgroundImage: `url(${quoteDotsBg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left 80% 0%",
                backgroundSize: "110% 110%",
              }}
            />

            {/* Desktop background with new image - overrides mobile background */}
            <div
              className="hidden lg:block absolute inset-0"
              style={{
                backgroundImage: `url(${group2Bg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center 22%",
                backgroundSize: "100% 150%",
                backgroundColor: "#F6FFFF",
                top: "0px",
                left: "0px",
                height: "200px",
              }}
            />

            <p
              className="text-left md:text-center lg:text-left who-quote-text text-[24px] lg:text-[32px] mt-12 lg:mt-12 ml-0 lg:ml-0 relative z-10"
              style={{
                fontFamily: "Urania",
                fontWeight: "200",
                fontStyle: "italic",
                lineHeight: "125%",
                letterSpacing: "0.5%",
                color: "#737c7bff",
              }}
              ref={(el) => {
                if (el && window.innerWidth >= 1024) {
                  el.style.marginLeft = "-60px";
                }
              }}
            >
              "Families deserve peace, clarity, and security
              <span className="hidden lg:block">
                when passing on what they have built."
              </span>
              <span className="lg:hidden">
                &nbsp;when passing on what they have built."
              </span>
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid gap-x-10 gap-y-5 lg:grid-cols-2 xl:grid-cols-3 justify-items-center justify-center md:justify-items-center xl:justify-items-center -mt-19 md:-mt-14 who-cards-grid -mx-4 md:mx-0 px-4 md:px-0 relative z-20">
          {cards.map((card) => (
            <div
              key={card.title}
              className="who-card bg-white shadow-[0_10px_30px_rgba(5,41,26,0.08)] overflow-hidden h-[394px] lg:h-[475px] w-[353px] md:w-[359px] lg:w-[457px] md:max-w-[467px]"
              style={{
                borderRadius: "6px",
              }}
            >
              {/* Mobile Image */}
              <div className="pt-[10px] px-[10px] flex justify-center lg:hidden">
                <div
                  className="overflow-hidden bg-[#05281F] who-card-image"
                  style={{
                    width: "98%",
                    height: "180px",
                    borderRadius: "6px",
                  }}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              {/* Desktop Image */}
              <div className="pt-[30px] px-[30px] flex justify-center hidden lg:block">
                <div
                  className="overflow-hidden bg-[#05281F] who-card-image"
                  style={{
                    width: "397px",
                    height: "230px",
                    borderRadius: "6px",
                  }}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="mt-5 px-6 pb-8 text-center flex flex-col items-center who-card-body">
                <h3
                  className="font-[Urania] font-bold text-[22px] lg:text-[30px] text-[#132F2C] mb-2 who-card-title"
                  style={{
                    fontFamily: "Urania",
                    fontWeight: "600",
                    fontStyle: "normal",
                    fontSize: "30px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                  }}
                >
                  {card.title}
                </h3>

                <p
                  className="font-[Urania] text-[16px] leading-[22px] sm:leading-[20px] text-[#132F2C]/80 max-w-[200px] mb-5 who-card-desc"
                  style={{
                    fontFamily: "Urania",
                    fontWeight: "400",
                    fontStyle: "normal",
                    fontSize: "16px",
                    lineHeight: "22px",
                    letterSpacing: "0%",
                  }}
                >
                  {card.description}
                </p>

                {card.tab ? (
                  <Link
                    to={`/services/${card.tab}`}
                    className={buttonClassName(true)}
                    style={buttonStyle}
                  >
                    {card.btn}
                  </Link>
                ) : (
                  <StyledButton
                    name={card.btn}
                    disabled
                    variant="primary"
                    minWidth="237px"
                    className={`${buttonClassName(false)} w-[375px] h-[52px] md:w-auto md:h-auto`}
                    style={buttonStyle}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoweAreNew;
