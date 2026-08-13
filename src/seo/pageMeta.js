/** Canonical site origin. */
export const SITE_ORIGIN = "https://truelegacyindia.com";

/** Default share image (1200×630) — used when a page has no featured image. */
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.jpg`;

/**
 * Absolute, percent-encoded image URL for Open Graph / Twitter crawlers.
 * Many uploaded blog images have spaces/parentheses in the filename; crawlers
 * refuse those URLs and WhatsApp/Facebook then show a link with no preview image.
 */
export function normalizeShareImageUrl(url, fallback = DEFAULT_OG_IMAGE) {
  const raw = String(url || "").trim();
  if (!raw) return fallback;
  try {
    const absolute = /^https?:\/\//i.test(raw)
      ? raw
      : `${SITE_ORIGIN}${raw.startsWith("/") ? "" : "/"}${raw}`;
    const parsed = new URL(absolute);
    parsed.pathname = parsed.pathname
      .split("/")
      .map((segment) => {
        if (!segment) return segment;
        try {
          return encodeURIComponent(decodeURIComponent(segment));
        } catch {
          return encodeURIComponent(segment);
        }
      })
      .join("/");
    return parsed.toString();
  } catch {
    return fallback;
  }
}

export const GA_MEASUREMENT_ID = "G-GR80GZBEVS";

/** Route → { title, description } for document meta tags. */
export const DEFAULT_ROBOTS =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

export const NOINDEX_ROBOTS = "noindex, nofollow";

/** Private / utility pages that should not appear in search results. */
const NOINDEX_PATHS = new Set([
  "/signin",
  "/succession/questions",
  "/succession/view",
  "/succession/family",
  "/readiness-survey/result",
]);

export const DEFAULT_PAGE_META = {
  title: "True Legacy – Secure Your Family's Future",
  description:
    "Secure your family's future with expert succession planning and estate management services.",
};

export const PAGE_META_BY_PATH = {
  "/": {
    title: "Expert Estate Planning Trusts & Succession | Truelegacy",
    description:
      "Secure your family's future with expert estate planning trusts. Truelegacy helps you manage assets and succession. Contact us to build your legacy right now.",
  },
  "/succession": {
    title: "Legal Heir Identification Tool By Truelegacy",
    description:
      "Truelegacy's Legal Heir Identification Tool helps you track family lines for estate planning. It's a smart way to secure a legacy. Check it out now.",
  },
  "/readiness-survey": {
    title: "Truelegacy Readiness Survey: Get Your Score Now",
    description:
      "Get your score with the Truelegacy Readiness Survey. It's a quick way to check your plans. Don't leave things to chance. See how prepared you are right now.",
  },
  "/services": {
    title: "Estate Planning and Trust Management | Truelegacy Services",
    description:
      "Keep your wealth safe for the next generation. We offer expert trust management and estate planning. Contact Truelegacy Services to start your plan now.",
  },
  "/services/will": {
    title: "Will Drafting & Estate Planning Services | Truelegacy",
    description:
      "Expert will drafting, estate planning, and cross-border wills for Indian and NRI families. Protect your legacy with Truelegacy's Family Will services.",
  },
  "/services/trust": {
    title: "Private Family Trust Services | Truelegacy",
    description:
      "Form and manage private family trusts with Truelegacy. Trust deed drafting, trusteeship, and succession planning for lasting wealth protection.",
  },
  "/why-choose-us": {
    title: "Expert Succession Planning for Families at Truelegacy",
    description:
      "Truelegacy offers expert succession planning for families. We help you pass down assets without the stress. Book a talk to save your legacy.",
  },
  "/resources": {
    title: "Guides to Succession Laws & Estate Planning | Truelegacy",
    description:
      "Explore Truelegacy's comprehensive guides on succession laws and estate planning. Learn how to protect your assets and your loved ones' future",
  },
  "/articles-news-events": {
    title: "Articles, News & Events | Truelegacy",
    description:
      "Read Truelegacy articles, news, and events on succession laws, estate planning, and protecting your family's legacy.",
  },
  "/contact": {
    title: "Contact Truelegacy | Estate Planning Consultants in India",
    description:
      "Contact Truelegacy for expert estate planning, will drafting, trust formation, & succession planning services. Schedule a consultation with our advisors today.",
  },
  "/terms-of-service": {
    title: "Terms and Conditions | Truelegacy",
    description:
      "Review Truelegacy's Terms and Conditions to understand the guidelines governing your use of our platform. Ensure a seamless experience with our services.",
  },
  "/privacy-policy": {
    title: "Privacy Policy | Truelegacy",
    description:
      "Explore Truelegacy's Privacy Policy to understand how we safeguard your personal information and maintain transparency in our data practices.",
  },
};

export function getPageMeta(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  const robots = NOINDEX_PATHS.has(path) ? NOINDEX_ROBOTS : DEFAULT_ROBOTS;

  if (PAGE_META_BY_PATH[path]) {
    return { ...PAGE_META_BY_PATH[path], robots };
  }

  return { ...DEFAULT_PAGE_META, robots };
}

/** Blog/article slugs — prefer API SEO fields, fall back to static map */
export async function getBlogPageMeta(slug) {
  const { BLOG_META_BY_SLUG } = await import("./blogMeta.js");
  const staticMeta = BLOG_META_BY_SLUG[slug] ?? null;

  try {
    const { getBlogBySlug, getBlogById } = await import("../api/blogsApi.js");
    let blog = await getBlogBySlug(slug);

    // Detail endpoint is the source of truth for meta_* after admin edits
    if (blog?._id) {
      try {
        const detail = await getBlogById(blog._id);
        blog = detail?.data?.blog || detail?.data || blog;
      } catch {
        // keep list payload
      }
    }

    if (blog) {
      const apiTitle = String(blog.meta_title || "").trim();
      const apiDescription = String(blog.meta_description || "").trim();
      const title =
        apiTitle ||
        staticMeta?.title ||
        (blog.title ? `${blog.title} | Truelegacy` : null);
      const description =
        apiDescription ||
        staticMeta?.description ||
        "Secure your family's future with expert succession planning and estate management services.";

      if (title) {
        return {
          title,
          description,
          keywords: String(blog.meta_keywords || "").trim(),
          image: normalizeShareImageUrl(blog.image),
          imageAlt: blog.image_alt || blog.imageAlt || blog.title || "",
          type: "article",
        };
      }
    }
  } catch {
    // fall through to static map
  }

  return staticMeta
    ? {
        ...staticMeta,
        image: normalizeShareImageUrl(staticMeta.image),
        type: "article",
      }
    : null;
}
