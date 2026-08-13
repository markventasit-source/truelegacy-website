import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  DEFAULT_OG_IMAGE,
  GA_MEASUREMENT_ID,
  getBlogPageMeta,
  getPageMeta,
  normalizeShareImageUrl,
  SITE_ORIGIN,
} from "./pageMeta";

function upsertMeta(attr, key, content) {
  if (!content) return;

  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href) {
  if (!href) return;

  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function applyMeta(
  { title, description, robots, keywords, image, imageAlt, type },
  pathname
) {
  // Canonical / OG URL without trailing slash (including homepage).
  const canonicalPath = pathname.replace(/\/+$/, "") || "/";
  const url =
    canonicalPath === "/"
      ? SITE_ORIGIN
      : `${SITE_ORIGIN}${canonicalPath}`;

  const shareImage = normalizeShareImageUrl(image, DEFAULT_OG_IMAGE);
  const ogType = type || "website";

  document.title = title;
  upsertCanonical(url);
  upsertMeta("name", "robots", robots);
  upsertMeta("name", "googlebot", robots);
  upsertMeta("name", "description", description);
  if (keywords) {
    upsertMeta("name", "keywords", keywords);
  }

  upsertMeta("property", "og:type", ogType);
  upsertMeta("property", "og:site_name", "Truelegacy");
  upsertMeta("property", "og:title", title);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:url", url);
  upsertMeta("property", "og:image", shareImage);
  upsertMeta("property", "og:image:secure_url", shareImage);
  if (imageAlt) {
    upsertMeta("property", "og:image:alt", imageAlt);
  }

  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", title);
  upsertMeta("name", "twitter:description", description);
  upsertMeta("name", "twitter:url", url);
  upsertMeta("name", "twitter:image", shareImage);
  if (imageAlt) {
    upsertMeta("name", "twitter:image:alt", imageAlt);
  }

  if (typeof window.gtag === "function") {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: pathname,
      page_title: title,
    });
  }

  if (typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
}

/**
 * Sets document title + meta description (and matching Open Graph / Twitter tags)
 * based on the current route.
 */
export function usePageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    let cancelled = false;
    const path = pathname.replace(/\/+$/, "") || "/";
    const baseMeta = getPageMeta(pathname);
    const blogMatch = path.match(/^\/resources\/([^/]+)$/);

    if (blogMatch) {
      getBlogPageMeta(blogMatch[1]).then((blogMeta) => {
        if (cancelled) return;
        applyMeta(
          blogMeta
            ? { ...blogMeta, robots: baseMeta.robots, type: "article" }
            : { ...baseMeta, image: DEFAULT_OG_IMAGE },
          pathname
        );
      });
      return () => {
        cancelled = true;
      };
    }

    applyMeta({ ...baseMeta, image: baseMeta.image || DEFAULT_OG_IMAGE }, pathname);
    return undefined;
  }, [pathname]);
}
