"use client";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import type { TargetAndTransition } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import {
  springs,
  durations,
  easings,
  variants,
  interactiveStates,
  shapes,
  buttonShapeMorph,
  chipShapeMorph,
} from "@/app/ui/theme/tokens/motion";

// =============================================================================
// HELPER TYPES
// =============================================================================

type VariantConfig = {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  exit: TargetAndTransition;
};

type InteractiveStateConfig = TargetAndTransition;

// Helper to parse CSS cubic-bezier into framer-motion array
const parseCubicBezier = (curve: string): [number, number, number, number] => {
  const match = curve.match(/cubic-bezier\(([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)\)/);
  if (match) {
    return [parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3]), parseFloat(match[4])];
  }
  // Fallback to easeInOut
  return [0.4, 0, 0.2, 1];
};

// =============================================================================
// COMPONENTS
// =============================================================================

// Spring Config Card Component
interface SpringCardProps {
  name: string;
  config: { stiffness: number; damping: number };
  description: string;
}

const SpringCard = ({ name, config, description }: SpringCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid #E7E5E4",
        cursor: "pointer",
        "&:hover": { boxShadow: "0 4px 14px rgba(120, 53, 15, 0.08)" },
        transition: "box-shadow 0.2s",
      }}
      onClick={() => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography
          sx={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#1C1917",
          }}
        >
          {name}
        </Typography>
        <motion.div
          animate={isAnimating ? { scale: [1, 1.2, 1], rotate: [0, 180, 360] } : {}}
          transition={config}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              bgcolor: "#F59E0B",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ color: "#FFFFFF", fontSize: "1.25rem" }}>✨</Typography>
          </Box>
        </motion.div>
      </Stack>
      <Typography
        sx={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "0.875rem",
          color: "#57534E",
          mb: 1.5,
        }}
      >
        {description}
      </Typography>
      <Stack direction="row" spacing={2}>
        <Box
          sx={{
            px: 2,
            py: 0.5,
            bgcolor: "#F5F5F4",
            borderRadius: "6px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.75rem",
            color: "#44403C",
          }}
        >
          stiffness: {config.stiffness}
        </Box>
        <Box
          sx={{
            px: 2,
            py: 0.5,
            bgcolor: "#F5F5F4",
            borderRadius: "6px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.75rem",
            color: "#44403C",
          }}
        >
          damping: {config.damping}
        </Box>
      </Stack>
      <Typography
        sx={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "0.75rem",
          color: "#A8A29E",
          mt: 1,
          fontStyle: "italic",
        }}
      >
        Click para ver la animación
      </Typography>
    </Box>
  );
};

// Duration Timeline Item Component (extracted to fix useState in callback issue)
const DurationTimelineItem = ({ name, ms, maxDuration }: { name: string; ms: number; maxDuration: number }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <Box onClick={() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), ms);
    }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 0.5 }}>
        <Typography
          sx={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#1C1917",
            minWidth: 80,
          }}
        >
          {name}
        </Typography>
        <Typography
          sx={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.75rem",
            color: "#78716C",
            minWidth: 60,
          }}
        >
          {ms}ms
        </Typography>
      </Stack>
      <Box
        sx={{
          position: "relative",
          height: 8,
          bgcolor: "#F5F5F4",
          borderRadius: "4px",
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        <motion.div
          animate={isAnimating ? { width: "100%" } : { width: 0 }}
          transition={{ duration: ms / 1000, ease: "linear" }}
          style={{
            height: "100%",
            background: "linear-gradient(to right, #F59E0B, #FBBF24)",
            borderRadius: "4px",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "#E7E5E4",
            width: `${(ms / maxDuration) * 100}%`,
            opacity: 0.3,
            borderRadius: "4px",
          }}
        />
      </Box>
    </Box>
  );
};

// Duration Timeline Component
const DurationTimeline = () => {
  const durationEntries = Object.entries(durations) as [keyof typeof durations, number][];
  const maxDuration = Math.max(...durationEntries.map(([, v]) => v));

  return (
    <Stack spacing={2}>
      {durationEntries.map(([name, ms]) => (
        <DurationTimelineItem key={name} name={name} ms={ms} maxDuration={maxDuration} />
      ))}
    </Stack>
  );
};

