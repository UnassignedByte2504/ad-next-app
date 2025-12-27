/**
 * Test Utilities - Helpers para testing
 *
 * Proporciona render personalizado con providers,
 * funciones de utilidad y factories para datos de test.
 */

import { ReactElement, ReactNode } from "react";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// ============================================
// Custom Render con Providers
// ============================================

const defaultTheme = createTheme({
  palette: {
    mode: "light",
  },
});

interface WrapperProps {
  children: ReactNode;
}

/**
 * Wrapper con todos los providers necesarios para tests
 */
function AllProviders({ children }: WrapperProps) {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

/**
 * Render personalizado que incluye providers
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
): RenderResult & { user: ReturnType<typeof userEvent.setup> } {
  const user = userEvent.setup();

  return {
    ...render(ui, { wrapper: AllProviders, ...options }),
    user,
  };
}

// ============================================
// Factory Functions
// ============================================

/**
 * Crea un músico de prueba
 */
export function createMockMusician(overrides = {}) {
  return {
    id: "musician-1",
    name: "Test Musician",
    email: "test@ayladesigns.me",
    bio: "Un músico de prueba",
    instruments: ["guitar", "bass"],
    genres: ["rock", "jazz"],
    location: {
      city: "Madrid",
      state: "Madrid",
      country: "Spain",
    },
    avatar: "/avatars/default.png",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    ...overrides,
  };
}

/**
 * Crea una banda de prueba
 */
export function createMockBand(overrides = {}) {
  return {
    id: "band-1",
    name: "Test Band",
    description: "Una banda de prueba",
    genre: "rock",
    members: [
      { id: "user-1", name: "Lead Singer", instrument: "vocals", role: "leader" },
      { id: "user-2", name: "Guitarist", instrument: "guitar", role: "member" },
    ],
    location: {
      city: "Barcelona",
      country: "Spain",
    },
    createdAt: "2024-01-01T00:00:00Z",
    ...overrides,
  };
}

/**
 * Crea un venue de prueba
 */
export function createMockVenue(overrides = {}) {
  return {
    id: "venue-1",
    name: "Test Venue",
    type: "concert_hall",
    description: "Un local de prueba",
    capacity: 200,
    amenities: ["sound_system", "lighting", "parking"],
    location: {
      address: "Calle Test 123",
      city: "Madrid",
      country: "Spain",
    },
    createdAt: "2024-01-01T00:00:00Z",
    ...overrides,
  };
}

/**
 * Crea un usuario autenticado de prueba
 */
export function createMockUser(overrides = {}) {
  return {
    id: "user-1",
    email: "test@ayladesigns.me",
    name: "Test User",
    role: "musician",
    avatar: "/avatars/default.png",
    ...overrides,
  };
}

// ============================================
// Helpers
// ============================================

/**
 * Espera a que se complete una operación async
 */
export async function waitForLoadingToFinish() {
  const { waitForElementToBeRemoved, screen } = await import("@testing-library/react");

  // Buscar cualquier indicador de carga
  const loadingIndicators = screen.queryAllByRole("progressbar");

  if (loadingIndicators.length > 0) {
    await waitForElementToBeRemoved(() => screen.queryAllByRole("progressbar"));
  }
}

/**
 * Simula un delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================
// Re-exports
// ============================================

// Re-exportar todo de testing-library
export * from "@testing-library/react";
export { userEvent };

// Sobrescribir render con la versión personalizada
export { customRender as render };
