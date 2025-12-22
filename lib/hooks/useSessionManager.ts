/**
 * useSessionManager Hook
 *
 * Gestiona el ciclo de vida de la sesión del usuario:
 * - Detecta inactividad del usuario (mouse, teclado, touch)
 * - Muestra advertencia antes del timeout de sesión
 * - Cierra sesión automáticamente tras timeout
 * - Refresca sesión periódicamente en background
 *
 * SEGURIDAD:
 * - Basado en CVSS 5.8 audit requirement
 * - Usa httpOnly cookies para tokens
 * - Limpia listeners al desmontar
 * - Usa refs para evitar re-renders
 *
 * @example
 * ```tsx
 * function App() {
 *   const {
 *     showWarning,
 *     remainingTime,
 *     handleContinueSession,
 *     handleLogout,
 *   } = useSessionManager({
 *     onWarning: () => console.log("Session warning!"),
 *     onTimeout: () => console.log("Session expired!"),
 *   });
 *
 *   return (
 *     <>
 *       <MainContent />
 *       <SessionWarningModal
 *         open={showWarning}
 *         remainingTime={remainingTime}
 *         onContinue={handleContinueSession}
 *         onLogout={handleLogout}
 *       />
 *     </>
 *   );
 * }
 * ```
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useStore } from "@store";
import { logger } from "@lib/logger";

// ============================================
// Configuration Constants
// ============================================

/** Tiempo de advertencia antes del timeout (25 minutos) */
export const SESSION_WARNING_TIME = 25 * 60 * 1000;

/** Tiempo total antes del timeout (30 minutos) */
export const SESSION_TIMEOUT = 30 * 60 * 1000;

/** Intervalo de refresh automático (10 minutos) */
export const REFRESH_INTERVAL = 10 * 60 * 1000;

/** Eventos que indican actividad del usuario */
const ACTIVITY_EVENTS = [
  "mousedown",
  "mousemove",
  "keypress",
  "scroll",
  "touchstart",
  "click",
] as const;

// ============================================
// Types
// ============================================

export interface SessionManagerOptions {
  /** Callback cuando se muestra la advertencia */
  onWarning?: () => void;
  /** Callback cuando expira la sesión */
  onTimeout?: () => void;
  /** Tiempo antes de mostrar advertencia (ms) */
  warningTime?: number;
  /** Tiempo total antes del timeout (ms) */
  timeoutDuration?: number;
  /** Intervalo de refresh automático (ms) */
  refreshInterval?: number;
}

export interface SessionManagerReturn {
  /** Si se está mostrando la advertencia */
  showWarning: boolean;
  /** Tiempo restante hasta el timeout (segundos) */
  remainingTime: number;
  /** Continuar la sesión (resetear timers) */
  handleContinueSession: () => void;
  /** Cerrar sesión manualmente */
  handleLogout: () => Promise<void>;
}

// ============================================
// Hook
// ============================================

/**
 * Hook para gestionar el ciclo de vida de la sesión
 */
