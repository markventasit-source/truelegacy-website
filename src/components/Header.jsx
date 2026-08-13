import { useEffect } from "react";
import FrameMobile from "../assets/img/service/Frame 2147224829.webp";
import FrameDesktop from "../assets/img/service/Frame 1.webp";
import ServicesAccent from "../assets/icon/accent-mark.webp";

const Header = ({ title, subtitle, mobileImage = FrameMobile, desktopImage = FrameDesktop, imageWidth = "150vw", imagePosition = "-1vw" }) => {
  useEffect(() => {
    // Add custom CSS for large screens
    const style = document.createElement('style');
    style.textContent = `
      @media (min-width: 1700px) {
        .header-bg-large {
          height: 450px !important;
          object-position: center center !important;
          object-fit: cover !important;
        }
        .header-section-large {
          height: 450px !important;
        }
        .header-content-large {
          padding-bottom: 80px !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  return (
    <header className="relative w-full">
      <div className="relative w-full h-[250px] sm:h-[240px] lg:h-[280px] xl:h-[350px] overflow-hidden header-section-large">
        {/* Mobile background image */}
        <img
          src={mobileImage}
          alt="Header background"
          className="absolute inset-0 w-full h-full object-cover  sm:block"
          style={{ objectPosition: 'center bottom' }}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          />
        
        {/* Desktop background image - full width */}
        <img
          src={desktopImage}
          alt="Header background"
          className="absolute inset-0 w-full h-full object-cover hidden sm:block header-bg-large"
          style={{ objectPosition: 'center' }}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          />
        <div className="relative h-full w-full mx-auto pl-4 pr-4 md:pl-20 md:pr-4 lg:pl-24 lg:pr-4 xl:pl-24 xl:pr-4 flex flex-col justify-end pb-10 md:pb-14 lg:pb-16 animate-fade-up header-content-large">
          {/* Title + yellow accent icon */}
          <div className="inline-flex items-center gap-3 mb-2">
            <h1
              className="font-[Urania] font-bold text-[#F4D57E]
                         text-[36px] sm:text-[46px] lg:text-[56px] xl:text-[66px]
                         leading-[44px] sm:leading-[54px] lg:leading-[64px] xl:leading-[74px]"
            >
              {title}
            </h1>
            <img
              src={ServicesAccent}
              alt="Services accent icon"
              className="w-[18px] h-[19px] sm:w-[21px] sm:h-[22px] lg:w-[24px] lg:h-[25px] xl:w-[27px] xl:h-[28px] animate-fade-in"
              loading="lazy"
              decoding="async"
              />
          </div>

          <p className="font-[Urania] font-normal text-white/90 max-w-[540px]
                         text-[16px] sm:text-[20px] lg:text-[18px] xl:text-[20px]
                         leading-[20px] sm:leading-[24px] lg:leading-[26px] xl:leading-[29px] animate-fade-in" style={{ animationDelay: '120ms' }}>
            {subtitle}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
