import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import RootLayout from "../layout/RootLayout";
import Layout from "../layout/Layout";
import ProtectedRoute from "./ProtectRouter";
/** Eager home — Vite modulepreloads it with the entry (avoids HTML→entry→home chain). */
import Home from "../pages/home/index.jsx";

const Services = lazy(() => import("../pages/services/index.jsx"));
const WhyChooseUs = lazy(() => import("../pages/why-choose-us"));
const Contact = lazy(() => import("../pages/contact"));
const Resources = lazy(() => import("../pages/resources"));
const ArticlesNewsEvents = lazy(() =>
  import("../pages/articles-news-events")
);
const BlogsView = lazy(() => import("../pages/resources/BlogsView"));
const SuccessionLanding = lazy(() => import("../pages/succession/Landing.jsx"));
const SurveyForm = lazy(() => import("../pages/succession"));
const ReadinessSurveyPage = lazy(() =>
  import("../pages/readiness-survey/ReadinessSurveyPage.jsx")
);
const SurveyResultPage = lazy(() =>
  import("../pages/readiness-survey/SurveyResultPage.jsx")
);
const SuccessionLayout = lazy(() => import("../layout/SuccessionLayout"));
const SuccessionTree = lazy(() => import("../pages/succession/SuccessionTree"));
const FamilyMembers = lazy(() => import("../pages/succession/FamilyView"));
const SignIn = lazy(() => import("../pages/succession/SignIn"));
const TermsOfService = lazy(() => import("../pages/Terms"));
const Privacy = lazy(() => import("../pages/privacy"));
const NotFound = lazy(() => import("../pages/NotFound"));

const Router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "services/:tab?",
            element: (
              <Suspense fallback={null}>
                <Services />
              </Suspense>
            ),
          },
          {
            path: "why-choose-us",
            element: (
              <Suspense fallback={null}>
                <WhyChooseUs />
              </Suspense>
            ),
          },
          {
            path: "contact",
            element: (
              <Suspense fallback={null}>
                <Contact />
              </Suspense>
            ),
          },
          {
            path: "resources",
            element: (
              <Suspense fallback={null}>
                <Resources />
              </Suspense>
            ),
          },
          {
            path: "articles-news-events",
            element: (
              <Suspense fallback={null}>
                <ArticlesNewsEvents />
              </Suspense>
            ),
          },
          {
            path: "resources/:slug",
            element: (
              <Suspense fallback={null}>
                <BlogsView />
              </Suspense>
            ),
          },
          {
            path: "readiness-survey",
            element: (
              <Suspense fallback={null}>
                <ReadinessSurveyPage />
              </Suspense>
            ),
          },
          {
            path: "readiness-survey/result",
            element: (
              <Suspense fallback={null}>
                <SurveyResultPage />
              </Suspense>
            ),
          },
          {
            path: "privacy-policy",
            element: (
              <Suspense fallback={null}>
                <Privacy />
              </Suspense>
            ),
          },
          {
            path: "terms-of-service",
            element: (
              <Suspense fallback={null}>
                <TermsOfService />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/succession",
        element: (
          <Suspense fallback={null}>
            <SuccessionLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={null}>
                <SuccessionLanding />
              </Suspense>
            ),
          },
          {
            path: "questions",
            element: (
              <Suspense fallback={null}>
                <SurveyForm />
              </Suspense>
            ),
          },
          {
            path: "view",
            element: (
              <Suspense fallback={null}>
                <ProtectedRoute>
                  <SuccessionTree />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: "family",
            element: (
              <Suspense fallback={null}>
                <ProtectedRoute>
                  <FamilyMembers />
                </ProtectedRoute>
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "signin",
        element: (
          <Suspense fallback={null}>
            <SignIn />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <Suspense fallback={null}>
            <NotFound />
          </Suspense>
        ),
      },
      {
        path: "404",
        element: (
          <Suspense fallback={null}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);

export default Router;