// Easing Curve Visualizer
const EasingCurve = ({ name, curve }: { name: string; curve: string }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid #E7E5E4",
        cursor: "pointer",
      }}
      onClick={() => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 600);
      }}
    >
      <Typography
        sx={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "#1C1917",
          mb: 1,
        }}
      >
        {name}
      </Typography>
      <Typography
        sx={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.75rem",
          color: "#78716C",
          mb: 2,
        }}
      >
        {curve}
      </Typography>
      <Box sx={{ position: "relative", height: 80, bgcolor: "#FAFAF9", borderRadius: "8px", overflow: "hidden" }}>
        <motion.div
          animate={isAnimating ? { x: 0, y: 0 } : { x: 0, y: 56 }}
          transition={{ duration: 0.6, ease: parseCubicBezier(curve) }}
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            width: 16,
            height: 16,
            background: "linear-gradient(135deg, #F59E0B, #A855F7)",
            borderRadius: "50%",
          }}
        />
        <motion.div
          animate={isAnimating ? { x: 232 } : { x: 0 }}
          transition={{ duration: 0.6, ease: parseCubicBezier(curve) }}
          style={{
            position: "absolute",
            bottom: 12,
            left: 12,
            width: 16,
            height: 16,
            backgroundColor: "#F59E0B",
            borderRadius: "50%",
          }}
        />
      </Box>
    </Box>
  );
};

