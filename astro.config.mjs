// @ts-check
import { defineConfig } from "astro/config";

// import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

import alpinejs from "@astrojs/alpinejs";

import markdoc from "@astrojs/markdoc";

// https://astro.build/config
export default defineConfig({
  integrations: [alpinejs(), markdoc()],

  vite: {
    css: {
      transformer: "lightningcss",
    },
    plugins: [tailwindcss()],
  },
});