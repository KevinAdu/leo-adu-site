import { defineConfig } from 'astro/config';
import NetlifyCMS from 'astro-netlify-cms';
import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: netlify(),
  image: {
    domains: ["astro.build"],
  }
});