// Animation Variant Buttons
const VariantButton = ({ name, variant }: { name: string; variant: VariantConfig }) => {
  const [show, setShow] = useState(true);

  return (
    <Box sx={{ p: 2, bgcolor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E7E5E4", minHeight: 120 }}>
      <Typography
        sx={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "#1C1917",
          mb: 2,
        }}
      >
        {name}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 60 }}>
        <AnimatePresence mode="wait">
          {show && (
            <motion.div
              key="box"
              initial={variant.initial}
              animate={variant.animate}
              exit={variant.exit}
              transition={springs.smooth}
            >
              <Box
                sx={{
                  width: 80,
                  height: 40,
                  background: "linear-gradient(to right, #F59E0B, #FBBF24)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(245, 158, 11, 0.25)",
                }}
              >
                <Typography sx={{ color: "#FFFFFF", fontSize: "1.25rem" }}>✨</Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
      <Box
        sx={{
          mt: 1,
          px: 3,
          py: 0.75,
          bgcolor: "#F5F5F4",
          borderRadius: "9999px",
          textAlign: "center",
          cursor: "pointer",
          "&:hover": { bgcolor: "#E7E5E4" },
          transition: "background-color 0.2s",
        }}
        onClick={() => {
          setShow(false);
          setTimeout(() => setShow(true), 500);
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "#44403C",
          }}
        >
          Replay
        </Typography>
      </Box>
    </Box>
  );
};

// Interactive State Demos
const InteractiveDemo = ({ name, state }: { name: string; state: InteractiveStateConfig }) => {
  return (
    <Box sx={{ p: 3, bgcolor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E7E5E4", textAlign: "center" }}>
      <Typography
        sx={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "#1C1917",
          mb: 2,
        }}
      >
        {name}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
        <motion.div whileHover={name === "hover" || name === "chipHover" || name === "cardHover" ? state : undefined} whileTap={name === "tap" ? state : undefined}>
          <Box
            sx={{
              width: name === "chipHover" ? 100 : 120,
              height: name === "chipHover" ? 32 : 60,
              background: name === "chipHover"
                ? "rgba(201, 184, 212, 0.3)"
                : "linear-gradient(to right, #F59E0B, #FBBF24)",
              borderRadius: name === "chipHover" ? "9999px" : "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: name === "cardHover" ? "0 2px 8px rgba(120, 53, 15, 0.08)" : undefined,
            }}
          >
            <Typography sx={{ color: name === "chipHover" ? "#44403C" : "#FFFFFF", fontSize: "1rem" }}>
              {name === "chipHover" ? "Hover me" : name === "tap" ? "Press" : "Hover"}
            </Typography>
          </Box>
        </motion.div>
      </Box>
      <Typography
        sx={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "0.75rem",
          color: "#78716C",
          fontStyle: "italic",
        }}
      >
        {name === "hover" && "Scale 1.02"}
        {name === "tap" && "Scale 0.98"}
        {name === "chipHover" && "Scale 1.05"}
        {name === "cardHover" && "Scale 1.01, Y -2px"}
      </Typography>
    </Box>
  );
};

// Like Animation Demo
const LikeDemo = () => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Box sx={{ p: 3, bgcolor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E7E5E4", textAlign: "center" }}>
      <Typography
        sx={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "#1C1917",
          mb: 2,
        }}
      >
        like
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
        <motion.div
          animate={isLiked ? interactiveStates.like : {}}
          onAnimationComplete={() => setIsLiked(false)}
        >
          <Box
            onClick={() => setIsLiked(true)}
            sx={{
              width: 60,
              height: 60,
              bgcolor: isLiked ? "#F43F5E" : "#E7E5E4",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Typography sx={{ fontSize: "1.75rem" }}>{isLiked ? "❤️" : "🤍"}</Typography>
          </Box>
        </motion.div>
      </Box>
      <Typography
        sx={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "0.75rem",
          color: "#78716C",
          fontStyle: "italic",
        }}
      >
        Scale [1, 1.3, 1]
      </Typography>
    </Box>
  );
};

// Shake Demo
const ShakeDemo = () => {
  const [isShaking, setIsShaking] = useState(false);

  return (
    <Box sx={{ p: 3, bgcolor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E7E5E4", textAlign: "center" }}>
      <Typography
        sx={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "#1C1917",
          mb: 2,
        }}
      >
        shake
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
        <motion.div
          animate={isShaking ? interactiveStates.shake : {}}
          onAnimationComplete={() => setIsShaking(false)}
        >
          <Box
            onClick={() => setIsShaking(true)}
            sx={{
              px: 3,
              py: 1.5,
              bgcolor: "#EF4444",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            <Typography sx={{ color: "#FFFFFF", fontSize: "0.875rem", fontWeight: 600 }}>Error!</Typography>
          </Box>
        </motion.div>
      </Box>
      <Typography
        sx={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "0.75rem",
          color: "#78716C",
          fontStyle: "italic",
        }}
      >
        X: [0, -10, 10, -10, 10, 0]
      </Typography>
    </Box>
  );
};

// Shape Scale Visual
const ShapeScaleVisual = () => {
  const shapeEntries = Object.entries(shapes) as [keyof typeof shapes, number][];

  return (
    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
      {shapeEntries.map(([name, value]) => (
        <Box key={name} sx={{ textAlign: "center" }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              bgcolor: "#F59E0B",
              borderRadius: `${value}px`,
              mb: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ color: "#FFFFFF", fontSize: "1rem", fontWeight: 600 }}>{name}</Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.75rem",
              color: "#78716C",
            }}
          >
            {value}px
          </Typography>
        </Box>
      ))}
    </Stack>
  );
};

