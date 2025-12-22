"use client";

/**
 * FeatureCard - Card individual de un item
 *
 * Componente presentacional con mínima lógica.
 * Recibe datos y callbacks, no hace fetch.
 *
 * Usa Material UI para componentes interactivos + Tailwind para layout.
 */

import { memo, useCallback } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
  Checkbox,
  Box,
  Skeleton,
} from "@mui/material";
import { MusicNote as MusicNoteIcon } from "@mui/icons-material";

import type { FeatureCardProps } from "../types";

export const FeatureCard = memo(function FeatureCard({
  item,
  isSelected = false,
  onSelect,
  onClick,
}: FeatureCardProps & { onClick?: () => void }) {
  // Handlers memorizados
  const handleSelectClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect?.(item.id);
    },
    [item.id, onSelect]
  );

  const handleCardClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  // Formatear fecha
  const formattedDate = new Date(item.createdAt).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <Card
        elevation={isSelected ? 4 : 1}
        className={`
          relative transition-all duration-200
          ${isSelected ? "ring-2 ring-primary-500" : ""}
          hover:shadow-lg
        `}
      >
        {/* Checkbox de selección (opcional) */}
        {onSelect && (
          <Checkbox
            checked={isSelected}
            onClick={handleSelectClick}
            className="absolute top-2 right-2 z-10 bg-white/80 dark:bg-gray-900/80 rounded-full"
            size="small"
            inputProps={{
              "aria-label": isSelected
                ? `Deseleccionar ${item.name}`
                : `Seleccionar ${item.name}`,
            }}
          />
        )}

        <CardActionArea onClick={handleCardClick}>
          {/* Imagen/Media */}
          <CardMedia className="h-32 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={200}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <MusicNoteIcon
                className="text-gray-400 dark:text-gray-500"
                sx={{ fontSize: 48 }}
              />
            )}
          </CardMedia>

          {/* Contenido */}
          <CardContent className="p-4">
            <Typography
              variant="h6"
              component="h3"
              className="font-semibold truncate mb-1"
              title={item.name}
            >
              {item.name}
            </Typography>

            {item.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                className="line-clamp-2 mb-3"
              >
                {item.description}
              </Typography>
            )}

            {/* Tags (ejemplo - descomentar cuando tengas tags) */}
            {/* 
            <Box className="flex flex-wrap gap-1 mb-3">
              {item.tags?.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                  className="text-xs"
                />
              ))}
            </Box>
            */}

            {/* Footer con fecha */}
            <Box className="pt-3 border-t border-gray-100 dark:border-gray-700">
              <Typography
                variant="caption"
                color="text.secondary"
                component="time"
                dateTime={item.createdAt}
              >
                {formattedDate}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
});

// =============================================================================
// Skeleton para Loading State
// =============================================================================

export function FeatureCardSkeleton() {
  return (
    <>
      <Card elevation={1}>
        <Skeleton
          variant="rectangular"
          height={128}
          animation="wave"
          className="bg-gray-200 dark:bg-gray-700"
        />
        <CardContent className="p-4">
          <Skeleton
            variant="text"
            width="70%"
            height={28}
            animation="wave"
            className="mb-1"
          />
          <Skeleton variant="text" width="100%" animation="wave" />
          <Skeleton variant="text" width="80%" animation="wave" />
          <Box className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700">
            <Skeleton variant="text" width="30%" animation="wave" />
          </Box>
        </CardContent>
      </Card>
    </>
  );
}

// =============================================================================
// Notas de Implementación
// =============================================================================

/**
 * MUI + TAILWIND:
 *
 * - Componentes de MUI: Card, CardContent, Typography, Checkbox, Chip
 * - Tailwind para: layout (flex, grid), spacing (p-4, mb-3), utilities (truncate)
 * - className en componentes MUI funciona gracias a la configuración de CSS layers
 *
 * MEMO:
 *
 * Usamos memo() porque este componente se renderiza muchas veces en una lista.
 * También memorizamos handlers con useCallback.
 *
 * FRAGMENTS:
 *
 * Usamos <></> (Fragment) para evitar divs innecesarios en el DOM.
 * En este caso el Card es el elemento raíz, pero el Fragment permite
 * añadir elementos hermanos en el futuro sin cambiar la estructura.
 *
 * ACCESIBILIDAD:
 *
 * - CardActionArea maneja keyboard navigation automáticamente
 * - aria-label descriptivos en Checkbox
 * - title en Typography para texto truncado
 * - Semantic HTML: h3 para títulos, time para fechas
 *
 * IMAGE OPTIMIZATION:
 *
 * - Usa next/image para optimización automática
 * - width/height previenen layout shift
 * - object-cover para aspect ratio consistente
 */

