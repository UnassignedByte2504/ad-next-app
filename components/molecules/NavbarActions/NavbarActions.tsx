"use client";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import { ThemeToggle, ThemeToggleProps } from "@atoms/ThemeToggle";
import { Avatar, AvatarProps } from "@atoms/Avatar";
import { cn } from "@utils";
import { useTranslations } from "next-intl";

/**
 * Extrae las iniciales de un nombre (máximo 2 caracteres)
 */
function getInitials(name?: string): string | undefined {
  if (!name) return undefined;
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export interface NavbarActionsProps {
  /** Usuario está autenticado */
  isAuthenticated?: boolean;
  /** Datos del usuario para el avatar */
  user?: {
    name?: string;
    avatar?: string;
  };
  /** Número de notificaciones sin leer */
  notificationCount?: number;
  /** Props del ThemeToggle */
  themeToggleProps?: Partial<ThemeToggleProps>;
  /** Props del Avatar */
  avatarProps?: Partial<AvatarProps>;
  /** Mostrar toggle de tema */
  showThemeToggle?: boolean;
  /** Mostrar notificaciones */
  showNotifications?: boolean;
  /** Callback al hacer clic en login */
  onLoginClick?: () => void;
  /** Callback al hacer clic en avatar/perfil */
  onProfileClick?: () => void;
  /** Callback al hacer clic en notificaciones */
  onNotificationsClick?: () => void;
  /** Clases CSS adicionales */
  className?: string;
  /** Contenido adicional (ej: carrito, acciones custom) */
  children?: React.ReactNode;
}

/**
 * NavbarActions - Molécula con acciones del navbar (derecha).
 *
 * Muestra diferentes elementos según el estado de autenticación:
 * - No autenticado: Botón de login + ThemeToggle
 * - Autenticado: Notificaciones + Avatar + ThemeToggle
 *
 * @example
 * ```tsx
 * // No autenticado
 * <NavbarActions onLoginClick={() => router.push('/login')} />
 *
 * // Autenticado
 * <NavbarActions
 *   isAuthenticated
 *   user={{ name: "Juan", avatar: "/avatars/juan.jpg" }}
 *   notificationCount={3}
 *   onProfileClick={() => router.push('/profile')}
 * />
 * ```
 */
export const NavbarActions = forwardRef<HTMLDivElement, NavbarActionsProps>(
  (
    {
      isAuthenticated = false,
      user,
      notificationCount = 0,
      themeToggleProps = {},
      avatarProps = {},
      showThemeToggle = true,
      showNotifications = true,
      onLoginClick,
      onProfileClick,
      onNotificationsClick,
      className,
      children,
    },
    ref
  ) => {
    const t = useTranslations("Components.navbarActions");
    const notificationsLabel = t("notifications");
    const notificationsAria = t("notificationsAria", {
      count: notificationCount,
    });
    const profileFallback = t("profileFallback");
    const profileAriaLabel = t("profileAria");
    const loginLabel = t("login");

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
        {/* Theme Toggle */}
        {showThemeToggle && (
          <ThemeToggle
            size="sm"
            cycleMode="simple"
            {...themeToggleProps}
          />
        )}

        {isAuthenticated ? (
          <>
            {/* Notifications */}
            {showNotifications && (
              <Tooltip title={notificationsLabel} arrow>
                <IconButton
                  onClick={onNotificationsClick}
                  size="small"
                  aria-label={notificationsAria}
                >
                  <Badge
                    badgeContent={notificationCount}
                    color="error"
                    max={99}
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}

            {/* User Avatar */}
            <Tooltip title={user?.name || profileFallback} arrow>
              <IconButton
                onClick={onProfileClick}
                size="small"
                aria-label={profileAriaLabel}
                sx={{ p: 0.5 }}
              >
                <Avatar
                  src={user?.avatar}
                  alt={user?.name}
                  initials={getInitials(user?.name)}
                  size="sm"
                  {...avatarProps}
                />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          /* Login Button */
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<PersonIcon />}
            onClick={onLoginClick}
            sx={{
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            {loginLabel}
          </Button>
        )}

        {/* Custom children (e.g., cart button) */}
        {children}
      </Box>
    );
  }
);

NavbarActions.displayName = "NavbarActions";
