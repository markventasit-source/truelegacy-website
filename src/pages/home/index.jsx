import { lazy, Suspense } from "react";
import HeaderHome from "../../components/home/HeaderHome";
/** Above-fold on desktop — keep in home chunk to avoid an extra critical-path hop. */
import PlanYourLegacy from "../../components/home/PlanYourLegacy";
import SurveyFloatHost from "../../components/survey/SurveyFloatHost";
import LazyWhenVisible from "../../ui/LazyWhenVisible";

const WhoweAreNew = lazy(() => import("../../components/home/WhoweAreNew"));
const TrueLegacyInstructions = lazy(() =>
  import("../../components/home/TrueLegacyInstructions")
);
const QuoteComponent = lazy(() => import("../../components/home/QuoteComponent"));
const LatestBlogsCarousel = lazy(
  () => import("../../components/home/LatestBlogsCarousel")
);
const FAQ = lazy(() => import("../../components/FAQ"));

const HomePage = () => {
  return (
    <main className="min-h-screen">
      <HeaderHome />
      <PlanYourLegacy />
      <SurveyFloatHost />
      <LazyWhenVisible minHeight={520} rootMargin="60px">
        <Suspense fallback={null}>
          <WhoweAreNew />
        </Suspense>
      </LazyWhenVisible>
      <LazyWhenVisible minHeight={400} rootMargin="60px">
        <Suspense fallback={null}>
          <TrueLegacyInstructions />
        </Suspense>
      </LazyWhenVisible>
      <LazyWhenVisible minHeight={320} rootMargin="60px">
        <Suspense fallback={null}>
          <QuoteComponent />
        </Suspense>
      </LazyWhenVisible>
      <LazyWhenVisible minHeight={440} rootMargin="60px">
        <Suspense fallback={null}>
          <LatestBlogsCarousel />
        </Suspense>
      </LazyWhenVisible>
      <LazyWhenVisible minHeight={360} rootMargin="60px">
        <Suspense fallback={null}>
          <FAQ />
        </Suspense>
      </LazyWhenVisible>
    </main>
  );
};

export default HomePage;
