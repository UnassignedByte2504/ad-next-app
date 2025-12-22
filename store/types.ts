/**
 * Store Types - Definiciones de tipos para el estado global
 */

import type { Musician, Band, Venue } from "@types";

// ============================================
// Auth Slice Types
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "musician" | "band_manager" | "venue_owner" | "admin";
  musicianProfile?: Musician;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  /** Auth method used for current session */
  authMethod: "credentials" | "google" | null;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  handleGoogleCallback: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  refreshSession: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: User["role"];
}

export type AuthSlice = AuthState & AuthActions;

// ============================================
// UI Slice Types
// ============================================

export type ThemeMode = "light" | "dark" | "system";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface Modal {
  id: string;
  component: string;
  props?: Record<string, unknown>;
}

export interface UIState {
  theme: ThemeMode;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  notifications: Notification[];
  modals: Modal[];
  isOnline: boolean;
  isMobile: boolean;
}

export interface UIActions {
  setTheme: (theme: ThemeMode) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  addNotification: (notification: Omit<Notification, "id">) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  openModal: (modal: Omit<Modal, "id">) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  setOnline: (online: boolean) => void;
  setMobile: (mobile: boolean) => void;
}

export type UISlice = UIState & UIActions;

// ============================================
// Search Slice Types
// ============================================

export interface SearchFilters {
  genres?: string[];
  instruments?: string[];
  location?: {
    city?: string;
    state?: string;
    radius?: number;
  };
  availability?: boolean;
}

export interface SearchState {
  query: string;
  filters: SearchFilters;
  results: {
    musicians: Musician[];
    bands: Band[];
    venues: Venue[];
  };
  isSearching: boolean;
  hasSearched: boolean;
}

export interface SearchActions {
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  clearFilters: () => void;
  search: () => Promise<void>;
  clearResults: () => void;
}

export type SearchSlice = SearchState & SearchActions;

// ============================================
// Consent Slice Types (GDPR Compliance)
// ============================================

export interface ConsentPreferences {
  /** Analytics cookies (Sentry, Google Analytics, etc.) */
  analytics: boolean;
  /** Marketing cookies (ads, remarketing) */
  marketing: boolean;
  /** Functional cookies (required for app functionality) */
  functional: boolean;
}

export interface ConsentState {
  /** Whether user has made a consent choice */
  hasConsented: boolean;
  /** Whether to show the consent banner */
  showBanner: boolean;
  /** User's consent preferences */
  preferences: ConsentPreferences;
  /** Timestamp of last consent update */
  timestamp: string | null;
  /** Consent schema version (to force re-consent on updates) */
  version: string;
}

export interface ConsentActions {
  /** Accept all cookies */
  acceptAll: () => void;
  /** Reject all non-essential cookies */
  rejectAll: () => void;
  /** Update specific consent preferences */
  updateConsent: (preferences: Partial<ConsentPreferences>) => void;
  /** Set consent banner visibility to true */
  setShowBanner: () => void;
  /** Set consent banner visibility to false */
  setHideBanner: () => void;
  /** Reset all consent (for testing or user request) */
  resetConsent: () => void;
}

export type ConsentSlice = ConsentState & ConsentActions;

// ============================================
// Combined Store Type
// ============================================

export interface StoreState {
  auth: AuthSlice;
  ui: UISlice;
  search: SearchSlice;
  consent: ConsentSlice;
}

// ============================================
// Middleware Types
// ============================================

export interface PersistedState {
  /** Solo persistimos datos no sensibles - los tokens van en httpOnly cookies */
  auth: Pick<AuthState, "user" | "authMethod">;
  ui: Pick<UIState, "theme" | "sidebarCollapsed">;
}
