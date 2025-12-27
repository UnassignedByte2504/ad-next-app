/**
 * Consent Slice - GDPR Consent Management
 *
 * Maneja:
 * - Consentimientos de cookies (analytics, marketing, functional)
 * - Persistencia en localStorage separado
 * - Banner de consentimiento
 * - Integración con Sentry y otros servicios de tracking
 *
 * COMPLIANCE:
 * - GDPR compliant (require explicit opt-in)
 * - Persistent storage of consent choices
 * - User can revoke consent at any time
 */

import type { StateCreator } from "zustand";
import type { StoreState, ConsentSlice, ConsentState, ConsentPreferences } from "../types";
import { logger } from "@lib/logger";

const CONSENT_STORAGE_KEY = "ayla-consent";
const CONSENT_VERSION = "1.0";

const initialState: ConsentState = {
  hasConsented: false,
  showBanner: false,
  preferences: {
    analytics: false,
    marketing: false,
    functional: true, // Functional cookies are required
  },
  timestamp: null,
  version: CONSENT_VERSION,
};

/**
 * Load consent from localStorage
 */
function loadConsent(): ConsentState {
  if (typeof window === "undefined") return initialState;

  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return { ...initialState, showBanner: true };

    const parsed = JSON.parse(stored) as ConsentState;

    // Check version - if outdated, request consent again
    if (parsed.version !== CONSENT_VERSION) {
      logger.info("Consent version outdated, requesting new consent");
      return { ...initialState, showBanner: true };
    }

    return parsed;
  } catch (error) {
    logger.error("Failed to load consent from localStorage", error instanceof Error ? error : undefined);
    return { ...initialState, showBanner: true };
  }
}

/**
 * Save consent to localStorage
 */
function saveConsent(state: ConsentState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
    logger.debug("Consent saved to localStorage", { preferences: state.preferences });
  } catch (error) {
    logger.error("Failed to save consent to localStorage", error instanceof Error ? error : undefined);
  }
}

export const createConsentSlice: StateCreator<
  StoreState,
  [["zustand/immer", never], ["zustand/devtools", never]],
  [],
  ConsentSlice
> = (set) => {
  // Load initial consent state
  const loadedState = loadConsent();

  return {
    ...loadedState,

    /**
     * Accept all cookies
     */
    acceptAll: () => {
      const newState: ConsentState = {
        hasConsented: true,
        showBanner: false,
        preferences: {
          analytics: true,
          marketing: true,
          functional: true,
        },
        timestamp: new Date().toISOString(),
        version: CONSENT_VERSION,
      };

      set((state) => {
        state.consent.hasConsented = newState.hasConsented;
        state.consent.showBanner = newState.showBanner;
        state.consent.preferences = newState.preferences;
        state.consent.timestamp = newState.timestamp;
        state.consent.version = newState.version;
      });

      saveConsent(newState);
      logger.info("User accepted all cookies");

      // Reload page to initialize analytics services
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    },

    /**
     * Reject all non-essential cookies
     */
    rejectAll: () => {
      const newState: ConsentState = {
        hasConsented: true,
        showBanner: false,
        preferences: {
          analytics: false,
          marketing: false,
          functional: true, // Functional cookies are required
        },
        timestamp: new Date().toISOString(),
        version: CONSENT_VERSION,
      };

      set((state) => {
        state.consent.hasConsented = newState.hasConsented;
        state.consent.showBanner = newState.showBanner;
        state.consent.preferences = newState.preferences;
        state.consent.timestamp = newState.timestamp;
        state.consent.version = newState.version;
      });

      saveConsent(newState);
      logger.info("User rejected all non-essential cookies");

      // Reload page to disable analytics services
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    },

    /**
     * Update specific consent preferences
     */
    updateConsent: (preferences: Partial<ConsentPreferences>) => {
      const currentPrefs = loadConsent().preferences;
      const newPreferences = {
        ...currentPrefs,
        ...preferences,
        functional: true, // Always keep functional enabled
      };

      const newState: ConsentState = {
        hasConsented: true,
        showBanner: false,
        preferences: newPreferences,
        timestamp: new Date().toISOString(),
        version: CONSENT_VERSION,
      };

      set((state) => {
        state.consent.hasConsented = newState.hasConsented;
        state.consent.showBanner = newState.showBanner;
        state.consent.preferences = newState.preferences;
        state.consent.timestamp = newState.timestamp;
        state.consent.version = newState.version;
      });

      saveConsent(newState);
      logger.info("User updated consent preferences", { preferences });

      // Reload page to apply changes
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    },

    /**
     * Show consent banner
     */
    setShowBanner: () => {
      set((state) => {
        state.consent.showBanner = true;
      });
    },

    /**
     * Hide consent banner without saving
     */
    setHideBanner: () => {
      set((state) => {
        state.consent.showBanner = false;
      });
    },

    /**
     * Reset consent (for testing or user request)
     */
    resetConsent: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem(CONSENT_STORAGE_KEY);
      }

      const newState = { ...initialState, showBanner: true };
      set((state) => {
        state.consent.hasConsented = newState.hasConsented;
        state.consent.showBanner = newState.showBanner;
        state.consent.preferences = newState.preferences;
        state.consent.timestamp = newState.timestamp;
        state.consent.version = newState.version;
      });

      logger.info("User reset consent preferences");

      // Reload page to apply changes
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    },
  };
};
