"use client";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import { motion, type Variants } from "framer-motion";
import { NavLink, NavLinkProps } from "@atoms/NavLink";
import { cn } from "@utils";
import { springs } from "@/app/ui/theme";

export interface NavLinkItem {
  /** URL de destino */
  href: string;
  /** Texto del enlace */
  label: string;
  /** Icono opcional */
  icon?: React.ReactNode;
  /** Sobreescribir estado activo */
  active?: boolean;
}

export interface NavbarLinksProps {
  /** Lista de enlaces de navegación */
  links: NavLinkItem[];
  /** Variante de los enlaces */
  variant?: NavLinkProps["variant"];
  /** Tamaño de los enlaces */
  size?: NavLinkProps["size"];
  /** Dirección del layout */
  direction?: "row" | "column";
  /** Espaciado entre enlaces */
  spacing?: number;
  /** Animar entrada de los items con stagger */
  animate?: boolean;
  /** Clases CSS adicionales */
  className?: string;
  /** Callback al hacer clic en un enlace */
  onLinkClick?: (href: string) => void;
}

// Stagger animation variants for M3 Expressive (using theme springs)
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.snappy,
  },
};

/**
 * NavbarLinks - Molécula que agrupa enlaces de navegación M3.
 *
 * Características M3 Expressive 2025:
 * - Soporte para variantes pill/default/vertical
 * - Stagger animations opcionales para entrada
 * - Layout horizontal (navbar) o vertical (drawer/rail)
 * - Spacing configurable con gap
 *
 * @example
 * ```tsx
 * const links = [
 *   { href: "/musicians", label: "Músicos", icon: <MusicIcon /> },
 *   { href: "/bands", label: "Bandas", icon: <BandIcon /> },
 * ];
 *
 * // Horizontal con pill indicators
 * <NavbarLinks links={links} variant="pill" />
 * 
 * // Vertical para drawer con animación
 * <NavbarLinks links={links} direction="column" variant="vertical" animate />
 * ```
 */
export const NavbarLinks = forwardRef<HTMLDivElement, NavbarLinksProps>(
  (
    {
      links,
      variant = "default",
      size = "md",
      direction = "row",
      spacing = 1,
      animate = false,
      className,
      onLinkClick,
    },
    ref
  ) => {
    const MotionBox = motion.create(Box);

    const content = links.map((link, index) => {
      const linkElement = (
        <NavLink
          key={link.href}
          href={link.href}
          icon={link.icon}
          active={link.active}
          variant={variant}
          size={size}
          onClick={() => onLinkClick?.(link.href)}
        >
          {link.label}
        </NavLink>
      );

      if (animate) {
        return (
          <motion.div key={link.href} variants={itemVariants}>
            {linkElement}
          </motion.div>
        );
      }

      return linkElement;
    });

    const boxProps = {
      ref,
      component: "nav" as const,
      "aria-label": "Navegación principal",
      className: cn("flex", className),
      sx: {
        display: "flex",
        flexDirection: direction,
        alignItems: direction === "row" ? "center" : "stretch",
        gap: spacing,
      },
    };

    if (animate) {
      return (
        <MotionBox
          {...boxProps}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {content}
        </MotionBox>
      );
    }

    return <Box {...boxProps}>{content}</Box>;
  }
);

NavbarLinks.displayName = "NavbarLinks";
