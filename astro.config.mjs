import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://vtdispensarydirectory.com",
  trailingSlash: "always",
  integrations: [
    tailwind(),
    react(),
    sitemap({
      filter: (page) => !page.includes("/affiliate/click/"),
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  output: "static",
  build: {
    format: "directory",
  },
});
