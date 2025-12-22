import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright Configuration para Tests E2E de Bemyre
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Directorio de tests E2E
  testDir: "./tests/e2e",

  // Matcher para archivos de test
  testMatch: "**/*.spec.ts",

  // Ejecutar tests en paralelo
  fullyParallel: true,

  // Fallar el build en CI si hay test.only()
  forbidOnly: !!process.env.CI,

  // Reintentos en CI
  retries: process.env.CI ? 2 : 0,

  // Workers paralelos
  workers: process.env.CI ? 1 : undefined,

  // Reporter
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["list"],
    ...(process.env.CI ? [["github"] as const] : []),
  ],

  // Configuración compartida para todos los tests
  use: {
    // URL base de la aplicación
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",

    // Tomar screenshot en caso de fallo
    screenshot: "only-on-failure",

    // Grabar video en caso de fallo
    video: "retain-on-failure",

    // Trazar en caso de fallo (para debugging)
    trace: "retain-on-failure",

    // Timeout para acciones
    actionTimeout: 10000,

    // Timeout para navegación
    navigationTimeout: 30000,
  },

  // Timeout global para cada test
  timeout: 30000,

  // Timeout para expect()
  expect: {
    timeout: 5000,
  },

  // Configuración de proyectos (browsers)
  projects: [
    // Setup project para autenticación
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },

    // Desktop Chrome
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
      dependencies: ["setup"],
    },

    // Desktop Firefox
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
      dependencies: ["setup"],
    },

    // Desktop Safari
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
      },
      dependencies: ["setup"],
    },

    // Mobile Chrome (Pixel 5)
    {
      name: "mobile-chrome",
      use: {
        ...devices["Pixel 5"],
      },
      dependencies: ["setup"],
    },

    // Mobile Safari (iPhone 12)
    {
      name: "mobile-safari",
      use: {
        ...devices["iPhone 12"],
      },
      dependencies: ["setup"],
    },
  ],

  // Output de artifacts
  outputDir: "test-results",

  // Servidor de desarrollo para tests
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutos para build
    stdout: "pipe",
    stderr: "pipe",
  },
});
