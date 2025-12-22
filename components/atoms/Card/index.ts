/**
 * Card Atom
 *
 * Base card components for building complex card organisms.
 * Follows M3 Expressive design principles.
 *
 * @example
 * ```tsx
 * import { Card, CardMedia } from '@atoms';
 *
 * <Card variant="elevated" interactive>
 *   <CardMedia src="/image.jpg" aspectRatio="16/9" />
 *   {children}
 * </Card>
 * ```
 */

export { Card, type CardProps, type CardVariant, type CardSize } from "./Card";

// Default export
export { Card as default } from "./Card";
