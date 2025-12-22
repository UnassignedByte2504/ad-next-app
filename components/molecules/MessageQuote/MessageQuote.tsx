"use client";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ReplyIcon from "@mui/icons-material/Reply";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { primary, neutral, springs } from "@/app/ui/theme";

// =============================================================================
// TYPES
// =============================================================================

export interface MessageQuoteProps {
  /** Original message content */
  content: string;
  /** Original message sender name */
  senderName: string;
  /** Timestamp of original message */
  timestamp?: Date;
  /** Whether this is the current user's message being quoted */
  isOwnMessage?: boolean;
  /** Show close button */
  showClose?: boolean;
  /** Close handler */
  onClose?: () => void;
  /** Click handler (to scroll to original message) */
  onClick?: () => void;
  /** Additional CSS class */
  className?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const MotionBox = motion.create(Box);

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * MessageQuote - Quoted message reply component.
 *
 * Features:
 * - Shows quoted message preview
 * - Distinguishes own vs other's messages
 * - Animated entrance/exit
 * - Close button for clearing quote
 * - Click to scroll to original
 *
 * @example
 * ```tsx
 * <MessageQuote
 *   content="Are you free this weekend?"
 *   senderName="Carlos García"
 *   onClose={() => setQuote(null)}
 *   onClick={() => scrollToMessage(messageId)}
 * />
 * ```
 */
export const MessageQuote = forwardRef<HTMLDivElement, MessageQuoteProps>(
  (
    {
      content,
      senderName,
      timestamp,
      isOwnMessage = false,
      showClose = true,
      onClose,
      onClick,
      className,
    },
    ref
  ) => {
    const t = useTranslations("Components.messageQuote");

    // Truncate content if too long
    const maxLength = 100;
    const truncatedContent =
      content.length > maxLength
        ? `${content.substring(0, maxLength)}...`
        : content;

    return (
      <MotionBox
        ref={ref}
        className={className}
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        transition={springs.smooth}
        sx={{
          display: "flex",
          alignItems: "stretch",
          gap: 1,
          p: 1,
          borderRadius: 2,
          bgcolor: neutral[850],
          cursor: onClick ? "pointer" : "default",
          "&:hover": onClick
            ? {
                bgcolor: neutral[800],
              }
            : {},
        }}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={(e) => {
          if (onClick && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {/* Reply icon */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            color: isOwnMessage ? primary.main : "text.secondary",
          }}
        >
          <ReplyIcon fontSize="small" />
        </Box>

        {/* Accent bar */}
        <Box
          sx={{
            width: 3,
            borderRadius: 1,
            bgcolor: isOwnMessage ? primary.main : neutral[500],
            flexShrink: 0,
          }}
        />

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0, py: 0.25 }}>
          <Typography
            variant="caption"
            sx={{
              color: isOwnMessage ? primary.main : "text.secondary",
              fontWeight: 600,
              display: "block",
            }}
          >
            {isOwnMessage ? t("you") : senderName}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: "0.8rem",
            }}
          >
            {truncatedContent}
          </Typography>
        </Box>

        {/* Close button */}
        {showClose && onClose && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label={t("closeQuote")}
            sx={{
              alignSelf: "flex-start",
              color: "text.secondary",
              "&:hover": {
                color: "text.primary",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </MotionBox>
    );
  }
);

MessageQuote.displayName = "MessageQuote";

export default MessageQuote;
