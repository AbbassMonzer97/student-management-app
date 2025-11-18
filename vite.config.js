import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target:
          "https://app-inttask-api-g2axe2gvgqgadyha.westeurope-01.azurewebsites.net",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
