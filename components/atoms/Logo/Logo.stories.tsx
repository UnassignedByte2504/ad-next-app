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
      description: "Tamano del logo",
    },
    variant: {
      control: "select",
      options: ["short", "full"],
      description: 'Variante: "short" = Ayla., "full" = Ayla.Designs',
    },
    linkTo: {
      control: "text",
      description: "URL de destino al hacer click",
    },
    textColor: {
      control: "color",
      description: "Color del texto (hereda del tema por defecto)",
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Logo por defecto (variante corta, tamano mediano) */
export const Default: Story = {
  args: {},
};

/** Variante corta: "Ayla." - Para navbar */
export const Short: Story = {
  args: {
    variant: "short",
    size: "md",
  },
};

/** Variante completa: "Ayla.Designs" - Para footer */
export const Full: Story = {
  args: {
    variant: "full",
    size: "md",
  },
};

/** Logo pequeno */
export const Small: Story = {
  args: {
    size: "sm",
    variant: "short",
  },
};

/** Logo mediano (por defecto) */
export const Medium: Story = {
  args: {
    size: "md",
    variant: "short",
  },
};

/** Logo grande */
export const Large: Story = {
  args: {
    size: "lg",
    variant: "short",
  },
};

/** Logo con enlace a la pagina principal */
export const WithLink: Story = {
  args: {
    linkTo: "/",
    size: "md",
    variant: "short",
  },
};

/** Todas las variantes y tamanos */
export const AllVariants: Story = {
  render: () => (
    <Stack spacing={4} alignItems="flex-start">
      <Box>
        <p className="text-sm text-gray-500 mb-2">Short (sm)</p>
        <Logo size="sm" variant="short" />
      </Box>
      <Box>
        <p className="text-sm text-gray-500 mb-2">Short (md)</p>
        <Logo size="md" variant="short" />
      </Box>
      <Box>
        <p className="text-sm text-gray-500 mb-2">Short (lg)</p>
        <Logo size="lg" variant="short" />
      </Box>
      <Box>
        <p className="text-sm text-gray-500 mb-2">Full (sm)</p>
        <Logo size="sm" variant="full" />
      </Box>
      <Box>
        <p className="text-sm text-gray-500 mb-2">Full (md)</p>
        <Logo size="md" variant="full" />
      </Box>
      <Box>
        <p className="text-sm text-gray-500 mb-2">Full (lg)</p>
        <Logo size="lg" variant="full" />
      </Box>
    </Stack>
  ),
};

/** Logo en diferentes fondos */
export const OnDifferentBackgrounds: Story = {
  render: () => (
    <Stack spacing={3}>
      <Box className="bg-white p-4 rounded">
        <p className="text-xs text-gray-400 mb-2">Light background</p>
        <Logo size="md" variant="short" />
      </Box>
      <Box className="bg-stone-100 p-4 rounded">
        <p className="text-xs text-gray-400 mb-2">Neutral background</p>
        <Logo size="md" variant="full" />
      </Box>
      <Box className="bg-stone-900 p-4 rounded">
        <p className="text-xs text-stone-500 mb-2">Dark background</p>
        <Logo size="md" variant="full" textColor="#FFFFFF" />
      </Box>
    </Stack>
  ),
};

/** Logo para navbar (uso tipico) */
export const NavbarUsage: Story = {
  render: () => (
    <Box className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-stone-200">
      <Logo size="md" variant="short" linkTo="/" />
    </Box>
  ),
};

/** Logo para footer (uso tipico) */
export const FooterUsage: Story = {
  render: () => (
    <Box className="bg-stone-800 p-6 rounded-lg">
      <Logo size="lg" variant="full" textColor="#FAFAF9" />
    </Box>
  ),
};
