#!/usr/bin/env node
/**
 * Post-build prerender step.
 *
 * Writes `dist/<route>/index.html` for marketing pages + published blogs with
 * unique title/description/canonical/OG tags and crawlable body copy (H1 +
 * article text + internal links). Also regenerates `dist/sitemap.xml` so new
 * `/resources/:slug` posts are discoverable.
 */
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  PAGE_META_BY_PATH,
  SITE_ORIGIN,
  DEFAULT_OG_IMAGE,
  normalizeShareImageUrl,
} from "../src/seo/pageMeta.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT_DIR, "dist");
const DEFAULT_BLOG_DESCRIPTION =
  "Secure your family's future with expert succession planning and estate management services.";

const STATIC_SITEMAP_PATHS = [
  "/",
  "/succession",
  "/readiness-survey",
  "/why-choose-us",
  "/resources",
  "/articles-news-events",
  "/contact",
  "/services/will",
  "/services/trust",
  "/privacy-policy",
  "/terms-of-service",
];

async function loadEnv() {
  const env = { ...process.env };
  const envPath = path.join(ROOT_DIR, ".env");
  try {
    const raw = await readFile(envPath, "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }
  } catch {
    // no local .env — rely on real process.env (e.g. CI secrets)
  }
  return env;
}

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const markdownToPlainText = (md) =>
  String(md || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/[*_~>|]+/g, " ")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const replaceMeta = (html, attrName, attrValue, newContent) => {
  const safe = escapeHtml(newContent);
  const regex = new RegExp(
    `<meta[^>]*${attrName}=["']${attrValue}["'][^>]*>`,
    "i"
  );
  if (regex.test(html)) {
    return html.replace(
      regex,
      `<meta ${attrName}="${attrValue}" content="${safe}" />`
    );
  }
  return html.replace(
    "</head>",
    `<meta ${attrName}="${attrValue}" content="${safe}" />\n</head>`
  );
};

const replaceCanonical = (html, href) => {
  const safe = escapeHtml(href);
  if (/<link[^>]*rel=["']canonical["'][^>]*>/i.test(html)) {
    return html.replace(
      /<link[^>]*rel=["']canonical["'][^>]*>/i,
      `<link rel="canonical" href="${safe}" />`
    );
  }
  return html.replace(
    "</head>",
    `<link rel="canonical" href="${safe}" />\n</head>`
  );
};

const SEO_OUTLINK_PATHS = [
  ["/", "Home"],
  ["/services/will", "Will drafting services"],
  ["/services/trust", "Private family trust services"],
  ["/succession", "Legal heir identification tool"],
  ["/why-choose-us", "Why choose Truelegacy"],
  ["/resources", "Guides on succession laws & estate planning"],
  ["/articles-news-events", "Articles, news & events"],
  ["/readiness-survey", "Readiness survey"],
  ["/contact", "Contact Truelegacy"],
  ["/privacy-policy", "Privacy policy"],
  ["/terms-of-service", "Terms of service"],
];

const siteNavLinksHtml = () =>
  SEO_OUTLINK_PATHS.map(([pathName, label]) => {
    const href = pathName === "/" ? SITE_ORIGIN : `${SITE_ORIGIN}${pathName}`;
    return `          <li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></li>`;
  }).join("\n");

const wrapSeoMain = (innerHtml) => `
    <!--
      Static SEO content for crawlers / no-JS tools.
      Visually hidden via CSS; removed from the DOM when React mounts.
    -->
    <main id="seo-static-content">
${innerHtml}
    </main>
`;

const seoImageHtml = (image, imageAlt) => {
  const src = normalizeShareImageUrl(image, DEFAULT_OG_IMAGE);
  if (!src) return "";
  return `      <img src="${escapeHtml(src)}" alt="${escapeHtml(imageAlt || "Truelegacy")}" width="1200" height="630" loading="eager" decoding="async" />`;
};

/** Crawlable body for marketing pages. */
const buildSeoOutlinksBlock = ({
  title,
  description,
  resourceLinks = [],
  image,
  imageAlt,
}) => {
  const resourceList =
    resourceLinks.length > 0
      ? `
      <h2>Guides &amp; articles</h2>
      <nav aria-label="Resource articles">
        <ul>
${resourceLinks
  .map(
    ({ href, label }) =>
      `          <li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></li>`
  )
  .join("\n")}
        </ul>
      </nav>`
      : "";

  return wrapSeoMain(`      <h1>${escapeHtml(title)}</h1>
${seoImageHtml(image, imageAlt || title)}
      <p>${escapeHtml(description)}</p>
      <p>
        Truelegacy helps individuals, families, business owners, and NRIs with will drafting,
        private family trusts, legal heir identification, and succession planning across India
        and cross-border estates. Our advisors combine clear legal guidance with practical
        planning so you can protect assets and pass them on without unnecessary conflict or delay.
      </p>
      <h2>How Truelegacy Supports Your Estate Plan</h2>
      <p>
        From a first consultation through document drafting and ongoing trust management, we
        focus on clarity, compliance, and family harmony. Explore our services, readiness tools,
        and guides to take the next step with confidence.
      </p>
      <ul>
        <li>Will drafting and estate planning for Indian and NRI families</li>
        <li>Private family trust formation, trusteeship, and succession planning</li>
        <li>Legal heir identification and readiness assessments</li>
        <li>Guides on succession laws and wealth transfer</li>
      </ul>${resourceList}
      <h2>Explore Truelegacy</h2>
      <nav aria-label="Primary site links">
        <ul>
${siteNavLinksHtml()}
        </ul>
      </nav>
      <h2>Speak With Our Team</h2>
      <p>
        Ready to protect your family's future?
        <a href="${escapeHtml(`${SITE_ORIGIN}/contact`)}">Schedule a consultation</a>
        or email
        <a href="mailto:info@truelegacy.in">info@truelegacy.in</a>
        / call
        <a href="tel:+917592912300">+91-7592912300</a>.
      </p>`);
};

/** Unique crawlable article body so Google does not treat every blog as a near-duplicate. */
const buildBlogSeoBlock = ({
  title,
  description,
  articleText,
  relatedLinks = [],
  faqs = [],
  image,
  imageAlt,
}) => {
  const paragraphs = String(articleText || "")
    .split(/(?<=\.)\s+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 24);

  const bodyHtml =
    paragraphs.length > 0
      ? paragraphs.map((p) => `      <p>${escapeHtml(p)}</p>`).join("\n")
      : `      <p>${escapeHtml(description)}</p>`;

  const related =
    relatedLinks.length > 0
      ? `
      <h2>Related guides</h2>
      <ul>
${relatedLinks
  .map(
    ({ href, label }) =>
      `        <li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></li>`
  )
  .join("\n")}
      </ul>`
      : "";

  const faqItems = Array.isArray(faqs)
    ? faqs.filter((f) => f?.question && f?.answer)
    : [];
  const faqHtml =
    faqItems.length > 0
      ? `
      <h2>Frequently asked questions</h2>
      <dl>
${faqItems
  .map(
    (f) => `        <dt>${escapeHtml(f.question)}</dt>
        <dd>${escapeHtml(f.answer)}</dd>`
  )
  .join("\n")}
      </dl>`
      : "";

  return wrapSeoMain(`      <article>
      <h1>${escapeHtml(title)}</h1>
${seoImageHtml(image, imageAlt || title)}
      <p>${escapeHtml(description)}</p>
${bodyHtml}
      </article>${faqHtml}${related}
      <h2>Explore Truelegacy</h2>
      <nav aria-label="Primary site links">
        <ul>
${siteNavLinksHtml()}
        </ul>
      </nav>
      <p>
        <a href="${escapeHtml(`${SITE_ORIGIN}/resources`)}">Back to all resources</a>
        ·
        <a href="${escapeHtml(`${SITE_ORIGIN}/contact`)}">Schedule a consultation</a>
      </p>`);
};

const buildArticleJsonLd = ({
  title,
  description,
  image,
  url,
  datePublished,
  dateModified,
  faqs = [],
}) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: [image],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: {
      "@type": "Organization",
      name: "Truelegacy",
      url: SITE_ORIGIN,
    },
    publisher: {
      "@type": "Organization",
      name: "Truelegacy",
      url: SITE_ORIGIN,
      logo: {
        "@type": "ImageObject",
        url: DEFAULT_OG_IMAGE,
      },
    },
  };
  if (datePublished) data.datePublished = datePublished;
  if (dateModified) data.dateModified = dateModified;

  const faqItems = Array.isArray(faqs)
    ? faqs.filter((f) => f?.question && f?.answer)
    : [];
  const scripts = [
    `<script type="application/ld+json">${JSON.stringify(data)}</script>`,
  ];
  if (faqItems.length > 0) {
    scripts.push(
      `<script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
          },
        })),
      })}</script>`
    );
  }
  return scripts.join("\n");
};

const extractBlogPlainText = (blog) => {
  const chunks = [
    blog?.dark_content,
    blog?.faded_content,
    ...(Array.isArray(blog?.sub_sections)
      ? blog.sub_sections.map((s) =>
          [s?.title, s?.content].filter(Boolean).join(". ")
        )
      : []),
  ];
  const text = markdownToPlainText(chunks.filter(Boolean).join("\n\n"));
  // Cap raw HTML size while keeping enough unique words for indexing.
  return text.slice(0, 6000);
};

const injectPageSeo = (
  html,
  {
    title,
    description,
    keywords,
    image,
    url,
    type,
    seoBlock,
    jsonLd,
  }
) => {
  let next = html;
  const shareImage = normalizeShareImageUrl(image, DEFAULT_OG_IMAGE);
  const ogType = type || "website";

  if (/<title>.*?<\/title>/i.test(next)) {
    next = next.replace(
      /<title>.*?<\/title>/i,
      `<title>${escapeHtml(title)}</title>`
    );
  } else {
    next = next.replace(
      "</head>",
      `<title>${escapeHtml(title)}</title>\n</head>`
    );
  }

  next = replaceCanonical(next, url);
  next = replaceMeta(next, "name", "description", description);
  next = replaceMeta(next, "property", "og:type", ogType);
  next = replaceMeta(next, "property", "og:site_name", "Truelegacy");
  next = replaceMeta(next, "property", "og:title", title);
  next = replaceMeta(next, "property", "og:description", description);
  next = replaceMeta(next, "property", "og:image", shareImage);
  next = replaceMeta(next, "property", "og:image:secure_url", shareImage);
  next = replaceMeta(next, "property", "og:url", url);
  next = replaceMeta(next, "name", "twitter:card", "summary_large_image");
  next = replaceMeta(next, "name", "twitter:title", title);
  next = replaceMeta(next, "name", "twitter:description", description);
  next = replaceMeta(next, "name", "twitter:image", shareImage);
  next = replaceMeta(next, "name", "twitter:url", url);
  if (keywords) {
    next = replaceMeta(next, "name", "keywords", keywords);
  }

  if (jsonLd) {
    next = next.replace(/<\/head>/i, `    ${jsonLd}\n  </head>`);
  }

  if (!/<main id="seo-static-content">/i.test(next)) {
    const block =
      seoBlock || buildSeoOutlinksBlock({ title, description });
    if (/<div id="root"><\/div>/i.test(next)) {
      next = next.replace(
        /<div id="root"><\/div>/i,
        `${block}\n    <div id="root"></div>`
      );
    } else {
      next = next.replace(/<\/body>/i, `${block}\n</body>`);
    }
  }

  return next;
};

async function writeRouteHtml(routePath, html) {
  const relDir = routePath.replace(/^\/+/, "").replace(/\/+$/, "");
  const outDir = path.join(DIST_DIR, relDir);
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "index.html"), html, "utf8");
}

