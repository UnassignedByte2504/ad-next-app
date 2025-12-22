import type { Meta, StoryObj } from "@storybook/react";
import { FloatingStars } from "./FloatingStars";
import { primary, secondary, accent } from "@/app/ui/theme";

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof FloatingStars> = {
  title: "Organisms/FloatingStars",
  component: FloatingStars,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Decorative floating star particles that create an ambient magical effect.

## Features
- Pre-defined positions to avoid hydration mismatch
- Respects reduced motion preferences
- Uses theme primary color by default
- Fully customizable star configurations

## Usage
\`\`\`tsx
<div className="relative h-screen">
  <FloatingStars />
  <HeroContent />
</div>
\`\`\`
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="relative h-[400px] bg-gradient-to-br from-stone-50 to-stone-100">
        <Story />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-stone-400 text-sm">
            Stars floating in background
          </span>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FloatingStars>;

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default floating stars with amber (primary) color
 */
export const Default: Story = {
  args: {},
};

/**
 * Stars with lavender (secondary) color
 */
export const Lavender: Story = {
  args: {
    starColor: secondary.main,
  },
  decorators: [
    (Story) => (
      <div className="relative h-[400px] bg-gradient-to-br from-purple-50 to-purple-100">
        <Story />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-purple-400 text-sm">
            Lavender stars for mystical sections
          </span>
        </div>
      </div>
    ),
  ],
};

/**
 * Stars with rose (accent) color
 */
export const Rose: Story = {
  args: {
    starColor: accent.main,
  },
  decorators: [
    (Story) => (
      <div className="relative h-[400px] bg-gradient-to-br from-pink-50 to-pink-100">
        <Story />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-pink-400 text-sm">
            Rose stars for romantic sections
          </span>
        </div>
      </div>
    ),
  ],
};

/**
 * Fewer stars (5) for subtle effect
 */
export const Subtle: Story = {
  args: {
    count: 5,
  },
};

/**
 * Custom star configuration
 */
export const CustomStars: Story = {
  args: {
    stars: [
      { left: 10, top: 10, duration: 2.0, delay: 0, size: 20, opacity: 0.6 },
      { left: 50, top: 50, duration: 2.5, delay: 0.5, size: 24, opacity: 0.7 },
      { left: 90, top: 90, duration: 3.0, delay: 1.0, size: 20, opacity: 0.6 },
    ],
    starColor: primary.light,
  },
  decorators: [
    (Story) => (
      <div className="relative h-[400px] bg-stone-900">
        <Story />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-stone-400 text-sm">
            3 large stars - custom configuration
          </span>
        </div>
      </div>
    ),
  ],
};

/**
 * Dark background with light stars
 */
export const OnDarkBackground: Story = {
  args: {
    starColor: "#FBBF24", // amber-400
  },
  decorators: [
    (Story) => (
      <div className="relative h-[400px] bg-gradient-to-br from-stone-900 to-stone-800">
        <Story />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-amber-400 text-sm">
            Stars on dark background
          </span>
        </div>
      </div>
    ),
  ],
};

/**
 * With reduced motion (static stars)
 */
export const ReducedMotion: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          "When user has reduced motion preference, stars remain static without animation.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="relative h-[400px] bg-stone-100">
        <p className="absolute top-4 left-4 text-xs text-stone-500 z-10">
          Enable &quot;Reduce motion&quot; in your OS settings to see static
          stars
        </p>
        <Story />
      </div>
    ),
  ],
};
