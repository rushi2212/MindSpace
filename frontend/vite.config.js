import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "VITE_");
  return {
    plugins: [react()],
    base: "",
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_PROXY_TARGET || "https://mindspace-r3fh.onrender.com",
          changeOrigin: true,
          secure: true,
        },
      },
    },
    css: { postcss: "./postcss.config.js" },
    build: { outDir: "dist", assetsDir: "assets" },
  };
});
