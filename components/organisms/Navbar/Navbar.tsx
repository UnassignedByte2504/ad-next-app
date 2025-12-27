"use client";

import { durations, easings, neutral, springs } from "@/app/ui/theme";
import { SearchInput, SearchInputProps } from "@atoms/SearchInput";
import { NavbarActions, NavbarActionsProps } from "@molecules/NavbarActions";
import { NavbarBrand, NavbarBrandProps } from "@molecules/NavbarBrand";
import { NavbarLinks, NavLinkItem } from "@molecules/NavbarLinks";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { cn } from "@utils";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { useTranslations } from "next-intl";
import { forwardRef, useState } from "react";

export interface NavbarProps {
  /** Props del NavbarBrand */
  brandProps?: NavbarBrandProps;
  /** Enlaces de navegación */
  links?: NavLinkItem[];
  /** Props del NavbarActions */
  actionsProps?: NavbarActionsProps;
  /** Mostrar barra de búsqueda */
  showSearch?: boolean;
  /** Props del SearchInput */
  searchProps?: Omit<SearchInputProps, "ref">;
  /** Variante del navbar */
  variant?: "default" | "transparent" | "elevated";
  /** Posición del navbar */
  position?: "fixed" | "sticky" | "static";
  /** Ancho máximo del contenido */
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  /** Habilitar efecto de scroll (color fill on scroll) */
  scrollEffect?: boolean;
  /** Usar variante pill para los links */
  usePillLinks?: boolean;
  /** Clases CSS adicionales */
  className?: string;
}

// M3 Expressive spring physics from theme tokens
const springConfig = springs.snappy;

/**
 * Navbar - Organismo principal de navegación M3 Expressive.
 *
 * Características Material Design 3 (Mayo 2025):
 * - Search App Bar layout: Logo + Navigation + Search pill + Trailing actions
 * - Sin drop shadow por defecto (M3 2025)
 * - Color fill on scroll con animación suave
 * - Pill-shaped navigation links opcionales
 * - Mobile drawer con Expanded Navigation Rail style
 * - Animaciones spring con framer-motion
 *
 * @example
 * ```tsx
 * const links = [
 *   { href: "/musicians", label: "Músicos", icon: <MusicIcon /> },
 *   { href: "/bands", label: "Bandas", icon: <BandIcon /> },
 * ];
 *
 * <Navbar
 *   links={links}
 *   showSearch
 *   scrollEffect
 *   usePillLinks
 *   actionsProps={{
 *     isAuthenticated: true,
 *     user: { name: "Juan" },
 *   }}
 * />
 * ```
 */
