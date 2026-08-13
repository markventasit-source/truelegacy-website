import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SurveyConfirmModal = lazy(() => import("./SurveyConfirmModal"));

const AUTO_OPEN_STORAGE_KEY = "tl_survey_confirm_auto_shown";

const SurveyFloatingButton = ({
  openOnMount = false,
  iconSrc = "/survey-float.svg",
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(openOnMount);

  // Auto-open scheduling lives in SurveyFloatHost (keeps this chunk off the critical path).
  useEffect(() => {
    if (!openOnMount) return;
    try {
      sessionStorage.setItem(AUTO_OPEN_STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  }, [openOnMount]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="tl-survey-float fixed bottom-20 right-4 sm:right-6 z-[60] cursor-pointer rounded-full bg-transparent p-0 transition-all hover:scale-110 active:scale-95 md:top-[75%] md:bottom-auto md:right-4 md:-translate-y-1/2"
        aria-label="Open readiness survey"
      >
        <img
          src={iconSrc}
          alt="Readiness survey"
          width={68}
          height={68}
          className="block h-[60px] w-[60px] sm:h-[68px] sm:w-[68px] object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.22)]"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </button>

      {open && (
        <Suspense fallback={null}>
          <SurveyConfirmModal
            open={open}
            onClose={() => setOpen(false)}
            onConfirm={() => {
              setOpen(false);
              navigate("/readiness-survey");
            }}
          />
        </Suspense>
      )}
    </>
  );
};

export default SurveyFloatingButton;
