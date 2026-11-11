import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/** Load built CSS without blocking first paint (Lighthouse render-blocking).
 *  Avoids inline onload= handlers (blocked by CSP script-src without unsafe-hashes). */
function asyncCssPlugin() {
  return {
    name: "async-css",
    enforce: "post",
    transformIndexHtml(html) {
      return html.replace(
        /<link([^>]*\s)rel="stylesheet"([^>]*)>/g,
        (match) => {
          if (match.includes("media=")) return match;
          const href = match.match(/href="([^"]+)"/)?.[1];
          if (!href || !href.includes(".css")) return match;
          const crossorigin = /\bcrossorigin\b/.test(match)
            ? " crossorigin"
            : "";
          // Inline <script> is fine with script-src 'unsafe-inline'; onload= is not.
          const activate =
            "(function(l){function r(){l.media='all';document.documentElement.classList.add('css-ready');document.dispatchEvent(new Event('tl-css-ready'))}if(!l)return;if(l.sheet)r();else l.addEventListener('load',r);})(document.currentScript.previousElementSibling);";
          return [
            `<link rel="stylesheet" href="${href}"${crossorigin} media="print" data-tl-async-css>`,
            `<noscript><link rel="stylesheet" href="${href}"${crossorigin}></noscript>`,
          ].join("\n    ");
        }
      );
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), asyncCssPlugin()],
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react-dom")) return "react-dom";
          if (id.includes("node_modules/react/")) return "react";
          if (id.includes("node_modules/react-router")) return "router";
          if (id.includes("node_modules/axios")) return "axios";
          if (id.includes("react-phone-input-2")) return "phone-input";
          if (id.includes("framer-motion")) return "motion";
          if (id.includes("recharts")) return "recharts";
          if (id.includes("reactflow")) return "reactflow";
          if (id.includes("libphonenumber-js")) return "libphonenumber";
        },
      },
    },
  },
  server: {
    proxy: {
      "/crm-api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/crm-api/, "/api"),
      },
    },
  },
});
