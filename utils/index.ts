// Utilidades y helpers de Bemyre

// Re-exportar helpers generales
export * from "./helpers";

/**
 * Genera iniciales a partir de un nombre
 */
export function getInitials(name: string, maxLength = 2): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, maxLength);
}

/**
 * Genera un color de avatar basado en el nombre
 */
export function getAvatarColor(name: string): string {
  const colors = [
    "#6366f1", // indigo
    "#ec4899", // pink
    "#8b5cf6", // violet
    "#06b6d4", // cyan
    "#10b981", // emerald
    "#f59e0b", // amber
    "#ef4444", // red
    "#3b82f6", // blue
  ];

  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}
