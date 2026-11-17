import { renderToString } from "react-dom/server";
import { MemoryRouter, Routes, Route } from "react-router-dom";

// Layout & core pages (static imports for SSR to avoid Suspense rendering null)
import Layout from "./layout/Layout";
import Home from "./pages/home/index.jsx";
import Services from "./pages/services/index.jsx";
import WhyChooseUs from "./pages/why-choose-us.jsx";
import Contact from "./pages/contact/index.jsx";
import Resources from "./pages/resources/index.jsx";
import ArticlesNewsEvents from "./pages/articles-news-events/index.jsx";
import ReadinessSurveyPage from "./pages/readiness-survey/ReadinessSurveyPage.jsx";
import Privacy from "./pages/privacy/index.jsx";
import TermsOfService from "./pages/Terms/index.jsx";
import SuccessionLanding from "./pages/succession/Landing.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:tab" element={<Services />} />
        <Route path="why-choose-us" element={<WhyChooseUs />} />
        <Route path="contact" element={<Contact />} />
        <Route path="resources" element={<Resources />} />
        <Route path="articles-news-events" element={<ArticlesNewsEvents />} />
        <Route path="readiness-survey" element={<ReadinessSurveyPage />} />
        <Route path="privacy-policy" element={<Privacy />} />
        <Route path="terms-of-service" element={<TermsOfService />} />
      </Route>
      <Route path="succession" element={<SuccessionLanding />} />
    </Routes>
  );
}

export function render(url = "/") {
  return renderToString(
    <MemoryRouter initialEntries={[url]}>
      <AppRoutes />
    </MemoryRouter>
  );
}

export function renderBlog({ title, description, articleText, image, imageAlt, faqs = [], relatedLinks = [] }) {
  const paragraphs = String(articleText || "")
    .split(/(?<=\.)\s+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 30);

  return renderToString(
    <MemoryRouter initialEntries={["/resources"]}>
      <div className="min-h-screen flex flex-col bg-white">
        <div className="fixed top-0 left-0 right-0 z-[60] bg-[#132F2C]">
          <Navbar />
        </div>
        <div className="h-[64px] md:h-[72px]" />
        <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <article className="prose prose-lg max-w-none text-[#132F2C]">
            <h1 className="font-[Urania] text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-[#132F2C]">
              {title}
            </h1>
            {image && (
              <div className="my-6 rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={imageAlt || title}
                  className="w-full h-auto object-cover max-h-[480px]"
                  loading="eager"
                />
              </div>
            )}
            <p className="text-lg md:text-xl text-[#4C6B63] font-medium leading-relaxed mb-8">
              {description}
            </p>
            <div className="space-y-4 text-base md:text-lg leading-relaxed text-[#2C3E3A]">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {Array.isArray(faqs) && faqs.length > 0 && (
              <section className="mt-12 pt-8 border-t border-[#E1E6E4]">
                <h2 className="font-[Urania] text-2xl md:text-3xl font-bold mb-6 text-[#132F2C]">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  {faqs.map((faq, i) => (
                    <div key={i} className="border-b border-[#E1E6E4] pb-4">
                      <h3 className="font-[Urania] text-lg md:text-xl font-semibold text-[#132F2C] mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-[#4C6B63] text-base leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {Array.isArray(relatedLinks) && relatedLinks.length > 0 && (
              <section className="mt-12 pt-8 border-t border-[#E1E6E4]">
                <h2 className="font-[Urania] text-2xl font-bold mb-4 text-[#132F2C]">
                  Related Guides &amp; Articles
                </h2>
                <ul className="space-y-2">
                  {relatedLinks.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link.href}
                        className="text-[#132F2C] hover:underline font-medium"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>
        </main>
        <Footer />
      </div>
    </MemoryRouter>
  );
}
