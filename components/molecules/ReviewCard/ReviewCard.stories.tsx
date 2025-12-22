import type { Meta, StoryObj } from "@storybook/react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ReviewCard } from "./ReviewCard";
import type { AylaReview } from "@/types/ayla";

const meta: Meta<typeof ReviewCard> = {
  title: "Molecules/ReviewCard",
  component: ReviewCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Customer testimonial card with avatar, rating, and quote.

## Features
- **Gradient Avatar**: Uses Ayla-style gradient avatars (gold, lavender, rose)
- **Star Rating**: Visual 5-star rating display
- **M3 Expressive Animation**: Scroll-triggered entrance with stagger
- **Hover Effects**: Subtle lift and shadow on hover
- **Reduced Motion Support**: Respects user's motion preferences

## Usage
Use ReviewCard in testimonial sections to showcase customer feedback.
Cards can be staggered with the \`index\` prop for sequential animation.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    index: {
      control: { type: "number", min: 0, max: 5 },
      description: "Index for staggered animation delay",
    },
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: 350 }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// SAMPLE DATA
// =============================================================================

const sampleReviews: AylaReview[] = [
  {
    name: "María González",
    role: "Wedding Planner",
    text: "Los diseños de Ayla son exactamente lo que buscaba: profesionales pero con ese toque bohemio que mis clientes adoran.",
    rating: 5,
    color: "gold",
  },
  {
    name: "Carlos Ruiz",
    role: "Coach de Bienestar",
    text: "Mi marca necesitaba ese equilibrio entre lo espiritual y lo profesional. Ayla Designs lo clavó perfectamente.",
    rating: 5,
    color: "lavender",
  },
  {
    name: "Laura Fernández",
    role: "Emprendedora Digital",
    text: "Las plantillas de social media han transformado mi feed de Instagram. Recibo cumplidos constantemente.",
    rating: 5,
    color: "rose",
  },
];

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default review card with gold avatar
 */
export const Default: Story = {
  args: {
    review: sampleReviews[0],
    index: 0,
  },
};

/**
 * Gold avatar variant
 */
export const GoldAvatar: Story = {
  args: {
    review: sampleReviews[0],
    index: 0,
  },
};

/**
 * Lavender avatar variant
 */
export const LavenderAvatar: Story = {
  args: {
    review: sampleReviews[1],
    index: 0,
  },
};

/**
 * Rose avatar variant
 */
export const RoseAvatar: Story = {
  args: {
    review: sampleReviews[2],
    index: 0,
  },
};

/**
 * 4-star rating
 */
export const FourStarRating: Story = {
  args: {
    review: {
      ...sampleReviews[0],
      rating: 4,
    },
    index: 0,
  },
};

/**
 * 3-star rating
 */
export const ThreeStarRating: Story = {
  args: {
    review: {
      ...sampleReviews[0],
      rating: 3,
    },
    index: 0,
  },
};

/**
 * All three reviews - testimonial grid
 */
export const TestimonialGrid: Story = {
  decorators: [
    () => (
      <Box sx={{ maxWidth: 1100 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, textAlign: "center", mb: 4 }}
        >
          Lo que dicen nuestros clientes
        </Typography>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems="stretch"
        >
          {sampleReviews.map((review, index) => (
            <Box key={review.name} sx={{ flex: 1 }}>
              <ReviewCard review={review} index={index} />
            </Box>
          ))}
        </Stack>
      </Box>
    ),
  ],
  args: {
    review: sampleReviews[0],
  },
};

/**
 * Ayla Designs testimonials section
 */
export const AylaTestimonialsSection: Story = {
  decorators: [
    () => (
      <Box
        sx={{
          py: 8,
          px: 4,
          bgcolor: "#FAFAF9",
          borderRadius: 3,
          maxWidth: 1100,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="overline"
            sx={{ color: "primary.main", fontWeight: 600, letterSpacing: 2 }}
          >
            Testimonios
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, mt: 1 }}>
            Clientes Satisfechos
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 2, maxWidth: 500, mx: "auto" }}
          >
            Descubre lo que dicen nuestros clientes sobre su experiencia con
            Ayla Designs
          </Typography>
        </Box>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems="stretch"
        >
          {sampleReviews.map((review, index) => (
            <Box key={review.name} sx={{ flex: 1 }}>
              <ReviewCard review={review} index={index} />
            </Box>
          ))}
        </Stack>
      </Box>
    ),
  ],
  args: {
    review: sampleReviews[0],
  },
};

/**
 * Long review text
 */
export const LongReviewText: Story = {
  args: {
    review: {
      name: "Ana Martínez",
      role: "Diseñadora de Interiores",
      text: "Trabajar con Ayla Designs ha sido una experiencia transformadora para mi negocio. No solo los diseños son increíblemente hermosos y únicos, sino que el proceso de personalización fue muy sencillo. Ahora mi marca tiene una identidad visual coherente que realmente refleja mi estilo bohemio y profesional. Mis clientes siempre comentan lo elegante que se ve todo.",
      rating: 5,
      color: "gold",
    },
    index: 0,
  },
};
