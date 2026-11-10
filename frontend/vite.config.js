import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "",
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_PROXY_TARGET || "https://mindspace-r3fh.onrender.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  css: {
    postcss: "./postcss.config.js"
  },
  build: {
    outDir: "dist",
    assetsDir: "assets"
  }
});
