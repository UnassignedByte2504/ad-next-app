/**
 * Types específicos de la feature
 *
 * Define aquí los tipos que solo usa esta feature.
 * Para tipos compartidos, usa @types.
 */

// =============================================================================
// Entities
// =============================================================================

/**
 * Entidad principal de la feature
 * TODO: Renombrar a tu entidad (Band, Venue, Event, etc.)
 */
export interface FeatureEntity {
  id: string;
  name: string;
  description: string | null;
  imageUrl?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  // TODO: Añadir campos específicos de tu entidad
}

/**
 * Versión resumida para listas
 */
export interface FeatureEntitySummary {
  id: string;
  name: string;
  // TODO: Solo campos necesarios para cards/listas
}

// =============================================================================
// API Responses
// =============================================================================

/**
 * Respuesta de lista con paginación
 */
export interface FeatureListResponse {
  data: FeatureEntity[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Respuesta de detalle
 */
export interface FeatureDetailResponse {
  data: FeatureEntity;
}

// =============================================================================
// Filters & Search
// =============================================================================

/**
 * Filtros disponibles para la búsqueda
 */
export interface FeatureFilters {
  query?: string;
  sortBy?: FeatureSortField;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
  // TODO: Añadir filtros específicos
  // genre?: string[];
  // location?: string;
}

/**
 * Campos por los que se puede ordenar
 */
export type FeatureSortField = "name" | "createdAt" | "updatedAt";

// =============================================================================
// Forms & Actions
// =============================================================================

/**
 * Datos para crear una nueva entidad
 */
export interface CreateFeatureDto {
  name: string;
  description?: string;
  // TODO: Campos requeridos para crear
}

/**
 * Datos para actualizar una entidad
 */
export interface UpdateFeatureDto {
  name?: string;
  description?: string;
  // TODO: Campos actualizables
}

/**
 * Estado del formulario
 */
export interface FeatureFormState {
  status: "idle" | "submitting" | "success" | "error";
  message?: string;
  errors?: Record<string, string[]>;
}

// =============================================================================
// Component Props
// =============================================================================

/**
 * Props del componente de lista
 */
export interface FeatureListProps {
  initialData: FeatureEntity[];
  initialFilters?: FeatureFilters;
}

/**
 * Props del componente de card
 */
export interface FeatureCardProps {
  item: FeatureEntity;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

/**
 * Props del componente de filtros
 */
export interface FeatureFiltersProps {
  filters: FeatureFilters;
  onFiltersChange: (filters: FeatureFilters) => void;
  isLoading?: boolean;
}
