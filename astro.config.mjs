import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  site: "https://end.hashvault.club",
  vite: {
    plugins: [tailwindcss()],
  },
});
