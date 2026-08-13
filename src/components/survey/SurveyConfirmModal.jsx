import { useState } from 'react';
import bulletStar from "../../assets/img/survey/mingcute_star-fill.svg";
import surveyIllustration from "../../assets/img/survey/Group 10.webp";
import exitVector from "../../assets/img/survey/exitVector.svg";
import "../../styles/dm-sans.css";

const SurveyConfirmModal = ({ open, onConfirm, onClose }) => {
  const isOpen = open;

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
  };
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 transition-opacity duration-200 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className={`relative w-full max-w-[366px] overflow-hidden rounded-[10px] bg-gradient-to-b from-white to-[#F6F2E6] shadow-2xl min-h-[480px] md:h-[588px] md:w-[747px] md:max-w-none md:rounded-[10px] transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <img
          src={surveyIllustration}
          alt="Survey"
          className="pointer-events-none absolute bottom-0 right-0 z-0 h-[260px] w-auto select-none md:h-[640px]"
          draggable={false}
          loading="lazy"
          decoding="async"
          />

        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 z-20 grid h-5 w-5 cursor-pointer place-items-center bg-transparent transition-all duration-200 hover:opacity-70 active:scale-90 md:right-6 md:top-6"
          aria-label="Close"
        >
          <img
            src={exitVector}
            alt="Close"
            className="h-full w-full"
            draggable={false}
            loading="lazy"
            decoding="async"
            />
        </button>

        <div className="relative z-10 flex flex-col gap-5 p-6 pt-14 md:gap-6 md:p-14 md:pt-24">
          <div className="max-w-[480px] font-['DM_Sans']">
            <h2 className="text-[32px] font-medium leading-[1.1] tracking-[-0.01em] text-[#132F2C] md:text-[36px]">
              Are You Financially
              <span className="block mt-1">
                <span className="italic">Prepared</span>{" "}
                <span className="italic text-[#F4D57E]">for the Future?</span>
              </span>
            </h2>

            <p className="mt-6 text-[14px] font-normal leading-[1.2] tracking-[-0.01em] text-[#808080] md:mt-8 md:text-[16px] md:leading-[1.4]">
              We are conducting a confidential Wealth &amp; Succession Planning Survey
              for NRIs to understand how prepared families are in protecting and
              transferring their assets.
            </p>

            <div className="mt-6 space-y-3 text-[14px] font-normal leading-[1.3] tracking-[-0.01em] text-[#000000] md:mt-8 md:space-y-4 md:text-[18px]">
              <div className="flex items-center gap-3">
                <img src={bulletStar} alt="Bullet point" className="h-4 w-4 md:h-5 md:w-5" draggable={false}
  loading="lazy"
  decoding="async"
  />
                <span>It takes just 3–4 minutes.</span>
              </div>
              <div className="flex items-center gap-3">
                <img src={bulletStar} alt="Bullet point" className="h-4 w-4 md:h-5 md:w-5" draggable={false}
  loading="lazy"
  decoding="async"
  />
                <span>No personal details required.</span>
              </div>
            </div>

            <p className="mt-6 text-[14px] font-medium italic leading-[1] tracking-[-0.01em] text-[#132F2C] md:mt-8 md:text-[16px]">
              Get your preparedness score instantly!
            </p>

            <div className="mt-8 flex items-center gap-6 md:mt-10 md:gap-8">
              <button
                type="button"
                onClick={handleConfirm}
                className="h-[36px] w-[124px] cursor-pointer rounded-full bg-[#132F2C] px-4 py-2 text-[12px] font-medium leading-[1] text-white transition-all hover:bg-[#132F2C]/90 active:scale-95 md:h-[52px] md:w-auto md:px-10 md:py-0 md:text-[16px]"
              >
                Start the Survey
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="cursor-pointer text-[12px] font-medium leading-[1] text-[#132F2C] transition-all hover:opacity-70 active:scale-95 md:text-[16px]"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyConfirmModal;
