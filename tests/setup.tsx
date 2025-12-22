/**
 * Test Setup - Configuración global para Vitest
 *
 * Este archivo se ejecuta antes de cada test suite.
 * Configura:
 * - Testing Library matchers
 * - MSW server
 * - Mocks globales
 * - Limpieza automática
 */

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { server } from "./mocks/server";
// ============================================
// MSW Setup
// ============================================

// Iniciar MSW server antes de todos los tests
beforeAll(() => {
  server.listen({
    onUnhandledRequest: "warn", // Advertir sobre requests no mockeados
  });
});

// Reset handlers después de cada test para evitar state leaking
afterEach(() => {
  server.resetHandlers();
});

// Cerrar server al terminar todos los tests
afterAll(() => {
  server.close();
});

// ============================================
// Testing Library Cleanup
// ============================================

// Limpiar DOM después de cada test
afterEach(() => {
  cleanup();
});

// ============================================
// Global Mocks
// ============================================

// Mock de window.matchMedia para componentes responsive
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock de ResizeObserver
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
window.ResizeObserver = ResizeObserverMock;

// Mock de IntersectionObserver
class IntersectionObserverMock {
  root = null;
  rootMargin = "";
  thresholds: number[] = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}
window.IntersectionObserver = IntersectionObserverMock;

// Mock de scrollTo
window.scrollTo = vi.fn();

// Mock de console.error para tests que esperan errores
// Descomenta si quieres silenciar errores esperados
// const originalError = console.error;
// beforeAll(() => {
//   console.error = (...args) => {
//     if (args[0]?.includes?.('Warning:')) return;
//     originalError.call(console, ...args);
//   };
// });
// afterAll(() => {
//   console.error = originalError;
// });

// ============================================
// Next.js Mocks
// ============================================

// Mock de next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
  useParams: () => ({}),
}));

// Mock de next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

// ============================================
// Framer Motion Mock
// ============================================

// Global mock for framer-motion to avoid animation issues in tests
vi.mock("framer-motion", async () => {
  const actual = await import("./mocks/framer-motion");
  return actual;
});

// ============================================
// Environment Variables
// ============================================

// Variables de entorno para tests (NODE_ENV ya se establece por vitest)
process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000/api";
