/**
 * API Route para recibir logs del cliente
 *
 * POST /api/logs
 * Body: LogEntry | LogEntry[]
 *
 * Escribe los logs a archivos en el servidor.
 */

import { NextRequest, NextResponse } from "next/server";
import { getFileLogger } from "@lib/logger/server/file-logger";
import type { LogEntry } from "@lib/logger";

// Inicializar file logger
const fileLogger = getFileLogger({
  logDir: "./logs",
  maxSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 5,
  compress: true,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Soportar un entry o array de entries
    const entries: LogEntry[] = Array.isArray(body) ? body : [body];

    // Validar y escribir cada entry
    for (const entry of entries) {
      if (!isValidLogEntry(entry)) {
        continue; // Saltar entries inválidos
      }

      // Añadir metadata del request
      const enrichedEntry: LogEntry = {
        ...entry,
        context: {
          ...entry.context,
          ip: request.headers.get("x-forwarded-for") || "unknown",
          userAgent: request.headers.get("user-agent") || "unknown",
          source: "client",
        },
      };

      fileLogger.write(enrichedEntry);
    }

    return NextResponse.json({ success: true, count: entries.length });
  } catch (error) {
    console.error("Error processing log request:", error);
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}

/**
 * Valida que un objeto sea un LogEntry válido
 */
function isValidLogEntry(entry: unknown): entry is LogEntry {
  if (!entry || typeof entry !== "object") return false;

  const e = entry as Record<string, unknown>;

  return (
    typeof e.level === "string" &&
    ["debug", "info", "warn", "error"].includes(e.level) &&
    typeof e.message === "string" &&
    typeof e.timestamp === "string"
  );
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "logs",
  });
}
