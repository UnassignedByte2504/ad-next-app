import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

// Color Swatch Component
interface SwatchProps {
  color: string;
  name: string;
  token?: string;
  textColor?: string;
}

const Swatch = ({ color, name, token, textColor = "#1C1917" }: SwatchProps) => (
  <Tooltip title={`${token || name}: ${color}`}>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        "&:hover": { transform: "scale(1.05)" },
        transition: "transform 0.2s",
      }}
      onClick={() => navigator.clipboard.writeText(color)}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          backgroundColor: color,
          borderRadius: "12px",
          border: "1px solid rgba(0,0,0,0.08)",
          mb: 1,
          boxShadow: "0 2px 8px rgba(120, 53, 15, 0.08)",
        }}
      />
      <Typography variant="caption" sx={{ fontWeight: 500, color: textColor }}>
        {name}
      </Typography>
      <Typography variant="caption" sx={{ color: "#78716C", fontSize: "10px" }}>
        {color}
      </Typography>
    </Box>
  </Tooltip>
);

// Palette Row Component
interface PaletteRowProps {
  name: string;
  colors: { shade: string; hex: string }[];
  textColor?: string;
}

const PaletteRow = ({ name, colors, textColor = "#1C1917" }: PaletteRowProps) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Cormorant Garamond', serif", color: textColor, fontWeight: 600 }}>
      {name}
    </Typography>
    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
      {colors.map((c) => (
        <Swatch
          key={c.shade}
          color={c.hex}
          name={c.shade}
          token={`${name.toLowerCase().split(" ")[0]}.${c.shade}`}
          textColor={textColor}
        />
      ))}
    </Stack>
  </Box>
);

