import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { componentTagger } from "lovable-tagger";

// Custom plugin to copy index.html to 404.html after build
function spaFallbackPlugin() {
  return {
    name: "spa-fallback",
    closeBundle() {
      const distDir = resolve(__dirname, "dist");
      const indexPath = resolve(distDir, "index.html");
      const notFoundPath = resolve(distDir, "404.html");

      if (existsSync(indexPath)) {
        const html = readFileSync(indexPath, "utf-8");
        writeFileSync(notFoundPath, html);
      }
    },
  };
}

export default defineConfig(({ mode }) => ({
  base: "/xenora_website/",
  server: {
    host: "::",
    port: 8080,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    spaFallbackPlugin(),
  ].filter(Boolean),
}));
