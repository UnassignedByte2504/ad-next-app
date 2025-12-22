import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { createTranslator, useTranslations } from "next-intl";
import storybookMessages from "@/messages/es/storybook.json";
import { ErrorBoundary } from "./ErrorBoundary";

const storyLocale = "es";
const storyT = createTranslator({
  locale: storyLocale,
  messages: storybookMessages,
  namespace: "ErrorBoundary",
});

const meta = {
  title: "Organisms/ErrorBoundary",
  component: ErrorBoundary,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: storyT("description.component"),
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

// Componente que lanza error intencionalmente
function BuggyComponent({ shouldError }: { shouldError: boolean }) {
  const t = useTranslations("Storybook.ErrorBoundary");
  if (shouldError) {
    throw new Error(t("buggy.errorMessage"));
  }
  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h6" color="success.main">
        {t("buggy.okTitle")}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        {t("buggy.okDescription")}
      </Typography>
    </Box>
  );
}

// Wrapper interactivo para demostrar el ErrorBoundary
function ErrorBoundaryDemo({ showDetails }: { showDetails?: boolean }) {
  const t = useTranslations("Storybook.ErrorBoundary");
  const [shouldError, setShouldError] = useState(false);
  const [key, setKey] = useState(0);

  const triggerError = () => {
    setShouldError(true);
  };

  const reset = () => {
    setShouldError(false);
    setKey((k) => k + 1);
  };

  return (
    <Box>
      <Box sx={{ p: 2, bgcolor: "grey.100", mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t("buggy.panelTitle")}
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={triggerError}
            disabled={shouldError}
          >
            {t("buggy.trigger")}
          </Button>
          <Button variant="outlined" onClick={reset}>
            {t("buggy.reset")}
          </Button>
        </Box>
      </Box>

      <ErrorBoundary
        key={key}
        componentName="BuggyComponent"
        showDetails={showDetails}
        onError={(error, info) => {
          console.log("Error capturado:", error.message);
          console.log("Component stack:", info.componentStack);
        }}
      >
        <BuggyComponent shouldError={shouldError} />
      </ErrorBoundary>
    </Box>
  );
}

/**
 * Estado normal sin errores
 */
function DefaultContent() {
  const t = useTranslations("Storybook.ErrorBoundary");
  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h6" color="success.main">
        {t("default.title")}
      </Typography>
      <Typography color="text.secondary">{t("default.description")}</Typography>
    </Box>
  );
}

export const Default: Story = {
  args: {
    children: <DefaultContent />,
  },
};

/**
 * Demo interactiva donde puedes provocar y resetear errores
 */
export const Interactive: Story = {
  args: {
    children: null,
  },
  render: () => <ErrorBoundaryDemo showDetails />,
  parameters: {
    docs: {
      description: {
        story: storyT("description.interactive"),
      },
    },
  },
};

/**
 * Error Boundary sin detalles técnicos (como se vería en producción)
 */
export const ProductionView: Story = {
  args: {
    children: null,
  },
  render: () => <ErrorBoundaryDemo showDetails={false} />,
  parameters: {
    docs: {
      description: {
        story: storyT("description.production"),
      },
    },
  },
};

/**
 * Con fallback personalizado (componente)
 */
export const CustomFallbackComponent: Story = {
  args: {
    fallback: (
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          bgcolor: "warning.light",
          borderRadius: 2,
        }}
      >
        <Typography variant="h4">⚠️</Typography>
        <Typography variant="h6">
          {storyT("fallback.title")}
        </Typography>
        <Typography color="text.secondary">
          {storyT("fallback.description")}
        </Typography>
      </Box>
    ),
    children: <BuggyComponent shouldError={true} />,
  },
};

/**
 * Con fallback como función (recibe error y reset)
 */
export const CustomFallbackFunction: Story = {
  args: {
    fallback: (error: Error, reset: () => void) => (
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          bgcolor: "error.50",
          borderRadius: 2,
          border: "2px dashed",
          borderColor: "error.main",
        }}
      >
        <Typography variant="h4" color="error">
          💥
        </Typography>
        <Typography variant="h6" color="error.dark" gutterBottom>
          {storyT("fallback.functionTitle")}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {storyT("fallback.messageLabel")} {error.message}
        </Typography>
        <Button variant="contained" onClick={reset}>
          {storyT("fallback.retry")}
        </Button>
      </Box>
    ),
    children: <BuggyComponent shouldError={true} />,
  },
  parameters: {
    docs: {
      description: {
        story: storyT("description.fallbackFunction"),
      },
    },
  },
};
