import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ThemeToggle } from "./ThemeToggle";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

/**
 * ThemeToggle - Botón animado para cambiar el tema de la aplicación.
 *
 * ## Características
 * - **Animaciones Spring** siguiendo M3 Motion Physics System
 * - **Iconos SVG animados** (rayos del sol, estrellas de la luna)
 * - **Transiciones suaves** entre estados con AnimatePresence
 * - **3 modos**: light, dark, system (configurable)
 *
 * ## Tendencias 2025 aplicadas
 * - Spring physics con rebote (expressive motion)
 * - Micro-animaciones en elementos individuales
 * - Exit/enter animations con rotación
 *
 * Nota: En Storybook, el toggle funciona con el store real.
 * ¡Haz clic para ver las animaciones!
 */
const meta = {
  title: "Atoms/ThemeToggle",
  component: ThemeToggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Tamaño del botón (sm: 36px, md: 44px, lg: 52px)",
    },
    showLabel: {
      control: "boolean",
      description: "Mostrar etiqueta de texto junto al icono",
    },
    cycleMode: {
      control: "select",
      options: ["full", "simple"],
      description: "Modo de ciclo: 'full' incluye system, 'simple' solo light/dark",
    },
    disabled: {
      control: "boolean",
      description: "Deshabilitar el toggle",
    },
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Toggle por defecto (tamaño md, sin label). ¡Haz clic para ver la animación! */
export const Default: Story = {
  args: {},
};

/** Toggle con tamaño pequeño (36px) */
export const Small: Story = {
  args: {
    size: "sm",
  },
};

/** Toggle con tamaño grande (52px) */
export const Large: Story = {
  args: {
    size: "lg",
  },
};

/** Toggle con etiqueta de texto animada */
export const WithLabel: Story = {
  args: {
    showLabel: true,
  },
};

/** Toggle con etiqueta y tamaño grande */
export const LargeWithLabel: Story = {
  args: {
    size: "lg",
    showLabel: true,
  },
};

/** Toggle en modo simple (solo light/dark, sin system) */
export const SimpleMode: Story = {
  args: {
    cycleMode: "simple",
    showLabel: true,
  },
};

/** Comparación de los 3 tamaños disponibles */
export const Sizes: Story = {
  render: () => (
    <Stack direction="row" spacing={3} alignItems="center">
      <Stack alignItems="center" spacing={1}>
        <ThemeToggle size="sm" />
        <Typography variant="caption" color="text.secondary">sm (36px)</Typography>
      </Stack>
      <Stack alignItems="center" spacing={1}>
        <ThemeToggle size="md" />
        <Typography variant="caption" color="text.secondary">md (44px)</Typography>
      </Stack>
      <Stack alignItems="center" spacing={1}>
        <ThemeToggle size="lg" />
        <Typography variant="caption" color="text.secondary">lg (52px)</Typography>
      </Stack>
    </Stack>
  ),
};

/** Con y sin etiquetas */
export const WithAndWithoutLabel: Story = {
  render: () => (
    <Stack direction="row" spacing={4} alignItems="center">
      <Stack alignItems="center" spacing={1}>
        <ThemeToggle showLabel={false} />
        <Typography variant="caption" color="text.secondary">Sin label</Typography>
      </Stack>
      <Stack alignItems="center" spacing={1}>
        <ThemeToggle showLabel />
        <Typography variant="caption" color="text.secondary">Con label</Typography>
      </Stack>
    </Stack>
  ),
};

/** En diferentes contextos de fondo */
export const InContext: Story = {
  render: () => (
    <Stack spacing={3}>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          bgcolor: "background.paper",
        }}
      >
        <Stack direction="row" spacing={3} alignItems="center">
          <Typography variant="body1">En fondo claro:</Typography>
          <ThemeToggle />
          <ThemeToggle showLabel />
        </Stack>
      </Paper>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          bgcolor: "grey.900",
          color: "common.white",
        }}
      >
        <Stack direction="row" spacing={3} alignItems="center">
          <Typography variant="body1">En fondo oscuro:</Typography>
          <ThemeToggle />
          <ThemeToggle showLabel />
        </Stack>
      </Paper>
    </Stack>
  ),
};

/** Ejemplo en un toolbar/header típico */
export const InToolbar: Story = {
  render: () => (
    <Paper
      elevation={1}
      sx={{
        p: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minWidth: 400,
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" fontWeight={600}>Ayla Designs</Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body2" color="text.secondary">
          Tema:
        </Typography>
        <ThemeToggle size="sm" />
      </Stack>
    </Paper>
  ),
};

/** Estado deshabilitado */
export const Disabled: Story = {
  args: {
    disabled: true,
    showLabel: true,
  },
};

/** 
 * Demo interactiva de las animaciones.
 * Haz clic repetidamente para ver:
 * - Rotación de entrada/salida
 * - Spring physics con rebote
 * - Animación de rayos del sol
 * - Animación de estrellas de la luna
 */
export const AnimationDemo: Story = {
  render: () => (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h6" gutterBottom>
        ¡Haz clic para ver las animaciones!
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Observa: rotación, spring bounce, rayos del sol, estrellas
      </Typography>
      <Stack direction="row" spacing={4} justifyContent="center" alignItems="center">
        <Stack alignItems="center" spacing={1}>
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <ThemeToggle size="lg" />
          </Paper>
          <Typography variant="caption">Sin label</Typography>
        </Stack>
        <Stack alignItems="center" spacing={1}>
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <ThemeToggle size="lg" showLabel />
          </Paper>
          <Typography variant="caption">Con label</Typography>
        </Stack>
      </Stack>
    </Box>
  ),
};
