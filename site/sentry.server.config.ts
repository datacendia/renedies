// @ts-nocheck - Sentry types will be available after npm install
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  profilesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // Filter out localhost in development
  beforeSend(event: any, hint: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Sentry]", event);
      return null; // Don't send in development
    }
    return event;
  },

  // Ignore common non-critical errors
  ignoreErrors: [
    // Random browser extensions
    "top.GLOBALS",
    // Facebook flakiness
    "fb_xd_fragment",
    // ISP blocking
    "cannon_debug",
    // Chrome extensions
    /chrome-extension:\/\//,
  ],
});