function toSitemapLastmod(value) {
  const d = value ? new Date(value) : new Date();
  if (Number.isNaN(d.getTime())) return new Date().toISOString();
  return d.toISOString();
}

async function writeSitemap(blogs) {
  const now = new Date().toISOString();
  const urls = [];

  for (const routePath of STATIC_SITEMAP_PATHS) {
    const loc =
      routePath === "/" ? SITE_ORIGIN : `${SITE_ORIGIN}${routePath}`;
    const priority =
      routePath === "/" || routePath === "/resources" || routePath === "/contact"
        ? "1.0"
        : "0.9";
    urls.push({ loc, lastmod: now, priority });
  }

  for (const blog of blogs) {
    if (!blog?.slug) continue;
    urls.push({
      loc: `${SITE_ORIGIN}/resources/${blog.slug}`,
      lastmod: toSitemapLastmod(blog.updatedAt || blog.createdAt),
      priority: "0.8",
    });
  }

  const body = urls
    .map(
      ({ loc, lastmod, priority }) => `  <url>
    <loc>${escapeHtml(loc)}</loc>
    <lastmod>${escapeHtml(lastmod)}</lastmod>
    <priority>${priority}</priority>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
  await writeFile(path.join(DIST_DIR, "sitemap.xml"), xml, "utf8");
  // Do NOT write back to public/sitemap.xml — that dirties the server
  // checkout and blocks the next `git pull` in CI deploy.
  return urls.length;
}

async function fetchAllPublishedBlogs(env) {
  const rawBase =
    env.VITE_APP_API_URL || "https://api.truelegacy.in/api/v1/";
  const base = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;
  const apiKey = env.VITE_APP_API_KEY;

  if (!apiKey) {
    throw new Error("VITE_APP_API_KEY not set — cannot prerender blog pages");
  }

  const blogs = [];
  const limit = 100;
  let page = 1;

  while (page <= 20) {
    const url = `${base}pages/blogs?status=published&limit=${limit}&page_no=${page}`;
    const res = await fetch(url, {
      headers: {
        "x-api-key": apiKey,
        "ngrok-skip-browser-warning": "true",
      },
    });
    if (!res.ok) {
      throw new Error(`Blog fetch failed: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    const pageBlogs = Array.isArray(json?.data) ? json.data : [];
    blogs.push(...pageBlogs);
    if (pageBlogs.length < limit) break;
    page += 1;
  }

  return blogs;
}

