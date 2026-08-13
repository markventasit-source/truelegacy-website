import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { NavLink } from "react-router-dom";
import FooterFrame from "../assets/footerframe.webp";
import MobileFooterFrame from "../assets/mobilefooterFrame .webp";
import LinkedinLogo from "../assets/linkedinlogo.webp";
import InstagramLogo from "../assets/instagramlogo.webp";
import FacebookLogo from "../assets/facebooklogo.webp";

const RequestDialog = lazy(() => import("./home/RequestDialog"));

const socials = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/share/1CqpzdoLFZ/?mibextid=wwXIfr",
    icon: FacebookLogo,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/truelegacy_india/?igsh=OHJteGFoNHIwZWJ4",
    icon: InstagramLogo,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/true-legacy-india/",
    icon: LinkedinLogo,
  },
  {
    name: "YouTube",
    url: "https://youtube.com/@truelegacyindia-h7c?si=DFBuKIU8Gl8h0GqN",
    icon: "/youtube.svg",
  },
];

const Footer = ({ hideCta = false }) => {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const node = footerRef.current;
    if (!node) return;

    // Add a small delay to prevent triggering on page load
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          // Only trigger when footer is actually scrolled into view and user has scrolled
          const hasScrolled = window.scrollY > 100;
          if (entry.isIntersecting && entry.intersectionRatio > 0.1 && hasScrolled) {
            setIsVisible(true);
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(node);
      return () => observer.disconnect();
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <footer
      ref={footerRef}
      className={`mt-0 text-white footer-section relative ${isVisible ? "footer-section-visible" : ""
        }`}
    >

      {/* Green background – MOBILE */}
      <div
        className="
    absolute inset-x-0 bottom-0 
    bg-[#0C201E]
    h-[640px]
    lg:hidden
    z-0
  "
      />

      {/* Green background – DESKTOP */}
      <div
        className="
    absolute inset-x-0 bottom-0 
    bg-[#0C201E]
    h-[450px]
    hidden lg:block
    z-0
  "
      />

      {!hideCta && (
        <>
          {/* Overlapping yellow CTA block - mobile */}
          <div className="relative w-full mx-auto px-0 sm:px-8 lg:hidden footer-cta-mobile">
            <div
              className="relative -top-10 sm:-top-12 bg-[#F4D57E] rounded-b-[16px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.3)] min-h-[390px] animate-fade-in footer-cta-card"
              style={{
                backgroundImage: `url(${MobileFooterFrame})`,
                backgroundSize: "49% auto",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 55%",
              }}
            >
              <div className="px-6 py-8 flex flex-col justify-center h-full">
                <div className="max-w-[80%]">
                  <h2 className="text-[32px] leading-[38px] font-semibold text-[#132F2C] footer-cta-heading animate-fade-in-up" style={{ animationDelay: "200ms", fontWeight: '700' }}>
                    Still wondering how to{" "}
                    <span className="hidden lg:inline">
                      <br />
                    </span>
                    pass down your legacy?
                  </h2>
                  <p className="mt-4 text-[16px] text-[#132F2C] footer-cta-body animate-fade-in-up" style={{ animationDelay: "400ms" }}>
                    Let our Experts Make it Simple for You. Succession
                    planning is not just about documents — it's about
                    securing your family's peace!
                  </p>
                </div>
                <div className="mt-9 flex flex-col items-center gap-4 w-full footer-cta-buttons">
                  <button
                    className="inline-flex w-[100%] max-w-[360px] items-center justify-center rounded-full bg-[#132F2C] px-6 py-3 text-[16px] font-[Urania] font-medium text-white whitespace-nowrap footer-cta-button animate-fade-in-up hover:scale-105 hover:bg-[#0F2724] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                    style={{ animationDelay: "600ms" }}
                    onClick={() => setIsScheduleOpen(true)}
                  >
                    Schedule your expert session today
                  </button>
                  <button
                    className="inline-flex w-[100%] max-w-[360px] items-center justify-center rounded-full bg-[#132F2C] px-6 py-3 text-[16px] font-[Urania] font-medium text-white whitespace-nowrap footer-cta-button animate-fade-in-up hover:scale-105 hover:bg-[#0F2724] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                    style={{ animationDelay: "800ms" }}
                    onClick={() => setIsCallbackOpen(true)}
                  >
                    Request a Call Back
                  </button>
                </div>
              </div>
              <div className="shine-slow" />
            </div>
          </div>

          {/* Overlapping yellow CTA block - desktop */}
          <div className="relative max-w-[1920px] mx-auto px-4 sm:px-8 hidden lg:block footer-cta-desktop">
            <div
              className="relative -top-5 sm:-top-6 md:-top-15 lg:-top-20 xl:-top-25 md:h-[413px] lg:h-[413px] bg-[#F4D57E] rounded-[6px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.3)] animate-fade-in footer-cta-card"
              style={{
                backgroundImage: `url(${FooterFrame})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right bottom",
                backgroundSize: "auto 100%",
              }}
            >
              <div className="grid h-full grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)] gap-6 md:gap-0 items-center">
                {/* Left: text + buttons */}
                <div className="px-4 lg:px-8 xl:px-11 pt-0 pb-0 flex flex-col justify-start">
                  <p className="text-[22px] sm:text-[26px] lg:text-[42px] leading-snug font-semibold text-[#132F2C] footer-cta-heading" style={{ fontWeight: '700' }}>
                    Still wondering how to{" "}
                    <span className="hidden md:inline">
                      <br />
                    </span>
                    pass down your legacy?
                  </p>
                  <p className="mt-4 text-[13px] sm:text-[18px] lg:text-[20px] text-[#132F2C] max-w-md footer-cta-body">
                    Let our Experts Make it Simple for You. Succession
                    planning is not just about documents — it's about
                    securing your family's peace!
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 footer-cta-buttons">
                    <button
                      className="inline-flex w-full sm:w-auto sm:min-w-[270px] items-center justify-center rounded-full bg-[#132F2C] px-6 sm:px-10 py-3 text-[13px] sm:text-[18px] font-[Urania] text-white whitespace-nowrap footer-cta-button hover:scale-105 hover:bg-[#0F2724] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                      onClick={() => setIsScheduleOpen(true)}
                    >
                      Schedule your expert session today
                    </button>
                    <button
                      className="inline-flex w-full sm:w-auto sm:min-w-[220px] items-center justify-center rounded-full bg-[#132F2C] px-6 sm:px-10 py-3 text-[13px] sm:text-[18px] font-[Urania] text-white whitespace-nowrap footer-cta-button hover:scale-105 hover:bg-[#0F2724] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                      onClick={() => setIsCallbackOpen(true)}
                    >
                      Request a Call Back
                    </button>
                  </div>
                </div>
              </div>
              <div className="shine-slow" />
            </div>
          </div>
        </>
      )}

      {/* Main footer content */}
      <div className="relative z-20 pt-3 pb-0 mt-0 footer-main">
        <div className="max-w-[1550px] lg:max-w-full mx-auto px-4 sm:px-8 lg:px-6 xl:px-8 2xl:px-4 footer-main-inner">
          {/* Mobile layout */}
          <div className="lg:hidden text-[13px] footer-mobile-block">
            {/* Top row: Phone/Email/Follow Us + Quick Links */}
            <div className="flex gap-6 sm:gap-8 pb-1">
              <div className="absolute bottom-0 left-[-10px] right-[-10px] h-px bg-[#193C38]"></div>
              <div className="flex-[1.2]">
                <div className="text-white mb-2 footer-label animate-fade-in-up" style={{ animationDelay: "100ms", fontFamily: 'Urania', fontWeight: '500', fontStyle: 'Medium', fontSize: '18px', lineHeight: '100%' }}>
                  Phone
                </div>
                <div className="space-y-1 mb-4 text-[#F4D57E] text-[16px] footer-text-group animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                  <div className="font-medium footer-text">
                    <a href="tel:+917592912300" className="block whitespace-nowrap hover:underline">
                      +91 75929 12300
                    </a>
                    <a href="tel:+917593912300" className="block whitespace-nowrap hover:underline">
                      +91 75939 12300
                    </a>
                  </div>
                </div>
                <div className="text-white mb-2 mt-5 footer-label animate-fade-in-up" style={{ animationDelay: "300ms", fontFamily: 'Urania', fontWeight: '500', fontStyle: 'Medium', fontSize: '18px', lineHeight: '100%' }}>
                  Email
                </div>
                <div className="text-[#F4D57E] text-[16px] mb-4 footer-text animate-fade-in-up" style={{ animationDelay: "400ms" }}>
                  <a href="mailto:info@truelegacy.in" className="hover:underline">
                    info@truelegacy.in
                  </a>
                </div>
                <div className="text-white mb-2 mt-5 footer-label animate-fade-in-up" style={{ animationDelay: "500ms", fontFamily: 'Urania', fontWeight: '500', fontStyle: 'Medium', fontSize: '18px', lineHeight: '100%' }}>
                  Follow Us
                </div>
                <div className="flex items-center gap-3 mb-1 footer-social animate-fade-in-up" style={{ animationDelay: "600ms" }}>
                  {socials.map((social, index) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.name}
                      className="inline-flex hover:scale-125 hover:rotate-6 transition-all duration-300 cursor-pointer"
                      style={{ animationDelay: `${600 + index * 100}ms` }}
                    >
                      <img src={social.icon} alt={social.name} className="h-6 w-6"
  loading="lazy"
  decoding="async"
  />
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex-[0.8] flex justify-start sm:justify-center">
                <div className="w-fit text-left">
                  <div className="text-white mb-2 footer-label animate-fade-in-up" style={{ animationDelay: "700ms", fontFamily: 'Urania', fontWeight: '500', fontStyle: 'Medium', fontSize: '18px', lineHeight: '100%' }}>
                    Quick Links
                  </div>
                  <div className="space-y-2 text-[#A1A1A1] footer-links">
                    {[
                      { to: "/", text: "Home" },
                      { to: "/why-choose-us", text: "Why Choose Us" },
                      { to: "/services/will", text: "Services" },
                      { to: "/resources", text: "Blogs" },
                      { to: "/articles-news-events", text: "News & Events" },
                      { to: "/contact", text: "Contact" }
                    ].map((link, index) => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        className="block text-[16px] hover:text-[#F4D57E] hover:translate-x-1 transition-all duration-300 cursor-pointer animate-fade-in-up"
                        style={{ animationDelay: `${800 + index * 100}ms` }}
                      >
                        {link.text}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Address full width */}
            <div className="mt-1 pt-5 pb-1 relative">
              <div className="h-px bg-[#193C38] w-full mb-6 mt-0"></div>
              <div className="absolute bottom-0 left-[-10px] right-[-10px] h-px bg-[#193C38]"></div>
              <div className="text-white mb-2 footer-label animate-fade-in-up" style={{ animationDelay: "1300ms", fontFamily: 'Urania', fontWeight: '500', fontStyle: 'Medium', fontSize: '18px', lineHeight: '100%' }}>
                Address
              </div>
              <p className="text-[16px] leading-relaxed text-[#A1A1A1] footer-text animate-fade-in-up" style={{ animationDelay: "1400ms" }}>
                True Legacy Solutions Private Limited,
                <br />
                2nd Floor, Imperial Amity, NH Bypass,
                <br />
                Vyttila, Kochi, Kerala 682019, India
              </p>
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-8 text-[13px] sm:text-[14px] footer-desktop-grid -mt-4">
            {/* Phone & Email */}
            <div className="pb-2 relative footer-col">
              <div className="absolute bottom-0 left-[-20px] right-[-20px] h-px bg-[#193C38]"></div>
              <div className="text-[20px] tracking-[0.12em] text-white mb-2 footer-label animate-fade-in">
                Phone
              </div>
              <div className="space-y-1 mb-4 text-[16px] text-[#F4D57E] footer-text-group animate-fade-in">
                <a href="tel:+917592912300" className="block font-medium footer-text hover:underline">
                  +91 75929 12300
                </a>
                <a href="tel:+917593912300" className="block font-medium footer-text hover:underline">
                  +91 75939 12300
                </a>
              </div>
              <div className="text-[20px] tracking-[0.12em] text-white mb-2 mt-11 footer-label animate-fade-in">
                Email
              </div>
              <div className="text-[#F4D57E] text-[16px] mb-1 footer-text animate-fade-in">
                <a href="mailto:info@truelegacy.in" className="hover:underline">
                  info@truelegacy.in
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="md:border-l md:border-[#1D3C36] md:pl-8 pb-2 relative footer-col">
              <div className="absolute bottom-0 left-[-20px] right-[-20px] h-px bg-[#193C38]"></div>
              <div className="text-[20px] tracking-[0.12em] text-white mb-2 footer-label animate-fade-in">
                Address
              </div>
              <p className="text-[16px] leading-relaxed text-[#A1A1A1] footer-text animate-fade-in">
                True Legacy Solutions Private Limited,

                2nd Floor, Imperial Amity, NH Bypass,

                Vyttila, Kochi, Kerala 682019, India
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:border-l md:border-[#1D3C36] md:pl-8 pb-2 relative footer-col">
              <div className="absolute bottom-0 left-[-20px] right-[-20px] h-px bg-[#193C38]"></div>
              <div className="text-[20px] tracking-[0.12em] text-white mb-2 footer-label animate-fade-in">
                Quick Links
              </div>
              <div className="space-y-2 text-[#A1A1A1] footer-links animate-fade-in">
                <NavLink
                  to="/"
                  className="block text-[16px] hover:text-[#F4D57E] transition-colors"
                >
                  Home
                </NavLink>
                <NavLink
                  to="/why-choose-us"
                  className="block text-[16px] hover:text-[#F4D57E] transition-colors"
                >
                  Why Choose Us
                </NavLink>
                <NavLink
                  to="/services/will"
                  className="block text-[16px] hover:text-[#F4D57E] transition-colors"
                >
                  Services
                </NavLink>
                <NavLink
                  to="/resources"
                  className="block text-[16px] hover:text-[#F4D57E] transition-colors"
                >
                  Blogs
                </NavLink>
                <NavLink
                  to="/articles-news-events"
                  className="block text-[16px] hover:text-[#F4D57E] transition-colors"
                >
                  News & Events
                </NavLink>
                <NavLink
                  to="/contact"
                  className="block text-[16px] hover:text-[#F4D57E] transition-colors"
                >
                  Contact
                </NavLink>
              </div>
            </div>

            {/* Follow Us */}
            <div className="md:border-l md:border-[#1D3C36] md:pl-8 pb-2 relative footer-col">
              <div className="absolute bottom-0 left-[-20px] right-[-20px] h-px bg-[#193C38]"></div>
              <div className="text-[20px] tracking-[0.12em] text-white mb-2 footer-label animate-fade-in">
                Follow Us
              </div>
              <div className="flex items-center gap-5 footer-social animate-fade-in">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.name}
                    className="inline-flex"
                  >
                    <img src={social.icon} alt={social.name} className="h-7 w-7"
  loading="lazy"
  decoding="async"
  />
                  </a>
                ))}
              </div>
            </div>

            {/* Blurb (desktop only) */}
            <div className="md:border-0.5 md:border-[#1D3C36] md:pl-1 pb-2 relative footer-col">
              <div className="absolute bottom-0 left-[-20px] right-[-20px] h-px bg-[#193C38]"></div>
              <p className="text-[16px] leading-relaxed text-[#A1A1A1] footer-blurb animate-fade-in">
                Helping families plan, protect, and
                pass on their legacy with clarity and
                confidence.
              </p>
            </div>
          </div>

          {/* Bottom row */}
          <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[14px] text-[#A3B4B0] footer-bottom">
            <div className="flex flex-wrap items-center gap-3">
              <NavLink to="/privacy-policy" className="hover:text-[#F4D57E] hover:underline hover:underline-offset-2 transition-all duration-300 cursor-pointer">
                Privacy Policy
              </NavLink>
              <span className="w-1 h-1 rounded-full bg-[#F4D57E]" />
              <NavLink to="/terms-of-service" className="hover:text-[#F4D57E] hover:underline hover:underline-offset-2 transition-all duration-300 cursor-pointer">
                Terms of Service
              </NavLink>
            </div>


            <div className="w-full h-px bg-[#193C38] sm:hidden"></div>

            <div className="text-[14px] sm:text-[12px] leading-none">
              ©{new Date().getFullYear()} TrueLegacy. ALL RIGHTS RESERVED
            </div>
            <div className="w-full h-px bg-[#193C38] sm:hidden"></div>
          </div>
        </div>
      </div>

      {/* Request Dialogs — lazy-loaded (phone input + enquiry API) */}
      {(isScheduleOpen || isCallbackOpen) && (
        <Suspense fallback={null}>
          {isScheduleOpen && (
            <RequestDialog
              open={isScheduleOpen}
              title="Schedule a Callback"
              isSchedule={true}
              onClose={() => setIsScheduleOpen(false)}
            />
          )}
          {isCallbackOpen && (
            <RequestDialog
              open={isCallbackOpen}
              title="Call Back Request"
              isSchedule={false}
              onClose={() => setIsCallbackOpen(false)}
            />
          )}
        </Suspense>
      )}
    </footer>
  );
};

export default Footer;
