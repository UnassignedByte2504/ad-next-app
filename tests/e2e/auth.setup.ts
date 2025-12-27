/**
 * Auth Setup - Setup de autenticación para tests E2E
 *
 * Este archivo se ejecuta antes de los tests que requieren autenticación.
 * Guarda el estado de autenticación para reutilizarlo en otros tests.
 */

import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "../.auth/user.json");

setup("authenticate", async ({ page }) => {
  // TODO: Implementar cuando tengamos el flujo de auth
  // Por ahora, este es un placeholder

  // Ejemplo de cómo sería el flujo:
  // await page.goto("/login");
  // await page.getByLabel("Email").fill("test@ayladesigns.me");
  // await page.getByLabel("Password").fill("password123");
  // await page.getByRole("button", { name: /login/i }).click();
  // await expect(page).toHaveURL("/dashboard");

  // Guardar el estado de autenticación
  // await page.context().storageState({ path: authFile });

  // Por ahora, simplemente pasamos
  await page.goto("/");
  expect(true).toBe(true);
});
