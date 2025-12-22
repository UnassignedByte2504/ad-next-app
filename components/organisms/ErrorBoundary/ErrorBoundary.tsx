"use client";

import { useTranslations } from "next-intl";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { Box, Button, Container, Typography, Paper, Collapse } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import HomeIcon from "@mui/icons-material/Home";
import BugReportIcon from "@mui/icons-material/BugReport";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import * as Sentry from "@sentry/nextjs";
import { logger } from "@lib/logger";

export interface ErrorBoundaryProps {
  children: ReactNode;
  /** Componente de fallback personalizado */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /** Callback cuando ocurre un error */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Nombre del componente para logging */
  componentName?: string;
  /** Mostrar detalles técnicos (solo desarrollo) */
  showDetails?: boolean;
}

type ErrorBoundaryTranslations = {
  title: string;
  message: string;
  retry: string;
  home: string;
  showDetails: string;
  hideDetails: string;
  componentStack: string;
};

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showTechnicalDetails: boolean;
}

const DEFAULT_TRANSLATIONS: ErrorBoundaryTranslations = {
  title: "¡Ups! Algo salió mal",
  message:
    "Ha ocurrido un error inesperado. Puedes intentar recargar la página o volver al inicio.",
  retry: "Reintentar",
  home: "Ir al inicio",
  showDetails: "Mostrar detalles técnicos",
  hideDetails: "Ocultar detalles técnicos",
  componentStack: "Pila de componentes:",
};

/**
 * Error Boundary para React 19
 *
 * Captura errores en el árbol de componentes hijos y muestra
 * una UI de fallback en lugar de crashear la aplicación.
 *
 * @example
 * ```tsx
 * <ErrorBoundary componentName="MusicianProfile">
 *   <MusicianProfile />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundaryBase extends Component<
  ErrorBoundaryProps & { translations?: ErrorBoundaryTranslations },
  ErrorBoundaryState
> {
  private log = logger.withContext({ component: "ErrorBoundary" });

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showTechnicalDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError, componentName } = this.props;

    // Guardar info del error
    this.setState({ errorInfo });

    // Log del error (también va a consola)
    this.log.error(
      `Error en ${componentName || "componente"}`,
      error,
      {
        componentStack: errorInfo.componentStack,
        componentName,
      }
    );

    // Enviar a Sentry con contexto completo
    Sentry.withScope((scope) => {
      scope.setTag("component", componentName || "unknown");
      scope.setExtra("componentStack", errorInfo.componentStack);
      scope.setLevel("error");
      Sentry.captureException(error);
    });

    // Callback personalizado
    if (onError) {
      onError(error, errorInfo);
    }
  }

  private handleReset = (): void => {
    this.log.info("Intentando recuperar de error");
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showTechnicalDetails: false,
    });
  };

  private handleGoHome = (): void => {
    this.log.info("Navegando a home desde error");
    window.location.href = "/";
  };

  private toggleDetails = (): void => {
    this.setState((prev) => ({
      showTechnicalDetails: !prev.showTechnicalDetails,
    }));
  };

  render(): ReactNode {
    const { hasError, error, errorInfo, showTechnicalDetails } = this.state;
    const {
      children,
      fallback,
      showDetails = process.env.NODE_ENV === "development",
      translations: translationsProp,
    } = this.props;
    const translations = translationsProp ?? DEFAULT_TRANSLATIONS;

    if (!hasError || !error) {
      return children;
    }

    // Fallback personalizado
    if (fallback) {
      if (typeof fallback === "function") {
        return fallback(error, this.handleReset);
      }
      return fallback;
    }

    // UI de error por defecto
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "error.light",
            bgcolor: "error.50",
          }}
        >
          {/* Icono */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "error.100",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
            }}
          >
            <BugReportIcon sx={{ fontSize: 40, color: "error.main" }} />
          </Box>

          {/* Título */}
          <Typography
            variant="h5"
            component="h1"
            fontWeight="bold"
            gutterBottom
            color="error.dark"
          >
            {translations.title}
          </Typography>

          {/* Mensaje */}
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            {translations.message}
          </Typography>

          {/* Acciones */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={this.handleReset}
            >
              {translations.retry}
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<HomeIcon />}
              onClick={this.handleGoHome}
            >
              {translations.home}
            </Button>
          </Box>

          {/* Detalles técnicos (solo en desarrollo) */}
          {showDetails && (
            <Box sx={{ mt: 3 }}>
              <Button
                size="small"
                color="inherit"
                onClick={this.toggleDetails}
                endIcon={showTechnicalDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                sx={{ color: "text.secondary" }}
              >
                {showTechnicalDetails ? translations.hideDetails : translations.showDetails}
              </Button>

              <Collapse in={showTechnicalDetails}>
                <Paper
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: "grey.900",
                    color: "grey.100",
                    borderRadius: 2,
                    textAlign: "left",
                    overflow: "auto",
                    maxHeight: 300,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "error.light", mb: 1 }}
                  >
                    {error.name}: {error.message}
                  </Typography>

                  {error.stack && (
                    <Box
                      component="pre"
                      sx={{
                        fontSize: "0.75rem",
                        fontFamily: "monospace",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        m: 0,
                        color: "grey.400",
                      }}
                    >
                      {error.stack}
                    </Box>
                  )}

                  {errorInfo?.componentStack && (
                    <>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "warning.light", mt: 2, mb: 1 }}
                      >
                        {translations.componentStack}
                      </Typography>
                      <Box
                        component="pre"
                        sx={{
                          fontSize: "0.75rem",
                          fontFamily: "monospace",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          m: 0,
                          color: "grey.400",
                        }}
                      >
                        {errorInfo.componentStack}
                      </Box>
                    </>
                  )}
                </Paper>
              </Collapse>
            </Box>
          )}
        </Paper>
      </Container>
    );
  }
}

export function ErrorBoundary(props: ErrorBoundaryProps): ReactNode {
  const t = useTranslations("Components.errorBoundary");
  const translations: ErrorBoundaryTranslations = {
    title: t("title"),
    message: t("message"),
    retry: t("retry"),
    home: t("home"),
    showDetails: t("showDetails"),
    hideDetails: t("hideDetails"),
    componentStack: t("componentStack"),
  };

  return <ErrorBoundaryBase {...props} translations={translations} />;
}

ErrorBoundary.displayName = "ErrorBoundary";

export default ErrorBoundary;
