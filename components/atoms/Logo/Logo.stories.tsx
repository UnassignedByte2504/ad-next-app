import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Logo } from "./Logo";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

const meta = {
  title: "Atoms/Logo",
  component: Logo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: "select",
      options: ["full", "icon"],
    },
    linkTo: {
      control: "text",
    },
    priority: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Logo por defecto (tamaño mediano) */
export const Default: Story = {
  args: {},
};

/** Logo pequeño */
export const Small: Story = {
  args: {
    size: "sm",
  },
};

/** Logo mediano (por defecto) */
export const Medium: Story = {
  args: {
    size: "md",
  },
};

/** Logo grande */
export const Large: Story = {
  args: {
    size: "lg",
  },
};

/** Variante de solo icono */
export const IconOnly: Story = {
  args: {
    variant: "icon",
  },
};

/** Logo con enlace a la página principal */
export const WithLink: Story = {
  args: {
    linkTo: "/",
    size: "md",
  },
};

/** Todos los tamaños juntos */
export const AllSizes: Story = {
  render: () => (
    <Stack spacing={3} alignItems="center">
      <Box>
        <Logo size="sm" />
      </Box>
      <Box>
        <Logo size="md" />
      </Box>
      <Box>
        <Logo size="lg" />
      </Box>
    </Stack>
  ),
};

/** Logo con diferentes backgrounds */
export const OnDifferentBackgrounds: Story = {
  render: () => (
    <Stack spacing={3}>
      <Box className="bg-white p-4 rounded">
        <Logo size="md" />
      </Box>
      <Box className="bg-gray-100 p-4 rounded">
        <Logo size="md" />
      </Box>
      <Box className="bg-gray-900 p-4 rounded">
        <Logo size="md" />
      </Box>
    </Stack>
  ),
};

/** Logo con prioridad de carga (para hero/above the fold) */
export const WithPriority: Story = {
  args: {
    size: "lg",
    priority: true,
  },
};
