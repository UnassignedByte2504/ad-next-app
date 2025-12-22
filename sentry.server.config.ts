// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://6df38519a8887e79e392c05a044d6bd8@o4510458144489486.ingest.de.sentry.io/4510458145734736",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // SECURITY: Only enable verbose logs in development to prevent leaking sensitive data
  enableLogs: process.env.NODE_ENV === "development",

  // SECURITY: Never send PII (Personally Identifiable Information) to third parties
  // This prevents GDPR violations and protects user privacy
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false,

  // SECURITY: Redact any PII that might slip through in error events
  beforeSend(event) {
    // Redact user email
    if (event.user?.email) {
      event.user.email = "[redacted]";
    }
    // Redact IP address
    if (event.user?.ip_address) {
      event.user.ip_address = "[redacted]";
    }
    // Redact username if present
    if (event.user?.username) {
      event.user.username = "[redacted]";
    }
    // Redact any other identifying user data
    if (event.user?.id) {
      event.user.id = "[redacted]";
    }
    return event;
  },
});
