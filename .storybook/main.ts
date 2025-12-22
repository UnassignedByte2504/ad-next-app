import type { StorybookConfig } from "@storybook/nextjs-vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../components/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

  addons: ["@storybook/addon-links", "@storybook/addon-docs"],

  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },

  staticDirs: ["../public"],

  docs: {
    autodocs: "tag",
    defaultName: "Docs",
  },

  typescript: {
    reactDocgen: "react-docgen-typescript",
  },

  viteFinal: async (config) => {
    // Configurar aliases para que coincidan con tsconfig.json
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, ".."),
      "@components": path.resolve(__dirname, "../components"),
      "@atoms": path.resolve(__dirname, "../components/atoms"),
      "@molecules": path.resolve(__dirname, "../components/molecules"),
      "@organisms": path.resolve(__dirname, "../components/organisms"),
      "@templates": path.resolve(__dirname, "../components/templates"),
      "@hooks": path.resolve(__dirname, "../hooks"),
      "@lib": path.resolve(__dirname, "../lib"),
      "@utils": path.resolve(__dirname, "../utils"),
      "@styles": path.resolve(__dirname, "../styles"),
      "@types": path.resolve(__dirname, "../types"),
      "@errors": path.resolve(__dirname, "../errors"),
      "@store": path.resolve(__dirname, "../store"),
    };

    return config;
  },
};

export default config;
