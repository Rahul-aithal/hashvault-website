// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import alpinejs from "@astrojs/alpinejs";

import markdoc from "@astrojs/markdoc";

import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  site: "https://end.hashvault.club",
  integrations: [
    // alpinejs(),
    // markdoc({ allowHTML: true }),
    // starlight({
    //   title: "HASHVAULT",
    //   favicon: "/favicon.ico",
    //   disable404Route: true,
    //   components: {
    //     Header: "./src/components/DocsHeader.astro",
    //     ThemeProvider: "./src/components/ForceDarkTheme.astro",
    //     ThemeSelect: "./src/components/EmptyComponent.astro",
    //   },
    //   customCss: [
    //     "./src/styles/global.css",
    //     "@fontsource/archivo-black/400.css",
    //   ],
    // }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
