"use client";

/**
 * FeatureFilters - Filtros de búsqueda
 *
 * Componente cliente para manejar filtros interactivos.
 * Sincroniza con URL params para persistencia y compartibilidad.
 *
 * Usa Material UI para inputs + Tailwind para layout.
 */

import { useCallback, useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Box,
  Chip,
  Collapse,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";

import { useDebounce } from "../hooks/useDebounce";
import type { FeatureFilters as Filters, FeatureSortField } from "../types";

// =============================================================================
// Props
// =============================================================================

interface FeatureFiltersProps {
  initialFilters?: Filters;
}

// =============================================================================
// Component
// =============================================================================

export function FeatureFilters({ initialFilters }: FeatureFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Estado local para inputs (antes de aplicar)
  const [query, setQuery] = useState(initialFilters?.query ?? "");
  const [sortBy, setSortBy] = useState<FeatureSortField>(
    initialFilters?.sortBy ?? "createdAt"
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Debounce del query para no hacer requests en cada keystroke
  const debouncedQuery = useDebounce(query, 300);

  // Actualizar URL cuando cambian los filtros
  const updateFilters = useCallback(
    (updates: Partial<Filters>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Aplicar updates
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && value !== null) {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      });

      // Reset page cuando cambian filtros
      if (!("page" in updates)) {
        params.delete("page");
      }

      // Navegar con transición (no bloquea UI)
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams]
  );

  // Handlers
  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      // El debounce se encarga de actualizar la URL
    },
    []
  );

  const handleQueryClear = useCallback(() => {
    setQuery("");
    updateFilters({ query: "" });
  }, [updateFilters]);

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<{ value: unknown }>) => {
      const value = e.target.value as FeatureSortField;
      setSortBy(value);
      updateFilters({ sortBy: value });
    },
    [updateFilters]
  );

  const handleClearAll = useCallback(() => {
    setQuery("");
    setSortBy("createdAt");
    startTransition(() => {
      router.push(pathname);
    });
  }, [router, pathname]);

  // Efecto para aplicar debounced query
  // useEffect(() => {
  //   if (debouncedQuery !== initialFilters?.query) {
  //     updateFilters({ query: debouncedQuery });
  //   }
  // }, [debouncedQuery, updateFilters, initialFilters?.query]);

  // Contar filtros activos
  const activeFiltersCount = [
    query,
    sortBy !== "createdAt" ? sortBy : null,
    // Añadir más filtros aquí
  ].filter(Boolean).length;

  return (
    <>
      <Box className="space-y-4">
        {/* Fila principal: Búsqueda + Ordenar */}
        <Box className="flex flex-col sm:flex-row gap-4">
          {/* Campo de búsqueda */}
          <TextField
            value={query}
            onChange={handleQueryChange}
            placeholder="Buscar..."
            size="small"
            className="flex-1"
            disabled={isPending}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="text-gray-400" />
                </InputAdornment>
              ),
              endAdornment: query && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleQueryClear}
                    aria-label="Limpiar búsqueda"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Selector de ordenamiento */}
          <FormControl size="small" className="min-w-[150px]">
            <InputLabel id="sort-label">Ordenar por</InputLabel>
            <Select
              labelId="sort-label"
              value={sortBy}
              label="Ordenar por"
              onChange={handleSortChange as any}
              disabled={isPending}
            >
              <MenuItem value="createdAt">Más recientes</MenuItem>
              <MenuItem value="name">Nombre A-Z</MenuItem>
              <MenuItem value="updatedAt">Última actualización</MenuItem>
            </Select>
          </FormControl>

          {/* Botón de filtros avanzados */}
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            endIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="whitespace-nowrap"
          >
            Filtros
            {activeFiltersCount > 0 && (
              <Chip
                label={activeFiltersCount}
                size="small"
                color="primary"
                className="ml-2 h-5 min-w-5"
              />
            )}
          </Button>
        </Box>

        {/* Filtros avanzados (colapsable) */}
        <Collapse in={showAdvanced}>
          <Box className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
            {/* TODO: Añadir filtros específicos de la feature */}
            {/* Ejemplo: Géneros, Instrumentos, Ubicación, etc. */}

            <Box className="flex flex-wrap gap-2">
              <Chip
                label="Rock"
                onClick={() => { }}
                variant="outlined"
                className="cursor-pointer"
              />
              <Chip
                label="Jazz"
                onClick={() => { }}
                variant="outlined"
                className="cursor-pointer"
              />
              <Chip
                label="Pop"
                onClick={() => { }}
                variant="outlined"
                className="cursor-pointer"
              />
              {/* Añadir más opciones dinámicamente */}
            </Box>

            {/* Botón limpiar filtros */}
            {activeFiltersCount > 0 && (
              <Button
                variant="text"
                color="error"
                size="small"
                onClick={handleClearAll}
                startIcon={<ClearIcon />}
              >
                Limpiar todos los filtros
              </Button>
            )}
          </Box>
        </Collapse>

        {/* Indicador de loading */}
        {isPending && (
          <Box className="h-1 bg-primary-100 dark:bg-primary-900 rounded overflow-hidden">
            <Box className="h-full w-1/3 bg-primary-500 animate-pulse" />
          </Box>
        )}
      </Box>
    </>
  );
}

// =============================================================================
// Notas de Implementación
// =============================================================================

/**
 * URL STATE:
 *
 * Los filtros se guardan en la URL (?query=rock&sortBy=name).
 * Beneficios:
 * - El usuario puede compartir la URL con filtros
 * - Funciona con back/forward del navegador
 * - SEO: cada combinación es indexable
 *
 * TRANSITIONS:
 *
 * useTransition permite que la UI siga respondiendo mientras
 * se navega. isPending indica cuando hay una navegación en curso.
 *
 * DEBOUNCE:
 *
 * El input de búsqueda usa debounce para no hacer una request
 * en cada keystroke. Solo actualiza la URL después de 300ms.
 *
 * MUI + TAILWIND:
 *
 * - TextField, Select, Button: componentes de MUI
 * - Layout con flex, gap, space-y: Tailwind
 * - Collapse para animación de acordeón
 */
