import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar } from "./Avatar";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const meta = {
  title: "Atoms/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Avatar component for displaying user images or initials.

## Features
- **Multiple sizes**: xs, sm, md, lg, xl
- **Gradient backgrounds**: Ayla-style gradients (gold, lavender, rose, sage, sand)
- **Online indicator**: Badge with ripple animation
- **Shape variants**: circular, rounded, square

## Ayla Gradients
Use \`gradientColor\` prop for Ayla-style gradient avatars in testimonials and reviews.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    variant: {
      control: "select",
      options: ["circular", "rounded", "square"],
    },
    online: {
      control: "boolean",
    },
    gradientColor: {
      control: "select",
      options: ["gold", "lavender", "rose", "sage", "sand"],
      description: "Gradient color for Ayla-style avatars",
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Avatar por defecto con iniciales */
export const Default: Story = {
  args: {
    initials: "JD",
    bgColor: "#6366f1",
  },
};

/** Avatar con imagen */
export const WithImage: Story = {
  args: {
    src: "https://i.pravatar.cc/150?img=3",
    alt: "Usuario",
  },
};

/** Diferentes tamaños */
export const Sizes: Story = {
  render: () => (
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar size="xs" initials="XS" bgColor="#6366f1" />
      <Avatar size="sm" initials="SM" bgColor="#6366f1" />
      <Avatar size="md" initials="MD" bgColor="#6366f1" />
      <Avatar size="lg" initials="LG" bgColor="#6366f1" />
      <Avatar size="xl" initials="XL" bgColor="#6366f1" />
    </Stack>
  ),
};

/** Diferentes variantes de forma */
export const Variants: Story = {
  render: () => (
    <Stack direction="row" spacing={2}>
      <Avatar variant="circular" initials="C" bgColor="#ec4899" size="lg" />
      <Avatar variant="rounded" initials="R" bgColor="#ec4899" size="lg" />
      <Avatar variant="square" initials="S" bgColor="#ec4899" size="lg" />
    </Stack>
  ),
};

/** Estado online */
export const Online: Story = {
  args: {
    src: "https://i.pravatar.cc/150?img=5",
    online: true,
    size: "lg",
  },
};

/** Estado offline */
export const Offline: Story = {
  args: {
    src: "https://i.pravatar.cc/150?img=5",
    online: false,
    size: "lg",
  },
};

/** Avatar de usuarios de Ayla Designs */
export const Musicians: Story = {
  render: () => (
    <Stack direction="row" spacing={2}>
      <Avatar
        src="https://i.pravatar.cc/150?img=11"
        online={true}
        size="lg"
        alt="Guitarrista"
      />
      <Avatar
        src="https://i.pravatar.cc/150?img=12"
        online={true}
        size="lg"
        alt="Bajista"
      />
      <Avatar
        src="https://i.pravatar.cc/150?img=33"
        online={false}
        size="lg"
        alt="Baterista"
      />
      <Avatar initials="NK" bgColor="#6366f1" size="lg" />
    </Stack>
  ),
};

// =============================================================================
// AYLA GRADIENT AVATARS
// =============================================================================

/** Gold gradient avatar - Ayla style */
export const GradientGold: Story = {
  args: {
    initials: "MG",
    gradientColor: "gold",
    size: "lg",
  },
};

/** Lavender gradient avatar - Ayla style */
export const GradientLavender: Story = {
  args: {
    initials: "CR",
    gradientColor: "lavender",
    size: "lg",
  },
};

/** Rose gradient avatar - Ayla style */
export const GradientRose: Story = {
  args: {
    initials: "LF",
    gradientColor: "rose",
    size: "lg",
  },
};

/** All Ayla gradient colors */
export const AylaGradients: Story = {
  render: () => (
    <Stack direction="row" spacing={3}>
      <Box sx={{ textAlign: "center" }}>
        <Avatar initials="G" gradientColor="gold" size="lg" />
        <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
          Gold
        </Typography>
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Avatar initials="L" gradientColor="lavender" size="lg" />
        <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
          Lavender
        </Typography>
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Avatar initials="R" gradientColor="rose" size="lg" />
        <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
          Rose
        </Typography>
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Avatar initials="S" gradientColor="sage" size="lg" />
        <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
          Sage
        </Typography>
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Avatar initials="S" gradientColor="sand" size="lg" />
        <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
          Sand
        </Typography>
      </Box>
    </Stack>
  ),
};

/** Ayla Designs testimonial avatars example */
export const AylaTestimonials: Story = {
  render: () => (
    <Stack direction="row" spacing={4}>
      <Box sx={{ textAlign: "center" }}>
        <Avatar initials="MG" gradientColor="gold" size="lg" />
        <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
          María González
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Wedding Planner
        </Typography>
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Avatar initials="CR" gradientColor="lavender" size="lg" />
        <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
          Carlos Ruiz
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Coach de Bienestar
        </Typography>
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Avatar initials="LF" gradientColor="rose" size="lg" />
        <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
          Laura Fernández
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Emprendedora Digital
        </Typography>
      </Box>
    </Stack>
  ),
};
