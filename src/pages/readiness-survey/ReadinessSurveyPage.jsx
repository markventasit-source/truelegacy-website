import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  getReadinessSurveyQuestions,
  submitReadinessSurvey,
} from "../../services/readinessSurveyService";
import surveyIllustration from "../../assets/img/survey/Group 9.png";
import exitVector from "../../assets/img/survey/exitVector.svg";
import trueLegacyLogo from "../../assets/truelagacylogo.webp";
import backArrowIcon from "../../assets/img/survey/bx_arrow-back.svg";
import "../../styles/dm-sans.css";

const ReadinessSurveyPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showLeavePopup, setShowLeavePopup] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getReadinessSurveyQuestions();

        const list = Array.isArray(res?.data) ? res.data : res?.data?.data;
        const normalized = Array.isArray(list) ? list : [];

        if (mounted) {
          setQuestions(normalized);
          setCurrentIndex(0);
          setAnswers({});
        }
      } catch (e) {
        if (mounted) {
          setError(e?.message || "Failed to load questions");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const current = questions[currentIndex];

  const allAnswered = useMemo(() => {
    if (!Array.isArray(questions) || questions.length === 0) return false;
    return questions.every((q) => {
      const key = q?.key;
      return key && typeof answers[key] === "string" && answers[key].length > 0;
    });
  }, [questions, answers]);

  const canGoNext = Boolean(current?.key && answers[current.key]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      if (!allAnswered) {
        setError("Please answer all questions before submitting");
        return;
      }

      const payload = {
        answers,
      };

      const res = await submitReadinessSurvey(payload);
      const data = res?.data ?? res;

      sessionStorage.setItem(
        "readinessSurveyResult",
        JSON.stringify(data)
      );

      // Add 1-second loading delay before navigation
      setTimeout(() => {
        navigate("/readiness-survey/result", { state: data });
      }, 1000);
    } catch (e) {
      setError(e?.message || "Failed to submit survey");
    } finally {
      setTimeout(() => setSubmitting(false), 1000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#F6F2E6] px-4 py-10">
        <div className="mx-auto max-w-4xl text-sm text-gray-600">Loading survey...</div>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#F6F2E6] px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-md border bg-white p-4">
          <div className="text-sm text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-[#F6F2E6] md:px-4 md:py-6">
      {/* Header section - Responsive */}
      <div className="relative mx-auto flex w-full max-w-6xl justify-between px-4 pb-0 pt-1 md:px-0 md:pb-0 md:pt-[20px]">
        {/* Desktop Exit button - positioned absolutely */}
        <button
          type="button"
          onClick={() => setShowLeavePopup(true)}
          className="hidden md:block absolute left-[-20px] top-[20px] cursor-pointer rounded-md bg-[#FEFCF6] px-3 py-0.5 text-[11px] font-medium text-black shadow-sm transition-all hover:bg-gray-50 active:scale-95 leading-none h-5"
        >
          <span className="flex items-center gap-1 h-full">
            <img src={exitVector} alt="Exit" className="h-2.5 w-2.5" draggable={false}
  loading="lazy"
  decoding="async"
  />
            Exit
          </span>
        </button>

        {/* Logo - centered for both mobile and desktop */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-16 md:mt-8">
          <img
            src={trueLegacyLogo}
            alt="Truelegacy"
            width={500}
            height={112}
            className="w-[120px] h-auto object-contain md:w-[207px] md:h-[43px]"
            draggable={false}
            loading="lazy"
            decoding="async"
            />
        </div>

        {/* Mobile: X button in top right */}
        <button
          type="button"
          onClick={() => setShowLeavePopup(true)}
          className="flex md:hidden cursor-pointer h-10 w-10 items-center justify-center rounded-lg bg-[#FEFCF6] shadow-sm ml-auto mt-2"
        >
          <img src={exitVector} alt="Close" className="h-4 w-4" draggable={false}
  loading="lazy"
  decoding="async"
  />
        </button>

        {/* Desktop logo container - empty since logo is absolutely positioned */}
        <div className="hidden md:flex md:justify-center md:pt-0">
          {/* Logo moved to absolute position above */}
        </div>
      </div>

      <div className="flex w-full flex-grow flex-col items-center justify-start overflow-y-auto px-0 md:px-0 md:items-center md:overflow-visible md:justify-start md:pt-[80px]">
        <div className="hidden md:block h-0" />
        <div className="flex-1 md:hidden" />
        {/* Mobile Illustration - Visible above the card with equal spacing */}
        <div className="flex md:hidden w-full min-h-[150px] items-center justify-center pt-16 pb-6">
          <img
            src={surveyIllustration}
            alt="Survey"
            className="h-[150px] w-auto"
            draggable={false}
            loading="lazy"
            decoding="async"
            />
        </div>
        <div className="flex-1 md:hidden" />

        <div className="relative w-full min-h-[550px] h-auto flex flex-col mt-0 mx-auto md:mt-0 md:flex-none md:mx-auto md:w-[1046px] md:max-w-none bg-white p-6 pb-32 md:px-12 md:py-8 md:pt-4 md:h-[550px] md:min-h-0 shadow-[0_0_4px_rgba(244,213,126,0.25)] md:rounded-[2px]">
          {/* Fading Top Border / Figma Specs */}
          <div
            className="absolute left-0 right-0 top-0 h-[2px] w-full"
            style={{
              background: 'linear-gradient(to right, white 10%, rgba(255,219,120,0.9) 50%, rgba(255,219,120,0.9) 50%, white 90%)'
            }}
          />

          {error ? (
            <div className="mb-4 rounded-md border bg-white/70 p-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <div className="flex items-center justify-between">
            <div className="text-[14px] font-medium text-[#132F2C] opacity-50">
              {questions.length > 0 ? `${currentIndex + 1}/${questions.length}` : ""}
            </div>
          </div>

          <div className="mt-0 grid gap-4 md:gap-20 md:grid-cols-[200px_1fr] md:items-stretch md:min-h-[440px] md:mt-0">
            <div className="hidden md:flex md:h-full md:items-center md:justify-start">
              <img
                src={surveyIllustration}
                alt="Survey"
                className="h-[120px] w-auto md:h-[170px]"
                draggable={false}
                loading="lazy"
                decoding="async"
                />
            </div>

            <div className="flex h-full flex-col font-['DM_Sans'] md:self-stretch md:pt-2">
              <div className="min-h-[60px]">
                <div className="text-left text-[22px] font-medium leading-[1.1] text-[#132F2C] md:text-[28px] md:leading-[1.2]">
                  {current?.title || ""}
                </div>
              </div>

              <div className="mt-10 flex flex-grow flex-col md:mt-4 pb-16 md:pb-0">
                <div className="grid gap-5 md:gap-4">
                  {(current?.options || []).map((opt) => {
                    const selected = current?.key ? answers[current.key] === opt : false;
                    return (
                      <button
                        key={`${current?.key || "q"}-${opt}`}
                        type="button"
                        onClick={() => {
                          const key = current?.key;
                          if (!key) return;
                          setAnswers((prev) => ({ ...prev, [key]: opt }));
                        }}
                        className={
                          "flex w-full cursor-pointer items-center gap-[12px] md:gap-[20px] rounded-full border border-black/10 px-4 h-[48px] text-left transition-colors md:max-w-[600px] md:h-[54px] md:px-5 md:py-4" +
                          (selected
                            ? " border-[#132F2C] bg-white shadow-sm"
                            : " bg-white hover:bg-[#F6F2E6]/40 text-[#001412]/70")
                        }
                      >
                        <span
                          className={
                            "grid h-5 w-5 place-items-center rounded-full border" +
                            (selected
                              ? " border-[#132F2C]"
                              : " border-black/20")
                          }
                        >
                          {selected ? (
                            <span className="h-2.5 w-2.5 rounded-full bg-[#132F2C]" />
                          ) : null}
                        </span>
                        <span className={"text-[16px] font-normal leading-tight md:text-[18px]" + (selected ? " text-[#001412] font-medium" : "")}>
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-transparent absolute bottom-28 left-6 right-6 md:static md:mt-12 md:pb-2">
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 py-2 text-[16px] font-medium text-[#132F2C] transition-all hover:bg-gray-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 md:px-0 md:py-0 md:w-[127px] md:h-[42px]"
                  disabled={currentIndex === 0 || submitting}
                  onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                >
                  <img src={backArrowIcon} alt="Back" className="h-4 w-4 md:h-5 md:w-5" draggable={false}
  loading="lazy"
  decoding="async"
  />
                  Back
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#132F2C] px-10 py-2 text-[16px] font-medium text-white transition-all hover:bg-[#132F2C]/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 md:px-0 md:py-0 md:w-[127px] md:h-[42px] md:mr-20"
                    disabled={!canGoNext || submitting}
                    onClick={() =>
                      setCurrentIndex((i) => Math.min(i + 1, questions.length - 1))
                    }
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#132F2C] px-10 py-2 text-[16px] font-medium text-white transition-all hover:bg-[#132F2C]/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 md:px-0 md:py-0 md:w-[127px] md:h-[42px] md:mr-20"
                    disabled={!allAnswered || submitting}
                    onClick={handleSubmit}
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Figma Triangle Accents - Both sides for mobile */}
          <div className="pointer-events-none absolute bottom-12 right-10 w-[27px] h-[26px] md:bottom-4 md:right-4 md:w-8 md:h-8 bg-[#F4D57E]" style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }} />
        </div>
      </div>

      {showLeavePopup && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/75 backdrop-blur-lg"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLeavePopup(false);
          }}
        >
          <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl transition-all animate-in fade-in zoom-in duration-300">
            <h2 className="mb-2 text-xl font-semibold text-[#132F2C]">Leave this page?</h2>
            <p className="mb-8 text-gray-600">
              You have changes that aren't saved yet. If you go back now, you might lose them. Do you want to continue?
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowLeavePopup(false)}
                className="cursor-pointer rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-base font-medium text-[#132F2C] transition-colors hover:bg-gray-50"
              >
                Stay Here
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLeavePopup(false);
                  navigate("/");
                }}
                className="cursor-pointer rounded-lg bg-[#F4D57E] px-6 py-2.5 text-base font-medium text-[#132F2C] transition-colors hover:bg-[#ebcc74]"
              >
                Yes, Go Back
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ReadinessSurveyPage;
