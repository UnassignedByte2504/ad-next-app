import type { Meta, StoryObj } from "@storybook/react";
import Box from "@mui/material/Box";
import BrushIcon from "@mui/icons-material/Brush";
import DownloadIcon from "@mui/icons-material/Download";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import VerifiedIcon from "@mui/icons-material/Verified";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";

import { FeaturesSection, type FeatureItem } from "./FeaturesSection";

const meta: Meta<typeof FeaturesSection> = {
  title: "Organisms/FeaturesSection",
  component: FeaturesSection,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
A responsive section component for displaying feature cards in a grid layout.

## Features
- **M3 Expressive Animations**: Staggered entrance with spring physics
- **Responsive Grid**: 1-4 columns with automatic breakpoint handling
- **Multiple Variants**: Different card styles and background options
- **Flexible Layout**: Center or left-aligned content
- **Reduced Motion Support**: Respects user's motion preferences

## Usage
Use FeaturesSection for landing pages, about pages, and anywhere you need to highlight
product features, services, or value propositions.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Section title",
    },
    subtitle: {
      control: "text",
      description: "Section subtitle",
    },
    columns: {
      control: "select",
      options: [1, 2, 3, 4],
      description: "Number of columns",
    },
    cardVariant: {
      control: "select",
      options: ["elevated", "outlined", "filled"],
      description: "Card visual variant",
    },
    background: {
      control: "select",
      options: ["default", "paper", "subtle"],
      description: "Section background",
    },
    align: {
      control: "select",
      options: ["left", "center"],
      description: "Content alignment",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// SAMPLE DATA
// =============================================================================

const aylaFeatures: FeatureItem[] = [
  {
    key: "personalized",
    icon: <BrushIcon />,
    title: "Personalized Designs",
    description:
      "Each design can be customized to match your unique vision and style.",
    iconColor: "primary",
  },
  {
    key: "instant",
    icon: <DownloadIcon />,
    title: "Instant Download",
    description:
      "Get your digital files immediately after purchase. Print when you're ready.",
    iconColor: "secondary",
  },
  {
    key: "handcrafted",
    icon: <AutoAwesomeIcon />,
    title: "Handcrafted Quality",
    description:
      "Every piece is thoughtfully designed with bohemian elegance and attention to detail.",
    iconColor: "info",
  },
];

const ecommerceFeatures: FeatureItem[] = [
  {
    key: "shipping",
    icon: <LocalShippingIcon />,
    title: "Fast Delivery",
    description: "Digital products delivered instantly to your inbox.",
    iconColor: "success",
  },
  {
    key: "support",
    icon: <SupportAgentIcon />,
    title: "24/7 Support",
    description: "Our team is always here to help with any questions.",
    iconColor: "info",
  },
  {
    key: "guarantee",
    icon: <VerifiedIcon />,
    title: "Quality Guarantee",
    description: "100% satisfaction guaranteed or your money back.",
    iconColor: "primary",
  },
  {
    key: "secure",
    icon: <SecurityIcon />,
    title: "Secure Payments",
    description: "Your payment information is always protected.",
    iconColor: "success",
  },
];

const twoFeatures: FeatureItem[] = [
  {
    key: "speed",
    icon: <SpeedIcon />,
    title: "Lightning Fast",
    description: "Optimized for performance and quick loading times.",
    iconColor: "warning",
  },
  {
    key: "secure",
    icon: <SecurityIcon />,
    title: "Enterprise Security",
    description: "Bank-level encryption keeps your data safe.",
    iconColor: "success",
  },
];

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default three-column features section
 */
export const Default: Story = {
  args: {
    title: "Why Choose Ayla Designs",
    subtitle: "Beautiful bohemian designs for life's meaningful moments",
    features: aylaFeatures,
    columns: 3,
    cardVariant: "elevated",
    background: "default",
    align: "center",
  },
};

/**
 * Section with paper background
 */
export const PaperBackground: Story = {
  args: {
    title: "Our Promise",
    subtitle: "What makes us different",
    features: aylaFeatures,
    columns: 3,
    background: "paper",
  },
};

/**
 * Section with subtle background
 */
export const SubtleBackground: Story = {
  args: {
    title: "Features",
    features: aylaFeatures,
    columns: 3,
    background: "subtle",
  },
};

/**
 * Four-column layout
 */
export const FourColumns: Story = {
  args: {
    title: "Why Shop With Us",
    subtitle: "Four reasons to choose our platform",
    features: ecommerceFeatures,
    columns: 4,
  },
};

/**
 * Two-column layout
 */
export const TwoColumns: Story = {
  args: {
    title: "Core Benefits",
    features: twoFeatures,
    columns: 2,
  },
};

/**
 * Single column layout
 */
export const SingleColumn: Story = {
  args: {
    title: "Our Values",
    features: aylaFeatures,
    columns: 1,
    align: "left",
  },
  decorators: [
    (Story) => (
      <Box sx={{ maxWidth: 600, mx: "auto" }}>
        <Story />
      </Box>
    ),
  ],
};

/**
 * Left-aligned content
 */
export const LeftAligned: Story = {
  args: {
    title: "What We Offer",
    subtitle: "Discover our range of digital products and services",
    features: aylaFeatures,
    columns: 3,
    align: "left",
  },
};

/**
 * Outlined card variant
 */
export const OutlinedCards: Story = {
  args: {
    title: "Platform Features",
    features: ecommerceFeatures,
    columns: 4,
    cardVariant: "outlined",
    background: "paper",
  },
};

/**
 * Filled card variant
 */
export const FilledCards: Story = {
  args: {
    title: "Key Benefits",
    features: aylaFeatures,
    columns: 3,
    cardVariant: "filled",
  },
};

/**
 * Without title - features only
 */
export const FeaturesOnly: Story = {
  args: {
    features: aylaFeatures,
    columns: 3,
  },
};

/**
 * Ayla Designs landing page example
 */
export const AylaLandingPage: Story = {
  render: () => (
    <Box>
      <FeaturesSection
        title="Why Choose Ayla Designs"
        subtitle="Bohemian digital designs crafted with soul for life's meaningful moments"
        features={aylaFeatures}
        columns={3}
        cardVariant="elevated"
        background="default"
      />
    </Box>
  ),
};

/**
 * E-commerce trust section
 */
export const EcommerceTrustSection: Story = {
  render: () => (
    <Box>
      <FeaturesSection
        title="Shop with Confidence"
        subtitle="We're committed to providing the best experience"
        features={ecommerceFeatures}
        columns={4}
        cardVariant="outlined"
        background="paper"
      />
    </Box>
  ),
};

/**
 * Multiple sections stacked
 */
export const MultipleSections: Story = {
  render: () => (
    <Box>
      <FeaturesSection
        title="Our Products"
        subtitle="Digital designs for every occasion"
        features={aylaFeatures}
        columns={3}
        background="default"
      />
      <FeaturesSection
        title="Why Trust Us"
        features={ecommerceFeatures.slice(0, 3)}
        columns={3}
        cardVariant="outlined"
        background="paper"
      />
    </Box>
  ),
};
