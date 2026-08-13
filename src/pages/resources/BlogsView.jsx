import Navbar from "../../components/Navbar";
import ResourcesSection from "../../components/resources/ResourcesSection";

const BlogsView = () => {
  return (
    <div
      className="relative"
      style={{
        background: "linear-gradient(264.41deg, #132F2C 4.24%, #132F2C 98.47%)",
      }}
    >
      {/* Fixed navbar for blog detail page */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-[#132F2C]">
        <Navbar />
      </div>

      {/* Spacer to avoid content overlap */}
      <div className="h-[64px] md:h-[72px]" />

      <main className="flex-grow bg-white text-black">
        <ResourcesSection />
      </main>
    </div>
  );
};

export default BlogsView;
