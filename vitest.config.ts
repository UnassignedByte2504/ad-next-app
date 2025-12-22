/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    // Entorno para tests de componentes
    environment: "jsdom",

    // Setup global antes de cada test
    setupFiles: ["./tests/setup.tsx"],

    // Incluir tests unitarios e integración
    include: [
      "**/*.{test,spec}.{ts,tsx}",
      "tests/unit/**/*.{test,spec}.{ts,tsx}",
      "tests/integration/**/*.{test,spec}.{ts,tsx}",
    ],

    // Excluir E2E y node_modules
    exclude: [
      "node_modules/**",
      "tests/e2e/**",
      ".next/**",
      "coverage/**",
    ],

    // Globals para no importar describe, it, expect en cada archivo
    globals: true,

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: [
        "components/**/*.{ts,tsx}",
        "hooks/**/*.{ts,tsx}",
        "lib/**/*.{ts,tsx}",
        "utils/**/*.{ts,tsx}",
      ],
      exclude: [
        "**/*.stories.{ts,tsx}",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "**/index.ts",
        "**/*.d.ts",
      ],
      thresholds: {
        // Umbrales mínimos de cobertura (aumentar progresivamente)
        lines: 20,
        functions: 20,
        branches: 15,
        statements: 20,
      },
    },

    // Reporter para CI/CD
    reporters: ["default", "html"],

    // Timeout para tests
    testTimeout: 10000,
    hookTimeout: 10000,

    // Watch mode solo en archivos modificados
    watch: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@components": path.resolve(__dirname, "./components"),
      "@atoms": path.resolve(__dirname, "./components/atoms"),
      "@molecules": path.resolve(__dirname, "./components/molecules"),
      "@organisms": path.resolve(__dirname, "./components/organisms"),
      "@templates": path.resolve(__dirname, "./components/templates"),
      "@hooks": path.resolve(__dirname, "./hooks"),
      "@lib": path.resolve(__dirname, "./lib"),
      "@utils": path.resolve(__dirname, "./utils"),
      "@styles": path.resolve(__dirname, "./styles"),
      "@types": path.resolve(__dirname, "./types"),
      "@tests": path.resolve(__dirname, "./tests"),
      "@errors": path.resolve(__dirname, "./errors"),
      "@store": path.resolve(__dirname, "./store"),
    },
  },
});
