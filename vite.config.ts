import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  server: {
    hmr: {
      host: "192.168.200.1",
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  base: "/searchawesomes/",
});
