import { useLocation } from "react-router-dom";

const WHATSAPP_NUMBER = "917592912300";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const WhatsAppFloat = () => {
  const location = useLocation();
  const isSuccessionQuestions =
    location.pathname === "/succession/questions";

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={`tl-whatsapp-float fixed bottom-5 z-[70] transition-transform hover:scale-105 active:scale-95 sm:bottom-6 ${
        isSuccessionQuestions
          ? "left-5 right-auto bottom-16 sm:bottom-20 sm:left-6 sm:right-auto"
          : "right-5 sm:right-6"
      }`}
    >
      <img
        src="/whatsapp.webp"
        alt="WhatsApp"
        width={192}
        height={192}
        className="block h-[56px] w-[56px] object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.2)] sm:h-[64px] sm:w-[64px]"
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </a>
  );
};

export default WhatsAppFloat;
