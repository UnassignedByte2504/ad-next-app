import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./index";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { neutral, fontFamilies, categoryColors, primary } from "@/app/ui/theme";

const meta: Meta<typeof Card> = {
  title: "Atoms/Card",
  component: Card,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "stone",
      values: [
        { name: "stone", value: neutral[50] },
        { name: "white", value: "#FFFFFF" },
      ],
    },
    docs: {
      description: {
        component: `
Base card component for Ayla Designs e-commerce platform.

## Features
- **Spring Animations**: Hover and tap animations using physics-based springs
- **Shape Variants**: elevated, outlined, filled
- **Size Presets**: sm, md, lg
- **Interactive Mode**: Enable hover effects for clickable cards

## Ayla Branding
- Light mode with stone palette backgrounds
- Amber-tinted shadows (not pure black)
- 12-16px border radius for cards
- Designed for product cards, order summaries, and account sections

## M3 Expressive
Based on Material Design 3 Expressive (Google I/O 2025):
- Spring physics for natural motion
- Shape morphing on interaction
- Subtle shadow changes on hover
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["elevated", "outlined", "filled"],
      description: "Visual style variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Padding size preset",
    },
    interactive: {
      control: "boolean",
      description: "Enable hover/tap animations",
    },
    disableAnimation: {
      control: "boolean",
      description: "Disable all animations",
    },
    borderRadius: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "full"],
      description: "Border radius from shape scale",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default elevated card with medium size
 */
export const Default: Story = {
  args: {
    variant: "elevated",
    size: "md",
    interactive: false,
  },
  render: (args) => (
    <Card {...args} sx={{ width: 320 }}>
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: fontFamilies.heading,
            color: neutral[900]
          }}
        >
          Order Summary
        </Typography>
        <Typography variant="body2" sx={{ color: neutral[700], mt: 0.5 }}>
          Elevated card with subtle amber-tinted shadow on light background.
        </Typography>
      </Box>
    </Card>
  ),
};

/**
 * Interactive card with hover animation
 */
export const Interactive: Story = {
  args: {
    variant: "elevated",
    size: "md",
    interactive: true,
  },
  render: (args) => (
    <Card {...args} sx={{ width: 320 }}>
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: fontFamilies.heading,
            color: neutral[900]
          }}
        >
          Product Card
        </Typography>
        <Typography variant="body2" sx={{ color: neutral[700], mt: 0.5 }}>
          Hover to see the spring animation with amber-tinted shadow lift!
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: primary.main,
            fontWeight: 600,
            mt: 1.5
          }}
        >
          €29.00
        </Typography>
      </Box>
    </Card>
  ),
};

/**
 * All visual variants side by side
 */
export const Variants: Story = {
  render: () => (
    <Stack direction="row" spacing={3}>
      <Card variant="elevated" sx={{ width: 200, p: 2 }}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{
            fontFamily: fontFamilies.heading,
            color: neutral[900]
          }}
        >
          Elevated
        </Typography>
        <Typography variant="body2" sx={{ color: neutral[700] }}>
          Amber-tinted shadow
        </Typography>
      </Card>
      <Card variant="outlined" sx={{ width: 200, p: 2 }}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{
            fontFamily: fontFamilies.heading,
            color: neutral[900]
          }}
        >
          Outlined
        </Typography>
        <Typography variant="body2" sx={{ color: neutral[700] }}>
          Stone.200 border
        </Typography>
      </Card>
      <Card variant="filled" sx={{ width: 200, p: 2 }}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{
            fontFamily: fontFamilies.heading,
            color: neutral[900]
          }}
        >
          Filled
        </Typography>
        <Typography variant="body2" sx={{ color: neutral[700] }}>
          Stone.100 background
        </Typography>
      </Card>
    </Stack>
  ),
};

/**
 * Size presets comparison
 */
export const Sizes: Story = {
  render: () => (
    <Stack direction="row" spacing={3} alignItems="flex-start">
      <Card variant="elevated" size="sm" sx={{ width: 180, p: 1.5 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontFamily: fontFamilies.heading,
            color: neutral[900]
          }}
        >
          Small
        </Typography>
        <Typography variant="caption" sx={{ color: neutral[700] }}>
          12px padding
        </Typography>
      </Card>
      <Card variant="elevated" size="md" sx={{ width: 180, p: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontFamily: fontFamilies.heading,
            color: neutral[900]
          }}
        >
          Medium
        </Typography>
        <Typography variant="caption" sx={{ color: neutral[700] }}>
          16px padding
        </Typography>
      </Card>
      <Card variant="elevated" size="lg" sx={{ width: 180, p: 3 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontFamily: fontFamilies.heading,
            color: neutral[900]
          }}
        >
          Large
        </Typography>
        <Typography variant="caption" sx={{ color: neutral[700] }}>
          24px padding
        </Typography>
      </Card>
    </Stack>
  ),
};


/**
 * Different border radius options
 */
export const BorderRadius: Story = {
  render: () => (
    <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((radius) => (
        <Card
          key={radius}
          variant="elevated"
          borderRadius={radius}
          sx={{ width: 120, p: 2, textAlign: "center" }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontFamily: fontFamilies.heading,
              color: neutral[900]
            }}
          >
            {radius}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: neutral[700] }}
          >
            {radius === "lg" ? "(default)" : ""}
          </Typography>
        </Card>
      ))}
    </Stack>
  ),
};

/**
 * E-commerce card gallery with Ayla product categories
 */
export const EcommerceGallery: Story = {
  render: () => (
    <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
      {[
        {
          name: "Bohemian Planner Kit",
          category: "Planners" as const,
          price: "€29.00",
        },
        {
          name: "Wedding Invitation Suite",
          category: "Bodas" as const,
          price: "€45.00",
        },
        {
          name: "Brand Identity Package",
          category: "Branding" as const,
          price: "€89.00",
        },
      ].map((product) => (
        <Card
          key={product.name}
          variant="elevated"
          interactive
          sx={{ width: 240 }}
        >
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: "inline-block",
                px: 1.5,
                py: 0.5,
                bgcolor: `${categoryColors[product.category]}4D`,
                borderRadius: "9999px",
                mb: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: neutral[800],
                  fontWeight: 600,
                }}
              >
                {product.category}
              </Typography>
            </Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                fontFamily: fontFamilies.heading,
                color: neutral[900],
                mb: 1,
              }}
            >
              {product.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: primary.main,
                fontWeight: 700,
              }}
            >
              {product.price}
            </Typography>
          </Box>
        </Card>
      ))}
    </Stack>
  ),
};
