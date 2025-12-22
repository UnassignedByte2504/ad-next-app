"use client";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Logo, LogoProps } from "@atoms/Logo";
import { fontFamilies } from "@/app/ui/theme";
import { cn } from "@utils";
import { useTranslations } from "next-intl";

export interface NavbarBrandProps {
  /** Props del Logo */
  logoProps?: Omit<LogoProps, "linkTo">;
  /** Mostrar tagline bajo el logo */
  showTagline?: boolean;
  /** Texto del tagline (default: "El amanecer de la música") */
  tagline?: string;
  /** URL de destino al hacer clic */
  href?: string;
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * NavbarBrand - Molécula que combina Logo + Tagline opcional.
 *
 * Usado en el Navbar para mostrar la identidad de marca.
 * El logo siempre enlaza al home por defecto.
 *
 * @example
 * ```tsx
 * <NavbarBrand />
 * <NavbarBrand showTagline />
 * <NavbarBrand logoProps={{ size: "sm" }} />
 * ```
 */
export const NavbarBrand = forwardRef<HTMLDivElement, NavbarBrandProps>(
  (
    {
      logoProps = {},
      showTagline = false,
      tagline,
      href = "/",
      className,
    },
    ref
  ) => {
    const t = useTranslations("Components");
    const resolvedTagline = tagline ?? t("navbarBrand.tagline");
    return (
      <Box
        ref={ref}
        className={cn("flex items-center", className)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Logo
          {...logoProps}
          linkTo={href}
          priority // Brand logo should load fast
        />
        {showTagline && (
          <Typography
            variant="caption"
            sx={{
              fontFamily: fontFamilies.heading,
              fontStyle: "italic",
              opacity: 0.7,
              display: { xs: "none", md: "block" },
              whiteSpace: "nowrap",
            }}
          >
            {resolvedTagline}
          </Typography>
        )}
      </Box>
    );
  }
);

NavbarBrand.displayName = "NavbarBrand";
