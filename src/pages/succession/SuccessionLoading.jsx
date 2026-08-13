import { useState } from "react";

const SuccessionLoading = ({ error, onClose }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <div
        className={`w-16 h-16 rounded-full mb-6 ${"bg-red-500 animate-bounce"}`}
      ></div>
      {!error ? (
        <p className="lg:text-3xl font-medium text-primary text-center leading-[120%]">
          We’re Preparing Your <br /> Succession Summary
        </p>
      ) : (
        <div className="text-center">
          <p className="lg:text-2xl font-semibold text-red-600 mb-2">
            Something Went Wrong
          </p>
          <p className="text-gray-600 max-w-md text-sm mx-auto">
            {error?.message ||
              "An unexpected error occurred while generating your succession summary."}
          </p>
        </div>
      )}

      <button
        onClick={() => {
          setVisible(false);
          onClose?.();
        }}
        className="absolute top-6 right-6 text-sm bg-gray-100 px-3 py-1.5 rounded-md text-gray-700 hover:bg-gray-200 transition"
      >
        Close ✕
      </button>
    </div>
  );
};

export default SuccessionLoading;