export const Navbar = forwardRef<HTMLDivElement, NavbarProps>(
  (
    {
      brandProps = {},
      links = [],
      actionsProps = {},
      showSearch = true,
      searchProps = {},
      variant = "default",
      position = "sticky",
      maxWidth = "xl",
      scrollEffect = true,
      usePillLinks = false,
      className,
    },
    ref
  ) => {
    const t = useTranslations("Components.navbar");
    const theme = useTheme();
    const providedPlaceholder = searchProps?.placeholder;
    const desktopPlaceholder =
      providedPlaceholder ?? t("search.desktopPlaceholder");
    const mobilePlaceholder =
      providedPlaceholder ?? t("search.mobilePlaceholder");
    const openMenuLabel = t("openMenu");
    const closeMenuLabel = t("closeMenu");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { scrollY } = useScroll();

    // M3 2025: Color fill on scroll
    useMotionValueEvent(scrollY, "change", (latest) => {
      if (scrollEffect) {
        setIsScrolled(latest > 20);
      }
    });

    const handleMobileMenuToggle = () => {
      setMobileMenuOpen((prev) => !prev);
    };

    const handleMobileMenuClose = () => {
      setMobileMenuOpen(false);
    };

    // Determine logo color for transparent state
    const isTransparent = variant === "transparent" && !isScrolled;
    const logoTextColor = isTransparent ? neutral[50] : undefined;

    // M3 2025: No drop shadows, use subtle background changes
    const getBackgroundStyles = () => {
      if (variant === "transparent") {
        return {
          bgcolor: isScrolled
            ? theme.palette.mode === "dark"
              ? `${neutral[900]}CC`
              : `${neutral[0]}CC`
            : "transparent", // 80% opacity
          backdropFilter: isScrolled ? "blur(20px) saturate(180%)" : "none",
        };
      }

      if (variant === "elevated") {
        return {
          bgcolor: "background.paper",
          boxShadow: isScrolled ? 2 : 0,
        };
      }

      // Default: M3 color fill on scroll
      return {
        bgcolor: isScrolled ? "background.paper" : "transparent",
        backdropFilter: isScrolled ? "blur(12px) saturate(150%)" : "none",
        borderBottom: isScrolled ? "1px solid" : "none",
        borderColor: isScrolled ? "divider" : "transparent",
      };
    };

    return (
      <>
        <AppBar
          ref={ref}
          position={position}
          color="transparent"
          elevation={0}
          className={cn(className)}
          component={motion.header}
          sx={{
            transition: `all ${durations.normal}ms ${easings.default}`,
            ...getBackgroundStyles(),
          }}
        >
          <Container maxWidth={maxWidth}>
            <Toolbar
              disableGutters
              sx={{
                minHeight: { xs: 56, sm: 64 },
                gap: { xs: 1, md: 2 },
                py: 0.5,
              }}
            >
              {/* Leading: Brand (Logo) */}
              <NavbarBrand
                {...brandProps}
                logoProps={{
                  ...brandProps.logoProps,
                  textColor: logoTextColor || brandProps.logoProps?.textColor,
                }}
              />

              {/* Center: Navigation Links (Desktop) - M3 style */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  flexGrow: 1,
                  justifyContent: "center",
                  px: 2,
                }}
              >
                {links.length > 0 && (
                  <NavbarLinks
                    links={links}
                    spacing={0.5}
                    variant={usePillLinks ? "pill" : "default"}
                    size="md"
                  />
                )}
              </Box>

              {/* Search (Desktop) - M3 Search App Bar style */}
              {showSearch && (
                <Box
                  sx={{
                    display: { xs: "none", lg: "flex" },
                    flexGrow: 0,
                    minWidth: 200,
                    maxWidth: 312, // M3: max 312dp base width
                  }}
                >
                  <SearchInput
                    size="sm"
                    fullWidth
                    {...searchProps}
                    placeholder={desktopPlaceholder}
                  />
                </Box>
              )}

              {/* Spacer for mobile */}
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }} />

              {/* Trailing: Actions (Desktop) */}
              <Box sx={{ display: { xs: "none", sm: "flex" } }}>
                <NavbarActions {...actionsProps} />
              </Box>

              {/* Mobile Menu Button with animation */}
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  transition={springConfig}
                >
                  <IconButton
                    edge="end"
                    color="inherit"
                    aria-label={mobileMenuOpen ? closeMenuLabel : openMenuLabel}
                    aria-expanded={mobileMenuOpen}
                    onClick={handleMobileMenuToggle}
                    sx={{
                      bgcolor: mobileMenuOpen
                        ? "action.selected"
                        : "transparent",
                      borderRadius: 2,
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {mobileMenuOpen ? (
                        <motion.div
                          key="close"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: durations.fast / 1000 }}
                        >
                          <CloseIcon />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="menu"
                          initial={{ rotate: 90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -90, opacity: 0 }}
                          transition={{ duration: durations.fast / 1000 }}
                        >
                          <MenuIcon />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </IconButton>
                </motion.div>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Mobile Drawer - M3 Expanded Navigation Rail style */}
        <Drawer
          anchor="right"
          open={mobileMenuOpen}
          onClose={handleMobileMenuClose}
          slotProps={{
            paper: {
              sx: {
                width: "85%",
                maxWidth: 320,
                bgcolor: "background.paper",
                backgroundImage: "none",
                // M3 Glassmorphism effect
                backdropFilter: "blur(20px) saturate(180%)",
              },
            },
            backdrop: {
              sx: {
                bgcolor: `${neutral[1000]}80`, // 50% opacity
                backdropFilter: "blur(4px)",
              },
            },
          }}
        >
          {/* Drawer Header */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, ...springConfig }}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              minHeight: 64,
            }}
          >
            <NavbarBrand logoProps={{ size: "sm" }} />
            <motion.div whileTap={{ scale: 0.9 }}>
              <IconButton
                onClick={handleMobileMenuClose}
                aria-label={closeMenuLabel}
                sx={{
                  bgcolor: "action.hover",
                  borderRadius: 2,
                }}
              >
                <CloseIcon />
              </IconButton>
            </motion.div>
          </Box>

          <Divider sx={{ opacity: 0.5 }} />

          {/* Mobile Search */}
          {showSearch && (
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, ...springConfig }}
              sx={{ p: 2 }}
            >
              <SearchInput
                size="sm"
                fullWidth
                {...searchProps}
                placeholder={mobilePlaceholder}
              />
            </Box>
          )}

          {/* Mobile Navigation Links - M3 Vertical variant */}
          {links.length > 0 && (
            <Box sx={{ p: 2, pt: 1 }}>
              <NavbarLinks
                links={links}
                direction="column"
                spacing={0.5}
                variant="vertical"
                size="md"
                animate
                onLinkClick={handleMobileMenuClose}
              />
            </Box>
          )}

          <Divider sx={{ opacity: 0.5, mt: "auto" }} />

          {/* Mobile Actions */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, ...springConfig }}
            sx={{ p: 2 }}
          >
            <NavbarActions
              {...actionsProps}
              themeToggleProps={{ showLabel: true }}
            />
          </Box>
        </Drawer>
      </>
    );
  }
);

Navbar.displayName = "Navbar";
