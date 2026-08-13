import { useState, useRef, useEffect } from "react";
import faqFrameImage from "../assets/img/Framefaq.webp";
import serviceImage from "../assets/img/Service.webp";
import group6Image from "../assets/img/home/Group 6.webp";
import iconWrap from "../assets/icon/Icon wrap.webp";
import iconMinus from "../assets/icon/Icon-.webp";

const faqs = {
  will: [
    {
      question: "What is the concept of Will?",
      answer:
        "A Will is a legal document where a person (the testator) declares how their assets should be distributed after their death. It ensures that their wishes are followed and minimises disputes among heirs.",
    },
    {
      question: "How does inheritance work?",
      answer:
        "Inheritance is based on whether there is a Will. If there is one, assets are passed on as per its terms. Without a Will, assets are distributed among legal heirs based on personal succession laws tied to religion.",
    },
    {
      question: "What is the validity of a Will in India?",
      answer:
        "A Will is valid if the person writing is of sound mind, signs voluntarily, and is witnessed by two people. Registration is not mandatory but adds authenticity.",
    },
    {
      question: "Is a will important during Estate Planning?",
      answer:
        "Yes, a Will ensures your assets are protected and shared as per your wishes while reducing confusion among heirs.",
    },
    {
      question: "Can anyone challenge a valid Will?",
      answer:
        "Yes, but only on legal grounds like fraud, coercion, or mental incapacity.",
    },
  ],
  trust: [
    {
      question: "What is meant by Trust Management?",
      answer:
        "Trust Management involves handling financial accounts, tax filings, legal compliance and smooth operation of the assets placed in a Trust.",
    },
    {
      question: "Do I need a Trust?",
      answer:
        "Yes, a trust is necessary to safeguard and expertly manage your assets, preventing tax issues and family conflicts while providing them with proper care throughout your life.",
    },
    {
      question: "How do you ensure the Trust Deed is effective?",
      answer:
        "A Trust Deed is effective when it is clear, legally compliant and specifies your goals and circumstances to prevent future complications. We draft precise and legally compliant Trust Deeds tailored to your wishes.",
    },
    {
      question: "What is a Trusteeship?",
      answer:
        "Trusteeship is the responsibility of the Trust Management to execute the terms of the Trust Deed. Trustees act in the best interest of the Trust and beneficiaries, ensuring proper administration and legal compliance.",
    },
    {
      question: "How does Trust work?",
      answer:
        "A Trust works by managing your assets for the benefit of your chosen beneficiaries according to the terms mentioned in your Trust Deed. A Trustee ensures that all the terms are met to ensure smooth Trust Management.",
    },
    {
      question: "What is the role of a Trustee?",
      answer:
        "The role of a Trustee is to manage the trust assets responsibly, make decisions as per the trust terms, maintain transparency, file taxes, and protect the interests of the beneficiaries.",
    },
  ],
};

