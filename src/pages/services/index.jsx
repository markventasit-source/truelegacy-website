import OurServices from "../../components/services/OurServices";
import FAQComponent from "../../components/FAQ";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const SERVICE_JSON_LD = {
  will: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": "https://truelegacyindia.com/services/will#service",
        "name": "Will Drafting Services",
        "url": "https://truelegacyindia.com/services/will",
        "description": "Will drafting and estate planning services for Indian and NRI families, helping individuals plan the distribution of their assets.",
        "serviceType": "Will Drafting and Estate Planning",
        "provider": { "@id": "https://truelegacyindia.com/#organization" },
        "areaServed": { "@type": "Country", "name": "India" },
      },
      {
        "@type": "WebPage",
        "@id": "https://truelegacyindia.com/services/will#webpage",
        "url": "https://truelegacyindia.com/services/will",
        "name": "Will Drafting Services | Truelegacy",
        "isPartOf": { "@id": "https://truelegacyindia.com/#website" },
        "mainEntity": { "@id": "https://truelegacyindia.com/services/will#service" },
        "inLanguage": "en-IN",
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://truelegacyindia.com/services/will#breadcrumb",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://truelegacyindia.com/" },
          { "@type": "ListItem", "position": 2, "name": "Will Drafting Services", "item": "https://truelegacyindia.com/services/will" },
        ],
      },
    ],
  },
  trust: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": "https://truelegacyindia.com/services/trust#service",
        "name": "Private Family Trust Services",
        "url": "https://truelegacyindia.com/services/trust",
        "description": "Private family trust formation, trust deed drafting, trusteeship and trust management services for family wealth and succession planning.",
        "serviceType": "Private Family Trust Formation and Management",
        "provider": { "@id": "https://truelegacyindia.com/#organization" },
        "areaServed": { "@type": "Country", "name": "India" },
      },
      {
        "@type": "WebPage",
        "@id": "https://truelegacyindia.com/services/trust#webpage",
        "url": "https://truelegacyindia.com/services/trust",
        "name": "Private Family Trust Formation | Truelegacy",
        "isPartOf": { "@id": "https://truelegacyindia.com/#website" },
        "mainEntity": { "@id": "https://truelegacyindia.com/services/trust#service" },
        "inLanguage": "en-IN",
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://truelegacyindia.com/services/trust#breadcrumb",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://truelegacyindia.com/" },
          { "@type": "ListItem", "position": 2, "name": "Private Family Trust Services", "item": "https://truelegacyindia.com/services/trust" },
        ],
      },
    ],
  },
};

function upsertServiceJsonLd(tab) {
  const schema = SERVICE_JSON_LD[tab];
  const id = "service-page-jsonld";
  let el = document.getElementById(id);
  if (schema) {
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema);
  } else if (el) {
    el.remove();
  }
}

const VALID_TABS = new Set(["will", "trust"]);

const TAB_HEADERS = {
  will: {
    title: "Will Drafting & Estate Planning",
    subtitle: "Protect your family's wealth with expert Will drafting and estate planning services in India.",
  },
  trust: {
    title: "Private Family Trust Services",
    subtitle: "Set up and manage private family trusts with expert guidance on formation, deed drafting and succession.",
  },
};

function Services() {
  const { tab } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialTab = tab === "trust" ? "trust" : "will";
  const header = TAB_HEADERS[initialTab] || TAB_HEADERS.will;

  // Canonical paths: /services/will | /services/trust (no query strings)
  useEffect(() => {
    const legacyTab = searchParams.get("tab");
    if (legacyTab && VALID_TABS.has(legacyTab)) {
      navigate(`/services/${legacyTab}`, { replace: true });
      return;
    }
    if (!tab) {
      navigate("/services/will", { replace: true });
      return;
    }
    if (!VALID_TABS.has(tab)) {
      navigate("/services/will", { replace: true });
    }
  }, [tab, searchParams, navigate]);

  // Inject page-specific JSON-LD; clean up on unmount
  useEffect(() => {
    upsertServiceJsonLd(initialTab);
    return () => {
      const el = document.getElementById("service-page-jsonld");
      if (el) el.remove();
    };
  }, [initialTab]);

  return (
    <div
      className="relative"
      style={{
        background: "linear-gradient(264.41deg, #132F2C 4.24%, #132F2C 98.47%)",
      }}
    >
      {/* Fixed navbar for Services page */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-[#132F2C]">
        <Navbar />
      </div>

      {/* Spacer to avoid content overlap */}
      <div className="h-[64px] md:h-[80px]" />

      <Header
        title={header.title}
        subtitle={header.subtitle}
      />
      <main className="flex-grow bg-white text-black">
        <OurServices initialTab={initialTab} />
        <div className="pb-0 md:pb-0 lg:pb-0">
          <FAQComponent />
        </div>
      </main>
    </div>
  );
}

export default Services;
