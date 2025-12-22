/**
 * File Logger para Bemyre (Server-side)
 *
 * Sistema de logging a archivos con:
 * - Rotación automática por tamaño (10MB por defecto)
 * - Formato JSON para fácil parsing
 * - Separación por nivel (app.log, error.log)
 * - Compresión de archivos rotados
 */

import { createWriteStream, existsSync, mkdirSync, statSync, renameSync, WriteStream } from "fs";
import { join } from "path";
import { gzipSync } from "zlib";
import { writeFileSync, unlinkSync, readdirSync } from "fs";
import type { LogEntry } from "@lib/logger";

export interface FileLoggerOptions {
  /** Directorio donde guardar los logs */
  logDir: string;
  /** Tamaño máximo del archivo antes de rotar (bytes) */
  maxSize: number;
  /** Número máximo de archivos rotados a mantener */
  maxFiles: number;
  /** Comprimir archivos rotados */
  compress: boolean;
  /** Niveles a escribir en archivo separado de errores */
  errorLevels: string[];
}

const DEFAULT_OPTIONS: FileLoggerOptions = {
  logDir: "./logs",
  maxSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 5,
  compress: true,
  errorLevels: ["error", "warn"],
};

class FileLogger {
  private options: FileLoggerOptions;
  private appStream: WriteStream | null = null;
  private errorStream: WriteStream | null = null;
  private appLogPath: string;
  private errorLogPath: string;
  private initialized = false;

  constructor(options: Partial<FileLoggerOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.appLogPath = join(this.options.logDir, "app.log");
    this.errorLogPath = join(this.options.logDir, "error.log");
  }

  /**
   * Inicializa el logger creando directorio y streams
   */
  init(): void {
    if (this.initialized) return;

    // Crear directorio si no existe
    if (!existsSync(this.options.logDir)) {
      mkdirSync(this.options.logDir, { recursive: true });
    }

    // Crear streams
    this.appStream = createWriteStream(this.appLogPath, { flags: "a" });
    this.errorStream = createWriteStream(this.errorLogPath, { flags: "a" });

    this.initialized = true;
  }

  /**
   * Escribe un log entry a archivo
   */
  write(entry: LogEntry): void {
    if (!this.initialized) {
      this.init();
    }

    const line = this.formatEntry(entry);

    // Siempre escribir en app.log
    this.writeToFile(this.appLogPath, this.appStream!, line);

    // Si es error/warn, también en error.log
    if (this.options.errorLevels.includes(entry.level)) {
      this.writeToFile(this.errorLogPath, this.errorStream!, line);
    }
  }

  /**
   * Formatea el entry como JSON
   */
  private formatEntry(entry: LogEntry): string {
    const logObject = {
      timestamp: entry.timestamp,
      level: entry.level,
      message: entry.message,
      component: entry.context?.component,
      context: entry.context,
      data: entry.data,
      error: entry.error
        ? {
          name: entry.error.name,
          message: entry.error.message,
          stack: entry.error.stack,
        }
        : undefined,
    };

    return JSON.stringify(logObject) + "\n";
  }

  /**
   * Escribe a archivo y verifica si necesita rotación
   */
  private writeToFile(filePath: string, stream: WriteStream, line: string): void {
    stream.write(line);

    // Verificar tamaño para rotación
    try {
      const stats = statSync(filePath);
      if (stats.size >= this.options.maxSize) {
        this.rotateFile(filePath, stream);
      }
    } catch {
      // Archivo no existe aún, no rotar
    }
  }

  /**
   * Rota el archivo de log
   */
  private rotateFile(filePath: string, stream: WriteStream): void {
    // Cerrar stream actual
    stream.end();

    // Generar nombre con timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const rotatedPath = filePath.replace(".log", `-${timestamp}.log`);

    // Renombrar archivo actual
    renameSync(filePath, rotatedPath);

    // Comprimir si está habilitado
    if (this.options.compress) {
      this.compressFile(rotatedPath);
    }

    // Limpiar archivos antiguos
    this.cleanOldFiles(filePath);

    // Recrear stream
    if (filePath === this.appLogPath) {
      this.appStream = createWriteStream(filePath, { flags: "a" });
    } else {
      this.errorStream = createWriteStream(filePath, { flags: "a" });
    }
  }

  /**
   * Comprime un archivo con gzip
   */
  private compressFile(filePath: string): void {
    try {
      const { readFileSync } = require("fs");
      const content = readFileSync(filePath);
      const compressed = gzipSync(content);
      writeFileSync(`${filePath}.gz`, compressed);
      unlinkSync(filePath);
    } catch (error) {
      console.error("Error compressing log file:", error);
    }
  }

  /**
   * Elimina archivos rotados antiguos
   */
  private cleanOldFiles(basePath: string): void {
    const dir = this.options.logDir;
    const baseName = basePath.split("/").pop()?.replace(".log", "") || "";

    try {
      const files = readdirSync(dir)
        .filter((f) => f.startsWith(baseName) && f !== `${baseName}.log`)
        .map((f) => ({
          name: f,
          path: join(dir, f),
          time: statSync(join(dir, f)).mtime.getTime(),
        }))
        .sort((a, b) => b.time - a.time);

      // Eliminar archivos que excedan el máximo
      files.slice(this.options.maxFiles).forEach((f) => {
        try {
          unlinkSync(f.path);
        } catch {
          // Ignorar errores de eliminación
        }
      });
    } catch {
      // Ignorar errores de limpieza
    }
  }

  /**
   * Cierra los streams
   */
  close(): void {
    this.appStream?.end();
    this.errorStream?.end();
    this.initialized = false;
  }

  /**
   * Handler para el Logger principal
   */
  handler = (entry: LogEntry): void => {
    this.write(entry);
  };
}

// Singleton para uso en servidor
let fileLogger: FileLogger | null = null;

/**
 * Obtiene o crea la instancia del FileLogger
 */
export function getFileLogger(options?: Partial<FileLoggerOptions>): FileLogger {
  if (!fileLogger) {
    fileLogger = new FileLogger(options);
  }
  return fileLogger;
}

/**
 * Handler de archivo para el Logger
 * Solo funciona en Node.js (servidor)
 */
export function createFileLogHandler(
  options?: Partial<FileLoggerOptions>
): (entry: LogEntry) => void {
  const logger = getFileLogger(options);
  return logger.handler;
}

export { FileLogger };
