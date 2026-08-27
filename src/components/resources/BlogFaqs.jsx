import { useEffect, useState } from "react";
import iconWrap from "../../assets/icon/Icon wrap.webp";
import iconMinus from "../../assets/icon/Icon-.webp";

const FAQ_JSON_LD_ID = "resource-faq-jsonld";

/**
 * Accordion FAQs for a single resource article (CMS-driven via blog.faqs).
 * Intentionally avoids home `.faq-list` / `.faq-item` classes — those stay
 * opacity:0 until `.faq-section-visible`, which this page never sets.
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
      <div className="space-y-0">
        {items.map((faq, index) => {
          const isOpen = openQuestion === index;
          return (
            <div
              key={`${faq.question}-${index}`}
              className="border-b border-[#E1E6E4]"
            >
              <button
                type="button"
                onClick={() => setOpenQuestion(isOpen ? null : index)}
                className="w-full py-4 flex justify-between items-start gap-3 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-[Urania] text-[#132F2C] text-[17px] md:text-[18px] leading-[26px] font-medium">
                  {faq.question}
                </span>
                <span className="mt-0.5 flex-shrink-0 inline-flex items-center justify-center w-6 h-6">
                  <img
                    src={isOpen ? iconMinus : iconWrap}
                    alt=""
                    className="w-full h-full"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
              </button>
              {isOpen ? (
                <p className="pb-4 pr-8 font-[Urania] text-[#2A4742] text-[15px] md:text-[16px] leading-[24px]">
                  {faq.answer}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
