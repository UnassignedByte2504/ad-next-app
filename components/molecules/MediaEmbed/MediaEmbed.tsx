"use client";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { primary, neutral, springs } from "@/app/ui/theme";
import {
  MediaTrackCard,
  type MediaTrack,
  type MediaTrackCardSize,
  type MediaTrackCardVariant,
} from "@atoms/MediaTrackCard";

// =============================================================================
// TYPES
// =============================================================================

export interface MediaEmbedProps {
  /** Section title */
  title?: string;
  /** Tracks to display */
  tracks: MediaTrack[];
  /** Card size variant */
  size?: MediaTrackCardSize;
  /** Card visual variant */
  variant?: MediaTrackCardVariant;
  /** Max tracks to show */
  maxTracks?: number;
  /** Show platform badges */
  showPlatform?: boolean;
  /** Show track durations */
  showDuration?: boolean;
  /** Show loading skeleton */
  loading?: boolean;
  /** Editable mode */
  editable?: boolean;
  /** Edit callback */
  onEdit?: () => void;
  /** View all callback (when maxTracks limits display) */
  onViewAll?: () => void;
  /** Track click callback */
  onTrackClick?: (track: MediaTrack) => void;
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
 * MediaEmbed - Display a list of music tracks from various platforms.
 *
 * A section component that displays multiple MediaTrackCard components
 * with a title, loading states, and empty states. Supports tracks from
 * Spotify, YouTube Music, Apple Music, Tidal, and SoundCloud.
 *
 * Features:
 * - Multi-platform support with consistent styling
 * - Loading skeleton state
 * - Empty state with call-to-action
 * - Editable mode with edit button
 * - Max tracks limit with "view all" option
 * - Animated entrance for tracks
 *
 * @example
 * ```tsx
 * <MediaEmbed
 *   title="Mis canciones favoritas"
 *   tracks={[
 *     {
 *       id: "1",
 *       title: "Good News",
 *       artist: "Mac Miller",
 *       platform: "spotify",
 *       externalUrl: "https://open.spotify.com/track/xxx",
 *     },
 *     {
 *       id: "2",
 *       title: "Bohemian Rhapsody",
 *       artist: "Queen",
 *       platform: "youtube-music",
 *       externalUrl: "https://music.youtube.com/watch?v=xxx",
 *     },
 *   ]}
 *   maxTracks={5}
 *   onViewAll={() => openModal()}
 * />
 * ```
 */
export const MediaEmbed = forwardRef<HTMLDivElement, MediaEmbedProps>(
  (
    {
      title,
      tracks,
      size = "md",
      variant = "filled",
      maxTracks,
      showPlatform = true,
      showDuration = true,
      loading = false,
      editable = false,
      onEdit,
      onViewAll,
      onTrackClick,
      className,
    },
    ref
  ) => {
    const t = useTranslations("Components.mediaEmbed");
    const displayedTracks = maxTracks ? tracks.slice(0, maxTracks) : tracks;
    const hasMore = maxTracks ? tracks.length > maxTracks : false;

    // Loading state
    if (loading) {
      return (
        <Box ref={ref} className={className}>
          {title && (
            <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                variant="rounded"
                height={size === "sm" ? 72 : size === "md" ? 96 : 112}
                sx={{ borderRadius: 3 }}
              />
            ))}
          </Box>
        </Box>
      );
    }

    // Empty state
    if (tracks.length === 0) {
      return (
        <Box ref={ref} className={className}>
          {title && (
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {title}
            </Typography>
          )}
          <Box
            sx={{
              p: 4,
              borderRadius: 3,
              bgcolor: neutral[850],
              textAlign: "center",
            }}
          >
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              {t("noTracks")}
            </Typography>
            {editable && (
              <Typography
                component="button"
                onClick={onEdit}
                sx={{
                  background: "none",
                  border: "none",
                  color: primary.main,
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {t("addTracks")}
              </Typography>
            )}
          </Box>
        </Box>
      );
    }

    return (
      <Box ref={ref} className={className}>
        {/* Header */}
        {(title || editable || hasMore) && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            {title && (
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
            )}
            <Box sx={{ display: "flex", gap: 2 }}>
              {hasMore && onViewAll && (
                <Typography
                  component="button"
                  onClick={onViewAll}
                  sx={{
                    background: "none",
                    border: "none",
                    color: neutral[400],
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    "&:hover": { color: neutral[200] },
                  }}
                >
                  {t("viewAll")}
                </Typography>
              )}
              {editable && (
                <Typography
                  component="button"
                  onClick={onEdit}
                  sx={{
                    background: "none",
                    border: "none",
                    color: primary.main,
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {t("edit")}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Track List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {displayedTracks.map((track, index) => (
            <MotionBox
              key={track.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springs.smooth, delay: index * 0.05 }}
            >
              <MediaTrackCard
                track={track}
                size={size}
                variant={variant}
                showPlatform={showPlatform}
                showDuration={showDuration}
                onClick={onTrackClick ? () => onTrackClick(track) : undefined}
              />
            </MotionBox>
          ))}
        </Box>

        {/* "And X more" indicator */}
        {hasMore && !onViewAll && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              textAlign: "center",
              color: neutral[500],
              mt: 2,
            }}
          >
            +{tracks.length - (maxTracks || 0)} more
          </Typography>
        )}
      </Box>
    );
  }
);

MediaEmbed.displayName = "MediaEmbed";

export default MediaEmbed;
