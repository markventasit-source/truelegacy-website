import { Outlet, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import WhatsAppFloat from "../components/WhatsAppFloat";
import { usePageMeta } from "../seo/usePageMeta";

const Footer = lazy(() => import("../components/Footer"));

const scrollToTopSmooth = () => {
  if (typeof window === "undefined") return;

  const prefersReducedMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  )?.matches;
  if (prefersReducedMotion) {
    window.scrollTo(0, 0);
    return;
  }

  const startY = window.scrollY || window.pageYOffset || 0;
  if (startY <= 0) return;

  const duration = 800;
  const startTime = performance.now();
  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const tick = (now) => {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / duration);
    const eased = easeInOutCubic(t);
    window.scrollTo(0, Math.round(startY * (1 - eased)));
    if (t < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const RootLayout = () => {
  const location = useLocation();
  const [showFooter, setShowFooter] = useState(false);
  usePageMeta();
  const isServicesPage = location.pathname.startsWith("/services");
  const isSuccessionFlow =
    location.pathname === "/signin" || location.pathname.startsWith("/succession");
  const isReadinessFlow = location.pathname.startsWith("/readiness-survey");

  useEffect(() => {
    if (location.hash) return;
    scrollToTopSmooth();
  }, [location.pathname]);

  // Static prerender HTML includes #seo-static-content for crawlers (H1 / word count).
  // Remove it once React owns the page so users never keep a duplicate visually-hidden main.
  useEffect(() => {
    document.getElementById("seo-static-content")?.remove();
  }, [location.pathname]);

  useEffect(() => {
    if (isSuccessionFlow || isReadinessFlow) return;

    // Footer is non-critical — only fetch after the user scrolls down, or
    // as a long fallback. Do NOT use requestIdleCallback (fires too early
    // in Lighthouse and re-chains Footer onto the entry critical path).
    const show = () => setShowFooter(true);
    const onScroll = () => {
      if (window.scrollY < 240) return;
      const doc = document.documentElement;
      const remaining =
        doc.scrollHeight - (window.scrollY + window.innerHeight);
      if (remaining < 1200) show();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    const timer = window.setTimeout(show, 12000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, [isSuccessionFlow, isReadinessFlow]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {!isServicesPage && !isSuccessionFlow && !isReadinessFlow && <Navbar />}
      <main className={isSuccessionFlow || isReadinessFlow ? "flex-1" : "flex-1 pb-8"}>
        <Outlet />
      </main>
      {!isSuccessionFlow && !isReadinessFlow && showFooter && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
      <WhatsAppFloat />
    </div>
  );
};

export default RootLayout;
