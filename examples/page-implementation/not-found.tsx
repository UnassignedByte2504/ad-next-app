import Link from "next/link";

/**
 * Not Found - 404 específico de esta ruta
 *
 * Se activa cuando:
 * - Se llama notFound() en page.tsx
 * - Un recurso específico no existe
 *
 * Si no existe este archivo, se usa el not-found.tsx del padre
 * o el default de Next.js.
 */

export default function NotFound() {
  return (
    <main className="container mx-auto py-16 px-4">
      <div className="max-w-md mx-auto text-center">
        {/* Ilustración o icono */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <span className="text-4xl">🔍</span>
        </div>

        {/* Mensaje */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No encontrado
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          El recurso que buscas no existe o fue eliminado.
        </p>

        {/* Sugerencias */}
        <div className="text-left bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sugerencias:
          </p>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Verifica que la URL sea correcta</li>
            <li>• El contenido pudo haber sido eliminado</li>
            <li>• Intenta buscar desde la página principal</li>
          </ul>
        </div>

        {/* Acciones */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Ir al inicio
          </Link>
          {/* TODO: Link a la lista de esta feature */}
          {/* <Link href="/feature" className="...">
            Ver todos
          </Link> */}
        </div>
      </div>
    </main>
  );
}

// =============================================================================
// Cómo Activar 404
// =============================================================================

/**
 * DESDE page.tsx:
 *
 * import { notFound } from "next/navigation";
 *
 * export default async function Page({ params }) {
 *   const item = await fetchItem(params.id);
 *
 *   if (!item) {
 *     notFound(); // Renderiza este componente
 *   }
 *
 *   return <ItemDetail item={item} />;
 * }
 *
 * DESDE Server Actions:
 *
 * "use server";
 * import { notFound } from "next/navigation";
 *
 * export async function getItem(id: string) {
 *   const item = await db.item.findUnique({ where: { id } });
 *   if (!item) notFound();
 *   return item;
 * }
 */
