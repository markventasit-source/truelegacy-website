import { useEffect } from "react";

const AnimatedPopup = ({ 
  open, 
  onClose, 
  children, 
  size = "md",
  showCloseButton = true,
  closeOnBackdrop = true 
}) => {
  // Handle ESC key
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Size variants
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-4xl"
  };

  if (!open) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 animate-fade-in`}
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div 
        className={`w-full ${sizeClasses[size]} rounded-xl bg-white text-[#132F2C] shadow-xl animate-scale-up`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 text-[#5A7371] hover:text-[#132F2C] text-xl leading-none transition-colors"
          >
            ×
          </button>
        )}
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AnimatedPopup;