const FAQ = () => {
  const [activeTab, setActiveTab] = useState("will");
  const [openQuestion, setOpenQuestion] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [tabKey, setTabKey] = useState("will");
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

  // Trigger tab animation
  useEffect(() => {
    setTabKey(activeTab);
  }, [activeTab]);

  const currentFaqs = activeTab === "will" ? faqs.will : faqs.trust;

  return (
    <section
      ref={sectionRef}
      className={`w-full bg-[#F6FFFF] pt-0 pb-0 mb-0 md:pt-16 md:pb-20 lg:pt-24 lg:pb-24 overflow-x-hidden faq-section ${
        isVisible ? "faq-section-visible" : ""
      }`}
    >
      <div className="max-w-[1450px] mx-auto px-4 md:px-9">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-32 items-start relative">
          {/* LEFT BLOCK (desktop only) */}
          <div className="hidden lg:block w-[590px] relative">
            <h2 className="font-[Urania] font-bold text-[32px] lg:text-[42px] leading-[36px] lg:leading-[49px] text-[#132F2C] mb-0 faq-heading">
              FAQ'S
            </h2>

            {/* IMAGE */}
            <div className="relative overflow-hidden -mt-10 -ml-8">
              <img
                src={faqFrameImage}
                alt="FAQ visual"
                width={590}
                height={600}
                loading="lazy"
                decoding="async"
                className="w-full h-[600px] object-cover rounded-[10px] transition-transform duration-500 ease-out hover:scale-105"
              />
            </div>

            {/* OVERLAY CARD (desktop) */}
            <div className="absolute right-[310px] bottom-[10px] w-[313px] h-[268px] rounded-[10px] overflow-hidden shadow-[0_20px_40px_rgba(10,47,36,0.18)] faq-overlay">
              <img
                src={serviceImage}
                alt="Estate planning consultation"
                width={313}
                height={268}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* RIGHT BLOCK */}
          <div className="flex-1 w-full lg:max-w-[700px] mt-6 lg:mt-0">
            {/* MOBILE HEADING */}
            <h2 className="lg:hidden font-[Urania] font-bold text-[32px] leading-[36px] text-[#132F2C] mb-4 faq-heading" style={{fontFamily: 'Urania', fontWeight: '600 !important', fontStyle: 'Bold'}}>
              FAQ'S
            </h2>

            {/* TABS */}
            <div className="flex gap-8 border-b border-[#E1E6E4] mb-6 faq-tabs">
              <button
                onClick={() => setActiveTab("will")}
                className={`pb-2 font-[Urania] text-[18px] md:text-[24px] font-bold border-b-2 transition-all duration-500 ease-out flex items-center justify-center ${
                  activeTab === "will"
                    ? "border-[#F4D57E] text-[#F4D57E]"
                    : "border-transparent text-[#717171]"
                }`}
              >
                <span className="text-left ml-10">Will and Inheritance</span>
              </button>

              <button
                onClick={() => setActiveTab("trust")}
                className={`pb-2 font-[Urania] text-[18px] md:text-[24px] border-b-2 transition-all duration-1000 ease-out ${
                  activeTab === "trust"
                    ? "border-[#F4D57E] text-[#F4D57E] font-bold"
                    : "border-transparent text-[#717171]"
                }`}
              >
                Trust Formation &amp; Management
              </button>
            </div>

            {/* FAQ LIST */}
            <div
              key={tabKey}
              className="space-y-2 faq-list faq-tab-enter"
            >
              {currentFaqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  faq={faq}
                  index={index}
                  openQuestion={openQuestion}
                  setOpenQuestion={setOpenQuestion}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM IMAGE */}
      <div className="lg:hidden w-full">
        <img
          src={group6Image}
          alt="FAQ visual"
          width={800}
          height={1101}
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-cover"
        />
      </div>
    </section>
  );
};

function FAQItem({ faq, index, openQuestion, setOpenQuestion }) {
  const isOpen = openQuestion === index;

  return (
    <div className="border-b border-[#E1E6E4] bg-transparent faq-item">
      <button
        onClick={() => setOpenQuestion(isOpen ? null : index)}
        className="w-full px-3 lg:px-4 py-3 flex justify-between items-center text-left hover:bg-[#F5FAF7] transition-colors"
      >
        <span className={`font-[Urania] text-[#132F2C] text-[18px] faq-question-text font-medium ${isOpen ? 'text-[20px] md:text-[24px]' : ''}`} style={{fontFamily: 'Urania', fontWeight: '500', WebkitTextStroke: '0.3px #132F2C', textStroke: '0.3px #132F2C'}}>
          {faq.question}
        </span>
        <span className="ml-3 flex-shrink-0">
          <span className="relative inline-flex items-center justify-center w-6 h-6">
            <img
              src={isOpen ? iconMinus : iconWrap}
              alt={isOpen ? "Collapse" : "Expand"}
              className="w-full h-full"
              loading="lazy"
              decoding="async"
              />
          </span>
        </span>
      </button>

      <div
        className={`px-3 lg:px-4 text-[#4C6B63] text-[15px] leading-[22px] faq-answer ${
          isOpen ? "faq-answer-open" : "faq-answer-closed"
        }`}
      >
        {faq.answer}
      </div>
    </div>
  );
}

export default FAQ;
