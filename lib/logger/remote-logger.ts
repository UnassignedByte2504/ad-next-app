/**
 * Remote Log Handler
 *
 * Envía logs al servidor para persistencia en archivos.
 * Usa batching para reducir requests.
 */

import type { LogEntry, LogHandler } from "./types";

export interface RemoteLoggerOptions {
  /** URL del endpoint de logs */
  endpoint: string;
  /** Tamaño del batch antes de enviar */
  batchSize: number;
  /** Intervalo máximo entre envíos (ms) */
  flushInterval: number;
  /** Reintentar envíos fallidos */
  retryOnError: boolean;
  /** Número máximo de reintentos */
  maxRetries: number;
}

const DEFAULT_OPTIONS: RemoteLoggerOptions = {
  endpoint: "/api/logs",
  batchSize: 10,
  flushInterval: 5000, // 5 segundos
  retryOnError: true,
  maxRetries: 3,
};

class RemoteLogger {
  private options: RemoteLoggerOptions;
  private buffer: LogEntry[] = [];
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private retryQueue: LogEntry[] = [];
  private retryCount = 0;

  constructor(options: Partial<RemoteLoggerOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.startFlushTimer();

    // Flush en beforeunload
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        this.flush(true);
      });

      // Flush cuando la pestaña pierde visibilidad
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          this.flush(true);
        }
      });
    }
  }

  /**
   * Añade un log al buffer
   */
  add(entry: LogEntry): void {
    this.buffer.push(entry);

    if (this.buffer.length >= this.options.batchSize) {
      this.flush();
    }
  }

  /**
   * Envía los logs al servidor
   */
  async flush(sync = false): Promise<void> {
    if (this.buffer.length === 0 && this.retryQueue.length === 0) return;

    // Combinar buffer actual con cola de reintentos
    const entries = [...this.retryQueue, ...this.buffer];
    this.buffer = [];
    this.retryQueue = [];

    if (entries.length === 0) return;

    try {
      // Usar sendBeacon para envíos síncronos (beforeunload)
      if (sync && typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(entries)], {
          type: "application/json",
        });
        navigator.sendBeacon(this.options.endpoint, blob);
        return;
      }

      // Fetch normal para envíos async
      const response = await fetch(this.options.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entries),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Reset retry count on success
      this.retryCount = 0;
    } catch (error) {
      console.warn("Failed to send logs to server:", error);

      // Añadir a cola de reintentos si está habilitado
      if (this.options.retryOnError && this.retryCount < this.options.maxRetries) {
        this.retryQueue.push(...entries);
        this.retryCount++;
      }
    }
  }

  /**
   * Inicia el timer de flush periódico
   */
  private startFlushTimer(): void {
    if (typeof window === "undefined") return;

    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.options.flushInterval);
  }

  /**
   * Detiene el logger
   */
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush(true);
  }

  /**
   * Handler para el Logger principal
   */
  handler: LogHandler = (entry: LogEntry): void => {
    this.add(entry);
  };
}

// Singleton
let remoteLogger: RemoteLogger | null = null;

/**
 * Obtiene o crea el RemoteLogger
 */
export function getRemoteLogger(options?: Partial<RemoteLoggerOptions>): RemoteLogger {
  if (!remoteLogger && typeof window !== "undefined") {
    remoteLogger = new RemoteLogger(options);
  }
  return remoteLogger!;
}

/**
 * Crea un handler para enviar logs al servidor
 */
export function createRemoteLogHandler(
  options?: Partial<RemoteLoggerOptions>
): LogHandler {
  const logger = getRemoteLogger(options);
  return logger.handler;
}

export { RemoteLogger };
