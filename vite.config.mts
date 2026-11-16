import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  base: process.env.GITHUB_ACTIONS ? "/cube-memory/" : "/",
  build: { outDir: "../dist", emptyOutDir: true },
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
