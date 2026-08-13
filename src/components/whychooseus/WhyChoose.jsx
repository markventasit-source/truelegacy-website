import { useEffect, useState } from "react";
import Framewhychoose1 from "../../assets/img/whychooseus/Framewhychoose1.webp";
import Framewhychoose2 from "../../assets/img/whychooseus/Framewhychoose2.webp";
import Framewhychoose3 from "../../assets/img/whychooseus/Framewhychoose3.webp";
import Framewhychoose4 from "../../assets/img/whychooseus/Framewhychoose4.webp";
import Framewhychoose5 from "../../assets/img/whychooseus/Framewhychoose5.webp";
import Framewhychoose6 from "../../assets/img/whychooseus/Framewhychoose6.webp";

const WhyChoose = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById("whychooseus-section");
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

  const cards = [
    {
      id: "01",
      title: "Custom Trust Creation",
      desc: "We help you establish private, public, family, charitable, or religious trusts tailored to your goals and advise on the best structure, whether revocable, irrevocable, discretionary, or fixed.",
      image: Framewhychoose1
    },
    {
      id: "02",
      title: "Estate & Succession Planning",
      desc: "Our plans combine trusts, wills, and other tools to make asset transfer smooth, reduce tax impact, and address both local and international needs.",
      image: Framewhychoose2
    },
    {
      id: "03",
      title: "Trust Management & Compliance",
      desc: "We support trustees in managing assets, preparing financial statements, filing taxes, and meeting all legal and regulatory requirements.",
      image: Framewhychoose3
    },
    {
      id: "04",
      title: "Tax-Efficient Strategies",
      desc: "We guide you on how to structure trust income to save taxes, use available exemptions, and stay compliant with tax laws.",
      image: Framewhychoose4
    },
    {
      id: "05",
      title: "Family Business Governance",
      desc: "Every result includes clear explanations with citations, so you understand not just what the law says, but why.",
      image: Framewhychoose5
    },
    {
      id: "06",
      title: "Trustee\nGuidance",
      desc: "We train and advise trustees to fulfil their roles with confidence, responsibility, and best practices.",
      image: Framewhychoose6
    },
  ];

  return (
    <>
      <style jsx>{`
        /* MOBILE STYLES (Keep exactly as before) */
        @media (max-width: 767px) {
          .why-choose-card {
            width: 100% !important;
            max-width: calc(100vw - 32px) !important;
            height: 433px !important;
            min-height: 428px !important;
          }
          .why-choose-card img {
            width: calc(100% - 40px) !important;
            height: 186px !important;
            position: absolute !important;
            top: 20px !important;
            left: 20px !important;
          }
          .why-choose-card h3 {
            margin-top: 216px !important;
            margin-left: 7px !important;
            font-size: 24px !important;
            max-width: 240px !important;
            line-height: 1.2;
            white-space: pre-wrap; 
          }
          .why-choose-card p {
            margin-left: 7px !important;
            font-size: 16px !important;
            line-height: 22px !important;
            max-width: 301px !important;
          }
        }

        /* TABLET STYLES (New 2-column adjustment) */
        @media (min-width: 768px) and (max-width: 1023px) {
          .why-choose-card {
            width: 100% !important; 
            max-width: 100% !important;
            height: 451px !important; /* increased height closer to desktop for better text fit */
            min-height: 451px !important;
          }
          .why-choose-card img {
             /* Adjust image width to fit the 2-col card minus padding */
            width: calc(100% - 40px) !important;
            height: 186px !important;
            position: absolute !important;
            top: 25px !important;
            left: 20px !important;
            object-fit: cover !important;
          }
          .why-choose-card h3 {
            margin-top: 225px !important; /* Adjusted for image */
            margin-left: 7px !important;
            font-size: 22px !important; /* Slightly smaller than mobile/desktop to fit 2 cols if tight */
            max-width: 280px !important;
            line-height: 1.2;
            white-space: pre-wrap;
          }
          .why-choose-card p {
            margin-left: 7px !important;
            font-size: 15px !important; /* Slightly smaller font for better fit */
            line-height: 22px !important;
            max-width: 351px !important;
          }
        }

        @media (min-width: 1024px) {
          .why-choose-card {
            width: 414px !important;
            height: 451px !important;
            min-height: 451px !important;
          }
          .why-choose-card img {
            width: 359px !important;
            height: 186px !important;
            position: absolute !important;
            top: 30px !important;
            left: 30px !important;
          }
          .why-choose-card h3 {
            margin-top: 226px !important;
            margin-left: 10px !important;
            line-height: 1.2 !important;
            white-space: pre-wrap;
          }
          .why-choose-card p {
            margin-left: 10px !important;
            max-width: 351px !important;
            line-height: 24px !important;
          }
        }
      `}</style>

      <section
        id="whychooseus-section"
        className="bg-white text-black px-4 md:px-16 py-10 md:py-16"
      >
        <div className="max-w-[1600px] mx-auto">
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-[repeat(3,414px)]

              gap-y-6
              gap-x-8
              sm:gap-x-7
              lg:gap-x-6

              justify-items-center
              lg:justify-center
            "
          >
            {cards.map((card, i) => (
              <div
                key={i}
                className={`why-choose-card relative bg-[#132F2C] border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 p-4 sm:p-6 group flex flex-col cursor-pointer rounded-[6px] w-full
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{
                  transitionDelay: isVisible ? `${i * 150}ms` : "0ms",
                }}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  decoding="async"
                  className="object-cover rounded-lg"
                />

                <h3 className="text-[24px] mb-4 text-[#F4D57E] font-bold font-[Urania] leading-[2] max-w-[240px]">
                  {card.title}
                </h3>

                <p className="text-gray-300 text-[16px] leading-[22px] font-[Urania] font-normal max-w-[280px]">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyChoose;

