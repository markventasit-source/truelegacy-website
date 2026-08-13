import { useNavigate, useLocation } from "react-router-dom";
import { useSuccession } from "../../context/SuccessionContext";
import { useState } from "react";
import { removeGuest } from "../../api/successionApi";
import StyledButton from "../../ui/StyledButton";
import { Undo2 } from "lucide-react";

const SuccessionFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { successionData, clearSuccessionData } = useSuccession();

  const [showPopup, setShowPopup] = useState(false);

  const handleGoBackClick = () => {
    // Check if any drawers are open and close them first
    const checkEvent = { detail: { hasOpenDrawers: false } };
    window.dispatchEvent(new CustomEvent('checkDrawersOpen', checkEvent));

    if (checkEvent.detail.hasOpenDrawers) {
      window.dispatchEvent(new CustomEvent('closeDrawers'));
      return; // Don't proceed with navigation
    }

    if (location.pathname === "/succession/family") {
      navigate("/succession/view");
      return;
    }

    const token = successionData?.temporary_user?.is_logged_in;

    if (token) {
      navigate("/");
    } else {
      setShowPopup(true);
    }
  };

  const handleConfirmLeave = async () => {
    try {
      const id = successionData?.temporary_user?.user_id;

      if (id) {
        await removeGuest(id);
      }

      clearSuccessionData();
      navigate("/succession");
    } catch (error) {
      console.error("Error removing guest:", error);

      clearSuccessionData();
      navigate("/succession");
    }
  };

  return (
    <>
      <footer className={`flex flex-col md:flex-row md:items-center justify-between px-4 md:px-8 py-6 bg-white border-t border-[#000000]/15 shadow-inner gap-4 md:gap-0 ${showPopup ? 'hidden' : ''}`}>
        <p
          className="text-lg text-primary flex items-center justify-start gap-2 cursor-pointer bg-[#F3F3F5] hover:bg-[#EDEDF1] px-4 py-2 rounded-full w-fit"
          onClick={handleGoBackClick}
        >
          <Undo2 size={22} strokeWidth={2} />
          Go back
        </p>
      </footer>

      {showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-2">Leave this page?</h2>
            <p className="text-gray-600 mb-6">
              You have changes that aren't saved yet. If you go back now, you
              might lose them. Do you want to continue?
            </p>

            <div className="flex justify-end gap-3">
              <StyledButton
                onClick={() => setShowPopup(false)}
                name="Stay Here"
                variant="quinary"
              />
              <StyledButton name="Yes, Go Back" onClick={handleConfirmLeave} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SuccessionFooter;
