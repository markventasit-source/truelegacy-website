import { useEffect, useState } from "react";
import iconWrap from "../../assets/icon/Icon wrap.webp";
import iconMinus from "../../assets/icon/Icon-.webp";

const FAQ_JSON_LD_ID = "resource-faq-jsonld";

/**
 * Accordion FAQs for a single resource article (CMS-driven via blog.faqs).
 */
export default function BlogFaqs({ faqs }) {
  const [openQuestion, setOpenQuestion] = useState(null);

  const items = Array.isArray(faqs)
    ? faqs.filter((f) => f?.question && f?.answer)
    : [];

  const faqKey = items
    .map((f) => `${f.question}\0${f.answer}`)
    .join("\n");

  useEffect(() => {
    const existing = document.getElementById(FAQ_JSON_LD_ID);
    const list = faqKey
      ? faqKey.split("\n").map((row) => {
          const [question, answer] = row.split("\0");
          return { question, answer };
        })
      : [];

    if (list.length === 0) {
      existing?.remove();
      return undefined;
    }

    const payload = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: list.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    };

    let el = existing;
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = FAQ_JSON_LD_ID;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(payload);

    return () => {
      document.getElementById(FAQ_JSON_LD_ID)?.remove();
    };
  }, [faqKey]);

  if (items.length === 0) return null;

  return (
    <section className="pt-4 md:pt-6" aria-labelledby="resource-faqs-heading">
      <h2
        id="resource-faqs-heading"
        className="font-[Urania] text-[24px] leading-[32px] font-medium text-[#132F2C] mb-4 md:mb-6"
      >
        Frequently asked questions
      </h2>
      <div className="space-y-2 faq-list">
        {items.map((faq, index) => {
          const isOpen = openQuestion === index;
          return (
            <div
              key={`${faq.question}-${index}`}
              className="border-b border-[#E1E6E4] bg-transparent faq-item"
            >
              <button
                type="button"
                onClick={() => setOpenQuestion(isOpen ? null : index)}
                className="w-full px-0 py-3 flex justify-between items-center text-left hover:bg-[#F5FAF7] transition-colors"
                aria-expanded={isOpen}
              >
                <span
                  className={`font-[Urania] text-[#132F2C] text-[18px] faq-question-text font-medium pr-3 ${
                    isOpen ? "text-[20px] md:text-[22px]" : ""
                  }`}
                  style={{
                    fontFamily: "Urania",
                    fontWeight: "500",
                    WebkitTextStroke: "0.3px #132F2C",
                  }}
                >
                  {faq.question}
                </span>
                <span className="ml-3 flex-shrink-0">
                  <span className="relative inline-flex items-center justify-center w-6 h-6">
                    <img
                      src={isOpen ? iconMinus : iconWrap}
                      alt=""
                      className="w-full h-full"
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                </span>
              </button>
              <div
                className={`px-0 text-[#4C6B63] text-[15px] leading-[22px] font-[Urania] faq-answer ${
                  isOpen ? "faq-answer-open" : "faq-answer-closed"
                }`}
              >
                {faq.answer}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
