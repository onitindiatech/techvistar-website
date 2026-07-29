import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Single React instance across all chunks (required for manualChunks splitting)
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          // React core MUST share one chunk — never split react from react-dom/jsx-runtime
          if (
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-router") ||
            id.includes("node_modules/scheduler/")
          ) {
            return "vendor-react";
          }

          if (id.includes("@tiptap") || id.includes("prosemirror")) return "vendor-tiptap";
          // Do NOT chunk recharts/d3/lodash here — previously caused circular TDZ errors in production.
          if (id.includes("three")) return "vendor-three";
          if (id.includes("gsap")) return "vendor-gsap";
          if (id.includes("framer-motion")) return "vendor-motion";
          if (id.includes("@radix-ui")) return "vendor-radix";
          if (id.includes("@tanstack/react-query")) return "vendor-query";
          if (id.includes("isomorphic-dompurify") || id.includes("dompurify")) return "vendor-sanitize";
          if (id.includes("embla-carousel")) return "vendor-carousel";
          if (id.includes("date-fns")) return "vendor-date";
        },
      },
    },
  },
}));
