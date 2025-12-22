import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { GlowCTA } from "./GlowCTA";
import { Sparkles, Heart, Star } from "lucide-react";
import { primary } from "@/app/ui/theme";

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof GlowCTA> = {
  title: "Organisms/GlowCTA",
  component: GlowCTA,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
A dramatic call-to-action section with mouse-following glow effect.

## Features
- Dark background with mouse-following gradient blob
- Blur overlay for dreamlike effect
- Animated content entrance
- Accessible button with optional link or callback
- Respects reduced motion preferences

## Usage
\`\`\`tsx
<GlowCTA
  title="Ready to transform your brand?"
  subtitle="Join hundreds who trust us"
  ctaText="Get Started"
  ctaHref="#products"
/>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GlowCTA>;

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default CTA with standard messaging
 */
export const Default: Story = {
  args: {},
};

/**
 * Spanish (original) version
 */
export const Spanish: Story = {
  args: {
    title: "¿Lista para transformar tu marca?",
    subtitle:
      "Únete a cientos de emprendedoras que ya confían en Ayla Designs para dar vida a su visión.",
    ctaText: "Comenzar Ahora",
    ctaHref: "#productos",
  },
};

/**
 * With custom click handler instead of href
 */
export const WithClickHandler: Story = {
  args: {
    title: "Start Your Journey",
    subtitle: "Create something beautiful today",
    ctaText: "Open Modal",
    onCtaClick: fn(),
  },
};

/**
 * With custom Sparkles icon
 */
export const WithSparklesIcon: Story = {
  args: {
    title: "Magic Awaits",
    subtitle: "Discover our mystical collection of designs",
    ctaText: "Explore Now",
    icon: <Sparkles size={48} style={{ color: `${primary.light}66` }} />,
  },
};

/**
 * With Heart icon for romantic themes
 */
export const WeddingTheme: Story = {
  args: {
    title: "Your Perfect Day Deserves Perfect Design",
    subtitle: "Elegant wedding stationery that tells your love story",
    ctaText: "View Wedding Collection",
    ctaHref: "#wedding",
    icon: <Heart size={48} style={{ color: "#F9A8D466" }} />,
  },
};

/**
 * With Star icon for testimonials
 */
export const TestimonialsTheme: Story = {
  args: {
    title: "Join Our Happy Customers",
    subtitle: "See why designers and entrepreneurs love our templates",
    ctaText: "Read Reviews",
    ctaHref: "#reviews",
    icon: <Star size={48} style={{ color: "#FBBF2466" }} />,
  },
};

/**
 * Shorter content for compact sections
 */
export const Compact: Story = {
  args: {
    title: "Get Started Today",
    subtitle: "Transform your brand with Ayla Designs",
    ctaText: "Shop Now",
  },
};

/**
 * Longer descriptive content
 */
export const Detailed: Story = {
  args: {
    title: "Elevate Your Brand with Handcrafted Designs",
    subtitle:
      "Our bohemian-inspired templates combine celestial elegance with modern functionality. Perfect for coaches, healers, wedding planners, and creative entrepreneurs who want to stand out.",
    ctaText: "Explore the Collection",
  },
};
