import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { Button } from "./Button";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";

const meta = {
  title: "Atoms/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["contained", "outlined", "text"],
    },
    color: {
      control: "select",
      options: ["primary", "secondary", "error", "warning", "info", "success"],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    loading: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    fullWidth: {
      control: "boolean",
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Botón principal por defecto */
export const Default: Story = {
  args: {
    children: "Botón",
  },
};

/** Botón con variante contained (relleno) */
export const Contained: Story = {
  args: {
    variant: "contained",
    children: "Contained",
  },
};

/** Botón con variante outlined (borde) */
export const Outlined: Story = {
  args: {
    variant: "outlined",
    children: "Outlined",
  },
};

/** Botón con variante text (solo texto) */
export const Text: Story = {
  args: {
    variant: "text",
    children: "Text",
  },
};

/** Diferentes colores disponibles */
export const Colors: Story = {
  render: () => (
    <Stack direction="row" spacing={2}>
      <Button color="primary">Primary</Button>
      <Button color="secondary">Secondary</Button>
      <Button color="success">Success</Button>
      <Button color="error">Error</Button>
      <Button color="warning">Warning</Button>
      <Button color="info">Info</Button>
    </Stack>
  ),
};

/** Diferentes tamaños */
export const Sizes: Story = {
  render: () => (
    <Stack direction="row" spacing={2} alignItems="center">
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </Stack>
  ),
};

/** Botón con icono al inicio */
export const WithStartIcon: Story = {
  args: {
    children: "Escuchar",
    startIcon: <MusicNoteIcon />,
  },
};

/** Botón con icono al final */
export const WithEndIcon: Story = {
  args: {
    children: "Enviar",
    endIcon: <SendIcon />,
  },
};

/** Estado de carga */
export const Loading: Story = {
  args: {
    children: "Cargando...",
    loading: true,
  },
};

/** Botón deshabilitado */
export const Disabled: Story = {
  args: {
    children: "Deshabilitado",
    disabled: true,
  },
};

/** Botón de ancho completo */
export const FullWidth: Story = {
  args: {
    children: "Ancho completo",
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
};
