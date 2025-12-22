/// <reference types="vitest/globals" />

/**
 * Vitest Global Types
 *
 * Este archivo extiende los tipos globales para Vitest,
 * permitiendo usar describe, it, expect, etc. sin importar.
 */

import "@testing-library/jest-dom";

declare global {
  // Extender Window si necesitas mocks globales adicionales
}

export { };
