"use client";

import { useState, useEffect, useRef, type RefObject } from "react";

/**
 * Options for the useInView hook
 */
export interface UseInViewOptions {
  /** Threshold for triggering the callback (0-1) */
  threshold?: number;
  /** Root margin for the intersection observer */
  rootMargin?: string;
  /** Whether to trigger only once */
  triggerOnce?: boolean;
}

/**
 * Return type for useInView hook
 */
export type UseInViewReturn<T extends HTMLElement = HTMLDivElement> = readonly [
  RefObject<T | null>,
  boolean,
];

/**
 * Custom hook for detecting when an element enters the viewport
 *
 * Uses Intersection Observer API to efficiently track element visibility.
 * Commonly used for scroll-triggered animations and lazy loading.
 *
 * @param options - Configuration options
 * @returns Tuple of [ref, isInView]
 *
 * @example
 * ```tsx
 * const [ref, isInView] = useInView({ threshold: 0.1 });
 *
 * return (
 *   <div
 *     ref={ref}
 *     style={{
 *       opacity: isInView ? 1 : 0,
 *       transform: isInView ? 'translateY(0)' : 'translateY(20px)',
 *     }}
 *   >
 *     Content
 *   </div>
 * );
 * ```
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
): UseInViewReturn<T> {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;

  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Disconnect after first intersection if triggerOnce is true
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isInView] as const;
}

export default useInView;
