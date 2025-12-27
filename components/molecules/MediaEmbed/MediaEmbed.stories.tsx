import type { Meta, StoryObj } from "@storybook/react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { MediaEmbed } from "./MediaEmbed";
import type { MediaTrack } from "@atoms/MediaTrackCard";

// =============================================================================
// MOCK DATA
// =============================================================================

const mockTracks: MediaTrack[] = [
  {
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
  {
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
  {
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
  {
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
  {
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
  {
    id: "6",
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    album: "Led Zeppelin IV",
    duration: 482,
    platform: "spotify",
    artworkUrl:
      "https://i.scdn.co/image/ab67616d0000b273c8a11e48c91a982d086afc69",
    externalUrl: "https://open.spotify.com/track/5CQ30WqJwcep0pYcV4AMNc",
  },
];

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof MediaEmbed> = {
  title: "Molecules/MediaEmbed",
  component: MediaEmbed,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Multi-platform music track list component.

## Features
- **Multi-Platform Support**: Displays tracks from Spotify, YouTube Music, Apple Music, Tidal, SoundCloud
- **Loading State**: Skeleton placeholders while loading
- **Empty State**: Call-to-action for adding tracks
- **Editable Mode**: Edit button for profile owners
- **Max Tracks**: Limit display with "view all" option
- **Animated Entrance**: Staggered animation for track cards

## Usage
Use this component to display a user's favorite tracks in their profile.
Replaces the iframe-based SpotifyEmbed with a consistent, branded experience.

## Comparison with SpotifyEmbed
| Feature | SpotifyEmbed | MediaEmbed |
|---------|--------------|------------|
| Platforms | Spotify only | 5 platforms |
| Styling | Iframe (external) | Full control |
| Performance | Heavy iframes | Lightweight |
| Branding | Spotify's design | Ayla design |
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Track card size",
    },
    variant: {
      control: "select",
      options: ["filled", "outlined", "elevated"],
      description: "Track card visual variant",
    },
    maxTracks: {
      control: { type: "number", min: 1, max: 10 },
      description: "Maximum tracks to display",
    },
    showPlatform: {
      control: "boolean",
      description: "Show platform badges",
    },
    showDuration: {
      control: "boolean",
      description: "Show track durations",
    },
    loading: {
      control: "boolean",
      description: "Show loading skeleton",
    },
    editable: {
      control: "boolean",
      description: "Show edit button",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default media embed with title and tracks
 */
export const Default: Story = {
  args: {
    title: "Mis canciones favoritas",
    tracks: mockTracks.slice(0, 3),
    size: "md",
    variant: "filled",
    showPlatform: true,
    showDuration: true,
  },
  render: (args) => (
    <Box sx={{ width: 450 }}>
      <MediaEmbed {...args} />
    </Box>
  ),
};

/**
 * Loading state with skeleton
 */
export const Loading: Story = {
  args: {
    title: "Mis canciones favoritas",
    tracks: [],
    loading: true,
  },
  render: (args) => (
    <Box sx={{ width: 450 }}>
      <MediaEmbed {...args} />
    </Box>
  ),
};

/**
 * Empty state with no tracks
 */
export const Empty: Story = {
  args: {
    title: "Mis canciones favoritas",
    tracks: [],
    editable: true,
    onEdit: () => alert("Edit clicked!"),
  },
  render: (args) => (
    <Box sx={{ width: 450 }}>
      <MediaEmbed {...args} />
    </Box>
  ),
};

/**
 * Editable mode with edit button
 */
export const Editable: Story = {
  args: {
    title: "Mis canciones favoritas",
    tracks: mockTracks.slice(0, 3),
    editable: true,
    onEdit: () => alert("Edit clicked!"),
  },
  render: (args) => (
    <Box sx={{ width: 450 }}>
      <MediaEmbed {...args} />
    </Box>
  ),
};

/**
 * With max tracks limit and "view all" button
 */
export const WithMaxTracks: Story = {
  args: {
    title: "Mis canciones favoritas",
    tracks: mockTracks,
    maxTracks: 3,
    onViewAll: () => alert("View all clicked!"),
  },
  render: (args) => (
    <Box sx={{ width: 450 }}>
      <MediaEmbed {...args} />
    </Box>
  ),
};

/**
 * Small size variant
 */
export const SmallSize: Story = {
  args: {
    title: "Canciones recientes",
    tracks: mockTracks.slice(0, 4),
    size: "sm",
  },
  render: (args) => (
    <Box sx={{ width: 400 }}>
      <MediaEmbed {...args} />
    </Box>
  ),
};

/**
 * Large size variant
 */
export const LargeSize: Story = {
  args: {
    title: "Top Tracks",
    tracks: mockTracks.slice(0, 3),
    size: "lg",
  },
  render: (args) => (
    <Box sx={{ width: 500 }}>
      <MediaEmbed {...args} />
    </Box>
  ),
};

/**
 * Outlined variant cards
 */
export const OutlinedVariant: Story = {
  args: {
    title: "Playlist",
    tracks: mockTracks.slice(0, 3),
    variant: "outlined",
  },
  render: (args) => (
    <Box sx={{ width: 450 }}>
      <MediaEmbed {...args} />
    </Box>
  ),
};

/**
 * Elevated variant cards
 */
export const ElevatedVariant: Story = {
  args: {
    title: "Featured Tracks",
    tracks: mockTracks.slice(0, 3),
    variant: "elevated",
  },
  render: (args) => (
    <Box sx={{ width: 450 }}>
      <MediaEmbed {...args} />
    </Box>
  ),
};

/**
 * Mixed platforms showcase
 */
export const MixedPlatforms: Story = {
  args: {
    title: "Across All Platforms",
    tracks: mockTracks.slice(0, 5),
  },
  render: (args) => (
    <Box sx={{ width: 450 }}>
      <MediaEmbed {...args} />
    </Box>
  ),
};

/**
 * Profile section integration example
 */
export const ProfileSection: Story = {
  render: () => (
    <Box
      sx={{
        width: 500,
        p: 3,
        bgcolor: "background.default",
        borderRadius: 3,
      }}
    >
      <MediaEmbed
        title="Mis canciones favoritas"
        tracks={mockTracks.slice(0, 4)}
        maxTracks={3}
        editable
        onEdit={() => alert("Edit tracks")}
        onViewAll={() => alert("View all tracks")}
      />
    </Box>
  ),
};

/**
 * Comparison with different sizes
 */
export const SizeComparison: Story = {
  render: () => (
    <Stack spacing={4}>
      <Box sx={{ width: 380 }}>
        <MediaEmbed title="Small" tracks={mockTracks.slice(0, 2)} size="sm" />
      </Box>
      <Box sx={{ width: 420 }}>
        <MediaEmbed title="Medium" tracks={mockTracks.slice(0, 2)} size="md" />
      </Box>
      <Box sx={{ width: 480 }}>
        <MediaEmbed title="Large" tracks={mockTracks.slice(0, 2)} size="lg" />
      </Box>
    </Stack>
  ),
};
