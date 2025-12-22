import type { Meta, StoryObj } from "@storybook/react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ProductImage } from "./ProductImage";

const meta: Meta<typeof ProductImage> = {
  title: "Atoms/ProductImage",
  component: ProductImage,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Product image component with fallback gradients and decorative icons.

## Features
- **Fallback Gradients**: Beautiful category-specific gradients when images fail to load
- **Decorative Icons**: Sparkles and category icons for visual interest
- **Lazy Loading**: Images load efficiently with native lazy loading
- **Theme Integration**: Uses category gradients from theme tokens

## Product Types
- \`planner\` - Celestial Planner (Moon icon)
- \`cards\` - Business Cards (PenTool icon)
- \`social\` - Social Media Kit (Image icon)
- \`wedding\` - Wedding Suite (Heart icon)
- \`brand\` - Brand Kit (Palette icon)
- \`thanks\` - Thank You Cards (Gift icon)
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["planner", "cards", "social", "wedding", "brand", "thanks"],
      description: "Product type determines gradient and icon",
    },
    showDecorations: {
      control: "boolean",
      description: "Whether to show sparkle and category icons",
    },
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: 300, height: 300 }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default planner product image
 */
export const Default: Story = {
  args: {
    type: "planner",
    showDecorations: true,
  },
};

/**
 * Business cards product
 */
export const Cards: Story = {
  args: {
    type: "cards",
    showDecorations: true,
  },
};

/**
 * Social media kit product
 */
export const Social: Story = {
  args: {
    type: "social",
    showDecorations: true,
  },
};

/**
 * Wedding suite product
 */
export const Wedding: Story = {
  args: {
    type: "wedding",
    showDecorations: true,
  },
};

/**
 * Brand kit product
 */
export const Brand: Story = {
  args: {
    type: "brand",
    showDecorations: true,
  },
};

/**
 * Thank you cards product
 */
export const Thanks: Story = {
  args: {
    type: "thanks",
    showDecorations: true,
  },
};

/**
 * Without decorations
 */
export const NoDecorations: Story = {
  args: {
    type: "planner",
    showDecorations: false,
  },
};

/**
 * All product types grid
 */
export const AllTypes: Story = {
  decorators: [
    () => (
      <Stack spacing={4}>
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          {["planner", "cards", "social", "wedding", "brand", "thanks"].map(
            (type) => (
              <Box key={type} sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    width: 150,
                    height: 150,
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <ProductImage type={type} />
                </Box>
                <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                  {type}
                </Typography>
              </Box>
            )
          )}
        </Stack>
      </Stack>
    ),
  ],
  args: {
    type: "planner",
  },
};

/**
 * Product card preview - how it looks in context
 */
export const InProductCard: Story = {
  decorators: [
    () => (
      <Box
        sx={{
          width: 280,
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(120, 53, 15, 0.08)",
          bgcolor: "background.paper",
        }}
      >
        <Box sx={{ height: 200 }}>
          <ProductImage type="planner" />
        </Box>
        <Box sx={{ p: 2 }}>
          <Typography
            variant="overline"
            sx={{ color: "primary.main", fontWeight: 500 }}
          >
            Planners
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5 }}>
            Celestial Planner 2025
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Planificador digital completo con fases lunares y seguimiento de
            hábitos.
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "primary.main", fontWeight: 700, mt: 2 }}
          >
            $24.99
          </Typography>
        </Box>
      </Box>
    ),
  ],
  args: {
    type: "planner",
  },
};

/**
 * Aspect ratio variations
 */
export const AspectRatios: Story = {
  decorators: [
    () => (
      <Stack direction="row" spacing={3}>
        <Box sx={{ textAlign: "center" }}>
          <Box
            sx={{ width: 200, height: 200, borderRadius: 2, overflow: "hidden" }}
          >
            <ProductImage type="planner" />
          </Box>
          <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
            1:1 Square
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Box
            sx={{ width: 200, height: 280, borderRadius: 2, overflow: "hidden" }}
          >
            <ProductImage type="wedding" />
          </Box>
          <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
            Portrait
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Box
            sx={{ width: 280, height: 180, borderRadius: 2, overflow: "hidden" }}
          >
            <ProductImage type="social" />
          </Box>
          <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
            Landscape
          </Typography>
        </Box>
      </Stack>
    ),
  ],
  args: {
    type: "planner",
  },
};
