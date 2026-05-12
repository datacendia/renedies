// @ts-nocheck - Sentry types will be available after npm install
import * as Sentry from "@sentry/nextjs";
import { browserTracingIntegration } from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  profilesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  integrations: [
    browserTracingIntegration({
      // Set tracing origins to match your Next.js routes
      tracingOrigins: ["localhost", /^\//],
    }),
  ],

  beforeSend(event: any, hint: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Sentry Client]", event);
      return null;
    }
    return event;
  },

  ignoreErrors: [
    "top.GLOBALS",
    "fb_xd_fragment",
    "cannon_debug",
    /chrome-extension:\/\//,
  ],
});
