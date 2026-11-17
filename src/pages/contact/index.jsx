import { useEffect, lazy, Suspense } from "react";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import ContactImage from "../../assets/img/resource/Frame contactus.webp";
import ContactMobileImage from "../../assets/img/Frame contactusmobile.webp";

const ContactSection = lazy(() => import("../../components/contact/ContactSection"));

const CONTACT_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": "https://truelegacyindia.com/contact#webpage",
      "url": "https://truelegacyindia.com/contact",
      "name": "Contact Truelegacy | Estate Planning Advisors",
      "description": "Get in touch with Truelegacy for guidance on estate planning, Will drafting, private family trusts and succession planning.",
      "isPartOf": { "@id": "https://truelegacyindia.com/#website" },
      "mainEntity": { "@id": "https://truelegacyindia.com/#organization" },
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://truelegacyindia.com/" },
        { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://truelegacyindia.com/contact" },
      ],
    },
  ],
};

const ContactPage = () => {
  useEffect(() => {
    const id = "contact-page-jsonld";
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(CONTACT_JSON_LD);
    return () => {
      const script = document.getElementById(id);
      if (script) script.remove();
    };
  }, []);
  return (
    <div className="min-h-screen bg-[#FfFFFF]">
      <div className="fixed top-0 left-0 right-0 z-[60] bg-[#132F2C]">
        <Navbar />
      </div>

      <div className="h-[64px] md:h-[72px]" />

      <Header
        title="Contact Us"
        subtitle="Have a question? Reach out to our team."
        mobileImage={ContactMobileImage}
        desktopImage={ContactImage}
      />

      <main className="max-w-[1200px] mx-auto px-0 md:px-10 pt-10 pb-0 md:pb-0 -mb-35 md:mb-0">
        <Suspense fallback={null}>
          <ContactSection />
        </Suspense>
      </main>
    </div>
  );
};

export default ContactPage;
