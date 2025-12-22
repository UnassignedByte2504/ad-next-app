import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * APIs de navegación con soporte i18n.
 *
 * Usar estos en lugar de los de next/navigation para
 * que las URLs incluyan el locale correctamente.
 *
 * @example
 * ```tsx
 * import { Link, useRouter } from "@/i18n/navigation";
 *
 * <Link href="/musicians">Músicos</Link>
 * router.push("/musicians");
 * ```
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
