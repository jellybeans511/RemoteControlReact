import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        monitor: resolve(__dirname, "apps/monitor/index.html"),
        vehicle: resolve(__dirname, "apps/vehicle/index.html"),
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
});
