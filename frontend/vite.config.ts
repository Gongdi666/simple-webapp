import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Railway の公開ホスト名を追加
const allowedHosts = ["simple-webapp-front-production.up.railway.app"];

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: true,
    port: 8080,
    allowedHosts,
  },
});