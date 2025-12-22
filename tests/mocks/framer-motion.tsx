/**
 * Global mock for framer-motion
 *
 * This mock provides compatible components for testing without
 * actual animations. All motion components render as their HTML
 * equivalents with motion-specific props filtered out.
 */

import React from "react";

// Props that should be filtered from motion components
const MOTION_PROPS = [
  "initial",
  "animate",
  "exit",
  "variants",
  "transition",
  "whileTap",
  "whileHover",
  "whileFocus",
  "whileDrag",
  "whileInView",
  "layoutId",
  "layout",
  "drag",
  "dragConstraints",
  "dragElastic",
  "dragMomentum",
  "dragTransition",
  "onDrag",
  "onDragStart",
  "onDragEnd",
  "onAnimationStart",
  "onAnimationComplete",
  "onViewportEnter",
  "onViewportLeave",
];

/**
 * Filter out motion-specific props
 */
const filterMotionProps = (
  props: Record<string, unknown>
): Record<string, unknown> => {
  return Object.fromEntries(
    Object.entries(props).filter(([key]) => !MOTION_PROPS.includes(key))
  );
};

/**
 * Create a motion component mock for a specific HTML element
 */
const createMotionMock = (
  element: keyof React.JSX.IntrinsicElements
): React.ForwardRefExoticComponent<
  React.PropsWithChildren<Record<string, unknown>>
> => {
  const MockComponent = React.forwardRef<
    HTMLElement,
    React.PropsWithChildren<Record<string, unknown>>
  >(({ children, ...props }, ref) => {
    const filteredProps = filterMotionProps(props);
    return React.createElement(
      element,
      { ...filteredProps, ref } as React.HTMLAttributes<HTMLElement>,
      children as React.ReactNode
    );
  });
  MockComponent.displayName = `motion.${element}`;
  return MockComponent;
};

/**
 * motion.create factory function mock
 */
const createMotionCreate = () => {
  return <T extends React.ComponentType<Record<string, unknown>>>(
    component: T
  ) => {
    const MockComponent = React.forwardRef<
      unknown,
      React.ComponentPropsWithRef<T>
    >(({ children, ...props }, ref) => {
      const filteredProps = filterMotionProps(props as Record<string, unknown>);
      return React.createElement(
        component,
        { ...filteredProps, ref } as React.ComponentProps<T>,
        children as React.ReactNode
      );
    });
    MockComponent.displayName = `motion.create(${(component as { displayName?: string }).displayName ||
      (component as { name?: string }).name ||
      "Component"
      })`;
    return MockComponent;
  };
};

/**
 * Mock motion object with commonly used elements
 */
export const motion = {
  div: createMotionMock("div"),
  span: createMotionMock("span"),
  header: createMotionMock("header"),
  footer: createMotionMock("footer"),
  nav: createMotionMock("nav"),
  section: createMotionMock("section"),
  article: createMotionMock("article"),
  aside: createMotionMock("aside"),
  main: createMotionMock("main"),
  ul: createMotionMock("ul"),
  ol: createMotionMock("ol"),
  li: createMotionMock("li"),
  a: createMotionMock("a"),
  button: createMotionMock("button"),
  img: createMotionMock("img"),
  p: createMotionMock("p"),
  h1: createMotionMock("h1"),
  h2: createMotionMock("h2"),
  h3: createMotionMock("h3"),
  h4: createMotionMock("h4"),
  h5: createMotionMock("h5"),
  h6: createMotionMock("h6"),
  form: createMotionMock("form"),
  input: createMotionMock("input"),
  textarea: createMotionMock("textarea"),
  label: createMotionMock("label"),
  svg: createMotionMock("svg"),
  path: createMotionMock("path"),
  circle: createMotionMock("circle"),
  rect: createMotionMock("rect"),
  line: createMotionMock("line"),
  g: createMotionMock("g"),
  // Factory function for custom components
  create: createMotionCreate(),
};

/**
 * AnimatePresence mock - just renders children
 */
export const AnimatePresence: React.FC<{
  children: React.ReactNode;
  mode?: "sync" | "wait" | "popLayout";
  initial?: boolean;
  onExitComplete?: () => void;
}> = ({ children }) => <>{children}</>;
AnimatePresence.displayName = "AnimatePresence";

/**
 * useScroll hook mock
 */
export const useScroll = () => ({
  scrollX: { get: () => 0, onChange: () => () => { } },
  scrollY: { get: () => 0, onChange: () => () => { } },
  scrollXProgress: { get: () => 0, onChange: () => () => { } },
  scrollYProgress: { get: () => 0, onChange: () => () => { } },
});

/**
 * useMotionValueEvent hook mock
 */
export const useMotionValueEvent = () => { };

/**
 * useMotionValue hook mock
 */
export const useMotionValue = (initial: number) => ({
  get: () => initial,
  set: () => { },
  onChange: () => () => { },
});

/**
 * useTransform hook mock
 */
export const useTransform = (
  _value: unknown,
  _inputRange: number[],
  outputRange: number[]
) => ({
  get: () => outputRange[0] || 0,
  onChange: () => () => { },
});

/**
 * useAnimation hook mock
 */
export const useAnimation = () => ({
  start: () => Promise.resolve(),
  stop: () => { },
  set: () => { },
});

/**
 * useInView hook mock
 */
export const useInView = () => true;

/**
 * useReducedMotion hook mock
 */
export const useReducedMotion = () => false;

const framerMotionMock = {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useMotionValue,
  useTransform,
  useAnimation,
  useInView,
  useReducedMotion,
};

export default framerMotionMock;
