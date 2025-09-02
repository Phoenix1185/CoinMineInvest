import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    // Keep runtimeErrorOverlay for development
    ...(process.env.NODE_ENV !== "production" ? [runtimeErrorOverlay()] : []),
    // Keep Replit cartographer plugin for non-production Replit environments
    ...(process.env.NODE_ENV !== "production" && process.env.REPL_ID
      ? [
          import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer()
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@assets": path.resolve(__dirname, "./attached_assets"),
    },
  },
  root: path.resolve(__dirname, "./client"),
  build: {
    outDir: path.resolve(__dirname, "./dist"), // Align with example's 'dist' for Vercel
    emptyOutDir: true, // Keep your setting to clear output directory
    sourcemap: false, // From example, optimizes production build
  },
  server: {
    port: 3000, // From example, for consistency
    fs: {
      strict: true,
      deny: ["**/.*"], // Keep your strict file serving settings
    },
  },
});
