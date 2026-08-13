import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import axiosInstance from "../../api/axiosIntercepter";
import trueLegacyLogo from "../../assets/truelagacylogo.webp";
import excellentImg from "../../assets/img/survey/excellent.png";
import goodImg from "../../assets/img/survey/good.png";
import averageImg from "../../assets/img/survey/average.png";
import limitedImg from "../../assets/img/survey/limited.png";
import pricingHeadImg from "../../assets/img/survey/Pricing Head.png";
import pricingHeadMobileImg from "../../assets/img/survey/Pricing Headmobile.png";
import downloadIcon from "../../assets/img/survey/Icon.svg";
import backArrowIcon from "../../assets/img/survey/bx_arrow-back.svg";
import mobileCloseIcon from "../../assets/img/survey/Frame 2147226070.svg";
import RequestDialog from "../../components/home/RequestDialog";
import "../../styles/dm-sans.css";

const SurveyResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [showLeavePopup, setShowLeavePopup] = useState(false);

  const data = useMemo(() => {
    if (location.state) return location.state;
    const stored = sessionStorage.getItem("readinessSurveyResult");
    return stored ? JSON.parse(stored) : null;
  }, [location.state]);

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-md border bg-white p-4">
          <div className="text-sm text-gray-600">No survey result found.</div>
          <button
            type="button"
            className="mt-4 rounded-md bg-black px-4 py-2 text-sm text-white"
            onClick={() => navigate("/readiness-survey")}
          >
            Start Survey
          </button>
        </div>
      </div>
    );
  }

  const score = data?.totalScore ?? data?.total_score ?? data?.totalScore;
  const rank = data?.rank ?? data?.ranking;

  const interpretation = data?.interpretation_text || data?.interpretationText;

  const gaugeImage = useMemo(() => {
    const r = typeof rank === "string" ? rank.toLowerCase() : "";
    if (r.includes("excellent")) return excellentImg;
    if (r.includes("good")) return goodImg;
    if (r.includes("average")) return averageImg;
    if (r.includes("limited")) return limitedImg;
    return excellentImg;
  }, [rank]);

  const handleDownloadPdf = async () => {
    try {
      const response = await axiosInstance.get('/readiness-survey/download');
      const result = response.data;

      if (result.data && result.data.download_url) {
        const downloadUrl = result.data.download_url;
        const fileName = 'succession-planning-guide.pdf';
        
        // Safari-specific download handling
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        
        if (isSafari) {
          // Method 1: Try direct fetch and blob download for Safari
          try {
            const fileResponse = await fetch(downloadUrl);
            const blob = await fileResponse.blob();
            
            // Create blob URL and download
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up blob URL
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
            
            return;
          } catch (blobError) {
            console.warn('Blob method failed, trying direct link:', blobError);
          }
          
          // Method 2: Fallback to window.location for Safari
          try {
            window.location.href = downloadUrl;
            return;
          } catch (locationError) {
            console.warn('Window.location method failed:', locationError);
          }
        }
        
        // Method 3: Standard method for other browsers
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.download = fileName;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
      } else {
        console.error("No download URL received");
        // Fallback: try to open in new tab
        window.open(`${apiBaseUrl}/readiness-survey/download`, '_blank');
      }
    } catch (error) {
      console.error("Failed to get download URL:", error);
      // Final fallback
      window.open(`${import.meta.env.VITE_APP_API_URL}/readiness-survey/download`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6 animate-fade-in">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between">
        <button
          type="button"
          onClick={() => setShowLeavePopup(true)}
          className="hidden items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-[#132F2C] md:inline-flex"
        >
          <img src={backArrowIcon} alt="Back" className="h-5 w-5" draggable={false}
  loading="lazy"
  decoding="async"
  />
          Back
        </button>
        <div className="absolute left-1/2 top-1/2 mt-8 -translate-x-1/2 -translate-y-1/2">
          <img
            src={trueLegacyLogo}
            alt="Truelegacy"
            width={500}
            height={112}
            className="w-[207px] h-[43px] object-contain"
            draggable={false}
            loading="lazy"
            decoding="async"
            />
        </div>
        <button
          type="button"
          className="absolute right-0 top-0 inline-flex h-10 w-10 items-center justify-center rounded-[6px] bg-white/70 md:hidden"
          onClick={() => setShowLeavePopup(true)}
          aria-label="Close"
        >
          <img src={mobileCloseIcon} alt="Close" className="h-10 w-10" draggable={false}
  loading="lazy"
  decoding="async"
  />
        </button>
        <div className="hidden w-[64px] md:block" />
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl justify-center">
        <div className="w-full max-w-[1127px] rounded-[10px] bg-white px-3 py-10 text-center md:px-6">
          <div className="whitespace-nowrap font-['DM_Sans'] text-[28px] font-semibold leading-[1] text-black md:text-[36px] md:text-[#132F2C] animate-fade-in-delay">
            The survey is complete!
          </div>
          <div className="mt-2 mb-6 font-['DM_Sans'] text-[22px] font-medium leading-[1] text-[#132F2C] md:text-[28px] animate-fade-in-delay-slow">
            Thank you for participating!
          </div>

          <div className="mt-6 flex items-center justify-center">
            <img
              src={gaugeImage}
              alt={rank ? `${rank} indicator` : "Survey indicator"}
              className="h-auto w-[300px] md:w-[480px] animate-fade-in-delay"
              draggable={false}
              loading="lazy"
              decoding="async"
              />
          </div>

          {(rank || interpretation) ? (
            <div className="mx-auto mt-5 h-[439px] w-full max-w-[345px] rounded-[30px] bg-[#F7F4E8] p-[36px] text-center md:h-[287px] md:w-full md:max-w-[1127px] md:px-[36px] md:py-[36px]">
              <div className="mx-auto w-full max-w-[273px] font-['DM_Sans'] text-[24px] font-semibold leading-[23px] text-[#088E13] md:max-w-[1055px] md:text-[32px] md:leading-[23px]">
                {rank ? `${rank} Planning!` : ""}
              </div>
              <div className="mx-auto mt-[10px] w-full max-w-[273px] font-['DM_Sans'] text-[14px] font-medium leading-[140%] text-[#132F2C] md:mt-[18px] md:max-w-[1055px] md:text-[20px]">
                {interpretation || ""}
              </div>
            </div>
          ) : null}

          {/* Mobile download card (exact 350x392) */}
          <div className="mx-auto mt-10 h-[392px] w-full max-w-[350px] rounded-[30px] bg-[#132F2C] p-[15px] text-left shadow-sm md:hidden">
            <div className="h-full w-full rounded-[24px] bg-[#132F2C]">
              <div className="w-full overflow-hidden rounded-[20px]">
                <img
                  src={pricingHeadMobileImg}
                  alt="Succession Planning"
                  className="h-auto w-full object-cover"
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  />
              </div>

              <div className="mt-[30px] px-[6px] font-['DM_Sans'] text-[14px] font-normal leading-[120%] text-[#EFF6FF] text-center md:text-left">
                Want to know why we chose those specific questions as part of our survey? Download our FREE Succession Planning Guide to find out how each question plays a key role in your Succession Planning journey.
              </div>

              <div className="mt-[30px] flex justify-center px-[6px]">
                <button
                  type="button"
                  className="inline-flex h-[48px] w-[202px] cursor-pointer items-center justify-between rounded-[40px] bg-[#F4D57E] pl-6 pr-3 font-['DM_Sans'] text-[16px] font-medium leading-[25.2px] text-[#132F2C] shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md active:translate-y-0 active:scale-[0.98]"
                  onClick={handleDownloadPdf}
                  style={{ letterSpacing: "-1px" }}
                >
                  <span>Click to Download</span>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#132F2C]">
                    <img src={downloadIcon} alt="Download" className="h-6 w-6" draggable={false}
  loading="lazy"
  decoding="async"
  />
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop download card (unchanged) */}
          <div className="mx-auto mt-10 hidden w-full rounded-[22px] bg-[#132F2C] p-5 text-left shadow-sm md:block md:h-[306px] md:w-[1127px] md:rounded-[30px] md:p-0">
            <div className="grid h-full md:grid-cols-[490px_1fr] md:gap-0 md:items-start">
              <div className="relative h-full">
                <div className="absolute left-[15px] top-[15px]">
                  <div className="h-[276.2px] w-[440px] overflow-hidden rounded-[17px]">
                    <img
                      src={pricingHeadImg}
                      alt="Succession Planning"
                      className="h-full w-full object-contain"
                      draggable={false}
                      loading="lazy"
                      decoding="async"
                      />
                  </div>
                </div>
              </div>

              <div className="relative h-full">
                <div className="flex h-full flex-col justify-center px-[14px]">
                  <div className="max-w-[599px] font-['DM_Sans'] text-[18px] font-normal leading-[25.2px] text-[#EFF6FF]">
                    Want to know why we chose those specific questions as part of our survey? Download our FREE Succession Planning Guide to find out how each question plays a key role in your Succession Planning journey.
                  </div>

                  <div className="mt-6 flex justify-start">
                    <button
                      type="button"
                      className="group inline-flex cursor-pointer items-center gap-4 rounded-full bg-[#F4D57E] px-8 py-3 font-['DM_Sans'] text-[18px] font-medium leading-[25.2px] text-[#132F2C] shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md active:translate-y-0 active:scale-[0.98]"
                      onClick={handleDownloadPdf}
                      style={{ letterSpacing: "-1px" }}
                    >
                      Click to Download
                      <span className="inline-flex h-10 w-10 items-center justify-center">
                        <img src={downloadIcon} alt="Download" className="h-10 w-10" draggable={false}
  loading="lazy"
  decoding="async"
  />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-12 w-full max-w-[1127px] text-center">
            <div className="font-['DM_Sans'] text-[14px] font-medium leading-[120%] text-[#154528] md:text-[18px] md:leading-[25.2px]">
              Interested in exploring tailored solutions for your wealth and succession planning?
            </div>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                className="inline-flex h-[48px] w-[240px] cursor-pointer items-center justify-center rounded-[66px] border border-[#132F2C] bg-white px-8 py-[14px] font-['DM_Sans'] text-[16px] font-medium leading-[1] text-[#132F2C] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-sm active:translate-y-0 active:scale-[0.98] md:h-[52px]"
                onClick={() => setIsCallbackOpen(true)}
              >
                Request a callback
              </button>
            </div>
          </div>
        </div>
      </div>

      <RequestDialog
        open={isCallbackOpen}
        title="Call Back Request"
        isSchedule={false}
        onClose={() => setIsCallbackOpen(false)}
      />

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
              Are you sure you want to leave the survey results page?
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
                Yes, Leave
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default SurveyResultPage;
