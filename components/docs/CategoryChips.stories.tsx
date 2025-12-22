import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";

// Product Category color mapping
const categoryColors: Record<string, { color: string; desc: string }> = {
  Planners: { color: "#C9B8D4", desc: "Lavender - Organizaci\u00f3n, calma" },
  Tarjetas: { color: "#D4B896", desc: "Sand - Profesional, cl\u00e1sico" },
  "Social Media": { color: "#A855F7", desc: "Purple - Digital, moderno" },
  Bodas: { color: "#F2DCDC", desc: "Blush - Romance, elegancia" },
  Branding: { color: "#E8D5B0", desc: "Gold - Premium, identidad" },
  "Thank You": { color: "#E1D8EA", desc: "Sage - Gratitud, suave" },
};

// Product variant/format colors (secondary chips)
const formatColors: Record<string, string> = {
  PDF: "#78716C",
  Canva: "#00C4CC",
  Illustrator: "#FF9A00",
  PNG: "#10B981",
  "Google Slides": "#FBBC04",
  Keynote: "#007AFF",
};

// Status badges
const statusColors: Record<string, string> = {
  Nuevo: "#10B981",
  Popular: "#F59E0B",
  Oferta: "#F43F5E",
  Premium: "#A855F7",
  Bundle: "#3B82F6",
};

interface CategoryChipProps {
  label: string;
  color: string;
  variant?: "filled" | "outlined" | "soft";
}

const CategoryChip = ({ label, color, variant = "soft" }: CategoryChipProps) => {
  const styles = {
    soft: {
      backgroundColor: `${color}4D`, // 30% opacity
      color: "#44403C",
      border: "none",
      "&:hover": {
        backgroundColor: `${color}66`, // 40% opacity
      },
    },
    filled: {
      backgroundColor: color,
      color: "#1C1917",
      border: "none",
      "&:hover": {
        backgroundColor: color,
        filter: "brightness(1.05)",
      },
    },
    outlined: {
      backgroundColor: "transparent",
      color: "#44403C",
      border: `1px solid ${color}`,
      "&:hover": {
        backgroundColor: `${color}26`,
      },
    },
  };

  return (
    <Chip
      label={label}
      sx={{
        fontFamily: "'Nunito Sans', sans-serif",
        fontWeight: 500,
        fontSize: "0.75rem",
        borderRadius: "9999px",
        ...styles[variant],
      }}
    />
  );
};

