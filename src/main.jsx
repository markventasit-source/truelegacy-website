import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import Router from "./router/Router";
import { SuccessionProvider } from "./context/SuccessionContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SuccessionProvider>
      <RouterProvider router={Router} />
    </SuccessionProvider>
  </StrictMode>
);
