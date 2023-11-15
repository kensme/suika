import { defineConfig } from "astro/config";
import wasm from "vite-plugin-wasm";

import tailwind from "@astrojs/tailwind";

const base = process.env.NODE_ENV === "production" ? "/suika/" : "/";

// https://astro.build/config
export default defineConfig({
  site: "https://kensme.github.io/suika/",
  base: base,
  integrations: [tailwind()],
  vite: {
    plugins: [wasm()],
  },
});
