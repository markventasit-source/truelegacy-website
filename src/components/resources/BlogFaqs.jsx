import { useEffect, useState } from "react";
import iconWrap from "../../assets/icon/Icon wrap.webp";
import iconMinus from "../../assets/icon/Icon-.webp";

const FAQ_JSON_LD_ID = "resource-faq-jsonld";

/**
 * Clean accordion FAQs for a resource article (CMS `blog.faqs`).
 * Matches home FAQ look, but avoids `.faq-list` / `.faq-item` animation
 * classes (those stay opacity:0 without `.faq-section-visible`).
 */
export default function BlogFaqs({ faqs }) {
  const items = Array.isArray(faqs)
    ? faqs.filter((f) => f?.question?.trim() && f?.answer?.trim())
    : [];

  const [openQuestion, setOpenQuestion] = useState(null);

  const faqKey = items
    .map((f) => `${f.question}\0${f.answer}`)
    .join("\n");

  useEffect(() => {
    setOpenQuestion(null);
  }, [faqKey]);

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
    <section className="mt-10 md:mt-12" aria-labelledby="resource-faqs-heading">
      <h2
        id="resource-faqs-heading"
        className="font-[Urania] text-[24px] md:text-[28px] leading-[32px] md:leading-[36px] font-bold text-[#132F2C] mb-4 md:mb-6"
      >
        FAQ&apos;s
      </h2>

      <div>
        {items.map((faq, index) => {
          const isOpen = openQuestion === index;
          const panelId = `resource-faq-panel-${index}`;

          return (
            <div key={`${faq.question}-${index}`} className="border-b border-[#E1E6E4]">
              <button
                type="button"
                onClick={() => setOpenQuestion(isOpen ? null : index)}
                className="w-full py-4 flex justify-between items-center gap-4 text-left hover:bg-[#F5FAF7]/40 transition-colors"
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span
                  className={`font-[Urania] text-[#132F2C] font-medium pr-2 transition-[font-size] duration-200 ${
                    isOpen
                      ? "text-[18px] md:text-[20px] leading-[26px] md:leading-[28px]"
                      : "text-[16px] md:text-[18px] leading-[24px] md:leading-[26px]"
                  }`}
                  style={{
                    fontFamily: "Urania",
                    fontWeight: 500,
                    WebkitTextStroke: "0.3px #132F2C",
                  }}
                >
                  {faq.question}
                </span>
                <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6">
                  <img
                    src={isOpen ? iconMinus : iconWrap}
                    alt=""
                    className="w-full h-full"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
              </button>

              <div
                id={panelId}
                className="overflow-hidden transition-[max-height,opacity,padding] duration-300 ease-out"
                style={{
                  maxHeight: isOpen ? "480px" : "0px",
                  opacity: isOpen ? 1 : 0,
                  paddingBottom: isOpen ? "16px" : "0px",
                }}
              >
                <p
                  className="font-[Urania] text-[#4C6B63] text-[15px] md:text-[16px] leading-[22px] md:leading-[24px] whitespace-pre-wrap pr-10"
                  style={{ fontFamily: "Urania" }}
                >
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
