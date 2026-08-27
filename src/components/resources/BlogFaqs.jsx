import { useEffect, useState } from "react";

const FAQ_JSON_LD_ID = "resource-faq-jsonld";

/**
 * Accordion FAQs for a single resource article (CMS-driven via blog.faqs).
 */
export default function BlogFaqs({ faqs }) {
  const items = Array.isArray(faqs)
    ? faqs.filter((f) => f?.question?.trim() && f?.answer?.trim())
    : [];

  const [openQuestion, setOpenQuestion] = useState(() =>
    items.length > 0 ? 0 : null
  );

  const faqKey = items
    .map((f) => `${f.question}\0${f.answer}`)
    .join("\n");

  useEffect(() => {
    // Reset open state when FAQ list changes (e.g. navigate to another article)
    setOpenQuestion(items.length > 0 ? 0 : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-open when content identity changes
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
    <section
      className="mt-10 md:mt-12 rounded-lg border border-[#D5DDDA] bg-white p-5 md:p-7"
      aria-labelledby="resource-faqs-heading"
    >
      <h2
        id="resource-faqs-heading"
        className="font-[Urania] text-[22px] md:text-[26px] leading-[30px] md:leading-[34px] font-bold text-[#132F2C] mb-5"
      >
        Frequently asked questions
      </h2>

      <div className="flex flex-col gap-3">
        {items.map((faq, index) => {
          const isOpen = openQuestion === index;
          const panelId = `resource-faq-panel-${index}`;
          return (
            <div
              key={`${faq.question}-${index}`}
              className="rounded-md border border-[#E1E6E4] bg-[#F6FFFF]"
            >
              <button
                type="button"
                onClick={() => setOpenQuestion(isOpen ? null : index)}
                className="w-full px-4 py-3.5 flex items-start gap-3 text-left"
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#132F2C] text-[18px] leading-none font-semibold text-white"
                  aria-hidden="true"
                >
                  {isOpen ? "−" : "+"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="mb-1 block font-[Urania] text-[12px] font-semibold uppercase tracking-wide text-[#5A7A72]">
                    Question {index + 1}
                  </span>
                  <span className="block font-[Urania] text-[16px] md:text-[18px] leading-[24px] md:leading-[26px] font-semibold text-[#132F2C]">
                    {faq.question}
                  </span>
                </span>
              </button>

              {isOpen ? (
                <div
                  id={panelId}
                  className="border-t border-[#E1E6E4] px-4 pb-4 pt-3 ml-10"
                >
                  <p className="mb-1.5 font-[Urania] text-[12px] font-semibold uppercase tracking-wide text-[#5A7A72]">
                    Answer
                  </p>
                  <p className="font-[Urania] text-[15px] md:text-[16px] leading-[24px] text-[#132F2C] whitespace-pre-wrap">
                    {faq.answer}
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
