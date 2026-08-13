import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import { lazy, Suspense } from "react";
import ResourcesImage from "../../assets/img/resource/Frame resource.webp";
import ResourcesMobileImage from "../../assets/img/resource/Frame resourcemobile.webp";

const AllResources = lazy(() => import("../../components/resources/AllResources"));

const ArticlesNewsEvents = () => {
  return (
    <div
      className="relative"
      style={{
        background: "linear-gradient(264.41deg, #132F2C 4.24%, #132F2C 98.47%)",
      }}
    >
      <div className="fixed top-0 left-0 right-0 z-[60] bg-[#132F2C]">
        <Navbar />
      </div>

      <div className="h-[64px] md:h-[80px]" />

      <Header
        title="Articles, News & Events"
        subtitle="Stay updated with articles, news, and events on succession and estate planning."
        mobileImage={ResourcesMobileImage}
        desktopImage={ResourcesImage}
      />

      <main className="flex-grow bg-white text-black">
        <Suspense fallback={null}>
          <AllResources
            types={["article", "event", "news"]}
            heading="Articles, News & Events"
          />
        </Suspense>
      </main>
    </div>
  );
};

export default ArticlesNewsEvents;
