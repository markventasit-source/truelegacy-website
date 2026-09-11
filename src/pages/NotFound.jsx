import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import StyledButton from "../ui/StyledButton";

const NotFound = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#F6FFFF] flex flex-col">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-[60]">
        <Navbar />
      </div>

      {/* Spacer under fixed navbar */}
      <div className="h-[80px]" />

      {/* Main content — vertically centred in remaining viewport */}
      <main className="flex-1 flex items-center justify-center px-4 py-16 md:py-24">
        <div
          className={`text-center max-w-[560px] mx-auto transition-all duration-700 ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          {/* Large 404 numeral */}
          <p
            className="font-['Editors_Note'] font-bold text-[120px] md:text-[180px] leading-none text-[#132F2C] select-none"
            aria-hidden="true"
          >
            404
          </p>

          {/* Accent line */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-12 bg-[#D9D9D9]" />
            <span className="h-2 w-2 rounded-full bg-[#065f46]" />
            <span className="h-px w-12 bg-[#D9D9D9]" />
          </div>

          {/* Heading */}
          <h1 className="font-[Urania] font-semibold text-[26px] md:text-[32px] leading-tight text-[#132F2C] mb-4">
            Page not found
          </h1>

          {/* Subtext */}
          <p className="font-[Urania] text-[16px] leading-[26px] text-[#868989] mb-10 max-w-[400px] mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved. Let&apos;s get you back on track.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/">
              <StyledButton name="Go to Home" variant="primary" />
            </Link>
            <Link to="/resources">
              <StyledButton name="Browse Resources" variant="quaternary" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
