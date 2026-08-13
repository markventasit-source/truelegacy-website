import { lazy, Suspense, useEffect, useState } from "react";

/**
 * Always paints the float icon immediately (public SVG — no JS chunk).
 * SurveyFloatingButton (modal logic) loads ONLY on click, or after the
 * auto-open delay — never during the LCP critical window.
 */
const SurveyFloatingButton = lazy(() => import("./SurveyFloatingButton"));

const ICON = "/survey-float.svg";
const AUTO_OPEN_DELAY_MS = 5500;
const AUTO_OPEN_STORAGE_KEY = "tl_survey_confirm_auto_shown";
const BTN_CLASS =
  "tl-survey-float fixed bottom-20 right-4 sm:right-6 z-[60] cursor-pointer rounded-full bg-transparent p-0 transition-all hover:scale-110 active:scale-95 md:top-[75%] md:bottom-auto md:right-4 md:-translate-y-1/2";

const FloatIconButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={BTN_CLASS}
    aria-label="Open readiness survey"
  >
    <img
      src={ICON}
      alt="Readiness survey"
      width={68}
      height={68}
      className="block h-[60px] w-[60px] sm:h-[68px] sm:w-[68px] object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.22)]"
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  </button>
);

const SurveyFloatHost = () => {
  const [hydrate, setHydrate] = useState(false);
  const [openOnMount, setOpenOnMount] = useState(false);

  // Auto-open modal once per session — well after LCP (not on the critical path).
  useEffect(() => {
    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem(AUTO_OPEN_STORAGE_KEY) === "1";
    } catch {
      alreadyShown = false;
    }
    if (alreadyShown) return;

    const timer = window.setTimeout(() => {
      setOpenOnMount(true);
      setHydrate(true);
    }, AUTO_OPEN_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  const requestHydrate = (open) => {
    if (open) setOpenOnMount(true);
    setHydrate(true);
  };

  if (!hydrate) {
    return <FloatIconButton onClick={() => requestHydrate(true)} />;
  }

  return (
    <Suspense fallback={<FloatIconButton onClick={() => requestHydrate(true)} />}>
      <SurveyFloatingButton openOnMount={openOnMount} iconSrc={ICON} />
    </Suspense>
  );
};

export default SurveyFloatHost;
