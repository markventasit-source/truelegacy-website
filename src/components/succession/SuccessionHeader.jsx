import { useState, lazy } from "react";
import { createPortal } from "react-dom";
import { Users2, Save, Grid2x2, LogOut } from "lucide-react";
import StyledButton from "../../ui/StyledButton";
import logo from "../../assets/img/succession/Truelegacy Logo (Green) 1.png";
import whatsappIcon from "../../assets/img/succession/logos_whatsapp-icon.svg";
import { useNavigate } from "react-router-dom";
import { useSuccession } from "../../context/SuccessionContext";

const WhatsAppShareModal = lazy(() => import("./WhatsAppShareModal"));

const SuccessionHeader = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showHomePopup, setShowHomePopup] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const navigate = useNavigate();
  const { successionData, clearSuccessionData } = useSuccession();
  const showSaveBtn = successionData?.temporary_user?.is_logged_in === false;

  const handleLogout = () => {
    navigate("/", { replace: true });
    setTimeout(() => {
      clearSuccessionData();
    }, 0);
    setShowLogoutPopup(false);
  };

  const handleLogoClick = () => {
    // Close any open drawers (overview/member/add-child) so only the modal is visible.
    try {
      window.dispatchEvent(new CustomEvent("closeDrawers"));
    } catch {
      // no-op
    }
    setShowHomePopup(true);
  };

  const handleGoHome = () => {
    navigate("/", { replace: true });
    setTimeout(() => {
      clearSuccessionData();
    }, 0);
    setShowHomePopup(false);
  };

   const homePopup =
     showHomePopup &&
     typeof document !== "undefined" &&
     createPortal(
       <div
         className="fixed inset-0 bg-black/75 backdrop-blur-lg flex items-center justify-center"
         style={{ zIndex: 99999 }}
       >
         <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
           <h2 className="text-xl font-semibold mb-2 text-primary">Go to Home Page?</h2>
           <p className="text-gray-600 mb-6">
             Are you sure you want to go to home page? Your succession data will be cleared.
           </p>

           <div className="flex justify-end gap-3">
             <StyledButton
               onClick={() => setShowHomePopup(false)}
               name="Stay Here"
               variant="quinary"
             />
             <StyledButton name="Yes, Go Home" onClick={handleGoHome} />
           </div>
         </div>
       </div>,
       document.body
     );
  return (
    <>
      <header className="px-4 md:px-8 py-4 bg-white shadow-xs border-b border-[#000000]/15 relative z-[60]">
        <div className="md:hidden flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <img
              src={logo}
              alt="True Legacy"
              className="w-28 h-auto object-contain cursor-pointer"
              onClick={handleLogoClick}
              loading="lazy"
              decoding="async"
              />
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="bg-transparent border border-gray-300 p-2 rounded-lg"
            >
              <Grid2x2 size={20} className="text-green" />
            </button>
          </div>

          <div className="flex flex-col text-left">
            <p className="text-lg font-semibold text-green leading-tight">
              Your Family Estate Overview
            </p>
            <p className="text-sm text-secondary leading-snug">
              Radial visualization centered on "You" with inheritance
              calculations
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="True Legacy"
              className="w-28 h-auto object-contain cursor-pointer"
              onClick={handleLogoClick}
              loading="lazy"
              decoding="async"
              />
            <div className="flex flex-col justify-center text-left">
              <h1 className="text-2xl font-semibold text-green leading-tight">
                Your Family Estate Overview
              </h1>
              <p className="text-base text-secondary leading-snug">
                Radial visualization centered on "You" with inheritance
                calculations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StyledButton
              variant="quinary"
              onClick={() => setShowWhatsAppModal(true)}
              name={
                <span className="flex items-center gap-2 text-base">
                  <span className="hidden md:inline">Get Detailed Report</span>
                  <img src={whatsappIcon} alt="WhatsApp" className="w-4 h-4"
  loading="lazy"
  decoding="async"
  />
                </span>
              }
            />
            <StyledButton
              variant="quinary"
              onClick={() => navigate("/succession/family")}
              name={
                <span className="flex items-center gap-2 text-base">
                  <Users2 size={16} /> Members
                </span>
              }
            />
            {showSaveBtn ? (
              <StyledButton
                name={
                  <span className="flex items-center gap-2 text-base">
                    <Save size={16} /> Save
                  </span>
                }
                onClick={() => navigate("/signin")}
              />
            ) : (
              <StyledButton
                variant="quaternary"
                name={
                  <span className="flex items-center gap-2 text-base">
                    <LogOut size={16} /> Logout
                  </span>
                }
                onClick={() => setShowLogoutPopup(true)}
              />
            )}
          </div>
        </div>
      </header>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-[200] md:hidden"
            onClick={() => setShowMenu(false)}
          />
          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg rounded-t-2xl p-4 pb-24 flex flex-col gap-3 md:hidden z-[201] animate-slide-up">
            <StyledButton
              variant="quinary"
              name={
                <span className="flex items-center gap-2 text-base">
                  <Users2 size={18} /> Members List
                </span>
              }
              onClick={() => {
                navigate("/succession/family");
                setShowMenu(false);
              }}
            />
            {showSaveBtn ? (
              <StyledButton
                name={
                  <span className="flex items-center gap-2 text-base">
                    <Save size={18} /> Save Details
                  </span>
                }
                onClick={() => {
                  navigate("/signin");
                  setShowMenu(false);
                }}
              />
            ) : (
              <StyledButton
                variant="quaternary"
                name={
                  <span className="flex items-center gap-2 text-base">
                    <LogOut size={18} /> Logout
                  </span>
                }
                onClick={() => {
                  setShowMenu(false);
                  setShowLogoutPopup(true);
                }}
              />
            )}
            <StyledButton
              variant="quinary"
              onClick={() => {
                setShowWhatsAppModal(true);
                setShowMenu(false);
              }}
              name={
                <span className="flex items-center gap-2 text-base">
                  <span>Get Detailed Report</span>
                  <img src={whatsappIcon} alt="WhatsApp" className="w-5 h-5"
  loading="lazy"
  decoding="async"
  />
                </span>
              }
            />
          </div>
        </>
      )}

      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[300]">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-2 text-primary">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout? Your succession data will be cleared.
            </p>

            <div className="flex justify-end gap-3">
              <StyledButton
                onClick={() => setShowLogoutPopup(false)}
                name="Cancel"
                variant="quinary"
              />
              <StyledButton 
                name="Yes, Logout" 
                onClick={handleLogout}
                variant="quaternary"
              />
            </div>
          </div>
        </div>
      )}

      {homePopup}
      
      {showWhatsAppModal && (
        <WhatsAppShareModal
          successionId={successionData?.survey?.id}
          onClose={() => setShowWhatsAppModal(false)}
        />
      )}
    </>
  );
};

export default SuccessionHeader;
