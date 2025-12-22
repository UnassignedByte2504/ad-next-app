// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

/**
 * Check if user has consented to analytics cookies
 * GDPR Compliance: Only initialize Sentry if user has given consent
 */
function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const consentData = localStorage.getItem("bemyre-consent");
    if (!consentData) return false;

    const consent = JSON.parse(consentData);
    return consent.preferences?.analytics === true;
  } catch {
    return false;
  }
}

/**
 * Initialize Sentry only if user has consented
 * GDPR Compliance: Require explicit opt-in for analytics
 */
if (hasAnalyticsConsent()) {
  Sentry.init({
    dsn: "https://6df38519a8887e79e392c05a044d6bd8@o4510458144489486.ingest.de.sentry.io/4510458145734736",

    // Add optional integrations for additional features
    integrations: [
      Sentry.replayIntegration(),
    ],

    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 1,

    // SECURITY: Only enable verbose logs in development to prevent leaking sensitive data
    enableLogs: process.env.NODE_ENV === "development",

    // Define how likely Replay events are sampled.
    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 0.1,

    // Define how likely Replay events are sampled when an error occurs.
    replaysOnErrorSampleRate: 1.0,

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

  console.log("[Sentry] Initialized with user consent");
} else {
  console.log("[Sentry] Not initialized - user has not consented to analytics");
}

export const onRouterTransitionStart = hasAnalyticsConsent()
  ? Sentry.captureRouterTransitionStart
  : () => {};