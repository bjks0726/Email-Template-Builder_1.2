import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// When deploying to GitHub Pages at https://<user>.github.io/<repo>/,
// set BASE_URL via the environment (e.g., BASE_URL: /Email-Template-Builder_1.2/ npm run build)
// or via GitHub Actions (see .github/workflows/deploy.yml).
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: process.env.BASE_URL || "/",
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: mode !== "production",
  },
}));