async function main() {
  try {
    await access(DIST_DIR);
  } catch {
    console.error(
      `[prerender] dist/ not found at ${DIST_DIR}. Run "vite build" first.`
    );
    process.exitCode = 1;
    return;
  }

  const baseHtmlPath = path.join(DIST_DIR, "index.html");
  const baseHtml = await readFile(baseHtmlPath, "utf8");
  const env = await loadEnv();

  // IMPORTANT: match the <main> id only — a leading <!--[\s\S]*?...--> regex is too
  // greedy and can wipe the entire <head> from an earlier comment.
  const stripHomeSeoBlock = (html) =>
    html
      .replace(
        /\s*<!--\s*\n?\s*Static SEO content for crawlers[\s\S]*?-->\s*/i,
        "\n    "
      )
      .replace(/<main id="seo-static-content">[\s\S]*?<\/main>\s*/i, "");

  let blogs = [];
  try {
    blogs = await fetchAllPublishedBlogs(env);
    if (blogs.length === 0) {
      throw new Error("API returned 0 published blogs");
    }
  } catch (err) {
    console.error(`[prerender] blog fetch failed: ${err.message}`);
    process.exitCode = 1;
    return;
  }

  const resourceLinks = blogs
    .filter((b) => b?.slug)
    .map((b) => ({
      href: `${SITE_ORIGIN}/resources/${b.slug}`,
      label: b.title || b.meta_title || b.slug,
    }));

  const listingPaths = new Set(["/resources", "/articles-news-events"]);

  let staticCount = 0;
  for (const [routePath, meta] of Object.entries(PAGE_META_BY_PATH)) {
    if (routePath === "/") continue;
    const url = `${SITE_ORIGIN}${routePath.replace(/\/+$/, "") || ""}`;
    const seoBlock = buildSeoOutlinksBlock({
      title: meta.title,
      description: meta.description,
      resourceLinks: listingPaths.has(routePath) ? resourceLinks : [],
      image: DEFAULT_OG_IMAGE,
      imageAlt: meta.title,
    });
    const html = injectPageSeo(stripHomeSeoBlock(baseHtml), {
      title: meta.title,
      description: meta.description,
      keywords: "",
      image: DEFAULT_OG_IMAGE,
      url: url || SITE_ORIGIN,
      seoBlock,
    });
    await writeRouteHtml(routePath, html);
    staticCount += 1;
  }
  console.log(`[prerender] wrote ${staticCount} static marketing pages.`);

  let blogCount = 0;
  for (const blog of blogs) {
    if (!blog?.slug) continue;
    const title = String(blog.meta_title || "").trim() || `${blog.title} | Truelegacy`;
    const description = String(
      blog.meta_description || DEFAULT_BLOG_DESCRIPTION
    )
      .trim()
      .slice(0, 300);
    const keywords = blog.meta_keywords || "";
    const image = normalizeShareImageUrl(blog.image, DEFAULT_OG_IMAGE);
    const url = `${SITE_ORIGIN}/resources/${blog.slug}`;
    const articleText = extractBlogPlainText(blog);

    const relatedIds = Array.isArray(blog.related_blogs)
      ? blog.related_blogs.map((r) => (typeof r === "string" ? r : r?._id || r?.id))
      : [];
    const relatedLinks = blogs
      .filter(
        (b) =>
          b?.slug &&
          b.slug !== blog.slug &&
          (relatedIds.length === 0 ||
            relatedIds.includes(b._id) ||
            relatedIds.includes(String(b._id)))
      )
      .slice(0, relatedIds.length > 0 ? 6 : 8)
      .map((b) => ({
        href: `${SITE_ORIGIN}/resources/${b.slug}`,
        label: b.title || b.meta_title || b.slug,
      }));

    const imageAlt = String(blog.image_alt || blog.title || title).trim();
    const seoBlock = buildBlogSeoBlock({
      title,
      description,
      articleText,
      relatedLinks,
      faqs: blog.faqs,
      image,
      imageAlt,
    });
    const jsonLd = buildArticleJsonLd({
      title,
      description,
      image,
      url,
      datePublished: blog.createdAt,
      dateModified: blog.updatedAt || blog.createdAt,
      faqs: blog.faqs,
    });

    const html = injectPageSeo(stripHomeSeoBlock(baseHtml), {
      title,
      description,
      keywords,
      image,
      url,
      type: "article",
      seoBlock,
      jsonLd,
    });
    await writeRouteHtml(`/resources/${blog.slug}`, html);
    blogCount += 1;
  }
  console.log(`[prerender] wrote ${blogCount} blog pages.`);

  const sitemapCount = await writeSitemap(blogs);
  console.log(`[prerender] wrote sitemap.xml with ${sitemapCount} URLs.`);

  console.log(
    `[prerender] done — ${staticCount + blogCount} route(s) prerendered with correct SEO tags.`
  );
}

main().catch((err) => {
  console.error("[prerender] failed:", err);
  process.exitCode = 1;
});
