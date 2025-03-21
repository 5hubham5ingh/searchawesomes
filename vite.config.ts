import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  base: "/searchawesomes/",
});
