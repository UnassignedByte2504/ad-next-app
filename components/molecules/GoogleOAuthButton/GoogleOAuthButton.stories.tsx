import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { GoogleOAuthButton } from "./GoogleOAuthButton";
import Box from "@mui/material/Box";
import { useStore } from "@/store";
import { useEffect } from "react";

const meta: Meta<typeof GoogleOAuthButton> = {
  title: "Molecules/GoogleOAuthButton",
  component: GoogleOAuthButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["contained", "outlined", "text"],
      description: "Variante del botón MUI",
    },
    disabled: {
      control: "boolean",
      description: "Si el botón está deshabilitado",
    },
    fullWidth: {
      control: "boolean",
      description: "Si debe ocupar todo el ancho",
    },
    label: {
      control: "text",
      description: "Texto del botón",
    },
  },
  args: {
    onSuccess: fn(),
    onError: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof GoogleOAuthButton>;

/** Estado por defecto del botón de Google OAuth */
export const Default: Story = {
  args: {},
};

/** Botón en estado de carga */
export const Loading: Story = {
  decorators: [
    (Story) => {
      // Mock del store para simular estado de carga
      useEffect(() => {
        const store = useStore.getState();
        store.auth.setLoading(true);

        // Limpiar al desmontar
        return () => {
          store.auth.setLoading(false);
        };
      }, []);

      return <Story />;
    },
  ],
  args: {},
};

/** Botón deshabilitado */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/** Variante outlined (por defecto) */
export const Outlined: Story = {
  args: {
    variant: "outlined",
  },
};

/** Variante contained (relleno) */
export const Contained: Story = {
  args: {
    variant: "contained",
  },
};

/** Variante text (solo texto) */
export const Text: Story = {
  args: {
    variant: "text",
  },
};

/** Con etiqueta personalizada */
export const CustomLabel: Story = {
  args: {
    label: "Iniciar sesión con Google",
  },
};

/** Ancho completo */
export const FullWidth: Story = {
  args: {
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: 400 }}>
        <Story />
      </Box>
    ),
  ],
};

/** Sin ancho completo */
export const NotFullWidth: Story = {
  args: {
    fullWidth: false,
  },
};

/** Diferentes variantes juntas */
export const AllVariants: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: 400 }}>
      <GoogleOAuthButton variant="outlined" label="Outlined" />
      <GoogleOAuthButton variant="contained" label="Contained" />
      <GoogleOAuthButton variant="text" label="Text" />
    </Box>
  ),
};

/** Casos de uso comunes en formularios de login */
export const LoginFormExample: Story = {
  render: () => (
    <Box sx={{ width: 400, p: 3, bgcolor: "background.paper", borderRadius: 2 }}>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Inicia sesión</h2>
        <p style={{ color: "#666", fontSize: "0.875rem", marginTop: "0.5rem" }}>
          Conecta con tu cuenta de Google
        </p>
      </Box>
      <GoogleOAuthButton />
      <Box sx={{ textAlign: "center", mt: 2, color: "text.secondary", fontSize: "0.75rem" }}>
        Al continuar, aceptas nuestros términos y condiciones
      </Box>
    </Box>
  ),
};
