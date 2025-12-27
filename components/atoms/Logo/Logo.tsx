"use client";

import { neutral, primary, fontFamilies } from "@/app/ui/theme";
import { useUI } from "@store";
import { cn } from "@utils";
import Link from "next/link";
import { forwardRef, useMemo } from "react";

export interface LogoProps {
  /** Tamano del logo */
  size?: "sm" | "md" | "lg";
  /** Variante del logo: 'short' = "Ayla.", 'full' = "Ayla.Designs" */
  variant?: "short" | "full";
  /** URL a la que enlaza el logo (opcional) */
  linkTo?: string;
  /** Clases CSS adicionales */
  className?: string;
  /** Color del texto principal (sobrescribe el del tema si se proporciona) */
  textColor?: string;
  /** data-testid para testing */
  "data-testid"?: string;
}

/**
 * Logo de Ayla Designs.
 *
 * Componente tipografico que muestra el logo de la marca.
 * - Variante "short": "Ayla." (para navbar)
 * - Variante "full": "Ayla.Designs" (para footer)
 *
 * El color del texto se adapta automaticamente al tema (light/dark),
 * o puede ser sobrescrito con la prop textColor.
 *
 * El punto siempre se muestra en el color primario (amber).
 * Usa Cormorant Garamond como tipografia.
 */
export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  (
    {
      size = "md",
      variant = "short",
      linkTo,
      className,
      textColor,
      "data-testid": testId = "logo",
    },
    ref
  ) => {
    // Obtener el tema actual del store de Zustand (más confiable que MUI useTheme)
    const storeTheme = useUI((state) => state.theme);

    // Determinar si está en dark mode efectivo
    const isDark = useMemo(() => {
      if (storeTheme === "system" && typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
      return storeTheme === "dark";
    }, [storeTheme]);

    // Tamanos de fuente segun el size
    const fontSizes = {
      sm: "1.25rem", // 20px
      md: "1.5rem", // 24px
      lg: "2rem", // 32px
    };

    const fontSize = fontSizes[size];

    // Color del punto (siempre primary/amber)
    const dotColor = primary.main;

    // Determine text color based on explicit textColor or theme mode
    // En dark mode: texto claro (neutral[50]), en light mode: texto oscuro (neutral[900])
    const mainTextColor = textColor || (isDark ? neutral[50] : neutral[900]);

    // Componente del logo
    const logoContent = (
      <div
        ref={ref}
        className={cn("inline-flex items-center", className)}
        data-testid={testId}
        style={{
          fontFamily: fontFamilies.heading,
          fontSize,
          fontWeight: 500,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        <span style={{ color: mainTextColor }}>Ayla</span>
        <span style={{ color: dotColor }}>.</span>
        {variant === "full" && (
          <span style={{ color: mainTextColor }}>Designs</span>
        )}
      </div>
    );

    // Si hay un enlace, envolver en Link
    if (linkTo) {
      return (
        <Link
          href={linkTo}
          className="inline-flex no-underline hover:opacity-80 transition-opacity"
        >
          {logoContent}
        </Link>
      );
    }

    return logoContent;
  }
);

Logo.displayName = "Logo";
