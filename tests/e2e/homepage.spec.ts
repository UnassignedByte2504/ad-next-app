/**
 * E2E Tests - Homepage
 *
 * Tests end-to-end para la página principal de Ayla Designs.
 * Verifica la funcionalidad desde la perspectiva del usuario.
 */

import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/Ayla/i);
  });

  test("displays main heading", async ({ page }) => {
    // Buscar un heading principal
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
  });

  test("navigation is visible", async ({ page }) => {
    // Verificar que existe navegación
    const nav = page.getByRole("navigation");
    await expect(nav).toBeVisible();
  });

  test("is responsive on mobile", async ({ page }) => {
    // Cambiar a viewport móvil
    await page.setViewportSize({ width: 375, height: 667 });

    // La página debe seguir siendo funcional
    await expect(page.locator("body")).toBeVisible();
  });

  test("has no accessibility violations", async ({ page }) => {
    // Test básico de accesibilidad
    // Para tests completos, usar axe-playwright

    // Verificar que las imágenes tienen alt
    const images = page.getByRole("img");
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute("alt");
      expect(alt).not.toBeNull();
    }

    // Verificar que los botones tienen texto accesible
    const buttons = page.getByRole("button");
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute("aria-label");
      expect(text || ariaLabel).toBeTruthy();
    }
  });
});

test.describe("Error States", () => {
  test("shows 404 page for unknown routes", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");

    // Debería mostrar algún indicador de error o 404
    await expect(page.locator("body")).toContainText(/404|not found/i);
  });
});

test.describe("Performance", () => {
  test("loads within acceptable time", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/");
    const loadTime = Date.now() - startTime;

    // La página debería cargar en menos de 5 segundos
    expect(loadTime).toBeLessThan(5000);
  });

  test("no console errors on load", async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/");

    // Filtrar errores conocidos/esperados si es necesario
    const criticalErrors = consoleErrors.filter(
      (error) => !error.includes("favicon")
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
