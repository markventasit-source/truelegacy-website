import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import Router from "./router/Router";
import { SuccessionProvider } from "./context/SuccessionContext";

const rootElement = document.getElementById("root");
const app = (
  <StrictMode>
    <SuccessionProvider>
      <RouterProvider router={Router} />
    </SuccessionProvider>
  </StrictMode>
);

if (rootElement && rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else if (rootElement) {
  createRoot(rootElement).render(app);
}

