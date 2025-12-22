"use client";

/**
 * ConsentModal - Modal para configuración granular de cookies
 *
 * Permite al usuario elegir qué tipos de cookies aceptar:
 * - Funcionales (siempre requeridas)
 * - Analytics (Sentry, métricas)
 * - Marketing (publicidad, remarketing)
 */

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Switch,
  FormControlLabel,
  Divider,
  Box,
  Alert,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import { useTranslations } from "next-intl";

import { useConsentActions, useConsentPreferences } from "@store";
import type { ConsentPreferences } from "@store/types";

export interface ConsentModalProps {
  /**
   * Si el modal está abierto
   */
  open: boolean;
  /**
   * Callback cuando se cierra el modal
   */
  onClose: () => void;
}

/**
 * Modal de configuración de consentimiento de cookies
 */
export function ConsentModal({ open, onClose }: ConsentModalProps) {
  const t = useTranslations("Components.consentModal");
  const currentPreferences = useConsentPreferences();
  const { updateConsent } = useConsentActions();

  const [preferences, setPreferences] = useState<ConsentPreferences>({
    ...currentPreferences,
    functional: true, // Siempre true
  });

  const handleToggle = (key: keyof ConsentPreferences) => {
    // No permitir desactivar funcionales
    if (key === "functional") return;

    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    updateConsent(preferences);
    onClose();
  };

  const handleCancel = () => {
    // Restaurar preferencias originales
    setPreferences({
      ...currentPreferences,
      functional: true,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      aria-labelledby="consent-modal-title"
    >
      <DialogTitle id="consent-modal-title">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6" component="span" fontWeight="bold">
            {t("title")}
          </Typography>
          <IconButton
            size="small"
            onClick={handleCancel}
            aria-label={t("close")}
            sx={{ ml: 1 }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          {/* Información general */}
          <Alert severity="info" icon={<InfoIcon />}>
            {t("info")}
          </Alert>

          {/* Cookies Funcionales */}
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {t("functional.title")}
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.functional}
                    disabled
                    color="primary"
                  />
                }
                label={t("functional.status")}
                labelPlacement="start"
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {t("functional.description")}
            </Typography>
          </Box>

          <Divider />

          {/* Cookies de Analytics */}
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {t("analytics.title")}
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.analytics}
                    onChange={() => handleToggle("analytics")}
                    color="primary"
                  />
                }
                label={
                  preferences.analytics
                    ? t("analytics.enabled")
                    : t("analytics.disabled")
                }
                labelPlacement="start"
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {t("analytics.description")}
            </Typography>
          </Box>

          <Divider />

          {/* Cookies de Marketing */}
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {t("marketing.title")}
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.marketing}
                    onChange={() => handleToggle("marketing")}
                    color="primary"
                  />
                }
                label={
                  preferences.marketing
                    ? t("marketing.enabled")
                    : t("marketing.disabled")
                }
                labelPlacement="start"
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {t("marketing.description")}
            </Typography>
          </Box>

          {/* Nota sobre privacidad */}
          <Alert severity="success">
            <Typography variant="body2">
              {t.rich("privacy.note", {
                link: (chunks) => (
                  <Typography
                    component="a"
                    href="/privacy"
                    variant="body2"
                    color="primary"
                    sx={{ textDecoration: "underline", cursor: "pointer" }}
                  >
                    {chunks}
                  </Typography>
                ),
              })}
            </Typography>
          </Alert>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleCancel} color="inherit">
          {t("cancel")}
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {t("save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
