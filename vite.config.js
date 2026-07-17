import { defineConfig } from "vite";

export default defineConfig({
  // The deployable site now lives in public/ — treat that folder as Vite's root
  // so `vite`, `vite build`, and `vite preview` all resolve public/index.html.
  root: "public",
  // public/ IS the web root here, so there is no separate verbatim-copy assets dir.
  publicDir: false,
  build: {
    // Emit the bundle to <repo>/dist (outside the root), replacing any previous build.
    outDir: "../dist",
    emptyOutDir: true,
  },
});
