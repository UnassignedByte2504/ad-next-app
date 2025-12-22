"use client";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";

import { Avatar } from "@atoms/Avatar";
import { primary, neutral, springs, shapes } from "@/app/ui/theme";
import { alpha } from "@mui/material/styles";

// =============================================================================
// TYPES
// =============================================================================

export type MessageStatus = "sending" | "sent" | "delivered" | "read";
export type MessageDirection = "incoming" | "outgoing";

export interface MessageBubbleProps {
  /** Message content */
  content: string;
  /** Message timestamp */
  timestamp: Date;
  /** Direction of the message */
  direction: MessageDirection;
  /** Message status (for outgoing messages) */
  status?: MessageStatus;
  /** Sender avatar URL */
  avatar?: string;
  /** Sender name */
  senderName?: string;
  /** Show avatar */
  showAvatar?: boolean;
  /** Show timestamp */
  showTimestamp?: boolean;
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

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("default", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function StatusIcon({ status }: { status: MessageStatus }) {
  const iconStyle = {
    width: 14,
    height: 14,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    ml: 0.5,
  };

  switch (status) {
    case "sending":
      return (
        <Box component="span" sx={iconStyle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="3" opacity="0.5" />
          </svg>
        </Box>
      );
    case "sent":
      return (
        <Box component="span" sx={iconStyle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </Box>
      );
    case "delivered":
      return (
        <Box component="span" sx={iconStyle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />
          </svg>
        </Box>
      );
    case "read":
      return (
        <Box component="span" sx={{ ...iconStyle, color: primary.main }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />
          </svg>
        </Box>
      );
    default:
      return null;
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * MessageBubble - Chat message bubble component.
 *
 * Features:
 * - Incoming and outgoing message styles
 * - Message status indicators
 * - Avatar support
 * - Timestamp display
 * - Animated entrance
 *
 * @example
 * ```tsx
 * <MessageBubble
 *   content="Hey, want to jam sometime?"
 *   timestamp={new Date()}
 *   direction="incoming"
 *   avatar="/avatars/user.jpg"
 *   senderName="Carlos García"
 * />
 * ```
 */
export const MessageBubble = forwardRef<HTMLDivElement, MessageBubbleProps>(
  (
    {
      content,
      timestamp,
      direction,
      status = "sent",
      avatar,
      senderName,
      showAvatar = true,
      showTimestamp = true,
      className,
    },
    ref
  ) => {
    const isOutgoing = direction === "outgoing";

    return (
      <MotionBox
        ref={ref}
        className={className}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={springs.smooth}
        sx={{
          display: "flex",
          flexDirection: isOutgoing ? "row-reverse" : "row",
          alignItems: "flex-end",
          gap: 1,
          mb: 1,
        }}
      >
        {/* Avatar */}
        {showAvatar && (
          <Box sx={{ flexShrink: 0, mb: 0.5 }}>
            {!isOutgoing && senderName ? (
              <Avatar
                src={avatar}
                alt={senderName}
                initials={getInitials(senderName)}
                size="sm"
              />
            ) : (
              <Box sx={{ width: 32, height: 32 }} /> // Spacer for outgoing
            )}
          </Box>
        )}

        {/* Message bubble */}
        <Box
          sx={{
            maxWidth: "70%",
            minWidth: 60,
          }}
        >
          {/* Sender name (for incoming messages) */}
          {!isOutgoing && senderName && (
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                mb: 0.25,
                ml: 1.5,
                display: "block",
              }}
            >
              {senderName}
            </Typography>
          )}

          {/* Bubble */}
          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: 3,
              borderTopLeftRadius: isOutgoing ? shapes.md : shapes.xs,
              borderTopRightRadius: isOutgoing ? shapes.xs : shapes.md,
              bgcolor: isOutgoing ? primary.main : neutral[800],
              color: isOutgoing ? neutral[0] : "text.primary", // Use theme token
              position: "relative",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {content}
            </Typography>

            {/* Timestamp and status */}
            {showTimestamp && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 0.25,
                  mt: 0.5,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: isOutgoing
                      ? alpha(neutral[0], 0.7) // Use alpha() with theme token
                      : "text.secondary",
                    fontSize: "0.65rem",
                  }}
                >
                  {formatTime(timestamp)}
                </Typography>
                {isOutgoing && <StatusIcon status={status} />}
              </Box>
            )}
          </Box>
        </Box>
      </MotionBox>
    );
  }
);

MessageBubble.displayName = "MessageBubble";

export default MessageBubble;
