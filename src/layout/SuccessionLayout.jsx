import { Outlet, useLocation } from "react-router-dom";
import SuccessionHeader from "../components/succession/SuccessionHeader";
import SuccessionFooter from "../components/succession/SuccessionFooter";

const SuccessionLayout = () => {
  const location = useLocation();
  const showResultChrome = location.pathname === "/succession/view";

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {showResultChrome && (
        <div className="fixed top-0 left-0 w-full z-40">
          <SuccessionHeader />
        </div>
      )}

      <main
        className={`flex-1 overflow-y-auto relative ${
          showResultChrome ? "lg:mt-[85px] mt-[150px] mb-[80px]" : ""
        }`}
      >
        <Outlet />
      </main>

      {showResultChrome && (
        <div className="fixed bottom-0 left-0 w-full z-40">
          <SuccessionFooter />
        </div>
      )}
    </div>
  );
};

export default SuccessionLayout;
