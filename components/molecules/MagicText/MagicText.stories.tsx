import type { Meta, StoryObj } from "@storybook/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { MagicText } from "./MagicText";

const meta: Meta<typeof MagicText> = {
  title: "Molecules/MagicText",
  component: MagicText,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Animated text component with gradient fill and floating stars on hover.

## Features
- **Gradient Animation**: Text fills with animated gradient on hover
- **Floating Stars**: Decorative stars animate around the text
- **Color Variants**: Amber (gold) and Purple (lavender)
- **Reduced Motion Support**: Respects user's motion preferences

## Usage
Use MagicText to highlight key words or phrases in headings and hero sections.
The animation draws attention without being overwhelming.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["amber", "purple"],
      description: "Gradient color variant",
    },
    disableAnimation: {
      control: "boolean",
      description: "Disable all animations",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default amber magic text
 */
export const Default: Story = {
  args: {
    children: "magical",
    color: "amber",
  },
  decorators: [
    (Story) => (
      <Typography variant="h3" sx={{ fontWeight: 700 }}>
        Create something <Story />
      </Typography>
    ),
  ],
};

/**
 * Purple variant
 */
export const Purple: Story = {
  args: {
    children: "mystical",
    color: "purple",
  },
  decorators: [
    (Story) => (
      <Typography variant="h3" sx={{ fontWeight: 700 }}>
        Discover the <Story /> world
      </Typography>
    ),
  ],
};

/**
 * Amber variant
 */
export const Amber: Story = {
  args: {
    children: "brillante",
    color: "amber",
  },
  decorators: [
    (Story) => (
      <Typography variant="h3" sx={{ fontWeight: 700 }}>
        Diseños <Story />
      </Typography>
    ),
  ],
};

/**
 * Both colors side by side
 */
export const ColorComparison: Story = {
  render: () => (
    <Stack spacing={4} alignItems="center">
      <Typography variant="h3" sx={{ fontWeight: 700 }}>
        Something <MagicText color="amber">golden</MagicText> awaits
      </Typography>
      <Typography variant="h3" sx={{ fontWeight: 700 }}>
        Enter the <MagicText color="purple">mystical</MagicText> realm
      </Typography>
    </Stack>
  ),
};

/**
 * In hero heading context
 */
export const HeroHeading: Story = {
  render: () => (
    <Box sx={{ textAlign: "center", maxWidth: 600 }}>
      <Typography
        variant="h2"
        sx={{
          fontWeight: 700,
          fontSize: { xs: "2rem", md: "3rem" },
          lineHeight: 1.2,
        }}
      >
        Diseños bohemios con{" "}
        <MagicText color="amber">magia profesional</MagicText>
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mt: 2, fontSize: "1.125rem" }}
      >
        Papelería digital y branding para momentos significativos
      </Typography>
    </Box>
  ),
};

/**
 * Multiple magic words
 */
export const MultipleWords: Story = {
  render: () => (
    <Typography variant="h4" sx={{ fontWeight: 600, textAlign: "center" }}>
      From <MagicText color="amber">golden</MagicText> sunrises to{" "}
      <MagicText color="purple">lavender</MagicText> twilights
    </Typography>
  ),
};

/**
 * Ayla Designs landing page example
 */
export const AylaLandingHero: Story = {
  render: () => (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
        px: 4,
        background: "linear-gradient(to bottom, #FFFBEB, #FAFAF9)",
        borderRadius: 3,
        maxWidth: 700,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontWeight: 700,
          fontSize: { xs: "2.5rem", md: "4rem" },
          lineHeight: 1.1,
          mb: 3,
        }}
      >
        Magia Profesional para tu{" "}
        <MagicText color="amber">Marca</MagicText>
      </Typography>
      <Typography
        variant="h5"
        color="text.secondary"
        sx={{ fontWeight: 400, maxWidth: 500, mx: "auto" }}
      >
        Diseños bohemios que combinan elegancia con espiritualidad para crear
        momentos <MagicText color="purple">inolvidables</MagicText>
      </Typography>
    </Box>
  ),
};

/**
 * Without animation (for reduced motion)
 */
export const NoAnimation: Story = {
  args: {
    children: "static text",
    color: "amber",
    disableAnimation: true,
  },
  decorators: [
    (Story) => (
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        This is <Story /> without effects
      </Typography>
    ),
  ],
};

/**
 * Different text sizes
 */
export const TextSizes: Story = {
  render: () => (
    <Stack spacing={3} alignItems="center">
      <Typography variant="h2" sx={{ fontWeight: 700 }}>
        Large <MagicText color="amber">magic</MagicText>
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        Medium <MagicText color="purple">magic</MagicText>
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 500 }}>
        Small <MagicText color="amber">magic</MagicText>
      </Typography>
    </Stack>
  ),
};
