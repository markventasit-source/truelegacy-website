import OurServices from "../../components/services/OurServices";
import FAQComponent from "../../components/FAQ";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const VALID_TABS = new Set(["will", "trust"]);

function Services() {
  const { tab } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialTab = tab === "trust" ? "trust" : "will";

  // Canonical paths: /services/will | /services/trust (no query strings)
  useEffect(() => {
    const legacyTab = searchParams.get("tab");
    if (legacyTab && VALID_TABS.has(legacyTab)) {
      navigate(`/services/${legacyTab}`, { replace: true });
      return;
    }
    if (!tab) {
      navigate("/services/will", { replace: true });
      return;
    }
    if (!VALID_TABS.has(tab)) {
      navigate("/services/will", { replace: true });
    }
  }, [tab, searchParams, navigate]);

  return (
    <div
      className="relative"
      style={{
        background: "linear-gradient(264.41deg, #132F2C 4.24%, #132F2C 98.47%)",
      }}
    >
      {/* Fixed navbar for Services page */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-[#132F2C]">
        <Navbar />
      </div>

      {/* Spacer to avoid content overlap */}
      <div className="h-[64px] md:h-[80px]" />

      <Header
        title="Services"
        subtitle="Understand succession laws and secure your estate with clarity and confidence."
      />
      <main className="flex-grow bg-white text-black">
        <OurServices initialTab={initialTab} />
        <div className="pb-0 md:pb-0 lg:pb-0">
          <FAQComponent />
        </div>
      </main>
    </div>
  );
}

export default Services;
