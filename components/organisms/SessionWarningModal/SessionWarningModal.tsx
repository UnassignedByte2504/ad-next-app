/**
 * SessionWarningModal Component
 *
 * Modal de advertencia de timeout de sesión.
 * Muestra un countdown y opciones para continuar o cerrar sesión.
 *
 * Features:
 * - Countdown timer en tiempo real
 * - Botones de acción (Continuar/Cerrar sesión)
 * - No se puede cerrar con ESC o click fuera (intencional)
 * - Diseño responsive con MUI
 *
 * @example
 * ```tsx
 * <SessionWarningModal
 *   open={showWarning}
 *   remainingTime={120}
 *   onContinue={handleContinue}
 *   onLogout={handleLogout}
 * />
 * ```
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { Warning as WarningIcon, ExitToApp as LogoutIcon } from "@mui/icons-material";

// ============================================
// Types
// ============================================

export interface SessionWarningModalProps {
  /** Si el modal está abierto */
  open: boolean;
  /** Tiempo restante en segundos */
  remainingTime: number;
  /** Callback para continuar la sesión */
  onContinue: () => void;
  /** Callback para cerrar sesión */
  onLogout: () => void;
  /** Tiempo de advertencia (minutos) - para display */
  warningMinutes?: number;
}

// ============================================
// Helper Functions
// ============================================

/**
 * Formatea segundos a formato MM:SS
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// ============================================
// Component
// ============================================

export function SessionWarningModal({
  open,
  remainingTime,
  onContinue,
  onLogout,
  warningMinutes = 25,
}: SessionWarningModalProps) {
  return (
    <Dialog
      open={open}
      // No permitir cerrar con ESC o click fuera (seguridad)
      disableEscapeKeyDown
      onClose={(_, reason) => {
        if (reason === "backdropClick") {
          return;
        }
      }}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 8,
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          pb: 2,
        }}
      >
        <WarningIcon color="warning" fontSize="large" />
        <Typography variant="h6" component="span" fontWeight={600}>
          Tu sesión está por expirar
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Has estado inactivo durante {warningMinutes} minutos. Por seguridad, tu sesión
            expirará pronto.
          </Typography>
        </Alert>

        <Box
          sx={{
            textAlign: "center",
            py: 3,
            px: 2,
            bgcolor: "background.default",
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Tiempo restante:
          </Typography>
          <Typography
            variant="h2"
            component="div"
            color={remainingTime <= 30 ? "error.main" : "warning.main"}
            fontWeight={700}
            fontFamily="monospace"
            sx={{
              letterSpacing: 2,
            }}
          >
            {formatTime(remainingTime)}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 3, textAlign: "center" }}
        >
          ¿Deseas continuar con tu sesión?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={onLogout}
          variant="outlined"
          color="inherit"
          startIcon={<LogoutIcon />}
          fullWidth
          sx={{ flex: 1 }}
        >
          Cerrar sesión
        </Button>
        <Button
          onClick={onContinue}
          variant="contained"
          color="primary"
          autoFocus
          fullWidth
          sx={{ flex: 1 }}
        >
          Continuar sesión
        </Button>
      </DialogActions>
    </Dialog>
  );
}
