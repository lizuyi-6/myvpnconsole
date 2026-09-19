import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The API server (see server/) serves the built SPA in production, so dev
// traffic is proxied to keep the app strictly same-origin — no CORS.
const API_PROXY_TARGET =
  process.env.API_PROXY_TARGET ?? "http://127.0.0.1:8787";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    proxy: {
      "/api": {
        target: API_PROXY_TARGET,
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
