// @ts-check
import { defineConfig } from "astro/config";

// import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

import alpinejs from "@astrojs/alpinejs";

import markdoc from "@astrojs/markdoc";

import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  integrations: [alpinejs(), markdoc(), starlight({ title: "Hashvault Docs" })],
  vite: {
    css: {
      transformer: "lightningcss",
    },
    plugins: [tailwindcss()],
  },
});
