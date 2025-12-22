import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState, useEffect } from "react";
import { fn } from "storybook/test";
import { Box, Button, Stack, Typography, Chip } from "@mui/material";
import { SessionWarningModal } from "./SessionWarningModal";

const meta = {
  title: "Organisms/SessionWarningModal",
  component: SessionWarningModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Modal de advertencia de timeout de sesión con countdown en tiempo real.

## Características
- Countdown timer visual
- Cambio de color cuando queda poco tiempo (≤30s)
- Botones de acción: Continuar sesión / Cerrar sesión
- No se puede cerrar con ESC o click fuera (seguridad)
- Diseño responsive

## Uso
\`\`\`tsx
import { SessionWarningModal } from "@components";

<SessionWarningModal
  open={showWarning}
  remainingTime={120}
  onContinue={handleContinue}
  onLogout={handleLogout}
  warningMinutes={25}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onContinue: fn(),
    onLogout: fn(),
  },
  argTypes: {
    remainingTime: {
      control: { type: "number", min: 0, max: 300 },
      description: "Tiempo restante en segundos",
    },
    warningMinutes: {
      control: { type: "number", min: 1, max: 60 },
      description: "Minutos de inactividad para mostrar en el mensaje",
    },
    open: {
      control: "boolean",
      description: "Si el modal está abierto",
    },
  },
} satisfies Meta<typeof SessionWarningModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================
// Stories básicas
// ============================================

/**
 * Modal con tiempo suficiente (2 minutos)
 */
export const Default: Story = {
  args: {
    open: true,
    remainingTime: 120,
    warningMinutes: 25,
  },
};

/**
 * Modal con tiempo medio (1 minuto)
 */
export const OneMinuteLeft: Story = {
  args: {
    open: true,
    remainingTime: 60,
    warningMinutes: 25,
  },
};

/**
 * Modal con poco tiempo (30 segundos) - Modo urgente
 */
export const UrgentTime: Story = {
  args: {
    open: true,
    remainingTime: 30,
    warningMinutes: 25,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Cuando quedan 30 segundos o menos, el timer cambia a color rojo para indicar urgencia.",
      },
    },
  },
};

/**
 * Modal con muy poco tiempo (10 segundos)
 */
export const CriticalTime: Story = {
  args: {
    open: true,
    remainingTime: 10,
    warningMinutes: 25,
  },
};

/**
 * Modal con tiempo casi agotado (5 segundos)
 */
export const AlmostExpired: Story = {
  args: {
    open: true,
    remainingTime: 5,
    warningMinutes: 25,
  },
};

/**
 * Modal cerrado (estado inicial)
 */
export const Closed: Story = {
  args: {
    open: false,
    remainingTime: 120,
    warningMinutes: 25,
  },
};

// ============================================
// Demo interactiva con countdown real
// ============================================

/**
 * Componente de demo con countdown real
 */
function InteractiveSessionWarning() {
  const [open, setOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(120);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Countdown effect
  useEffect(() => {
    if (!isRunning || !open) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setOpen(false);
          setSessionExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, open]);

  const handleShowWarning = () => {
    setSessionExpired(false);
    setRemainingTime(120);
    setOpen(true);
    setIsRunning(true);
  };

  const handleContinue = () => {
    console.log("✅ Sesión extendida");
    setOpen(false);
    setIsRunning(false);
    setRemainingTime(120);
  };

  const handleLogout = () => {
    console.log("🚪 Cerrar sesión");
    setOpen(false);
    setIsRunning(false);
    setSessionExpired(true);
  };

  const handleQuickDemo = (seconds: number) => {
    setSessionExpired(false);
    setRemainingTime(seconds);
    setOpen(true);
    setIsRunning(true);
  };

  return (
    <Box sx={{ p: 4, minWidth: 400 }}>
      <Stack spacing={3}>
        <Typography variant="h5" fontWeight="bold">
          Demo Interactiva
        </Typography>

        {sessionExpired ? (
          <Box
            sx={{
              p: 3,
              bgcolor: "error.light",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" color="error.dark">
              ⏰ Sesión Expirada
            </Typography>
            <Typography variant="body2" color="error.dark" sx={{ mt: 1 }}>
              Tu sesión ha expirado por inactividad.
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => setSessionExpired(false)}
            >
              Iniciar Sesión de Nuevo
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Estado:
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip
                  label={open ? "Modal Abierto" : "Modal Cerrado"}
                  color={open ? "warning" : "default"}
                  size="small"
                />
                <Chip
                  label={isRunning ? "Countdown Activo" : "Countdown Pausado"}
                  color={isRunning ? "error" : "default"}
                  size="small"
                />
              </Stack>
            </Box>

            <Stack spacing={2}>
              <Typography variant="subtitle2">
                Iniciar con diferentes tiempos:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Button
                  variant="contained"
                  onClick={handleShowWarning}
                  disabled={open}
                >
                  🕐 2 minutos
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleQuickDemo(60)}
                  disabled={open}
                >
                  🕐 1 minuto
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={() => handleQuickDemo(30)}
                  disabled={open}
                >
                  ⚠️ 30 segundos
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleQuickDemo(10)}
                  disabled={open}
                >
                  🔥 10 segundos
                </Button>
              </Stack>
            </Stack>
          </>
        )}

        <Typography variant="caption" color="text.secondary">
          💡 Tip: El timer cambia a rojo cuando quedan 30 segundos o menos.
        </Typography>
      </Stack>

      <SessionWarningModal
        open={open}
        remainingTime={remainingTime}
        onContinue={handleContinue}
        onLogout={handleLogout}
        warningMinutes={25}
      />
    </Box>
  );
}

/**
 * Demo interactiva con countdown en tiempo real
 */
export const Interactive: Story = {
  args: {
    open: false,
    remainingTime: 120,
    warningMinutes: 25,
  },
  render: () => <InteractiveSessionWarning />,
  parameters: {
    docs: {
      description: {
        story:
          "Demo interactiva con countdown en tiempo real. Puedes iniciar el warning con diferentes tiempos y ver cómo se comporta el modal.",
      },
    },
  },
};

// ============================================
// Variantes de tiempo de inactividad
// ============================================

/**
 * Advertencia después de 15 minutos de inactividad
 */
export const After15Minutes: Story = {
  args: {
    open: true,
    remainingTime: 60,
    warningMinutes: 15,
  },
  parameters: {
    docs: {
      description: {
        story: "Configuración para sesiones más cortas (15 minutos).",
      },
    },
  },
};

/**
 * Advertencia después de 30 minutos de inactividad
 */
export const After30Minutes: Story = {
  args: {
    open: true,
    remainingTime: 120,
    warningMinutes: 30,
  },
  parameters: {
    docs: {
      description: {
        story: "Configuración para sesiones más largas (30 minutos).",
      },
    },
  },
};

// ============================================
// Estados de countdown específicos
// ============================================

/**
 * Componente de demostración de diferentes estados del timer
 */
function TimerStatesDemo() {
  return (
    <Stack spacing={3} sx={{ p: 2 }}>
      <Typography variant="h6">Estados del Timer</Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
        <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
          <Typography
            variant="h3"
            fontWeight={700}
            fontFamily="monospace"
            color="warning.main"
          >
            02:00
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Normal (≥31s)
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
          <Typography
            variant="h3"
            fontWeight={700}
            fontFamily="monospace"
            color="error.main"
          >
            00:30
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Urgente (≤30s)
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
          <Typography
            variant="h3"
            fontWeight={700}
            fontFamily="monospace"
            color="error.main"
          >
            00:05
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Crítico (≤5s)
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
}

/**
 * Referencia visual de los estados del timer
 */
export const TimerStates: Story = {
  args: {
    open: false,
    remainingTime: 120,
    warningMinutes: 25,
  },
  render: () => <TimerStatesDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Referencia visual de cómo cambia el color del timer según el tiempo restante.",
      },
    },
  },
};
