import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NavbarBrand } from "./NavbarBrand";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

const meta = {
  title: "Molecules/NavbarBrand",
  component: NavbarBrand,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    showTagline: {
      control: "boolean",
    },
    tagline: {
      control: "text",
    },
    href: {
      control: "text",
    },
  },
} satisfies Meta<typeof NavbarBrand>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Brand por defecto - solo logo */
export const Default: Story = {
  args: {},
};

/** Con tagline visible */
export const WithTagline: Story = {
  args: {
    showTagline: true,
  },
};

/** Con tagline personalizado */
export const CustomTagline: Story = {
  args: {
    showTagline: true,
    tagline: "Conecta. Crea. Colabora.",
  },
};

/** Logo pequeño */
export const SmallLogo: Story = {
  args: {
    logoProps: { size: "sm" },
  },
};

/** Logo grande con tagline */
export const LargeWithTagline: Story = {
  args: {
    logoProps: { size: "lg" },
    showTagline: true,
  },
};

/** Todos los tamaños */
export const AllSizes: Story = {
  render: () => (
    <Stack spacing={4} alignItems="flex-start">
      <Box>
        <NavbarBrand logoProps={{ size: "sm" }} showTagline />
      </Box>
      <Box>
        <NavbarBrand logoProps={{ size: "md" }} showTagline />
      </Box>
      <Box>
        <NavbarBrand logoProps={{ size: "lg" }} showTagline />
      </Box>
    </Stack>
  ),
};

/** En contexto de navbar (fondo oscuro) */
export const OnDarkBackground: Story = {
  args: {
    showTagline: true,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
  decorators: [
    (Story) => (
      <Box sx={{ p: 2 }}>
        <Story />
      </Box>
    ),
  ],
};
