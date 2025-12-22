"use client";

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import { ProductCard } from "./ProductCard";
import { products } from "@/data/ayla";
import {
  neutral,
  primary,
  secondary,
  fontFamilies,
  categoryGradients,
} from "@/app/ui/theme";

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof ProductCard> = {
  title: "Organisms/ProductCard",
  component: ProductCard,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "stone",
      values: [
        { name: "stone", value: neutral[50] },
        { name: "white", value: "#FFFFFF" },
        { name: "dark", value: neutral[900] },
      ],
    },
    docs: {
      description: {
        component: `
ProductCard displays a product with image, category, title, description, and price.

## Features
- **Hover Overlay**: Action buttons appear on hover
- **Add to Cart Feedback**: Visual confirmation when item is added (2s duration)
- **M3 Expressive Animation**: Scale and shadow on hover
- **Reduced Motion Support**: Respects user's motion preferences
- **Atomic Composition**: Uses Button, Chip, and ProductImage atoms
- **Theme Integration**: Uses categoryColors, fontFamilies from theme

## Typography
- **Product Title**: Cormorant Garamond (serif) - elegant heading
- **Description**: Nunito Sans (body) - readable body text
- **Price**: Cormorant Garamond (serif) - prominent display

## Theming
- Category chips use colors from \`categoryColors\` tokens
- Buttons use pill shape (9999px radius) per branding
- Add to Cart uses amber gradient from \`primary\` palette
- Shadows use amber tint for warmth
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    product: {
      description: "Product data object",
      control: false,
    },
    index: {
      control: { type: "number", min: 0, max: 10 },
      description: "Index for staggered animation delay",
    },
    onAddToCart: {
      description: "Callback when Add to Cart button is clicked",
      action: "addToCart",
    },
    onViewProduct: {
      description: "Callback when View button or card is clicked",
      action: "viewProduct",
    },
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: 320, p: 2 }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// INDIVIDUAL PRODUCT STORIES
// =============================================================================

/**
 * Default product card with the Celestial Planner
 */
export const Default: Story = {
  args: {
    product: products[0],
    index: 0,
  },
};

/**
 * Celestial Planner 2025 - Digital planner with lunar phases
 */
export const Planner: Story = {
  args: {
    product: products[0],
    index: 0,
  },
  parameters: {
    docs: {
      description: {
        story: "Planners category uses lavender (#C9B8D4) chip color.",
      },
    },
  },
};

/**
 * Bohemian Business Cards - Editable card templates
 */
export const BusinessCards: Story = {
  args: {
    product: products[1],
    index: 0,
  },
  parameters: {
    docs: {
      description: {
        story: "Tarjetas category uses warm tan (#D4B896) chip color.",
      },
    },
  },
};

/**
 * Crystal Social Media Kit - Instagram templates
 */
export const SocialMediaKit: Story = {
  args: {
    product: products[2],
    index: 0,
  },
  parameters: {
    docs: {
      description: {
        story: "Social Media category uses purple (#A855F7) chip color.",
      },
    },
  },
};

/**
 * Moonlight Wedding Suite - Complete wedding stationery
 */
export const WeddingSuite: Story = {
  args: {
    product: products[3],
    index: 0,
  },
  parameters: {
    docs: {
      description: {
        story: "Bodas category uses soft rose (#F2DCDC) chip color.",
      },
    },
  },
};

/**
 * Mystic Brand Kit - Complete branding package
 */
export const BrandKit: Story = {
  args: {
    product: products[4],
    index: 0,
  },
  parameters: {
    docs: {
      description: {
        story: "Branding category uses champagne (#E8D5B0) chip color.",
      },
    },
  },
};

/**
 * Boho Thank You Cards - Gratitude card designs
 */
export const ThankYouCards: Story = {
  args: {
    product: products[5],
    index: 0,
  },
  parameters: {
    docs: {
      description: {
        story: "Thank You category uses soft lavender (#E1D8EA) chip color.",
      },
    },
  },
};

// =============================================================================
// INTERACTIVE STORIES
// =============================================================================

/**
 * Interactive card demonstrating callbacks and Add to Cart feedback
 */
export const Interactive: Story = {
  render: () => {
    const [lastAction, setLastAction] = useState<string>("");

    return (
      <Box sx={{ width: 320, p: 2 }}>
        <ProductCard
          product={products[0]}
          onAddToCart={(p) => setLastAction(`✓ Added "${p.name}" to cart`)}
          onViewProduct={(p) => setLastAction(`👁 Viewing "${p.name}"`)}
        />
        {lastAction && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: neutral[100],
              borderRadius: 2,
              textAlign: "center",
              border: `1px solid ${neutral[200]}`,
            }}
          >
            <Typography
              sx={{
                fontFamily: fontFamilies.body,
                fontSize: "0.875rem",
                color: neutral[700],
              }}
            >
              {lastAction}
            </Typography>
          </Box>
        )}
      </Box>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Hover over the card and click the buttons to see callbacks in action. The Add to Cart button shows a checkmark for 2 seconds.",
      },
    },
  },
};

// =============================================================================
// GRID LAYOUTS
// =============================================================================

/**
 * 3-column product grid with proper spacing
 */
export const ProductGrid: Story = {
  decorators: [
    () => (
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          py: 6,
          px: 4,
          bgcolor: neutral[50],
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <Grid container spacing={4}>
            {products.slice(0, 3).map((product, index) => (
              <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ProductCard
                  product={product}
                  index={index}
                  onAddToCart={(p) => console.log("Add to cart:", p.name)}
                  onViewProduct={(p) => console.log("View:", p.name)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story: "Standard 3-column grid layout with 32px gap. Cards scale on hover.",
      },
    },
  },
  args: {
    product: products[0],
  },
};

/**
 * Complete product catalog - all 6 products
 */
export const FullCatalog: Story = {
  decorators: [
    () => (
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          py: 8,
          px: 4,
          bgcolor: neutral[50],
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              sx={{
                fontFamily: fontFamilies.heading,
                fontSize: "2.5rem",
                fontWeight: 600,
                color: neutral[800],
                mb: 1,
              }}
            >
              Nuestros Productos
            </Typography>
            <Typography
              sx={{
                fontFamily: fontFamilies.body,
                fontSize: "1.125rem",
                color: neutral[500],
                maxWidth: 500,
                mx: "auto",
              }}
            >
              Descubre nuestra colección de diseños digitales bohemios
            </Typography>
          </Box>

          {/* Grid */}
          <Grid container spacing={4}>
            {products.map((product, index) => (
              <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ProductCard
                  product={product}
                  index={index}
                  onAddToCart={(p) => console.log("Add to cart:", p.name)}
                  onViewProduct={(p) => console.log("View:", p.name)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Complete catalog showing all 6 products. Uses Cormorant Garamond for headings, Nunito Sans for body text.",
      },
    },
  },
  args: {
    product: products[0],
  },
};

/**
 * Ayla Designs product section - as seen on landing page
 */
export const AylaProductSection: Story = {
  decorators: [
    () => (
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          py: 10,
          px: 4,
          background: `linear-gradient(180deg, ${neutral[50]} 0%, #FFFFFF 50%, ${neutral[50]} 100%)`,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          {/* Section Header */}
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              component="span"
              sx={{
                fontFamily: fontFamilies.body,
                fontSize: "0.875rem",
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: primary.main,
                display: "block",
                mb: 1.5,
              }}
            >
              ✨ Colección
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontFamily: fontFamilies.heading,
                fontSize: { xs: "2rem", md: "3rem" },
                fontWeight: 600,
                color: neutral[800],
                lineHeight: 1.2,
                mb: 2,
              }}
            >
              Diseños Destacados
            </Typography>
            <Typography
              sx={{
                fontFamily: fontFamilies.body,
                fontSize: "1.125rem",
                color: neutral[500],
                maxWidth: 550,
                mx: "auto",
                lineHeight: 1.7,
              }}
            >
              Explora nuestra colección de plantillas y diseños bohemios para
              transformar tu marca con un toque mágico y profesional
            </Typography>
          </Box>

          {/* Products Grid */}
          <Grid container spacing={4}>
            {products.slice(0, 3).map((product, index) => (
              <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ProductCard
                  product={product}
                  index={index}
                  onAddToCart={(p) => console.log("Add to cart:", p.name)}
                  onViewProduct={(p) => console.log("View:", p.name)}
                />
              </Grid>
            ))}
          </Grid>

          {/* View All CTA */}
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Box
              component="button"
              sx={{
                px: 4,
                py: 1.5,
                fontFamily: fontFamilies.body,
                fontSize: "1rem",
                fontWeight: 600,
                color: neutral[800],
                bgcolor: "transparent",
                border: `2px solid ${neutral[300]}`,
                borderRadius: "9999px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: primary.main,
                  color: primary.dark,
                },
              }}
            >
              Ver toda la colección →
            </Box>
          </Box>
        </Box>
      </Box>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Complete product section as it appears on the Ayla Designs landing page. Features gradient background, Cormorant Garamond headings, and pill-shaped CTA button.",
      },
    },
  },
  args: {
    product: products[0],
  },
};

// =============================================================================
// DARK MODE SHOWCASE
// =============================================================================

/**
 * Dark background - for contrast testing
 */
export const OnDarkBackground: Story = {
  decorators: [
    (Story) => (
      <Box
        sx={{
          width: 360,
          p: 4,
          bgcolor: neutral[900],
          borderRadius: 3,
        }}
      >
        <Story />
      </Box>
    ),
  ],
  args: {
    product: products[4],
    index: 0,
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Card on dark background. The card maintains its light appearance - text below the card would need dark mode styling.",
      },
    },
  },
};
