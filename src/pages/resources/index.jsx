import { useEffect, lazy, Suspense } from "react";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import ResourcesImage from "../../assets/img/resource/Frame resource.webp";
import ResourcesMobileImage from "../../assets/img/resource/Frame resourcemobile.webp";

const AllResources = lazy(() => import("../../components/resources/AllResources"));

const RESOURCES_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://truelegacyindia.com/resources#webpage",
      "url": "https://truelegacyindia.com/resources",
      "name": "Estate Planning and Succession Planning Resources | Truelegacy",
      "description": "Explore guides and articles about estate planning, inheritance laws, Will drafting, private family trusts and succession planning in India.",
      "isPartOf": { "@id": "https://truelegacyindia.com/#website" },
      "about": { "@id": "https://truelegacyindia.com/#organization" },
      "inLanguage": "en-IN",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://truelegacyindia.com/resources#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://truelegacyindia.com/" },
        { "@type": "ListItem", "position": 2, "name": "Resources", "item": "https://truelegacyindia.com/resources" },
      ],
    },
  ],
};

const Resources = () => {
  useEffect(() => {
    const id = "resources-page-jsonld";
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(RESOURCES_JSON_LD);
    return () => {
      const script = document.getElementById(id);
      if (script) script.remove();
    };
  }, []);
  return (
    <div
      className="relative"
      style={{
        background: "linear-gradient(264.41deg, #132F2C 4.24%, #132F2C 98.47%)",
      }}
    >
      <div className="fixed top-0 left-0 right-0 z-[60] bg-[#132F2C]">
        <Navbar />
      </div>

      <div className="h-[64px] md:h-[80px]" />

      <Header
        title="Resources"
        subtitle="Explore guides and blogs to understand succession laws and estate planning."
        mobileImage={ResourcesMobileImage}
        desktopImage={ResourcesImage}
      />

      <main className="flex-grow bg-white text-black">
        <Suspense fallback={null}>
          <AllResources types={["blog"]} heading="Blogs" />
        </Suspense>
      </main>
    </div>
  );
};

export default Resources;
