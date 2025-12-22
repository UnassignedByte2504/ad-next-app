"use client";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";

import { primary, neutral, shapes, springs } from "@/app/ui/theme";
import { PlatformBadge, type StreamingPlatform } from "./PlatformBadge";

// =============================================================================
// TYPES
// =============================================================================

export interface MediaTrack {
  /** Unique track identifier */
  id: string;
  /** Track title */
  title: string;
  /** Artist name */
  artist: string;
  /** Album artwork URL */
  artworkUrl?: string;
  /** Track duration in seconds */
  duration?: number;
  /** Album name */
  album?: string;
  /** Streaming platform */
  platform: StreamingPlatform;
  /** External URL to open in streaming platform */
  externalUrl: string;
}

export type MediaTrackCardSize = "sm" | "md" | "lg";
export type MediaTrackCardVariant = "filled" | "outlined" | "elevated";

export interface MediaTrackCardProps {
  /** Track data */
  track: MediaTrack;
  /** Card size variant */
  size?: MediaTrackCardSize;
  /** Visual variant following MD3 specs */
  variant?: MediaTrackCardVariant;
  /** Show platform badge */
  showPlatform?: boolean;
  /** Show duration */
  showDuration?: boolean;
  /** Enable hover animations */
  interactive?: boolean;
  /** Click handler (e.g., for in-app preview) */
  onClick?: () => void;
  /** Additional CSS class */
  className?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const MotionBox = motion.create(Box);

const sizeConfig: Record<
  MediaTrackCardSize,
  {
    artworkSize: number;
    padding: number;
    titleSize: string;
    subtitleSize: string;
    playButtonSize: "small" | "medium";
  }
> = {
  sm: {
    artworkSize: 48,
    padding: 12,
    titleSize: "0.875rem",
    subtitleSize: "0.75rem",
    playButtonSize: "small",
  },
  md: {
    artworkSize: 64,
    padding: 16,
    titleSize: "1rem",
    subtitleSize: "0.875rem",
    playButtonSize: "medium",
  },
  lg: {
    artworkSize: 80,
    padding: 20,
    titleSize: "1.125rem",
    subtitleSize: "0.875rem",
    playButtonSize: "medium",
  },
};

const variantStyles: Record<
  MediaTrackCardVariant,
  {
    background: string;
    border: string;
    shadow: string;
  }
> = {
  filled: {
    background: neutral[850],
    border: "none",
    shadow: "none",
  },
  outlined: {
    background: "transparent",
    border: `1px solid ${alpha(neutral[600], 0.4)}`,
    shadow: "none",
  },
  elevated: {
    background: neutral[850],
    border: "none",
    shadow: `0 4px 20px ${alpha(neutral[1000], 0.25)}`,
  },
};

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Format duration from seconds to mm:ss
 */
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * MediaTrackCard - Atom for displaying a single music track.
 *
 * A clean, platform-agnostic card displaying track information with
 * album artwork, title, artist, and streaming platform badge.
 * Follows Material Design 3 card specifications.
 *
 * Features:
 * - Support for Spotify, YouTube Music, Apple Music, Tidal, SoundCloud
 * - Three size variants (sm, md, lg)
 * - Three visual variants (filled, outlined, elevated)
 * - Platform-specific badges and colors
 * - Optional duration display
 * - Interactive hover animations
 * - External link to streaming platform
 *
 * @example
 * ```tsx
 * <MediaTrackCard
 *   track={{
 *     id: "1",
 *     title: "Good News",
 *     artist: "Mac Miller",
 *     artworkUrl: "/album-art.jpg",
 *     duration: 167,
 *     platform: "spotify",
 *     externalUrl: "https://open.spotify.com/track/xxx",
 *   }}
 *   size="md"
 *   variant="filled"
 *   showPlatform
 *   showDuration
 * />
 * ```
 */
export const MediaTrackCard = forwardRef<HTMLDivElement, MediaTrackCardProps>(
  (
    {
      track,
      size = "md",
      variant = "filled",
      showPlatform = true,
      showDuration = true,
      interactive = true,
      onClick,
      className,
    },
    ref
  ) => {
    const config = sizeConfig[size];
    const styles = variantStyles[variant];

    const handleExternalClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      window.open(track.externalUrl, "_blank", "noopener,noreferrer");
    };

    const CardWrapper = interactive ? MotionBox : Box;
    const motionProps = interactive
      ? {
          whileHover: { scale: 1.01, y: -2 },
          whileTap: { scale: 0.99 },
          transition: springs.smooth,
        }
      : {};

    return (
      <CardWrapper
        ref={ref}
        className={className}
        onClick={onClick}
        {...motionProps}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: `${config.padding}px`,
          borderRadius: `${shapes.lg}px`,
          background: styles.background,
          border: styles.border,
          boxShadow: styles.shadow,
          cursor: onClick || interactive ? "pointer" : "default",
          overflow: "hidden",
          position: "relative",
          // Subtle gradient overlay for depth
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 0% 0%, ${alpha(primary.main, 0.03)} 0%, transparent 50%)`,
            pointerEvents: "none",
          },
        }}
      >
        {/* Album Artwork */}
        <Box
          sx={{
            width: config.artworkSize,
            height: config.artworkSize,
            minWidth: config.artworkSize,
            borderRadius: `${shapes.md}px`,
            overflow: "hidden",
            bgcolor: neutral[800],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            boxShadow: `0 2px 8px ${alpha(neutral[1000], 0.3)}`,
          }}
        >
          {track.artworkUrl ? (
            <Box
              component="img"
              src={track.artworkUrl}
              alt={`${track.title} - ${track.artist}`}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            // Placeholder with music note pattern
            <Box
              sx={{
                width: "100%",
                height: "100%",
                background: `linear-gradient(135deg, ${neutral[700]} 0%, ${neutral[800]} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{ fontSize: config.artworkSize * 0.4, opacity: 0.5 }}
              >
                🎵
              </Typography>
            </Box>
          )}
        </Box>

        {/* Track Info */}
        <Box sx={{ flex: 1, minWidth: 0, position: "relative", zIndex: 1 }}>
          {/* Platform Badge (positioned top-right if shown) */}
          {showPlatform && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
              }}
            >
              <PlatformBadge platform={track.platform} size={size} />
            </Box>
          )}

          {/* Title */}
          <Typography
            variant="body1"
            sx={{
              fontSize: config.titleSize,
              fontWeight: 600,
              color: neutral[100],
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              pr: showPlatform ? 6 : 0, // Space for platform badge
              lineHeight: 1.3,
            }}
          >
            {track.title}
          </Typography>

          {/* Artist */}
          <Typography
            variant="body2"
            sx={{
              fontSize: config.subtitleSize,
              color: neutral[400],
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              mt: 0.25,
              lineHeight: 1.3,
            }}
          >
            {track.artist}
          </Typography>

          {/* Duration & Album */}
          {(showDuration || track.album) && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: 0.5,
              }}
            >
              {showDuration && track.duration && (
                <Typography
                  variant="caption"
                  sx={{
                    color: neutral[500],
                    fontSize: "0.75rem",
                  }}
                >
                  {formatDuration(track.duration)}
                </Typography>
              )}
              {showDuration && track.duration && track.album && (
                <Typography
                  variant="caption"
                  sx={{ color: neutral[600], fontSize: "0.75rem" }}
                >
                  •
                </Typography>
              )}
              {track.album && (
                <Typography
                  variant="caption"
                  sx={{
                    color: neutral[500],
                    fontSize: "0.75rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {track.album}
                </Typography>
              )}
            </Box>
          )}
        </Box>

        {/* Play/Open Button */}
        <IconButton
          size={config.playButtonSize}
          onClick={handleExternalClick}
          sx={{
            bgcolor: alpha(primary.main, 0.1),
            color: primary.main,
            "&:hover": {
              bgcolor: alpha(primary.main, 0.2),
              transform: "scale(1.05)",
            },
            transition: "all 0.2s ease",
          }}
          aria-label={`Open ${track.title} on ${track.platform}`}
        >
          <OpenInNewIcon fontSize={size === "sm" ? "small" : "medium"} />
        </IconButton>
      </CardWrapper>
    );
  }
);

MediaTrackCard.displayName = "MediaTrackCard";

export default MediaTrackCard;
