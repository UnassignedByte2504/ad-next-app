import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { AlertDialog } from "./AlertDialog";

const meta: Meta<typeof AlertDialog> = {
  title: "Molecules/AlertDialog",
  component: AlertDialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Modal dialog for alerts and confirmations with multiple variants.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "error", "confirm"],
    },
    loading: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AlertDialog>;

/**
 * Info variant - for informational messages.
 */
export const Info: Story = {
  args: {
    open: true,
    variant: "info",
    title: "Información",
    message:
      "Tu perfil ha sido actualizado correctamente. Los cambios pueden tardar unos minutos en reflejarse.",
    onClose: () => {},
  },
};

/**
 * Success variant - for successful operations.
 */
export const Success: Story = {
  args: {
    open: true,
    variant: "success",
    title: "¡Éxito!",
    message: "Tu mensaje ha sido enviado correctamente. Te responderemos pronto.",
    onClose: () => {},
  },
};

/**
 * Warning variant - for warnings.
 */
export const Warning: Story = {
  args: {
    open: true,
    variant: "warning",
    title: "Atención",
    message:
      "Tu sesión está a punto de expirar. Guarda tus cambios para no perderlos.",
    onClose: () => {},
  },
};

/**
 * Error variant - for error messages.
 */
export const Error: Story = {
  args: {
    open: true,
    variant: "error",
    title: "Error",
    message:
      "No se pudo conectar con el servidor. Por favor, comprueba tu conexión e inténtalo de nuevo.",
    onClose: () => {},
  },
};

/**
 * Confirm variant - for confirmation dialogs.
 */
export const Confirm: Story = {
  args: {
    open: true,
    variant: "confirm",
    title: "¿Eliminar banda?",
    message:
      "Esta acción eliminará la banda y todos sus datos. Esta acción no se puede deshacer.",
    confirmText: "Eliminar",
    cancelText: "Cancelar",
    onClose: () => {},
    onConfirm: () => console.log("Confirmed!"),
  },
};

/**
 * With loading state.
 */
export const Loading: Story = {
  args: {
    open: true,
    variant: "confirm",
    title: "¿Eliminar cuenta?",
    message: "Esta acción es irreversible.",
    confirmText: "Eliminar",
    loading: true,
    onClose: () => {},
  },
};

/**
 * With custom content.
 */
export const CustomContent: Story = {
  args: {
    open: true,
    variant: "info",
    title: "Nuevas funcionalidades",
    message: (
      <Box sx={{ textAlign: "left" }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Hemos añadido nuevas funcionalidades:
        </Typography>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            <Typography variant="body2" color="text.secondary">
              Mensajería en tiempo real
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              Notificaciones push
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              Perfil mejorado
            </Typography>
          </li>
        </ul>
      </Box>
    ),
    onClose: () => {},
  },
};

/**
 * Custom button texts.
 */
export const CustomButtons: Story = {
  args: {
    open: true,
    variant: "confirm",
    title: "¿Salir sin guardar?",
    message: "Tienes cambios sin guardar que se perderán.",
    confirmText: "Salir",
    cancelText: "Seguir editando",
    onClose: () => {},
  },
};

/**
 * Interactive example with trigger button.
 */
export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [variant, setVariant] = useState<
      "info" | "success" | "warning" | "error" | "confirm"
    >("info");
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
      if (variant === "confirm") {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setLoading(false);
        setOpen(false);
      } else {
        setOpen(false);
      }
    };

    const messages = {
      info: "Este es un mensaje informativo.",
      success: "La operación se completó correctamente.",
      warning: "Ten cuidado con esta acción.",
      error: "Ha ocurrido un error inesperado.",
      confirm: "¿Estás seguro de que quieres continuar?",
    };

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {(["info", "success", "warning", "error", "confirm"] as const).map(
            (v) => (
              <Button
                key={v}
                variant={variant === v ? "contained" : "outlined"}
                onClick={() => {
                  setVariant(v);
                  setOpen(true);
                }}
                size="small"
              >
                {v}
              </Button>
            )
          )}
        </Box>

        <AlertDialog
          open={open}
          onClose={() => setOpen(false)}
          variant={variant}
          title={variant.charAt(0).toUpperCase() + variant.slice(1)}
          message={messages[variant]}
          onConfirm={handleConfirm}
          loading={loading}
        />
      </Box>
    );
  },
};
