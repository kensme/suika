import { defineConfig } from "astro/config";
import wasm from "vite-plugin-wasm";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://kensme.github.io/",
  base: "/",
  integrations: [tailwind()],
  vite: {
    plugins: [wasm()],
  },
});
