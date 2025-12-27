import type { Meta, StoryObj } from "@storybook/react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { MediaTrackCard } from "./MediaTrackCard";
import { PlatformBadge } from "./PlatformBadge";
import type { MediaTrack, StreamingPlatform } from "./index";

// =============================================================================
// MOCK DATA
// =============================================================================

const mockTracks: Record<string, MediaTrack> = {
  spotify: {
    id: "1",
    title: "Good News",
    artist: "Mac Miller",
    album: "Circles",
    duration: 167,
    platform: "spotify",
    artworkUrl:
      "https://i.scdn.co/image/ab67616d0000b273c027ad28821777b00dcaa888",
    externalUrl: "https://open.spotify.com/track/5rhMc6IqSdVsyF7bRieSTc",
  },
  youtubeMusic: {
    id: "2",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    duration: 354,
    platform: "youtube-music",
    artworkUrl:
      "https://lh3.googleusercontent.com/xJz5EQGEV0jWPH9Pz50IpJGm_tA8zGpKlRqAhJHOVnwN0-U9Zc5pKU1qIqnMxOc7qWrA9g4=w544-h544-l90-rj",
    externalUrl: "https://music.youtube.com/watch?v=fJ9rUzIMcZQ",
  },
  appleMusic: {
    id: "3",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: 200,
    platform: "apple-music",
    artworkUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/b6/2e/e0/b62ee0e0-2d9e-5cd7-f0ec-8e7ec0d3e96e/source/600x600bb.jpg",
    externalUrl: "https://music.apple.com/song/blinding-lights/1499378108",
  },
  tidal: {
    id: "4",
    title: "HUMBLE.",
    artist: "Kendrick Lamar",
    album: "DAMN.",
    duration: 177,
    platform: "tidal",
    artworkUrl:
      "https://resources.tidal.com/images/8aff4e02/bfbf/4c7f/b9a7/51e5a0d98c0c/320x320.jpg",
    externalUrl: "https://tidal.com/track/73038026",
  },
  soundcloud: {
    id: "5",
    title: "Dreams",
    artist: "Fleetwood Mac",
    album: "Rumours",
    duration: 257,
    platform: "soundcloud",
    artworkUrl:
      "https://i1.sndcdn.com/artworks-000178320652-x5t5hg-t500x500.jpg",
    externalUrl: "https://soundcloud.com/fleetwood-mac/dreams",
  },
  noArtwork: {
    id: "6",
    title: "Mystery Track",
    artist: "Unknown Artist",
    duration: 180,
    platform: "spotify",
    externalUrl: "https://open.spotify.com/track/xxx",
  },
};

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof MediaTrackCard> = {
  title: "Atoms/MediaTrackCard",
  component: MediaTrackCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Platform-agnostic music track card component.

## Features
- **Multi-Platform Support**: Spotify, YouTube Music, Apple Music, Tidal, SoundCloud
- **MD3 Design**: Follows Material Design 3 card specifications
- **Size Variants**: Small (48px), Medium (64px), Large (80px) artwork
- **Visual Variants**: Filled, Outlined, Elevated
- **Interactive Animations**: Spring-based hover effects
- **Platform Badges**: Color-coded platform identification

## Usage
Use this component to display individual tracks with consistent styling
across different streaming platforms. The card links to the external
streaming platform when the play button is clicked.

## Ayla Designs Integration
This component replaces the iframe-based SpotifyEmbed for a more
controlled, branded experience aligned with Ayla's design system.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Card size affecting artwork and text",
    },
    variant: {
      control: "select",
      options: ["filled", "outlined", "elevated"],
      description: "Visual style variant (MD3)",
    },
    showPlatform: {
      control: "boolean",
      description: "Show platform badge",
    },
    showDuration: {
      control: "boolean",
      description: "Show track duration",
    },
    interactive: {
      control: "boolean",
      description: "Enable hover animations",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default track card with Spotify styling
 */
export const Default: Story = {
  args: {
    track: mockTracks.spotify,
    size: "md",
    variant: "filled",
    showPlatform: true,
    showDuration: true,
    interactive: true,
  },
};

/**
 * All size variants comparison
 */
export const Sizes: Story = {
  render: () => (
    <Stack spacing={3} sx={{ width: 400 }}>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
          Small (48px artwork)
        </Typography>
        <MediaTrackCard track={mockTracks.spotify} size="sm" />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
          Medium (64px artwork)
        </Typography>
        <MediaTrackCard track={mockTracks.spotify} size="md" />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
          Large (80px artwork)
        </Typography>
        <MediaTrackCard track={mockTracks.spotify} size="lg" />
      </Box>
    </Stack>
  ),
};

/**
 * All visual variants (MD3 spec)
 */
export const Variants: Story = {
  render: () => (
    <Stack spacing={3} sx={{ width: 400 }}>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
          Filled (Default)
        </Typography>
        <MediaTrackCard track={mockTracks.spotify} variant="filled" />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
          Outlined
        </Typography>
        <MediaTrackCard track={mockTracks.spotify} variant="outlined" />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
          Elevated
        </Typography>
        <MediaTrackCard track={mockTracks.spotify} variant="elevated" />
      </Box>
    </Stack>
  ),
};

/**
 * All supported streaming platforms
 */
export const AllPlatforms: Story = {
  render: () => (
    <Stack spacing={2} sx={{ width: 450 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Supported Platforms
      </Typography>
      <MediaTrackCard track={mockTracks.spotify} />
      <MediaTrackCard track={mockTracks.youtubeMusic} />
      <MediaTrackCard track={mockTracks.appleMusic} />
      <MediaTrackCard track={mockTracks.tidal} />
      <MediaTrackCard track={mockTracks.soundcloud} />
    </Stack>
  ),
};

/**
 * Without album artwork (fallback state)
 */
export const NoArtwork: Story = {
  args: {
    track: mockTracks.noArtwork,
    size: "md",
    variant: "filled",
  },
};

/**
 * Minimal card without duration or platform
 */
export const Minimal: Story = {
  args: {
    track: mockTracks.spotify,
    size: "md",
    variant: "filled",
    showPlatform: false,
    showDuration: false,
  },
};

/**
 * Non-interactive (static) card
 */
export const NonInteractive: Story = {
  args: {
    track: mockTracks.spotify,
    interactive: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Card without hover animations, for use in static contexts.",
      },
    },
  },
};

/**
 * Compact list layout
 */
export const CompactList: Story = {
  render: () => (
    <Stack spacing={1} sx={{ width: 380 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.7 }}>
        Playlist - 5 tracks
      </Typography>
      {Object.values(mockTracks)
        .slice(0, 5)
        .map((track) => (
          <MediaTrackCard
            key={track.id}
            track={track}
            size="sm"
            variant="filled"
            showDuration={false}
          />
        ))}
    </Stack>
  ),
};

/**
 * Platform badges standalone
 */
export const PlatformBadges: Story = {
  render: () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Icon Only (Default)
        </Typography>
        <Stack direction="row" spacing={2}>
          {(
            [
              "spotify",
              "youtube-music",
              "apple-music",
              "tidal",
              "soundcloud",
            ] as StreamingPlatform[]
          ).map((platform) => (
            <PlatformBadge key={platform} platform={platform} size="md" />
          ))}
        </Stack>
      </Box>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          With Labels
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          {(
            [
              "spotify",
              "youtube-music",
              "apple-music",
              "tidal",
              "soundcloud",
            ] as StreamingPlatform[]
          ).map((platform) => (
            <PlatformBadge
              key={platform}
              platform={platform}
              size="md"
              showLabel
            />
          ))}
        </Stack>
      </Box>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Size Variants
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <PlatformBadge platform="spotify" size="sm" />
          <PlatformBadge platform="spotify" size="md" />
          <PlatformBadge platform="spotify" size="lg" />
        </Stack>
      </Box>
    </Stack>
  ),
};

/**
 * Real-world profile section example
 */
export const ProfileSection: Story = {
  render: () => (
    <Box
      sx={{
        width: 450,
        p: 3,
        bgcolor: "background.default",
        borderRadius: 3,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Mis canciones favoritas
      </Typography>
      <Stack spacing={1.5}>
        <MediaTrackCard track={mockTracks.spotify} variant="filled" />
        <MediaTrackCard track={mockTracks.appleMusic} variant="filled" />
        <MediaTrackCard track={mockTracks.youtubeMusic} variant="filled" />
      </Stack>
    </Box>
  ),
};
