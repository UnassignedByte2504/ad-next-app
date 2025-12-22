import React from "react";
import type { Preview } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme, neutral, primary, secondary } from "../app/ui/theme";
import "../app/globals.css";

// Import messages synchronously to avoid top-level await
// which is not supported in Storybook's esbuild target
import metadataMessages from "../messages/es/metadata.json";
import homeMessages from "../messages/es/home.json";
import commonMessages from "../messages/es/common.json";
import authMessages from "../messages/es/auth.json";
import navigationMessages from "../messages/es/navigation.json";
import componentsMessages from "../messages/es/components.json";
import storybookMessages from "../messages/es/storybook.json";

const defaultLocale = "es";
const messages = {
  Metadata: metadataMessages,
  Home: homeMessages,
  Common: commonMessages,
  Auth: authMessages,
  Navigation: navigationMessages,
  Components: componentsMessages,
  Storybook: storybookMessages,
};

/**
 * Storybook Preview Configuration
 *
 * Uses Bemyre's modular theme architecture with dark mode as default.
 * Brand colors and design tokens are imported from @/app/ui/theme
 */
const preview: Preview = {
  tags: ["autodocs"],

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    backgrounds: {
      default: "dark", // Dark mode is Bemyre's default
      values: [
        { name: "dark", value: neutral[950] }, // #0A0A0A
        { name: "light", value: neutral[50] }, // #FAFAFA
        { name: "surface", value: neutral[900] }, // #171717
        { name: "primary", value: primary.main }, // #F15640
        { name: "secondary", value: secondary.main }, // #FFA151
      ],
    },
    layout: "centered",
    // Next.js App Router configuration
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
  },

  decorators: [
    (Story) => (
      <NextIntlClientProvider locale={defaultLocale} messages={messages}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Story />
        </ThemeProvider>
      </NextIntlClientProvider>
    ),
  ],
};

export default preview;