// Main Component for Storybook
const ColorPalette = () => {
  const palettes = {
    primary: [
      { shade: "50", hex: "#FFFBEB" },
      { shade: "100", hex: "#FEF3C7" },
      { shade: "200", hex: "#FDE68A" },
      { shade: "300", hex: "#FCD34D" },
      { shade: "400", hex: "#FBBF24" },
      { shade: "500", hex: "#F59E0B" },
      { shade: "600", hex: "#D97706" },
      { shade: "700", hex: "#B45309" },
      { shade: "800", hex: "#92400E" },
      { shade: "900", hex: "#78350F" },
    ],
    secondary: [
      { shade: "50", hex: "#FAF5FF" },
      { shade: "100", hex: "#F3E8FF" },
      { shade: "200", hex: "#E9D5FF" },
      { shade: "300", hex: "#D8B4FE" },
      { shade: "400", hex: "#C084FC" },
      { shade: "500", hex: "#A855F7" },
      { shade: "600", hex: "#9333EA" },
      { shade: "700", hex: "#7C3AED" },
      { shade: "800", hex: "#6B21A8" },
      { shade: "900", hex: "#581C87" },
    ],
    accent: [
      { shade: "50", hex: "#FFF1F2" },
      { shade: "100", hex: "#FFE4E6" },
      { shade: "200", hex: "#FECDD3" },
      { shade: "300", hex: "#FDA4AF" },
      { shade: "400", hex: "#FB7185" },
      { shade: "500", hex: "#F43F5E" },
      { shade: "600", hex: "#E11D48" },
      { shade: "700", hex: "#BE123C" },
      { shade: "800", hex: "#9F1239" },
      { shade: "900", hex: "#881337" },
    ],
    stone: [
      { shade: "50", hex: "#FAFAF9" },
      { shade: "100", hex: "#F5F5F4" },
      { shade: "200", hex: "#E7E5E4" },
      { shade: "300", hex: "#D6D3D1" },
      { shade: "400", hex: "#A8A29E" },
      { shade: "500", hex: "#78716C" },
      { shade: "600", hex: "#57534E" },
      { shade: "700", hex: "#44403C" },
      { shade: "800", hex: "#292524" },
      { shade: "900", hex: "#1C1917" },
      { shade: "950", hex: "#0C0A09" },
    ],
  };

  const semanticColors = [
    { name: "Success", hex: "#10B981" },
    { name: "Warning", hex: "#F59E0B" },
    { name: "Error", hex: "#EF4444" },
    { name: "Info", hex: "#3B82F6" },
  ];

  const categoryColors = [
    { name: "Planners", hex: "#C9B8D4", desc: "Lavender - Organizaci\u00f3n, calma" },
    { name: "Tarjetas", hex: "#D4B896", desc: "Sand - Profesional, cl\u00e1sico" },
    { name: "Social Media", hex: "#A855F7", desc: "Purple - Digital, moderno" },
    { name: "Bodas", hex: "#F2DCDC", desc: "Blush - Romance, elegancia" },
    { name: "Branding", hex: "#E8D5B0", desc: "Gold - Premium, identidad" },
    { name: "Thank You", hex: "#E1D8EA", desc: "Sage - Gratitud, suave" },
  ];

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: "auto", bgcolor: "#FAFAF9", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 1, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: "#1C1917" }}>
        Ayla Designs Color System
      </Typography>
      <Typography variant="body2" sx={{ mb: 4, color: "#78716C", fontFamily: "'Nunito Sans', sans-serif" }}>
        Click en cualquier swatch para copiar el valor hex. Basado en el concepto &quot;Magia Profesional&quot;.
      </Typography>

      {/* 60-30-10 Rule Visualization */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Cormorant Garamond', serif", color: "#1C1917", fontWeight: 600 }}>
          Regla 60-30-10
        </Typography>
        <Stack direction="row" spacing={1} sx={{ height: 60 }}>
          <Box sx={{ flex: 6, bgcolor: "#F5F5F4", borderRadius: "12px 0 0 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="caption" sx={{ color: "#57534E", fontWeight: 600 }}>60% Stone (Neutrals)</Typography>
          </Box>
          <Box sx={{ flex: 3, bgcolor: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="caption" sx={{ color: "#92400E", fontWeight: 600 }}>30% Amber</Typography>
          </Box>
          <Box sx={{ flex: 1, bgcolor: "#F3E8FF", borderRadius: "0 12px 12px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="caption" sx={{ color: "#7C3AED", fontWeight: 600 }}>10%</Typography>
          </Box>
        </Stack>
      </Box>

      <PaletteRow name="Primary (Amber Gold)" colors={palettes.primary} />
      <PaletteRow name="Secondary (Lavender Purple)" colors={palettes.secondary} />
      <PaletteRow name="Accent (Rose Pink)" colors={palettes.accent} />
      <PaletteRow name="Stone (Neutrals)" colors={palettes.stone} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Cormorant Garamond', serif", color: "#1C1917", fontWeight: 600 }}>
          Semantic
        </Typography>
        <Stack direction="row" spacing={2}>
          {semanticColors.map((c) => (
            <Swatch key={c.name} color={c.hex} name={c.name} />
          ))}
        </Stack>
      </Box>

      {/* Category Colors */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Cormorant Garamond', serif", color: "#1C1917", fontWeight: 600 }}>
          Colores de Categor&iacute;as
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          {categoryColors.map((c) => (
            <Tooltip key={c.name} title={c.desc}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  "&:hover": { transform: "scale(1.05)" },
                  transition: "transform 0.2s",
                }}
                onClick={() => navigator.clipboard.writeText(c.hex)}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    backgroundColor: c.hex,
                    borderRadius: "12px",
                    border: "1px solid rgba(0,0,0,0.08)",
                    mb: 1,
                  }}
                />
                <Typography variant="caption" sx={{ fontWeight: 500, color: "#1C1917" }}>
                  {c.name}
                </Typography>
                <Typography variant="caption" sx={{ color: "#78716C", fontSize: "10px" }}>
                  {c.hex}
                </Typography>
              </Box>
            </Tooltip>
          ))}
        </Stack>
      </Box>

      {/* Gradient Preview */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Cormorant Garamond', serif", color: "#1C1917", fontWeight: 600 }}>
          Brand Gradients
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Box
              sx={{
                height: 60,
                borderRadius: "12px",
                background: "linear-gradient(to right, #F59E0B, #FBBF24)",
                boxShadow: "0 4px 14px rgba(245, 158, 11, 0.25)",
              }}
            />
            <Typography variant="caption" sx={{ color: "#78716C" }}>
              Primary CTA - linear-gradient(to right, #F59E0B, #FBBF24)
            </Typography>
          </Box>

          <Box>
            <Box
              sx={{
                height: 60,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #F59E0B, #A855F7)",
              }}
            />
            <Typography variant="caption" sx={{ color: "#78716C" }}>
              Celestial - linear-gradient(135deg, #F59E0B, #A855F7)
            </Typography>
          </Box>

          <Box>
            <Box
              sx={{
                height: 60,
                borderRadius: "12px",
                background: "linear-gradient(to bottom, #FFFBEB, #FAFAF9, #FAF5FF)",
              }}
            />
            <Typography variant="caption" sx={{ color: "#78716C" }}>
              Hero Background - linear-gradient(to bottom, #FFFBEB, #FAFAF9, #FAF5FF)
            </Typography>
          </Box>

          <Box>
            <Box
              sx={{
                height: 60,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #E8D5B0, #C9B8D4)",
              }}
            />
            <Typography variant="caption" sx={{ color: "#78716C" }}>
              Warm Glow - linear-gradient(135deg, #E8D5B0, #C9B8D4)
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Shadows */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Cormorant Garamond', serif", color: "#1C1917", fontWeight: 600 }}>
          Sombras (Tinte Amber)
        </Typography>
        <Stack direction="row" spacing={3}>
          {[
            { name: "sm", shadow: "0 1px 2px rgba(120, 53, 15, 0.05)" },
            { name: "md", shadow: "0 4px 6px rgba(120, 53, 15, 0.07)" },
            { name: "lg", shadow: "0 10px 15px rgba(120, 53, 15, 0.1)" },
            { name: "xl", shadow: "0 20px 25px rgba(120, 53, 15, 0.15)" },
            { name: "amber", shadow: "0 4px 14px rgba(245, 158, 11, 0.25)" },
          ].map((s) => (
            <Box
              key={s.name}
              sx={{
                width: 80,
                height: 80,
                bgcolor: "#FFFFFF",
                borderRadius: "12px",
                boxShadow: s.shadow,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 500, color: "#57534E" }}>
                {s.name}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Divider */}
      <Box sx={{ my: 6, borderBottom: "2px solid #E7E5E4" }} />

      {/* Light vs Dark Theme Comparison */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: "#1C1917" }}>
          Light vs Dark Theme Comparison
        </Typography>
        <Typography variant="body2" sx={{ mb: 4, color: "#78716C", fontFamily: "'Nunito Sans', sans-serif" }}>
          Ayla Designs usa light mode por defecto, pero soporta dark mode con colores ajustados para mejor visibilidad.
        </Typography>

        {/* Side-by-side Theme Preview */}
        <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Cormorant Garamond', serif", color: "#1C1917", fontWeight: 600 }}>
          Side-by-side UI Preview
        </Typography>
        <Stack direction="row" spacing={3} sx={{ mb: 5 }}>
          {/* Light Theme Card */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: "#78716C", mb: 1, display: "block", fontWeight: 600 }}>
              Light Mode (Default)
            </Typography>
            <Box
              sx={{
                bgcolor: "#FAFAF9",
                p: 3,
                borderRadius: "16px",
                border: "1px solid #E7E5E4",
              }}
            >
              {/* Background colors */}
              <Stack spacing={2} sx={{ mb: 2 }}>
                <Box sx={{ bgcolor: "#FFFFFF", p: 2, borderRadius: "8px", border: "1px solid #E7E5E4" }}>
                  <Typography variant="caption" sx={{ color: "#57534E" }}>
                    Paper: #FFFFFF
                  </Typography>
                </Box>
                <Box sx={{ bgcolor: "#FAFAF9", p: 2, borderRadius: "8px", border: "1px solid #E7E5E4" }}>
                  <Typography variant="caption" sx={{ color: "#57534E" }}>
                    Default: #FAFAF9
                  </Typography>
                </Box>
              </Stack>

              {/* Text colors */}
              <Box sx={{ bgcolor: "#FFFFFF", p: 2, borderRadius: "8px", mb: 2 }}>
                <Typography sx={{ color: "#1C1917", fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 600, mb: 1 }}>
                  Primary Text
                </Typography>
                <Typography variant="body2" sx={{ color: "#57534E", mb: 1 }}>
                  Secondary text for descriptions and supporting content.
                </Typography>
                <Typography variant="caption" sx={{ color: "#A8A29E" }}>
                  Disabled text for inactive elements.
                </Typography>
              </Box>

              {/* Sample button */}
              <Box
                sx={{
                  bgcolor: "#F59E0B",
                  color: "#78350F",
                  px: 3,
                  py: 1.5,
                  borderRadius: "9999px",
                  textAlign: "center",
                  mb: 2,
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(245, 158, 11, 0.25)",
                  "&:hover": { bgcolor: "#FBBF24" },
                }}
              >
                <Typography variant="button" sx={{ fontWeight: 600 }}>
                  Add to Cart
                </Typography>
              </Box>

              {/* Sample chip */}
              <Box
                sx={{
                  display: "inline-block",
                  bgcolor: "rgba(201, 184, 212, 0.3)",
                  color: "#1C1917",
                  px: 2,
                  py: 0.5,
                  borderRadius: "9999px",
                  mb: 2,
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  Planners
                </Typography>
              </Box>

              {/* Sample card */}
              <Box
                sx={{
                  bgcolor: "#FFFFFF",
                  p: 2,
                  borderRadius: "12px",
                  border: "1px solid #E7E5E4",
                  boxShadow: "0 4px 6px rgba(120, 53, 15, 0.07)",
                }}
              >
                <Typography variant="h6" sx={{ fontFamily: "'Cormorant Garamond', serif", color: "#1C1917", fontWeight: 600, mb: 1 }}>
                  Card Title
                </Typography>
                <Typography variant="body2" sx={{ color: "#57534E" }}>
                  This is a sample card showing how content looks in light mode.
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Dark Theme Card */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: "#78716C", mb: 1, display: "block", fontWeight: 600 }}>
              Dark Mode
            </Typography>
            <Box
              sx={{
                bgcolor: "#0C0A09",
                p: 3,
                borderRadius: "16px",
                border: "1px solid #292524",
              }}
            >
              {/* Background colors */}
              <Stack spacing={2} sx={{ mb: 2 }}>
                <Box sx={{ bgcolor: "#1C1917", p: 2, borderRadius: "8px", border: "1px solid #292524" }}>
                  <Typography variant="caption" sx={{ color: "#A8A29E" }}>
                    Paper: #1C1917
                  </Typography>
                </Box>
                <Box sx={{ bgcolor: "#0C0A09", p: 2, borderRadius: "8px", border: "1px solid #292524" }}>
                  <Typography variant="caption" sx={{ color: "#A8A29E" }}>
                    Default: #0C0A09
                  </Typography>
                </Box>
              </Stack>

              {/* Text colors */}
              <Box sx={{ bgcolor: "#1C1917", p: 2, borderRadius: "8px", mb: 2 }}>
                <Typography sx={{ color: "#F5F5F4", fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 600, mb: 1 }}>
                  Primary Text
                </Typography>
                <Typography variant="body2" sx={{ color: "#A8A29E", mb: 1 }}>
                  Secondary text for descriptions and supporting content.
                </Typography>
                <Typography variant="caption" sx={{ color: "#57534E" }}>
                  Disabled text for inactive elements.
                </Typography>
              </Box>

              {/* Sample button */}
              <Box
                sx={{
                  bgcolor: "#FBBF24",
                  color: "#78350F",
                  px: 3,
                  py: 1.5,
                  borderRadius: "9999px",
                  textAlign: "center",
                  mb: 2,
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(245, 158, 11, 0.25)",
                  "&:hover": { bgcolor: "#FCD34D" },
                }}
              >
                <Typography variant="button" sx={{ fontWeight: 600 }}>
                  Add to Cart
                </Typography>
              </Box>

              {/* Sample chip */}
              <Box
                sx={{
                  display: "inline-block",
                  bgcolor: "rgba(201, 184, 212, 0.3)",
                  color: "#F5F5F4",
                  px: 2,
                  py: 0.5,
                  borderRadius: "9999px",
                  mb: 2,
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  Planners
                </Typography>
              </Box>

              {/* Sample card */}
              <Box
                sx={{
                  bgcolor: "#1C1917",
                  p: 2,
                  borderRadius: "12px",
                  border: "1px solid #292524",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                }}
              >
                <Typography variant="h6" sx={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5F5F4", fontWeight: 600, mb: 1 }}>
                  Card Title
                </Typography>
                <Typography variant="body2" sx={{ color: "#A8A29E" }}>
                  This is a sample card showing how content looks in dark mode.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Stack>

        {/* Surface Levels Comparison */}
        <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Cormorant Garamond', serif", color: "#1C1917", fontWeight: 600 }}>
          Surface Elevation Levels
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "#78716C", fontFamily: "'Nunito Sans', sans-serif" }}>
          Light mode usa sombras para elevación. Dark mode usa tonos más claros en niveles más altos (Material 3 style).
        </Typography>

        <Stack direction="row" spacing={3} sx={{ mb: 5 }}>
          {/* Light Theme Surfaces */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: "#78716C", mb: 1, display: "block", fontWeight: 600 }}>
              Light Mode Surfaces
            </Typography>
            <Stack spacing={2}>
              {[
                { level: "Level 0 (Base)", color: "#FAFAF9", shadow: "none" },
                { level: "Level 1 (Cards)", color: "#FFFFFF", shadow: "0 1px 2px rgba(120, 53, 15, 0.05)" },
                { level: "Level 2 (Elevated)", color: "#FFFFFF", shadow: "0 4px 6px rgba(120, 53, 15, 0.07)" },
                { level: "Level 3 (Modals)", color: "#FFFFFF", shadow: "0 10px 15px rgba(120, 53, 15, 0.1)" },
                { level: "Level 4 (Highest)", color: "#FFFFFF", shadow: "0 20px 25px rgba(120, 53, 15, 0.15)" },
              ].map((surface) => (
                <Box
                  key={surface.level}
                  sx={{
                    bgcolor: surface.color,
                    p: 2,
                    borderRadius: "8px",
                    border: "1px solid #E7E5E4",
                    boxShadow: surface.shadow,
                  }}
                >
                  <Typography variant="caption" sx={{ color: "#57534E", fontWeight: 500 }}>
                    {surface.level}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#78716C", display: "block", fontSize: "10px" }}>
                    {surface.color}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Dark Theme Surfaces */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: "#78716C", mb: 1, display: "block", fontWeight: 600 }}>
              Dark Mode Surfaces (Material 3)
            </Typography>
            <Box sx={{ bgcolor: "#0C0A09", p: 2, borderRadius: "12px", border: "1px solid #292524" }}>
              <Stack spacing={2}>
                {[
                  { level: "Level 0 (Base)", color: "#0C0A09" },
                  { level: "Level 1 (Cards)", color: "#1C1917" },
                  { level: "Level 2 (Elevated)", color: "#1C1917" },
                  { level: "Level 3 (Modals)", color: "#292524" },
                  { level: "Level 4 (Highest)", color: "#44403C" },
                ].map((surface) => (
                  <Box
                    key={surface.level}
                    sx={{
                      bgcolor: surface.color,
                      p: 2,
                      borderRadius: "8px",
                      border: "1px solid #292524",
                    }}
                  >
                    <Typography variant="caption" sx={{ color: "#A8A29E", fontWeight: 500 }}>
                      {surface.level}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#78716C", display: "block", fontSize: "10px" }}>
                      {surface.color}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>
        </Stack>

        {/* Text on Background Comparison */}
        <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Cormorant Garamond', serif", color: "#1C1917", fontWeight: 600 }}>
          Text Readability on Different Backgrounds
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "#78716C", fontFamily: "'Nunito Sans', sans-serif" }}>
          Ambos temas usan colores ajustados para garantizar WCAG AA contrast ratio (4.5:1 para texto normal).
        </Typography>

        <Stack direction="row" spacing={3}>
          {/* Light Theme Text */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: "#78716C", mb: 1, display: "block", fontWeight: 600 }}>
              Light Mode
            </Typography>
            <Stack spacing={2}>
              {/* On default background */}
              <Box sx={{ bgcolor: "#FAFAF9", p: 2, borderRadius: "8px", border: "1px solid #E7E5E4" }}>
                <Typography variant="body2" sx={{ color: "#1C1917", fontWeight: 600, mb: 0.5 }}>
                  Primary text on default background
                </Typography>
                <Typography variant="caption" sx={{ color: "#78716C" }}>
                  #1C1917 on #FAFAF9 - Stone 900 on Stone 50
                </Typography>
              </Box>

              {/* On paper background */}
              <Box sx={{ bgcolor: "#FFFFFF", p: 2, borderRadius: "8px", border: "1px solid #E7E5E4" }}>
                <Typography variant="body2" sx={{ color: "#1C1917", fontWeight: 600, mb: 0.5 }}>
                  Primary text on paper background
                </Typography>
                <Typography variant="caption" sx={{ color: "#78716C" }}>
                  #1C1917 on #FFFFFF - Stone 900 on White
                </Typography>
              </Box>

              {/* On primary background */}
              <Box sx={{ bgcolor: "#FEF3C7", p: 2, borderRadius: "8px" }}>
                <Typography variant="body2" sx={{ color: "#92400E", fontWeight: 600, mb: 0.5 }}>
                  Text on primary light background
                </Typography>
                <Typography variant="caption" sx={{ color: "#92400E" }}>
                  #92400E on #FEF3C7 - Amber 800 on Amber 100
                </Typography>
              </Box>

              {/* On secondary background */}
              <Box sx={{ bgcolor: "#F3E8FF", p: 2, borderRadius: "8px" }}>
                <Typography variant="body2" sx={{ color: "#581C87", fontWeight: 600, mb: 0.5 }}>
                  Text on secondary light background
                </Typography>
                <Typography variant="caption" sx={{ color: "#581C87" }}>
                  #581C87 on #F3E8FF - Purple 900 on Purple 100
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Dark Theme Text */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: "#78716C", mb: 1, display: "block", fontWeight: 600 }}>
              Dark Mode
            </Typography>
            <Box sx={{ bgcolor: "#0C0A09", p: 2, borderRadius: "12px", border: "1px solid #292524" }}>
              <Stack spacing={2}>
                {/* On default background */}
                <Box sx={{ bgcolor: "#0C0A09", p: 2, borderRadius: "8px", border: "1px solid #292524" }}>
                  <Typography variant="body2" sx={{ color: "#F5F5F4", fontWeight: 600, mb: 0.5 }}>
                    Primary text on default background
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#78716C" }}>
                    #F5F5F4 on #0C0A09 - Stone 100 on Stone 950
                  </Typography>
                </Box>

                {/* On paper background */}
                <Box sx={{ bgcolor: "#1C1917", p: 2, borderRadius: "8px", border: "1px solid #292524" }}>
                  <Typography variant="body2" sx={{ color: "#F5F5F4", fontWeight: 600, mb: 0.5 }}>
                    Primary text on paper background
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#78716C" }}>
                    #F5F5F4 on #1C1917 - Stone 100 on Stone 900
                  </Typography>
                </Box>

                {/* On primary background */}
                <Box sx={{ bgcolor: "#78350F", p: 2, borderRadius: "8px" }}>
                  <Typography variant="body2" sx={{ color: "#FEF3C7", fontWeight: 600, mb: 0.5 }}>
                    Text on primary dark background
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#FEF3C7" }}>
                    #FEF3C7 on #78350F - Amber 100 on Amber 900
                  </Typography>
                </Box>

                {/* On secondary background */}
                <Box sx={{ bgcolor: "#581C87", p: 2, borderRadius: "8px" }}>
                  <Typography variant="body2" sx={{ color: "#F3E8FF", fontWeight: 600, mb: 0.5 }}>
                    Text on secondary dark background
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#F3E8FF" }}>
                    #F3E8FF on #581C87 - Purple 100 on Purple 900
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Stack>

        {/* Color Adjustments Summary */}
        <Box sx={{ mt: 4, p: 3, bgcolor: "#FEF3C7", borderRadius: "12px", border: "1px solid #FDE68A" }}>
          <Typography variant="h6" sx={{ fontFamily: "'Cormorant Garamond', serif", color: "#92400E", fontWeight: 600, mb: 2 }}>
            Key Differences: Light vs Dark
          </Typography>
          <Stack spacing={1}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography variant="body2" sx={{ color: "#92400E", fontWeight: 600, minWidth: "120px" }}>
                Primary:
              </Typography>
              <Typography variant="body2" sx={{ color: "#78350F" }}>
                Light usa #F59E0B (500), Dark usa #FBBF24 (400) - más brillante para visibilidad
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography variant="body2" sx={{ color: "#92400E", fontWeight: 600, minWidth: "120px" }}>
                Secondary:
              </Typography>
              <Typography variant="body2" sx={{ color: "#78350F" }}>
                Light usa #A855F7 (500), Dark usa #C084FC (400) - más vibrante
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography variant="body2" sx={{ color: "#92400E", fontWeight: 600, minWidth: "120px" }}>
                Background:
              </Typography>
              <Typography variant="body2" sx={{ color: "#78350F" }}>
                Light usa #FAFAF9 (warm white), Dark usa #0C0A09 (warm black)
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography variant="body2" sx={{ color: "#92400E", fontWeight: 600, minWidth: "120px" }}>
                Elevation:
              </Typography>
              <Typography variant="body2" sx={{ color: "#78350F" }}>
                Light usa shadows, Dark usa tones más claros (Material 3)
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

const meta = {
  title: "Brand/Color Palette",
  component: ColorPalette,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "light",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ColorPalette>;

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
