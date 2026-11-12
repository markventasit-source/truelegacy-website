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
    title: "Estate Planning & Succession Planning in India | Truelegacy",
    description:
      "Protect your family's wealth with Truelegacy's Estate Planning services in India. Explore Will Drafting, Private Family Trusts and Succession Planning solutions.",
    h1: "Protect Your Family's Wealth with Expert Estate Planning",
  },
  "/succession": {
    title: "Legal Heir Identification Tool in India | Truelegacy",
    description:
      "Identify your rightful legal heirs with Truelegacy's Legal Heir Identification Tool. Understand family succession and inheritance rights under Indian laws.",
    h1: "Legal Heir Identification Tool",
  },
  "/readiness-survey": {
    title: "Estate Planning Readiness Survey | Truelegacy",
    description:
      "Take the Truelegacy readiness survey to assess your estate planning preparedness. Understand your succession planning needs with Truelegacy",
    h1: "Estate Planning Readiness Survey",
  },
  "/services": {
    title: "Estate Planning and Trust Management | Truelegacy Services",
    description:
      "Keep your wealth safe for the next generation. We offer expert trust management and estate planning. Contact Truelegacy Services to start your plan now.",
    canonical: `${SITE_ORIGIN}/services/will`,
  },
  "/services/will": {
    title: "Will Drafting & Estate Planning Services | Truelegacy",
    description:
      "Protect your family's wealth with expert Will drafting services in India. Truelegacy helps Indian and NRI families plan asset distribution and succession.",
    h1: "Will Drafting & Estate Planning Services",
  },
  "/services/trust": {
    title: "Private Family Trust Services in India | Truelegacy",
    description:
      "Set up a private family trust with Truelegacy. Get expert guidance on trust formation, deed drafting, trusteeship and succession planning in India.",
    h1: "Private Family Trust Services in India",
  },
  "/why-choose-us": {
    title: "Why Choose True Legacy for Estate Planning?",
    description:
      "Choose Truelegacy for estate planning, Will drafting & private family trusts. Get personalised guidance to protect your family's wealth & secure your legacy.",
    h1: "Why Choose Us",
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
