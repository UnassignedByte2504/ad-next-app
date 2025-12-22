"use client";

/**
 * Google OAuth Callback Client Component
 *
 * Esta página maneja el callback de Google OAuth.
 * Procesa el código de autorización y completa el login.
 *
 * Flujo:
 * 1. Usuario clickea "Login con Google"
 * 2. Redirigido a Google para autenticar
 * 3. Google redirige aquí con ?code=...
 * 4. Llamamos al backend para intercambiar code por tokens
 * 5. Backend setea cookies httpOnly
 * 6. Redirigimos al usuario a la app
 */

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { useAuthActions } from "@/store";
import { useLogger } from "@hooks";

type CallbackState = "loading" | "success" | "error";

/**
 * Componente de loading para Suspense
 */
function LoadingFallback() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        p: 3,
        textAlign: "center",
      }}
    >
      <CircularProgress size={48} sx={{ mb: 3 }} />
      <Typography variant="h6" gutterBottom>
        Cargando...
      </Typography>
    </Box>
  );
}

/**
 * Contenido principal del callback
 * Separado para poder usar Suspense con useSearchParams
 */
function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { handleGoogleCallback } = useAuthActions();
  const log = useLogger("GoogleOAuthCallback");

  const [state, setState] = useState<CallbackState>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      // Si hay un error de Google
      if (error) {
        log.error("Error from Google", undefined, { error, errorDescription });
        setState("error");
        setErrorMessage(
          errorDescription || "Google rechazó la solicitud de autenticación"
        );
        return;
      }

      // Si no hay código
      if (!code) {
        log.error("Missing code parameter");
        setState("error");
        setErrorMessage("No se recibió el código de autorización de Google");
        return;
      }

      try {
        // Intercambiar código por tokens
        await handleGoogleCallback(code);

        setState("success");
        log.info("Callback successful");

        // Redirigir después de un breve delay para mostrar éxito
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } catch (err) {
        log.error("Callback failed", err);
        setState("error");
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Error al completar la autenticación con Google"
        );
      }
    };

    processCallback();
  }, [searchParams, handleGoogleCallback, router, log]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        p: 3,
        textAlign: "center",
      }}
    >
      {state === "loading" && (
        <>
          <CircularProgress size={48} sx={{ mb: 3 }} />
          <Typography variant="h6" gutterBottom>
            Conectando con Google...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Por favor espera mientras completamos tu inicio de sesión
          </Typography>
        </>
      )}

      {state === "success" && (
        <>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: "success.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Typography variant="h4" color="white">
              ✓
            </Typography>
          </Box>
          <Typography variant="h6" gutterBottom>
            ¡Inicio de sesión exitoso!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Redirigiendo...
          </Typography>
        </>
      )}

      {state === "error" && (
        <>
          <Alert severity="error" sx={{ mb: 3, maxWidth: 400 }}>
            {errorMessage || "Ocurrió un error durante la autenticación"}
          </Alert>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            No pudimos completar el inicio de sesión con Google.
            <br />
            Por favor intenta de nuevo.
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" onClick={() => router.push("/login")}>
              Volver al login
            </Button>
            <Button variant="contained" onClick={() => router.push("/")}>
              Ir al inicio
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

/**
 * Cliente de callback de Google OAuth
 * Envuelta en Suspense porque usa useSearchParams
 */
export default function GoogleCallbackClient() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
