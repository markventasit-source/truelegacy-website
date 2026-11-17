import { SITE_ORIGIN, canonicalUrl } from "./pageMeta.js";

/**
 * Standard page-level JSON-LD schemas keyed by canonical pathname.
 * Each subpage references the global Organization (#organization)
 * and WebSite (#website) declared on the homepage.
 */
export const PAGE_SCHEMAS = {
  "/services/will": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE_ORIGIN}/services/will#service`,
        name: "Will Drafting Services",
        url: `${SITE_ORIGIN}/services/will`,
        description:
          "Will drafting and estate planning services for Indian and NRI families, helping individuals plan the distribution of their assets.",
        serviceType: "Will Drafting and Estate Planning",
        provider: {
          "@id": `${SITE_ORIGIN}/#organization`,
        },
        areaServed: {
          "@type": "Country",
          name: "India",
        },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_ORIGIN}/services/will#webpage`,
        url: `${SITE_ORIGIN}/services/will`,
        name: "Will Drafting Services | Truelegacy",
        isPartOf: {
          "@id": `${SITE_ORIGIN}/#website`,
        },
        mainEntity: {
          "@id": `${SITE_ORIGIN}/services/will#service`,
        },
        inLanguage: "en-IN",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_ORIGIN}/services/will#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_ORIGIN}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Will Drafting Services",
            item: `${SITE_ORIGIN}/services/will`,
          },
        ],
      },
    ],
  },
  "/services/trust": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE_ORIGIN}/services/trust#service`,
        name: "Private Family Trust Services",
        url: `${SITE_ORIGIN}/services/trust`,
        description:
          "Private family trust formation, trust deed drafting, trusteeship and trust management services for family wealth and succession planning.",
        serviceType: "Private Family Trust Formation and Management",
        provider: {
          "@id": `${SITE_ORIGIN}/#organization`,
        },
        areaServed: {
          "@type": "Country",
          name: "India",
        },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_ORIGIN}/services/trust#webpage`,
        url: `${SITE_ORIGIN}/services/trust`,
        name: "Private Family Trust Formation | Truelegacy",
        isPartOf: {
          "@id": `${SITE_ORIGIN}/#website`,
        },
        mainEntity: {
          "@id": `${SITE_ORIGIN}/services/trust#service`,
        },
        inLanguage: "en-IN",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_ORIGIN}/services/trust#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_ORIGIN}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Private Family Trust Services",
            item: `${SITE_ORIGIN}/services/trust`,
          },
        ],
      },
    ],
  },
  "/succession": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${SITE_ORIGIN}/succession#application`,
        name: "Truelegacy Legal Heir Identification Tool",
        url: `${SITE_ORIGIN}/succession`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web Browser",
        description:
          "An interactive family tree and inheritance calculation tool designed to help users understand potential legal heirs under applicable succession laws.",
        provider: {
          "@id": `${SITE_ORIGIN}/#organization`,
        },
        inLanguage: "en-IN",
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_ORIGIN}/succession#webpage`,
        url: `${SITE_ORIGIN}/succession`,
        name: "Legal Heir Identification Tool | Truelegacy",
        isPartOf: {
          "@id": `${SITE_ORIGIN}/#website`,
        },
        mainEntity: {
          "@id": `${SITE_ORIGIN}/succession#application`,
        },
        inLanguage: "en-IN",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_ORIGIN}/succession#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_ORIGIN}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Legal Heir Identification Tool",
            item: `${SITE_ORIGIN}/succession`,
          },
        ],
      },
    ],
  },
  "/resources": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_ORIGIN}/resources#webpage`,
        url: `${SITE_ORIGIN}/resources`,
        name: "Estate Planning and Succession Planning Resources | Truelegacy",
        description:
          "Explore guides and articles about estate planning, inheritance laws, Will drafting, private family trusts and succession planning in India.",
        isPartOf: {
          "@id": `${SITE_ORIGIN}/#website`,
        },
        about: {
          "@id": `${SITE_ORIGIN}/#organization`,
        },
        inLanguage: "en-IN",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_ORIGIN}/resources#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_ORIGIN}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Resources",
            item: `${SITE_ORIGIN}/resources`,
          },
        ],
      },
    ],
  },
  "/contact": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${SITE_ORIGIN}/contact#webpage`,
        url: `${SITE_ORIGIN}/contact`,
        name: "Contact Truelegacy | Estate Planning Advisors",
        description:
          "Get in touch with Truelegacy for guidance on estate planning, Will drafting, private family trusts and succession planning.",
        isPartOf: {
          "@id": `${SITE_ORIGIN}/#website`,
        },
        mainEntity: {
          "@id": `${SITE_ORIGIN}/#organization`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_ORIGIN}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Contact",
            item: `${SITE_ORIGIN}/contact`,
          },
        ],
      },
    ],
  },
  "/readiness-survey": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_ORIGIN}/readiness-survey#webpage`,
        url: `${SITE_ORIGIN}/readiness-survey`,
        name: "Estate Planning Readiness Survey | Truelegacy",
        description:
          "Assess your estate planning readiness and identify areas where you may need to plan for your family's wealth, assets and succession.",
        isPartOf: {
          "@id": `${SITE_ORIGIN}/#website`,
        },
        about: {
          "@id": `${SITE_ORIGIN}/#organization`,
        },
        inLanguage: "en-IN",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_ORIGIN}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Estate Planning Readiness Survey",
            item: `${SITE_ORIGIN}/readiness-survey`,
          },
        ],
      },
    ],
  },
  "/why-choose-us": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${SITE_ORIGIN}/why-choose-us#webpage`,
        url: `${SITE_ORIGIN}/why-choose-us`,
        name: "Why Choose True Legacy for Estate Planning?",
        description:
          "Choose Truelegacy for estate planning, Will drafting & private family trusts. Get personalised guidance to protect your family's wealth & secure your legacy.",
        isPartOf: {
          "@id": `${SITE_ORIGIN}/#website`,
        },
        about: {
          "@id": `${SITE_ORIGIN}/#organization`,
        },
        inLanguage: "en-IN",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_ORIGIN}/why-choose-us#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_ORIGIN}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Why Choose Us",
            item: `${SITE_ORIGIN}/why-choose-us`,
          },
        ],
      },
    ],
  },
  "/articles-news-events": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_ORIGIN}/articles-news-events#webpage`,
        url: `${SITE_ORIGIN}/articles-news-events`,
        name: "Articles, News & Events | Truelegacy",
        description:
          "Read Truelegacy articles, news, and events on succession laws, estate planning, and protecting your family's legacy.",
        isPartOf: {
          "@id": `${SITE_ORIGIN}/#website`,
        },
        about: {
          "@id": `${SITE_ORIGIN}/#organization`,
        },
        inLanguage: "en-IN",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_ORIGIN}/articles-news-events#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_ORIGIN}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Articles, News & Events",
            item: `${SITE_ORIGIN}/articles-news-events`,
          },
        ],
      },
    ],
  },
};

/**
 * Builds unique Article + BreadcrumbList JSON-LD for a single blog post.
 */
export function buildArticleSchema({
  slug,
  title,
  description,
  image,
  datePublished,
  dateModified,
}) {
  const url = canonicalUrl(`/resources/${slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        isPartOf: {
          "@id": `${SITE_ORIGIN}/#website`,
        },
        headline: title,
        description,
        image: image ? [image] : undefined,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
        author: {
          "@id": `${SITE_ORIGIN}/#organization`,
        },
        publisher: {
          "@id": `${SITE_ORIGIN}/#organization`,
        },
        datePublished,
        dateModified: dateModified || datePublished,
        inLanguage: "en-IN",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_ORIGIN}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Resources",
            item: `${SITE_ORIGIN}/resources`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: title,
            item: url,
          },
        ],
      },
    ],
  };
}