export function useSessionManager(
  options: SessionManagerOptions = {}
): SessionManagerReturn {
  const {
    onWarning,
    onTimeout,
    warningTime = SESSION_WARNING_TIME,
    timeoutDuration = SESSION_TIMEOUT,
    refreshInterval = REFRESH_INTERVAL,
  } = options;

  // Estado del store
  const isAuthenticated = useStore((state) => state.auth.isAuthenticated);
  const logout = useStore((state) => state.auth.logout);
  const refreshSession = useStore((state) => state.auth.refreshSession);

  // Estado local
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  // Refs para timers (evitar re-renders)
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  /**
   * Limpia todos los timers
   */
  const clearAllTimers = useCallback(() => {
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    if (timeoutTimerRef.current) {
      clearTimeout(timeoutTimerRef.current);
      timeoutTimerRef.current = null;
    }
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, []);

  /**
   * Inicia el countdown cuando se muestra la advertencia
   */
  const startCountdown = useCallback(() => {
    const warningDuration = timeoutDuration - warningTime;
    setRemainingTime(Math.floor(warningDuration / 1000));

    // Actualizar cada segundo
    countdownTimerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [timeoutDuration, warningTime]);

  /**
   * Muestra la advertencia de timeout
   */
  const showWarningModal = useCallback(() => {
    logger.warn("Session warning - user inactive", {
      inactiveDuration: warningTime,
    });

    setShowWarning(true);
    startCountdown();

    if (onWarning) {
      onWarning();
    }
  }, [warningTime, startCountdown, onWarning]);

  /**
   * Expira la sesión y cierra sesión
   */
  const expireSession = useCallback(async () => {
    logger.warn("Session expired - logging out user", {
      inactiveDuration: timeoutDuration,
    });

    clearAllTimers();
    setShowWarning(false);

    if (onTimeout) {
      onTimeout();
    }

    await logout();
  }, [timeoutDuration, clearAllTimers, onTimeout, logout]);

  /**
   * Resetea los timers de inactividad
   */
  const resetTimers = useCallback(() => {
    clearAllTimers();
    setShowWarning(false);
    lastActivityRef.current = Date.now();

    // Timer para mostrar advertencia
    warningTimerRef.current = setTimeout(() => {
      showWarningModal();
    }, warningTime);

    // Timer para expirar sesión
    timeoutTimerRef.current = setTimeout(() => {
      void expireSession();
    }, timeoutDuration);

    logger.debug("Session timers reset", {
      warningIn: warningTime,
      timeoutIn: timeoutDuration,
    });
  }, [clearAllTimers, warningTime, timeoutDuration, showWarningModal, expireSession]);

  /**
   * Refresca la sesión en background
   */
  const scheduleRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    refreshTimerRef.current = setTimeout(() => {
      // Solo refrescar si el usuario está activo
      const timeSinceActivity = Date.now() - lastActivityRef.current;
      if (timeSinceActivity < refreshInterval) {
        logger.debug("Refreshing session in background");
        void refreshSession();
      }

      // Programar siguiente refresh
      scheduleRefresh();
    }, refreshInterval);
  }, [refreshInterval, refreshSession]);

  /**
   * Maneja la actividad del usuario
   */
  const handleUserActivity = useCallback(() => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;

    // Throttle: solo resetear si han pasado al menos 1 segundo
    if (timeSinceLastActivity >= 1000) {
      lastActivityRef.current = now;

      // Si se está mostrando la advertencia, solo actualizar timestamp
      // El usuario debe hacer clic en "Continuar sesión" para cerrar el modal
      if (!showWarning) {
        resetTimers();
      }
    }
  }, [showWarning, resetTimers]);

  /**
   * Continuar la sesión (cerrar advertencia y resetear)
   */
  const handleContinueSession = useCallback(async () => {
    logger.info("User continued session");

    // Refrescar tokens
    await refreshSession();

    // Resetear timers
    resetTimers();
    setShowWarning(false);
  }, [refreshSession, resetTimers]);

  /**
   * Cerrar sesión manualmente
   */
  const handleLogout = useCallback(async () => {
    logger.info("User logged out manually from session manager");
    clearAllTimers();
    await logout();
  }, [clearAllTimers, logout]);

  // ============================================
  // Effects
  // ============================================

  /**
   * Setup: Registrar listeners de actividad cuando el usuario está autenticado
   */
  useEffect(() => {
    if (!isAuthenticated) {
      clearAllTimers();
      setShowWarning(false);
      return;
    }

    logger.debug("Session manager initialized");

    // Iniciar timers
    resetTimers();

    // Programar refresh automático
    scheduleRefresh();

    // Registrar listeners de actividad
    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Cleanup
    return () => {
      logger.debug("Session manager cleanup");

      clearAllTimers();

      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [isAuthenticated, resetTimers, scheduleRefresh, handleUserActivity, clearAllTimers]);

  return {
    showWarning,
    remainingTime,
    handleContinueSession,
    handleLogout,
  };
}
