import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/homix/",
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  server: {
    // Исправлено с serve на server
    port: 3000,
  },
});
