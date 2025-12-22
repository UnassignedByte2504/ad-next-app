"use client";

/**
 * Root Providers
 *
 * Wraps the application with essential providers:
 * - MUI Theme (dark mode default, CSS variables for runtime switching)
 * - MUI Next.js cache provider for SSR optimization
 *
 * @see app/ui/theme/ for theme architecture
 * @see docs/branding/CORPORATE_IDENTITY.md for design system
 */

import { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./ui/theme";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Providers wrapper for the application
 *
 * This component is a Client Component ("use client") because ThemeProvider
 * requires it. However, children passed to it CAN be Server Components
 * thanks to React's composition pattern.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
