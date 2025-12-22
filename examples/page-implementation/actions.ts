"use server";

/**
 * Server Actions - Mutaciones de datos
 *
 * Este archivo contiene todas las acciones del servidor para esta feature.
 * Se ejecutan en el servidor, incluso cuando se llaman desde el cliente.
 *
 * Beneficios:
 * - No exponen lógica de negocio al cliente
 * - Acceso directo a DB/APIs sin CORS
 * - Validación segura en servidor
 * - Revalidación automática de cache
 */

import { revalidatePath, revalidateTag } from "next/cache";
// import { redirect } from "next/navigation";
// import { z } from "zod"; // Para validación

import type {
  FeatureEntity,
  FeatureListResponse,
  FeatureFilters,
  CreateFeatureDto,
  UpdateFeatureDto,
  FeatureFormState,
} from "./types";

// =============================================================================
// Configuración
// =============================================================================

const API_BASE_URL = process.env.API_URL ?? "http://localhost:8000/api/v1";

// =============================================================================
// Fetch Functions (Read Operations)
// =============================================================================

/**
 * Obtener lista de items con filtros
 *
 * Usa cache de Next.js con tags para revalidación selectiva.
 */
export async function fetchFeatures(
  filters: FeatureFilters = {}
): Promise<FeatureListResponse> {
  const params = new URLSearchParams();

  if (filters.query) params.set("q", filters.query);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("page_size", String(filters.pageSize));
  if (filters.sortBy) params.set("sort_by", filters.sortBy);
  if (filters.sortOrder) params.set("sort_order", filters.sortOrder);

  const response = await fetch(`${API_BASE_URL}/features?${params}`, {
    next: {
      tags: ["features"], // Tag para revalidación
      revalidate: 60, // Revalidar cada 60 segundos
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch features: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Obtener un item por ID
 */
export async function fetchFeatureById(
  id: string
): Promise<FeatureEntity | null> {
  const response = await fetch(`${API_BASE_URL}/features/${id}`, {
    next: {
      tags: [`feature-${id}`], // Tag específico del item
      revalidate: 60,
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch feature: ${response.statusText}`);
  }

  return response.json();
}

// =============================================================================
// Mutation Functions (Write Operations)
// =============================================================================

/**
 * Crear nuevo item
 *
 * Puede usarse con:
 * - <form action={createFeature}>
 * - startTransition(() => createFeature(formData))
 */
export async function createFeature(
  formData: FormData
): Promise<FeatureFormState> {
  // Extraer y validar datos
  const rawData: CreateFeatureDto = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || undefined,
  };

  // TODO: Validar con Zod
  // const validated = CreateFeatureSchema.safeParse(rawData);
  // if (!validated.success) {
  //   return {
  //     status: "error",
  //     errors: validated.error.flatten().fieldErrors,
  //   };
  // }

  // Validación básica
  if (!rawData.name || rawData.name.length < 2) {
    return {
      status: "error",
      message: "El nombre es requerido (mínimo 2 caracteres)",
      errors: { name: ["Mínimo 2 caracteres"] },
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/features`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rawData),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        status: "error",
        message: error.message ?? "Error al crear",
      };
    }

    // Revalidar la lista
    revalidateTag("features");
    revalidatePath("/features");

    return {
      status: "success",
      message: "Creado exitosamente",
    };
  } catch {
    return {
      status: "error",
      message: "Error de conexión. Intenta de nuevo.",
    };
  }
}

/**
 * Actualizar item existente
 */
export async function updateFeature(
  id: string,
  formData: FormData
): Promise<FeatureFormState> {
  const rawData: UpdateFeatureDto = {
    name: (formData.get("name") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/features/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rawData),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        status: "error",
        message: error.message ?? "Error al actualizar",
      };
    }

    // Revalidar el item específico y la lista
    revalidateTag(`feature-${id}`);
    revalidateTag("features");

    return {
      status: "success",
      message: "Actualizado exitosamente",
    };
  } catch {
    return {
      status: "error",
      message: "Error de conexión. Intenta de nuevo.",
    };
  }
}

/**
 * Eliminar item
 */
export async function deleteFeature(id: string): Promise<FeatureFormState> {
  try {
    const response = await fetch(`${API_BASE_URL}/features/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return {
        status: "error",
        message: "Error al eliminar",
      };
    }

    // Revalidar la lista
    revalidateTag("features");
    revalidatePath("/features");

    // Opcionalmente redirigir
    // redirect("/features");

    return {
      status: "success",
      message: "Eliminado exitosamente",
    };
  } catch {
    return {
      status: "error",
      message: "Error de conexión. Intenta de nuevo.",
    };
  }
}

// =============================================================================
// Notas de Implementación
// =============================================================================

/**
 * SERVER ACTIONS vs API ROUTES:
 *
 * Usa Server Actions cuando:
 * ✅ Forms con submit
 * ✅ Mutaciones (create, update, delete)
 * ✅ Acciones que necesitan revalidar cache
 *
 * Usa API Routes cuando:
 * ✅ Webhooks externos
 * ✅ Autenticación OAuth callbacks
 * ✅ APIs públicas para terceros
 *
 * PATRONES:
 *
 * 1. Optimistic Updates (cliente)
 *    const [state, formAction] = useActionState(createFeature, initialState);
 *
 * 2. Pending State
 *    const { pending } = useFormStatus();
 *    <button disabled={pending}>
 *
 * 3. Validación con Zod
 *    const schema = z.object({ name: z.string().min(2) });
 *    const result = schema.safeParse(data);
 *
 * 4. Cache Tags
 *    - Tag genérico: "features" (toda la lista)
 *    - Tag específico: "feature-{id}" (item individual)
 *    - Revalidar ambos cuando se modifica
 */
