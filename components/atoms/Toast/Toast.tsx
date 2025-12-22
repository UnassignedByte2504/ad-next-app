"use client";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Info, AlertTriangle, X } from "lucide-react";

import { springs, neutral, semantic, shadows } from "@/app/ui/theme";

// =============================================================================
// TYPES
// =============================================================================

export interface ToastProps {
  /** Toast message to display */
  message: string;
  /** Whether the toast is visible */
  isVisible: boolean;
  /** Toast variant - determines color and icon */
  variant?: "success" | "info" | "warning" | "error";
  /** Additional CSS class */
  className?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const variantConfig = {
  success: {
    icon: Check,
    bgColor: semantic.success.main,
    textColor: neutral[0], // Use theme token instead of #FFFFFF
  },
  info: {
    icon: Info,
    bgColor: semantic.info.main,
    textColor: neutral[0],
  },
  warning: {
    icon: AlertTriangle,
    bgColor: semantic.warning.main,
    textColor: semantic.warning.contrastText,
  },
  error: {
    icon: X,
    bgColor: semantic.error.main,
    textColor: neutral[0],
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Toast notification component for temporary feedback messages.
 *
 * Displays a fixed notification at the bottom of the screen with
 * smooth enter/exit animations using Framer Motion.
 *
 * ## Features
 * - **M3 Expressive Animations**: Spring physics for smooth transitions
 * - **Multiple Variants**: success, info, warning, error
 * - **Auto-dismiss**: Parent controls visibility with timeout
 * - **Accessible**: Uses semantic colors and clear iconography
 *
 * ## Usage
 * ```tsx
 * const [toast, setToast] = useState({ visible: false, message: "" });
 *
 * const showToast = (message: string) => {
 *   setToast({ visible: true, message });
 *   setTimeout(() => setToast({ visible: false, message: "" }), 2500);
 * };
 *
 * <Toast
 *   message={toast.message}
 *   isVisible={toast.visible}
 *   variant="success"
 * />
 * ```
 */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ message, isVisible, variant = "success", className }, ref) => {
    const config = variantConfig[variant];
    const Icon = config.icon;

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={springs.smooth}
            style={{
              position: "fixed",
              bottom: 24,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
            }}
            className={className}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 3,
                py: 1.5,
                bgcolor: config.bgColor,
                color: config.textColor,
                borderRadius: 2,
                boxShadow: shadows.lg, // Amber-tinted shadow from theme
                minWidth: 200,
              }}
            >
              <Icon size={18} />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: "inherit",
                }}
              >
                {message}
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

Toast.displayName = "Toast";
export default Toast;
