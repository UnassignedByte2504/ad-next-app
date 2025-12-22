"use client";

import {
  forwardRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useTranslations } from "next-intl";

import { primary, neutral, springs } from "@/app/ui/theme";

// =============================================================================
// TYPES
// =============================================================================

export interface CarouselItem {
  id: string;
  content: ReactNode;
}

export interface CarouselProps {
  /** Carousel items */
  items: CarouselItem[];
  /** Auto-play interval in milliseconds (0 to disable) */
  autoPlay?: number;
  /** Show navigation arrows */
  showArrows?: boolean;
  /** Show dot indicators */
  showDots?: boolean;
  /** Enable swipe gestures */
  swipeable?: boolean;
  /** Infinite loop */
  loop?: boolean;
  /** Slide change callback */
  onChange?: (index: number) => void;
  /** Additional CSS class */
  className?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const MotionBox = motion.create(Box);

const SWIPE_THRESHOLD = 50;

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Carousel - Image/content carousel with navigation.
 *
 * Features:
 * - Auto-play support
 * - Swipe gestures
 * - Keyboard navigation
 * - Dot indicators
 * - Arrow navigation
 * - Infinite loop
 *
 * @example
 * ```tsx
 * <Carousel
 *   items={[
 *     { id: "1", content: <img src="/slide1.jpg" /> },
 *     { id: "2", content: <img src="/slide2.jpg" /> },
 *   ]}
 *   autoPlay={5000}
 *   showDots
 * />
 * ```
 */
export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      items,
      autoPlay = 0,
      showArrows = true,
      showDots = true,
      swipeable = true,
      loop = true,
      onChange,
      className,
    },
    ref
  ) => {
    const t = useTranslations("Components.carousel");
    const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);

    const totalItems = items.length;

    // Navigate to a specific slide
    const goToSlide = useCallback(
      (index: number, dir?: number) => {
        let newIndex = index;
        let newDir = dir ?? (index > currentIndex ? 1 : -1);

        if (loop) {
          if (index < 0) {
            newIndex = totalItems - 1;
            newDir = -1;
          } else if (index >= totalItems) {
            newIndex = 0;
            newDir = 1;
          }
        } else {
          if (index < 0 || index >= totalItems) return;
        }

        setCurrentIndex([newIndex, newDir]);
        onChange?.(newIndex);
      },
      [currentIndex, totalItems, loop, onChange]
    );

    // Navigation handlers
    const goToPrev = useCallback(() => goToSlide(currentIndex - 1, -1), [goToSlide, currentIndex]);
    const goToNext = useCallback(() => goToSlide(currentIndex + 1, 1), [goToSlide, currentIndex]);

    // Auto-play
    useEffect(() => {
      if (autoPlay <= 0) return;

      const interval = setInterval(goToNext, autoPlay);
      return () => clearInterval(interval);
    }, [autoPlay, goToNext]);

    // Keyboard navigation
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") goToPrev();
        if (e.key === "ArrowRight") goToNext();
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [goToPrev, goToNext]);

    // Swipe handlers
    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!swipeable) return;

      if (info.offset.x > SWIPE_THRESHOLD) {
        goToPrev();
      } else if (info.offset.x < -SWIPE_THRESHOLD) {
        goToNext();
      }
    };

    if (totalItems === 0) return null;

    const canGoPrev = loop || currentIndex > 0;
    const canGoNext = loop || currentIndex < totalItems - 1;

    return (
      <Box
        ref={ref}
        className={className}
        sx={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          borderRadius: 3,
        }}
      >
        {/* Slides container */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/9",
            overflow: "hidden",
          }}
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <MotionBox
              key={items[currentIndex].id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={springs.smooth}
              drag={swipeable ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: swipeable ? "grab" : "default",
                "&:active": swipeable ? { cursor: "grabbing" } : {},
              }}
            >
              {items[currentIndex].content}
            </MotionBox>
          </AnimatePresence>
        </Box>

        {/* Arrow navigation */}
        {showArrows && totalItems > 1 && (
          <>
            <IconButton
              onClick={goToPrev}
              disabled={!canGoPrev}
              aria-label={t("previous")}
              sx={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.7)",
                },
                "&:disabled": {
                  opacity: 0.3,
                  color: "white",
                },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              onClick={goToNext}
              disabled={!canGoNext}
              aria-label={t("next")}
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.7)",
                },
                "&:disabled": {
                  opacity: 0.3,
                  color: "white",
                },
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </>
        )}

        {/* Dot indicators */}
        {showDots && totalItems > 1 && (
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 1,
            }}
          >
            {items.map((item, index) => (
              <Box
                key={item.id}
                component="button"
                onClick={() => goToSlide(index)}
                aria-label={t("goToSlide", { number: index + 1 })}
                aria-current={index === currentIndex ? "true" : undefined}
                sx={{
                  width: index === currentIndex ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  border: "none",
                  bgcolor: index === currentIndex ? primary.main : "rgba(255, 255, 255, 0.5)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: index === currentIndex ? primary.main : "rgba(255, 255, 255, 0.8)",
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    );
  }
);

Carousel.displayName = "Carousel";

export default Carousel;
