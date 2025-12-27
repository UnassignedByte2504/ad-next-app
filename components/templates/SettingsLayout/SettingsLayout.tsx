"use client";

import { forwardRef, useState, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTheme } from "@mui/material/styles";

import { neutral, springs, zIndex } from "@/app/ui/theme";

// =============================================================================
// TYPES
// =============================================================================

export interface SettingsLayoutProps {
  /** Page title */
  title: string;
  /** Sidebar navigation component */
  sidebar: ReactNode;
  /** Main content */
  children: ReactNode;
  /** Optional header actions */
  actions?: ReactNode;
  /** Additional CSS class */
  className?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const MotionBox = motion.create(Box);

const SIDEBAR_WIDTH = 280;

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * SettingsLayout - Layout template for settings pages.
 *
 * Features:
 * - Responsive sidebar navigation
 * - Mobile drawer support
 * - Animated transitions
 * - Header with title and actions
 *
 * @example
 * ```tsx
 * <SettingsLayout
 *   title="Account Settings"
 *   sidebar={<SettingsNav sections={sections} />}
 *   actions={<Button>Save</Button>}
 * >
 *   <SettingsContent />
 * </SettingsLayout>
 * ```
 */
export const SettingsLayout = forwardRef<HTMLDivElement, SettingsLayoutProps>(
  ({ title, sidebar, children, actions, className }, ref) => {
    const t = useTranslations("Components.settingsLayout");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
      <Box
        ref={ref}
        className={className}
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 4,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {isMobile && (
                <IconButton
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  aria-label={t("toggleSidebar")}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="h4" fontWeight={700}>
                {title}
              </Typography>
            </Box>
            {actions && <Box>{actions}</Box>}
          </Box>

          {/* Main content area */}
          <Box
            sx={{
              display: "flex",
              gap: 4,
              position: "relative",
            }}
          >
            {/* Sidebar - Desktop */}
            {!isMobile && (
              <Box
                sx={{
                  width: SIDEBAR_WIDTH,
                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{
                    position: "sticky",
                    top: 24,
                    borderRadius: 3,
                    bgcolor: "background.paper",
                    overflow: "hidden",
                  }}
                >
                  {sidebar}
                </Box>
              </Box>
            )}

            {/* Sidebar - Mobile Drawer */}
            <AnimatePresence>
              {isMobile && sidebarOpen && (
                <>
                  {/* Backdrop */}
                  <MotionBox
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setSidebarOpen(false)}
                    sx={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: "rgba(0, 0, 0, 0.5)",
                      zIndex: zIndex.drawer - 1,
                    }}
                  />

                  {/* Drawer */}
                  <MotionBox
                    initial={{ x: -SIDEBAR_WIDTH }}
                    animate={{ x: 0 }}
                    exit={{ x: -SIDEBAR_WIDTH }}
                    transition={springs.smooth}
                    sx={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      bottom: 0,
                      width: SIDEBAR_WIDTH,
                      bgcolor: "background.paper",
                      zIndex: zIndex.drawer,
                      overflowY: "auto",
                    }}
                  >
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                        {t("navigation")}
                      </Typography>
                      {sidebar}
                    </Box>
                  </MotionBox>
                </>
              )}
            </AnimatePresence>

            {/* Content area */}
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  borderRadius: 3,
                  bgcolor: "background.paper",
                  p: { xs: 2, md: 4 },
                }}
              >
                {children}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }
);

SettingsLayout.displayName = "SettingsLayout";

export default SettingsLayout;
