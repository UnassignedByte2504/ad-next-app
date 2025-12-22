import type { Meta, StoryObj } from "@storybook/react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import BrushIcon from "@mui/icons-material/Brush";
import DownloadIcon from "@mui/icons-material/Download";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import VerifiedIcon from "@mui/icons-material/Verified";

import { FeatureCard } from "./FeatureCard";

const meta: Meta<typeof FeatureCard> = {
  title: "Atoms/FeatureCard",
  component: FeatureCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Feature card component for displaying value propositions, features, and service highlights.

## Features
- **M3 Expressive Animations**: Spring physics with gentle entrance and hover effects
- **Multiple Variants**: elevated, outlined, filled
- **Icon Backgrounds**: Subtle tinted backgrounds for icons
- **Reduced Motion Support**: Respects user's motion preferences
- **Accessible**: Focus ring and keyboard navigation

## Usage
Use FeatureCard to highlight key features of your product or service. Commonly used in
landing pages, about pages, and feature comparison sections.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: false,
      description: "Icon element to display",
    },
    title: {
      control: "text",
      description: "Feature title",
    },
    description: {
      control: "text",
      description: "Feature description",
    },
    iconColor: {
      control: "select",
      options: ["primary", "secondary", "info", "success", "warning", "error"],
      description: "Icon color from MUI palette",
    },
    variant: {
      control: "select",
      options: ["elevated", "outlined", "filled"],
      description: "Visual variant",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default elevated feature card with primary icon color
 */
export const Default: Story = {
  args: {
    icon: <BrushIcon />,
    title: "Personalized Designs",
    description:
      "Each design can be customized to match your unique vision and style.",
    iconColor: "primary",
    variant: "elevated",
  },
};

/**
 * Feature card with secondary icon color
 */
export const SecondaryColor: Story = {
  args: {
    icon: <DownloadIcon />,
    title: "Instant Download",
    description:
      "Get your digital files immediately after purchase. Print when you're ready.",
    iconColor: "secondary",
    variant: "elevated",
  },
};

/**
 * Feature card with info icon color
 */
export const InfoColor: Story = {
  args: {
    icon: <AutoAwesomeIcon />,
    title: "Handcrafted Quality",
    description:
      "Every piece is thoughtfully designed with bohemian elegance and attention to detail.",
    iconColor: "info",
    variant: "elevated",
  },
};

/**
 * All visual variants side by side
 */
export const Variants: Story = {
  render: () => (
    <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
      <Box sx={{ width: 280 }}>
        <FeatureCard
          icon={<BrushIcon />}
          title="Elevated"
          description="Card with shadow and background"
          iconColor="primary"
          variant="elevated"
        />
      </Box>
      <Box sx={{ width: 280 }}>
        <FeatureCard
          icon={<DownloadIcon />}
          title="Outlined"
          description="Card with border only"
          iconColor="secondary"
          variant="outlined"
        />
      </Box>
      <Box sx={{ width: 280 }}>
        <FeatureCard
          icon={<AutoAwesomeIcon />}
          title="Filled"
          description="Card with subtle background"
          iconColor="info"
          variant="filled"
        />
      </Box>
    </Stack>
  ),
};

/**
 * All icon colors available
 */
export const IconColors: Story = {
  render: () => (
    <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
      {(
        ["primary", "secondary", "info", "success", "warning", "error"] as const
      ).map((color) => (
        <Box key={color} sx={{ width: 200 }}>
          <FeatureCard
            icon={<AutoAwesomeIcon />}
            title={color.charAt(0).toUpperCase() + color.slice(1)}
            description="Icon color variant"
            iconColor={color}
            variant="elevated"
          />
        </Box>
      ))}
    </Stack>
  ),
};

/**
 * Ayla Designs value propositions
 */
export const AylaFeatures: Story = {
  render: () => (
    <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
      <Box sx={{ width: 300 }}>
        <FeatureCard
          icon={<BrushIcon />}
          title="Personalized Designs"
          description="Each design can be customized to match your unique vision and style."
          iconColor="primary"
        />
      </Box>
      <Box sx={{ width: 300 }}>
        <FeatureCard
          icon={<DownloadIcon />}
          title="Instant Download"
          description="Get your digital files immediately after purchase. Print when you're ready."
          iconColor="secondary"
        />
      </Box>
      <Box sx={{ width: 300 }}>
        <FeatureCard
          icon={<AutoAwesomeIcon />}
          title="Handcrafted Quality"
          description="Every piece is thoughtfully designed with bohemian elegance and attention to detail."
          iconColor="info"
        />
      </Box>
    </Stack>
  ),
};

/**
 * E-commerce feature set example
 */
export const EcommerceFeatures: Story = {
  render: () => (
    <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
      <Box sx={{ width: 280 }}>
        <FeatureCard
          icon={<LocalShippingIcon />}
          title="Fast Delivery"
          description="Digital products delivered instantly to your inbox."
          iconColor="success"
        />
      </Box>
      <Box sx={{ width: 280 }}>
        <FeatureCard
          icon={<SupportAgentIcon />}
          title="24/7 Support"
          description="Our team is always here to help with any questions."
          iconColor="info"
        />
      </Box>
      <Box sx={{ width: 280 }}>
        <FeatureCard
          icon={<VerifiedIcon />}
          title="Quality Guarantee"
          description="100% satisfaction guaranteed or your money back."
          iconColor="primary"
        />
      </Box>
    </Stack>
  ),
};

/**
 * Long content handling
 */
export const LongContent: Story = {
  args: {
    icon: <BrushIcon />,
    title: "This is a Very Long Feature Title That Might Wrap",
    description:
      "This is a much longer description that tests how the card handles extended content. It should wrap nicely and maintain proper spacing and alignment throughout the entire card component without breaking the layout.",
    iconColor: "primary",
    variant: "elevated",
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: 320 }}>
        <Story />
      </Box>
    ),
  ],
};
