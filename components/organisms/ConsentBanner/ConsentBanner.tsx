"use client";

/**
 * ConsentBanner - GDPR Cookie Consent Banner
 *
 * Aparece en la parte inferior de la pantalla cuando el usuario
 * no ha dado consentimiento para cookies.
 *
 * Botones:
 * - Aceptar todo: Acepta todas las cookies
 * - Rechazar todo: Rechaza cookies no esenciales
 * - Personalizar: Abre modal para elegir individualmente
 */

import { useState } from "react";
import {
  Paper,
  Typography,
  Button,
  Stack,
  Box,
  Container,
  IconButton,
  Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import CookieIcon from "@mui/icons-material/Cookie";
import { useTranslations } from "next-intl";

import { useConsentActions, useShowConsentBanner } from "@store";
import { ConsentModal } from "./ConsentModal";

export interface ConsentBannerProps {
  /**
   * Posición del banner (por defecto: bottom)
   */
  position?: "top" | "bottom";
  /**
   * Ancho máximo del banner (por defecto: lg)
   */
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

/**
 * Banner de consentimiento de cookies GDPR
 */
export function ConsentBanner({
  position = "bottom",
  maxWidth = "lg",
}: ConsentBannerProps) {
  const t = useTranslations("Components.consentBanner");
  const showBanner = useShowConsentBanner();
  const { acceptAll, rejectAll, setHideBanner } = useConsentActions();
  const [showModal, setShowModal] = useState(false);

  // No renderizar si no debe mostrarse
  if (!showBanner) return null;

  const handleAcceptAll = () => {
    acceptAll();
  };

  const handleRejectAll = () => {
    rejectAll();
  };

  const handleCustomize = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleClose = () => {
    setHideBanner();
  };

  return (
    <>
      <Slide direction={position === "bottom" ? "up" : "down"} in={showBanner}>
        <Box
          sx={{
            position: "fixed",
            [position]: 0,
            left: 0,
            right: 0,
            zIndex: (theme) => theme.zIndex.snackbar,
            py: 2,
            px: { xs: 2, sm: 3 },
          }}
        >
          <Container maxWidth={maxWidth}>
            <Paper
              elevation={8}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Stack spacing={2}>
                {/* Header con icono y título */}
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <CookieIcon color="primary" />
                    <Typography variant="h6" component="h2" fontWeight="bold">
                      {t("title")}
                    </Typography>
                  </Stack>
                  <IconButton
                    size="small"
                    onClick={handleClose}
                    aria-label={t("close")}
                    sx={{ ml: 1 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Stack>

                {/* Texto descriptivo */}
                <Typography variant="body2" color="text.secondary">
                  {t("description")}
                </Typography>

                {/* Botones de acción */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.5}
                  alignItems={{ xs: "stretch", sm: "center" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAcceptAll}
                    size="large"
                    fullWidth={false}
                    sx={{ minWidth: { xs: "100%", sm: 140 } }}
                  >
                    {t("accept")}
                  </Button>

                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleRejectAll}
                    size="large"
                    fullWidth={false}
                    sx={{ minWidth: { xs: "100%", sm: 140 } }}
                  >
                    {t("reject")}
                  </Button>

                  <Button
                    variant="text"
                    color="primary"
                    onClick={handleCustomize}
                    startIcon={<SettingsIcon />}
                    size="large"
                    fullWidth={false}
                    sx={{ minWidth: { xs: "100%", sm: 140 } }}
                  >
                    {t("customize")}
                  </Button>
                </Stack>

                {/* Enlace a política de privacidad */}
                <Typography variant="caption" color="text.secondary">
                  {t("policy")}{" "}
                  <Typography
                    component="a"
                    href="/privacy"
                    variant="caption"
                    color="primary"
                    sx={{ textDecoration: "underline", cursor: "pointer" }}
                  >
                    {t("moreInfo")}
                  </Typography>
                </Typography>
              </Stack>
            </Paper>
          </Container>
        </Box>
      </Slide>

      {/* Modal de personalización */}
      <ConsentModal open={showModal} onClose={handleCloseModal} />
    </>
  );
}
