import { defineConfig } from 'astro/config';
import netlify from "@astrojs/netlify/functions";
import sentry from "@sentry/astro";

const sentryIntegration = process.env.SENTRY_DSN
  ? sentry({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? "0.1"),
      sourceMapsUploadOptions:
        process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_PROJECT
          ? {
              authToken: process.env.SENTRY_AUTH_TOKEN,
              project: process.env.SENTRY_PROJECT,
            }
          : undefined,
    })
  : null;

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: netlify(),
  integrations: sentryIntegration ? [sentryIntegration] : [],
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
