"use client";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { neutral, springs } from "@/app/ui/theme";

// =============================================================================
// TYPES
// =============================================================================

export interface ChatDateDividerProps {
  /** Date to display */
  date: Date;
  /** Additional CSS class */
  className?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const MotionBox = motion.create(Box);

// =============================================================================
// HELPERS
// =============================================================================

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

function isThisYear(date: Date): boolean {
  return date.getFullYear() === new Date().getFullYear();
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ChatDateDivider - Date separator for chat conversations.
 *
 * Features:
 * - Smart date formatting (Today, Yesterday, date)
 * - Animated entrance
 * - Theme-aware styling
 *
 * @example
 * ```tsx
 * <ChatDateDivider date={new Date()} />
 * ```
 */
export const ChatDateDivider = forwardRef<HTMLDivElement, ChatDateDividerProps>(
  ({ date, className }, ref) => {
    const t = useTranslations("Components.chatDateDivider");

    const formatDate = (date: Date): string => {
      if (isToday(date)) {
        return t("today");
      }
      if (isYesterday(date)) {
        return t("yesterday");
      }
      if (isThisYear(date)) {
        return new Intl.DateTimeFormat("default", {
          month: "long",
          day: "numeric",
        }).format(date);
      }
      return new Intl.DateTimeFormat("default", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    };

    return (
      <MotionBox
        ref={ref}
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={springs.smooth}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          my: 2,
        }}
      >
        <Divider sx={{ flex: 1, borderColor: neutral[700] }} />
        <Typography
          variant="caption"
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: 2,
            bgcolor: neutral[800],
            color: "text.secondary",
            fontSize: "0.75rem",
            fontWeight: 500,
          }}
        >
          {formatDate(date)}
        </Typography>
        <Divider sx={{ flex: 1, borderColor: neutral[700] }} />
      </MotionBox>
    );
  }
);

ChatDateDivider.displayName = "ChatDateDivider";

export default ChatDateDivider;
