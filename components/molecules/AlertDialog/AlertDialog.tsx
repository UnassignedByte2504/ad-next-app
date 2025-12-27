"use client";

import { forwardRef, type ReactNode } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Button } from "@atoms/Button";
import { primary, semantic, springs } from "@/app/ui/theme";

// =============================================================================
// TYPES
// =============================================================================

export type AlertVariant = "info" | "success" | "warning" | "error" | "confirm";

export interface AlertDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Close handler */
  onClose: () => void;
  /** Dialog variant */
  variant?: AlertVariant;
  /** Dialog title */
  title: string;
  /** Dialog message/content */
  message: ReactNode;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Confirm handler */
  onConfirm?: () => void;
  /** Cancel handler (defaults to onClose) */
  onCancel?: () => void;
  /** Whether confirm button is loading */
  loading?: boolean;
  /** Additional CSS class */
  className?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const MotionBox = motion.create(Box);

const variantConfig: Record<
  AlertVariant,
  {
    icon: typeof InfoOutlinedIcon;
    color: string;
    bgColor: string;
  }
> = {
  info: {
    icon: InfoOutlinedIcon,
    color: semantic.info.main,
    bgColor: semantic.info.bg,
  },
  success: {
    icon: CheckCircleOutlineIcon,
    color: semantic.success.main,
    bgColor: semantic.success.bg,
  },
  warning: {
    icon: WarningAmberIcon,
    color: semantic.warning.main,
    bgColor: semantic.warning.bg,
  },
  error: {
    icon: ErrorOutlineIcon,
    color: semantic.error.main,
    bgColor: semantic.error.bg,
  },
  confirm: {
    icon: HelpOutlineIcon,
    color: primary.main,
    bgColor: `${primary.main}15`,
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * AlertDialog - Modal dialog for alerts and confirmations.
 *
 * Features:
 * - Multiple variants (info, success, warning, error, confirm)
 * - Custom icons per variant
 * - Animated entrance
 * - Loading state for async actions
 * - Accessible ARIA attributes
 *
 * @example
 * ```tsx
 * <AlertDialog
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   variant="confirm"
 *   title="Delete item?"
 *   message="This action cannot be undone."
 *   confirmText="Delete"
 *   onConfirm={handleDelete}
 * />
 * ```
 */
export const AlertDialog = forwardRef<HTMLDivElement, AlertDialogProps>(
  (
    {
      open,
      onClose,
      variant = "info",
      title,
      message,
      confirmText,
      cancelText,
      onConfirm,
      onCancel,
      loading = false,
      className,
    },
    ref
  ) => {
    const t = useTranslations("Components.alertDialog");
    const config = variantConfig[variant];
    const Icon = config.icon;

    const showCancel = variant === "confirm" || cancelText;
    const defaultConfirmText = variant === "confirm" ? t("confirm") : t("ok");
    const defaultCancelText = t("cancel");

    const handleCancel = () => {
      if (onCancel) {
        onCancel();
      } else {
        onClose();
      }
    };

    const handleConfirm = () => {
      if (onConfirm) {
        onConfirm();
      } else {
        onClose();
      }
    };

    return (
      <Dialog
        ref={ref}
        open={open}
        onClose={loading ? undefined : onClose}
        className={className}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: "background.paper",
          },
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={onClose}
          disabled={loading}
          aria-label={t("close")}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "text.secondary",
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogTitle sx={{ pt: 4, pb: 2, textAlign: "center" }}>
          {/* Icon */}
          <MotionBox
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={springs.bouncy}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: config.bgColor,
              mx: "auto",
              mb: 2,
            }}
          >
            <Icon sx={{ fontSize: 32, color: config.color }} />
          </MotionBox>

          {/* Title */}
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pb: 2, textAlign: "center" }}>
          {typeof message === "string" ? (
            <Typography variant="body1" color="text.secondary">
              {message}
            </Typography>
          ) : (
            message
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
            pt: 1,
            justifyContent: "center",
            gap: 1,
          }}
        >
          {showCancel && (
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={loading}
            >
              {cancelText || defaultCancelText}
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleConfirm}
            loading={loading}
            sx={{
              bgcolor: variant === "error" ? "error.main" : config.color,
              "&:hover": {
                bgcolor: variant === "error" ? "error.dark" : config.color,
                filter: "brightness(0.9)",
              },
            }}
          >
            {confirmText || defaultConfirmText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

AlertDialog.displayName = "AlertDialog";

export default AlertDialog;
