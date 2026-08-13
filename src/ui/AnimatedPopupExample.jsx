import { useState } from "react";
import AnimatedPopup from "./AnimatedPopup";

// Example of how to use AnimatedPopup in any component
const AnimatedPopupExample = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div>
      {/* Button to trigger popup */}
      <button
        onClick={() => setIsPopupOpen(true)}
        className="px-6 py-3 bg-[#132F2C] text-white rounded-lg hover:bg-[#0D241E] transition-colors"
      >
        Open Popup
      </button>

      {/* Animated Popup */}
      <AnimatedPopup 
        open={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)}
        size="md"
      >
        <h2 className="text-xl font-bold mb-4">Popup Title</h2>
        <p className="text-gray-600 mb-6">
          This is a reusable animated popup that can be used across multiple components.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={() => setIsPopupOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => setIsPopupOpen(false)}
            className="px-4 py-2 bg-[#132F2C] text-white rounded-lg hover:bg-[#0D241E]"
          >
            Confirm
          </button>
        </div>
      </AnimatedPopup>
    </div>
  );
};

export default AnimatedPopupExample;
