import { defineConfig } from 'astro/config';
import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: netlify(),
  image: {
    domains: ["astro.build"],
  },
  vite: {
    ssr: {
      noExternal: [
        "@better-auth-kit/app-invite",
        "@better-auth-kit/app-invite/client",
        "better-auth",
      ],
    },
  },
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja', 'en'],
   },
});