const CategoryChipsShowcase = () => {
  const categories = Object.entries(categoryColors);
  const formats = Object.entries(formatColors);
  const statuses = Object.entries(statusColors);

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: "auto", bgcolor: "#FAFAF9", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{ mb: 1, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: "#1C1917" }}
      >
        Category & Status Chips
      </Typography>
      <Typography variant="body2" sx={{ mb: 4, color: "#78716C", fontFamily: "'Nunito Sans', sans-serif" }}>
        Cada categor&iacute;a de producto tiene un color distintivo que evoca su esencia.
      </Typography>

      {/* Category Chips - Soft Variant (Recommended) */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Cormorant Garamond', serif", color: "#1C1917", fontWeight: 600 }}>
          Categor&iacute;as de Productos (Soft - Recomendado)
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
          {categories.map(([name, { color }]) => (
            <CategoryChip key={name} label={name} color={color} variant="soft" />
          ))}
        </Stack>
      </Box>

      {/* Category Chips - Filled Variant */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Cormorant Garamond', serif", color: "#1C1917", fontWeight: 600 }}>
          Categor&iacute;as de Productos (Filled)
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
          {categories.map(([name, { color }]) => (
            <CategoryChip key={name} label={name} color={color} variant="filled" />
          ))}
        </Stack>
      </Box>

      {/* Category Chips - Outlined Variant */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Cormorant Garamond', serif", color: "#1C1917", fontWeight: 600 }}>
          Categor&iacute;as de Productos (Outlined)
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
          {categories.map(([name, { color }]) => (
            <CategoryChip key={name} label={name} color={color} variant="outlined" />
          ))}
        </Stack>
      </Box>

      <Divider sx={{ my: 4, borderColor: "#E7E5E4" }} />

      {/* Format/File Type Chips */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Cormorant Garamond', serif", color: "#1C1917", fontWeight: 600 }}>
          Formatos de Archivo
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
          {formats.map(([name, color]) => (
            <Chip
              key={name}
              label={name}
              size="small"
              sx={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 500,
                fontSize: "0.7rem",
                borderRadius: "8px",
                bgcolor: `${color}20`,
                color: color,
                border: `1px solid ${color}40`,
              }}
            />
          ))}
        </Stack>
      </Box>

      <Divider sx={{ my: 4, borderColor: "#E7E5E4" }} />

      {/* Status Badges */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Cormorant Garamond', serif", color: "#1C1917", fontWeight: 600 }}>
          Badges de Estado
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
          {statuses.map(([name, color]) => (
            <Chip
              key={name}
              label={name}
              size="small"
              sx={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontWeight: 600,
                fontSize: "0.7rem",
                borderRadius: "9999px",
                bgcolor: color,
                color: name === "Popular" ? "#1C1917" : "#FFFFFF",
              }}
            />
          ))}
        </Stack>
      </Box>

      <Divider sx={{ my: 4, borderColor: "#E7E5E4" }} />

      {/* Usage Example */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" sx={{ mb: 3, fontFamily: "'Cormorant Garamond', serif", color: "#1C1917", fontWeight: 600 }}>
          Ejemplo de Uso en Product Card
        </Typography>

        <Box
          sx={{
            p: 3,
            bgcolor: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E7E5E4",
            maxWidth: 300,
            position: "relative",
          }}
        >
          {/* Status badge positioned absolute */}
          <Chip
            label="Nuevo"
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              fontFamily: "'Nunito Sans', sans-serif",
              fontWeight: 600,
              fontSize: "0.65rem",
              borderRadius: "9999px",
              bgcolor: "#10B981",
              color: "#FFFFFF",
              height: 22,
            }}
          />

          {/* Placeholder image */}
          <Box
            sx={{
              height: 160,
              bgcolor: "#F5F5F4",
              borderRadius: "12px",
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ color: "#A8A29E", fontSize: "0.875rem" }}>Product Image</Typography>
          </Box>

          {/* Category chip */}
          <CategoryChip label="Planners" color="#C9B8D4" variant="soft" />

          {/* Title */}
          <Typography
            sx={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "#1C1917",
              mt: 1.5,
              mb: 0.5,
            }}
          >
            Celestial Planner 2025
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "0.875rem",
              color: "#57534E",
              mb: 2,
            }}
          >
            Planificador digital completo con dise&ntilde;o celestial bohemio.
          </Typography>

          {/* Format chips */}
          <Stack direction="row" spacing={0.5} sx={{ mb: 2 }}>
            <Chip
              label="PDF"
              size="small"
              sx={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 500,
                fontSize: "0.6rem",
                height: 20,
                borderRadius: "6px",
                bgcolor: "rgba(120, 113, 108, 0.15)",
                color: "#78716C",
              }}
            />
            <Chip
              label="Canva"
              size="small"
              sx={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 500,
                fontSize: "0.6rem",
                height: 20,
                borderRadius: "6px",
                bgcolor: "rgba(0, 196, 204, 0.15)",
                color: "#00C4CC",
              }}
            />
          </Stack>

          {/* Price */}
          <Typography
            sx={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#1C1917",
            }}
          >
            $24.99
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 4, borderColor: "#E7E5E4" }} />

      {/* Color Reference Table */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Cormorant Garamond', serif", color: "#1C1917", fontWeight: 600 }}>
          Referencia de Colores
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 2,
          }}
        >
          {categories.map(([name, { color, desc }]) => (
            <Box
              key={name}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderRadius: "12px",
                bgcolor: "#FFFFFF",
                border: "1px solid #E7E5E4",
                cursor: "pointer",
                "&:hover": { boxShadow: "0 4px 14px rgba(120, 53, 15, 0.1)" },
                transition: "box-shadow 0.2s",
              }}
              onClick={() => navigator.clipboard.writeText(color)}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  backgroundColor: color,
                  flexShrink: 0,
                }}
              />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1C1917" }}>
                  {name}
                </Typography>
                <Typography variant="caption" sx={{ color: "#78716C", display: "block" }}>
                  {color}
                </Typography>
                <Typography variant="caption" sx={{ color: "#A8A29E", fontSize: "0.65rem" }}>
                  {desc}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const meta = {
  title: "Brand/Category Chips",
  component: CategoryChipsShowcase,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "light",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CategoryChipsShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnDarkBackground: Story = {
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
};