// Button Shape Morph Demo
const ButtonMorphDemo = () => {
  const [state, setState] = useState<"idle" | "hover" | "pressed">("idle");

  return (
    <Box sx={{ p: 3, bgcolor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E7E5E4", textAlign: "center" }}>
      <Typography
        sx={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "#1C1917",
          mb: 2,
        }}
      >
        Button Shape Morph
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <motion.div
          animate={buttonShapeMorph[state]}
          onHoverStart={() => setState("hover")}
          onHoverEnd={() => setState("idle")}
          onTapStart={() => setState("pressed")}
          onTap={() => setState("hover")}
        >
          <Box
            sx={{
              px: 4,
              py: 1.5,
              background: "linear-gradient(to right, #F59E0B, #FBBF24)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ color: "#FFFFFF", fontSize: "0.875rem", fontWeight: 600 }}>Hover & Click</Typography>
          </Box>
        </motion.div>
      </Box>
      <Typography
        sx={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.75rem",
          color: "#78716C",
        }}
      >
        {state === "idle" && "borderRadius: 12px"}
        {state === "hover" && "borderRadius: 16px"}
        {state === "pressed" && "borderRadius: 8px"}
      </Typography>
    </Box>
  );
};

// Chip Shape Morph Demo
const ChipMorphDemo = () => {
  const [selected, setSelected] = useState(false);

  return (
    <Box sx={{ p: 3, bgcolor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E7E5E4", textAlign: "center" }}>
      <Typography
        sx={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "#1C1917",
          mb: 2,
        }}
      >
        Chip Shape Morph
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <motion.div
          animate={selected ? chipShapeMorph.selected : chipShapeMorph.idle}
          onClick={() => setSelected(!selected)}
        >
          <Box
            sx={{
              px: 3,
              py: 0.75,
              bgcolor: selected ? "#A855F7" : "rgba(201, 184, 212, 0.3)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                color: selected ? "#FFFFFF" : "#44403C",
                fontSize: "0.75rem",
                fontWeight: 500,
              }}
            >
              {selected ? "Selected ✓" : "Click me"}
            </Typography>
          </Box>
        </motion.div>
      </Box>
      <Typography
        sx={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.75rem",
          color: "#78716C",
        }}
      >
        {selected ? "borderRadius: 16px, scale: 1.05" : "borderRadius: 9999px"}
      </Typography>
    </Box>
  );
};

// Main Component
const MotionShowcase = () => {
  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: "auto", bgcolor: "#FAFAF9", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{
          mb: 1,
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 700,
          color: "#1C1917",
        }}
      >
        Ayla Designs Motion System
      </Typography>
      <Typography
        variant="body2"
        sx={{
          mb: 4,
          color: "#78716C",
          fontFamily: "'Nunito Sans', sans-serif",
        }}
      >
        Material Design 3 Expressive motion with spring physics. Click/hover elementos para ver animaciones.
      </Typography>

      {/* Spring Configurations */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontFamily: "'Cormorant Garamond', serif",
            color: "#1C1917",
            fontWeight: 600,
          }}
        >
          Spring Configurations
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 3,
            color: "#57534E",
            fontFamily: "'Nunito Sans', sans-serif",
          }}
        >
          Usa springs en lugar de duration/easing para movimiento más natural y expresivo.
        </Typography>
        <Stack spacing={2}>
          <SpringCard
            name="snappy"
            config={springs.snappy}
            description="Quick interactions (hover, tap, toggle). Fast, crisp response."
          />
          <SpringCard
            name="smooth"
            config={springs.smooth}
            description="Standard transitions (expand, collapse, modal). Natural, comfortable motion."
          />
          <SpringCard
            name="bouncy"
            config={springs.bouncy}
            description="Expressive animations (like, success, celebration). Playful overshoot."
          />
          <SpringCard
            name="gentle"
            config={springs.gentle}
            description="Subtle entries (fade in, slide up). Soft, elegant motion."
          />
          <SpringCard
            name="stiff"
            config={springs.stiff}
            description="Immediate response (drag, resize). Minimal delay, direct control."
          />
        </Stack>
      </Box>

      <Divider sx={{ my: 5, borderColor: "#E7E5E4" }} />

      {/* Duration Tokens */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontFamily: "'Cormorant Garamond', serif",
            color: "#1C1917",
            fontWeight: 600,
          }}
        >
          Duration Tokens
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 3,
            color: "#57534E",
            fontFamily: "'Nunito Sans', sans-serif",
          }}
        >
          Fallback durations para CSS transitions cuando springs no son apropiados. Click para ver duración.
        </Typography>
        <Box sx={{ p: 3, bgcolor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E7E5E4" }}>
          <DurationTimeline />
        </Box>
      </Box>

      <Divider sx={{ my: 5, borderColor: "#E7E5E4" }} />

      {/* Easing Curves */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontFamily: "'Cormorant Garamond', serif",
            color: "#1C1917",
            fontWeight: 600,
          }}
        >
          Easing Curves
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 3,
            color: "#57534E",
            fontFamily: "'Nunito Sans', sans-serif",
          }}
        >
          CSS cubic-bezier curves para legacy support. Prefer springs cuando sea posible.
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          {Object.entries(easings).map(([name, curve]) => (
            <Box key={name} sx={{ flex: "1 1 calc(50% - 8px)", minWidth: 280 }}>
              <EasingCurve name={name} curve={curve} />
            </Box>
          ))}
        </Stack>
      </Box>

      <Divider sx={{ my: 5, borderColor: "#E7E5E4" }} />

      {/* Animation Variants */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontFamily: "'Cormorant Garamond', serif",
            color: "#1C1917",
            fontWeight: 600,
          }}
        >
          Animation Variants
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 3,
            color: "#57534E",
            fontFamily: "'Nunito Sans', sans-serif",
          }}
        >
          Pre-configured framer-motion variants para animaciones comunes. Click Replay para ver.
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 2 }}>
          {Object.entries(variants).map(([name, variant]) => (
            <VariantButton key={name} name={name} variant={variant} />
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 5, borderColor: "#E7E5E4" }} />

      {/* Interactive States */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontFamily: "'Cormorant Garamond', serif",
            color: "#1C1917",
            fontWeight: 600,
          }}
        >
          Interactive States
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 3,
            color: "#57534E",
            fontFamily: "'Nunito Sans', sans-serif",
          }}
        >
          Hover/Tap states para elementos interactivos. Hover/click para probar.
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 2 }}>
          <InteractiveDemo name="hover" state={interactiveStates.hover} />
          <InteractiveDemo name="tap" state={interactiveStates.tap} />
          <InteractiveDemo name="chipHover" state={interactiveStates.chipHover} />
          <InteractiveDemo name="cardHover" state={interactiveStates.cardHover} />
          <LikeDemo />
          <ShakeDemo />
        </Box>
      </Box>

      <Divider sx={{ my: 5, borderColor: "#E7E5E4" }} />

      {/* Shape Scale */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontFamily: "'Cormorant Garamond', serif",
            color: "#1C1917",
            fontWeight: 600,
          }}
        >
          Shape Scale
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 3,
            color: "#57534E",
            fontFamily: "'Nunito Sans', sans-serif",
          }}
        >
          Border radius scale (M3 Expressive). De badges pequeños a pills completos.
        </Typography>
        <Box sx={{ p: 3, bgcolor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E7E5E4" }}>
          <ShapeScaleVisual />
        </Box>
      </Box>

      <Divider sx={{ my: 5, borderColor: "#E7E5E4" }} />

      {/* Shape Morphing */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontFamily: "'Cormorant Garamond', serif",
            color: "#1C1917",
            fontWeight: 600,
          }}
        >
          Shape Morphing
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 3,
            color: "#57534E",
            fontFamily: "'Nunito Sans', sans-serif",
          }}
        >
          Transiciones de border-radius en interacciones. Hace que los elementos se sientan más vivos.
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: 280 }}>
            <ButtonMorphDemo />
          </Box>
          <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: 280 }}>
            <ChipMorphDemo />
          </Box>
        </Stack>
      </Box>

      {/* Usage Notes */}
      <Box sx={{ mt: 6, p: 4, bgcolor: "#FFFBEB", borderRadius: "16px", border: "1px solid #FCD34D" }}>
        <Typography
          sx={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#92400E",
            mb: 2,
          }}
        >
          Guía de Uso
        </Typography>
        <Stack spacing={1.5}>
          <Typography
            sx={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "0.875rem",
              color: "#78350F",
            }}
          >
            <strong>• Prefer Springs:</strong> Usa spring configs en lugar de duration/easing para movimiento natural
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "0.875rem",
              color: "#78350F",
            }}
          >
            <strong>• Match Context:</strong> snappy para hover/tap, smooth para modals, bouncy para celebrations
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "0.875rem",
              color: "#78350F",
            }}
          >
            <strong>• Reduce Motion:</strong> Respeta prefers-reduced-motion con useReducedMotion hook
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "0.875rem",
              color: "#78350F",
            }}
          >
            <strong>• Test Performance:</strong> Limita animaciones simultáneas en mobile devices
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

const meta = {
  title: "Brand/Motion",
  component: MotionShowcase,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "light",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MotionShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
