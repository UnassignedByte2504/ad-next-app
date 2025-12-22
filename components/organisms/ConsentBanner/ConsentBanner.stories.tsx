import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import { ConsentBanner } from "./ConsentBanner";

const meta = {
  title: "Organisms/ConsentBanner",
  component: ConsentBanner,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Banner de consentimiento de cookies GDPR que aparece en la parte inferior 
de la pantalla cuando el usuario no ha dado consentimiento.

## Características
- Posicionamiento flexible (top/bottom)
- Animación de entrada/salida con Slide
- Botones de acción: Aceptar todo, Rechazar todo, Personalizar
- Enlace a política de privacidad
- Integración con ConsentModal para configuración granular

## Uso
\`\`\`tsx
import { ConsentBanner } from "@components";

// En tu layout principal
<ConsentBanner position="bottom" maxWidth="lg" />
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story: React.ComponentType) => (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Contenido de la Página
        </Typography>
        <Typography color="text.secondary" paragraph>
          Este es el contenido principal de la página. El banner de
          consentimiento aparece en la parte inferior.
        </Typography>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof ConsentBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================
// Componente de demostración standalone
// ============================================

/**
 * Componente standalone para demostrar el banner sin depender del store
 */
function StandaloneConsentBanner({
  position = "bottom",
  maxWidth = "lg",
}: {
  position?: "top" | "bottom";
  maxWidth?: "sm" | "md" | "lg" | "xl";
}) {
  const [showBanner, setShowBanner] = useState(true);
  const [showModal, setShowModal] = useState(false);

  if (!showBanner) {
    return (
      <Box sx={{ position: "fixed", bottom: 20, right: 20 }}>
        <Button
          variant="contained"
          onClick={() => setShowBanner(true)}
          size="small"
        >
          🔄 Mostrar Banner de Nuevo
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          [position]: 0,
          left: 0,
          right: 0,
          zIndex: 1400,
          py: 2,
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ maxWidth: maxWidth === "lg" ? 1200 : maxWidth === "md" ? 900 : maxWidth === "sm" ? 600 : 1536, mx: "auto" }}>
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
              bgcolor: "background.paper",
              boxShadow: 8,
              border: 1,
              borderColor: "divider",
            }}
          >
            <Stack spacing={2}>
              {/* Header */}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Typography fontSize={24}>🍪</Typography>
                  <Typography variant="h6" component="h2" fontWeight="bold">
                    Consentimiento de Cookies
                  </Typography>
                </Stack>
                <Button
                  size="small"
                  onClick={() => setShowBanner(false)}
                  sx={{ minWidth: "auto" }}
                >
                  ✕
                </Button>
              </Stack>

              {/* Texto */}
              <Typography variant="body2" color="text.secondary">
                Utilizamos cookies para mejorar tu experiencia, analizar el
                tráfico del sitio y personalizar el contenido. Algunas cookies
                son necesarias para el funcionamiento del sitio, mientras que
                otras nos ayudan a mejorar nuestros servicios.
              </Typography>

              {/* Botones */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                alignItems={{ xs: "stretch", sm: "center" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    console.log("✅ Aceptar todo");
                    setShowBanner(false);
                  }}
                  size="large"
                  sx={{ minWidth: { xs: "100%", sm: 140 } }}
                >
                  Aceptar todo
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    console.log("❌ Rechazar todo");
                    setShowBanner(false);
                  }}
                  size="large"
                  sx={{ minWidth: { xs: "100%", sm: 140 } }}
                >
                  Rechazar todo
                </Button>

                <Button
                  variant="text"
                  color="primary"
                  onClick={() => setShowModal(true)}
                  size="large"
                  sx={{ minWidth: { xs: "100%", sm: 140 } }}
                >
                  ⚙️ Personalizar
                </Button>
              </Stack>

              {/* Nota */}
              <Typography variant="caption" color="text.secondary">
                Al hacer clic en &quot;Aceptar todo&quot;, aceptas el
                almacenamiento de cookies en tu dispositivo.{" "}
                <Typography
                  component="span"
                  variant="caption"
                  color="primary"
                  sx={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  Más información
                </Typography>
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Modal standalone */}
      <StandaloneConsentModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={() => {
          setShowModal(false);
          setShowBanner(false);
        }}
      />
    </>
  );
}

/**
 * Modal standalone para configuración de cookies
 */
function StandaloneConsentModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "rgba(0,0,0,0.5)",
      }}
      onClick={onClose}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 2,
          p: 3,
          maxWidth: 500,
          width: "90%",
          maxHeight: "80vh",
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Configuración de Cookies
        </Typography>

        <Stack spacing={2} sx={{ my: 2 }}>
          {/* Funcionales */}
          <Box
            sx={{ p: 2, bgcolor: "grey.100", borderRadius: 1 }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight="bold">🔒 Cookies Funcionales</Typography>
              <Typography variant="caption" color="text.secondary">
                Siempre activas
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Necesarias para el funcionamiento del sitio.
            </Typography>
          </Box>

          {/* Analytics */}
          <Box sx={{ p: 2, border: 1, borderColor: "divider", borderRadius: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight="bold">📊 Cookies de Análisis</Typography>
              <Button
                size="small"
                variant={analytics ? "contained" : "outlined"}
                onClick={() => setAnalytics(!analytics)}
              >
                {analytics ? "Activadas" : "Desactivadas"}
              </Button>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Nos ayudan a entender cómo usas el sitio.
            </Typography>
          </Box>

          {/* Marketing */}
          <Box sx={{ p: 2, border: 1, borderColor: "divider", borderRadius: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight="bold">📢 Cookies de Marketing</Typography>
              <Button
                size="small"
                variant={marketing ? "contained" : "outlined"}
                onClick={() => setMarketing(!marketing)}
              >
                {marketing ? "Activadas" : "Desactivadas"}
              </Button>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Para mostrarte anuncios relevantes.
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              console.log("Preferencias guardadas:", { analytics, marketing });
              onSave();
            }}
          >
            Guardar Preferencias
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

// ============================================
// Stories
// ============================================

/**
 * Banner de consentimiento en posición inferior (por defecto)
 */
export const Default: Story = {
  args: {
    position: "bottom",
    maxWidth: "lg",
  },
  render: () => <StandaloneConsentBanner position="bottom" maxWidth="lg" />,
};

/**
 * Banner en la parte superior de la pantalla
 */
export const TopPosition: Story = {
  args: {
    position: "top",
    maxWidth: "lg",
  },
  render: () => <StandaloneConsentBanner position="top" maxWidth="lg" />,
};

/**
 * Banner con ancho reducido (sm)
 */
export const SmallWidth: Story = {
  args: {
    position: "bottom",
    maxWidth: "sm",
  },
  render: () => <StandaloneConsentBanner position="bottom" maxWidth="sm" />,
};

/**
 * Banner con ancho mediano (md)
 */
export const MediumWidth: Story = {
  args: {
    position: "bottom",
    maxWidth: "md",
  },
  render: () => <StandaloneConsentBanner position="bottom" maxWidth="md" />,
};

// ============================================
// ConsentModal Stories
// ============================================

/**
 * Wrapper component for Modal story to avoid hooks in render function
 */
function ModalOpenDemo() {
  const [open, setOpen] = useState(true);
  return (
    <Box>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Abrir Modal de Configuración
      </Button>
      <StandaloneConsentModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={() => setOpen(false)}
      />
    </Box>
  );
}

/**
 * Modal de configuración de cookies abierto
 */
export const ModalOpen: Story = {
  args: {
    position: "bottom",
    maxWidth: "lg",
  },
  render: () => <ModalOpenDemo />,
  parameters: {
    docs: {
      description: {
        story: "Modal de configuración de cookies para selección granular.",
      },
    },
  },
};

/**
 * Wrapper component for InteractiveDemo to avoid hooks in render function
 */
function InteractiveDemoComponent() {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState({
    functional: true,
    analytics: false,
    marketing: false,
  });

  return (
    <Box sx={{ minHeight: "60vh" }}>
      <Stack spacing={3}>
        <Typography variant="h5">Demo Interactiva de Consentimiento</Typography>

        <Box sx={{ p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Estado actual de preferencias:
          </Typography>
          <Stack direction="row" spacing={2}>
            <Typography variant="body2">
              🔒 Funcionales: <strong>Siempre</strong>
            </Typography>
            <Typography variant="body2">
              📊 Analytics:{" "}
              <strong>{preferences.analytics ? "✅" : "❌"}</strong>
            </Typography>
            <Typography variant="body2">
              📢 Marketing:{" "}
              <strong>{preferences.marketing ? "✅" : "❌"}</strong>
            </Typography>
          </Stack>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={() => setShowBanner(true)}
            disabled={showBanner}
          >
            🍪 Mostrar Banner
          </Button>
          <Button
            variant="outlined"
            onClick={() =>
              setPreferences({ functional: true, analytics: false, marketing: false })
            }
          >
            🔄 Resetear Preferencias
          </Button>
        </Stack>
      </Stack>

      {showBanner && (
        <StandaloneConsentBanner
          position="bottom"
          maxWidth="lg"
        />
      )}
    </Box>
  );
}

/**
 * Demo interactiva completa
 */
export const InteractiveDemo: Story = {
  args: {
    position: "bottom",
    maxWidth: "lg",
  },
  render: () => <InteractiveDemoComponent />,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Demo interactiva que muestra el flujo completo de consentimiento de cookies.",
      },
    },
  },
};
