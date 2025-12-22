import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";

const BrandOverview = () => {
  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: "auto", bgcolor: "#FAFAF9", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          sx={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "4rem",
            fontWeight: 700,
            background: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #A855F7 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          Ayla Designs
        </Typography>
        <Typography
          variant="h5"
          sx={{ fontFamily: "'Cormorant Garamond', serif", color: "#57534E", fontWeight: 500, fontStyle: "italic" }}
        >
          Magia Profesional
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, color: "#78716C", maxWidth: 600, mx: "auto", fontFamily: "'Nunito Sans', sans-serif" }}>
          Creamos un puente entre lo m&iacute;stico y lo profesional. Dise&ntilde;os que capturan
          la esencia bohemia - elementos celestiales, tonos terrosos, formas org&aacute;nicas -
          sin sacrificar la elegancia corporativa que las marcas modernas necesitan.
        </Typography>
      </Box>

      <Divider sx={{ my: 4, borderColor: "#E7E5E4" }} />

      {/* Brand Values */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" sx={{ mb: 3, fontFamily: "'Cormorant Garamond', serif", color: "#1C1917", fontWeight: 600 }}>
          Valores de Marca
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          {[
            { value: "Magia", desc: "Dise\u00f1os que inspiran y evocan emociones", icon: "\u2728" },
            { value: "Profesionalidad", desc: "Est\u00e9tica refinada y vers\u00e1til", icon: "\u2b50" },
            { value: "Autenticidad", desc: "Cada plantilla tiene alma propia", icon: "\ud83c\udf19" },
            { value: "Accesibilidad", desc: "F\u00e1cil de usar, f\u00e1cil de personalizar", icon: "\ud83d\udc9c" },
          ].map((item) => (
            <Box
              key={item.value}
              sx={{
                p: 3,
                borderRadius: "16px",
                bgcolor: "rgba(245, 158, 11, 0.08)",
                border: "1px solid rgba(245, 158, 11, 0.2)",
                minWidth: 200,
                flex: 1,
              }}
            >
              <Typography sx={{ fontSize: "1.5rem", mb: 1 }}>{item.icon}</Typography>
              <Typography
                sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: "#B45309", fontSize: "1.1rem" }}
              >
                {item.value}
              </Typography>
              <Typography variant="body2" sx={{ color: "#78716C", mt: 0.5, fontFamily: "'Nunito Sans', sans-serif" }}>
                {item.desc}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      <Divider sx={{ my: 4, borderColor: "#E7E5E4" }} />

      {/* Color Philosophy */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" sx={{ mb: 3, fontFamily: "'Cormorant Garamond', serif", color: "#1C1917", fontWeight: 600 }}>
          Filosof&iacute;a de Color: 60-30-10
        </Typography>

        <Box
          sx={{
            height: 120,
            borderRadius: "16px",
            background: "linear-gradient(90deg, #FAFAF9 0%, #FFFBEB 20%, #F59E0B 45%, #A855F7 70%, #FAF5FF 90%, #FAFAF9 100%)",
            mb: 2,
            boxShadow: "0 4px 14px rgba(120, 53, 15, 0.1)",
          }}
        />

        <Stack direction="row" spacing={1} sx={{ mt: 2, mb: 3 }}>
          <Box sx={{ flex: 6, p: 2, bgcolor: "#F5F5F4", borderRadius: "12px", textAlign: "center" }}>
            <Typography variant="caption" sx={{ color: "#57534E", fontWeight: 600 }}>60% Stone</Typography>
          </Box>
          <Box sx={{ flex: 3, p: 2, bgcolor: "#FEF3C7", borderRadius: "12px", textAlign: "center" }}>
            <Typography variant="caption" sx={{ color: "#92400E", fontWeight: 600 }}>30% Amber</Typography>
          </Box>
          <Box sx={{ flex: 1, p: 2, bgcolor: "#F3E8FF", borderRadius: "12px", textAlign: "center" }}>
            <Typography variant="caption" sx={{ color: "#7C3AED", fontWeight: 600 }}>10% Purple</Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={3} sx={{ mt: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "12px",
                bgcolor: "#F59E0B",
                mb: 1,
                boxShadow: "0 4px 14px rgba(245, 158, 11, 0.25)",
              }}
            />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1C1917" }}>
              Primary: Amber Gold
            </Typography>
            <Typography variant="caption" sx={{ color: "#78716C" }}>
              #F59E0B - Calidez, magia
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "12px",
                bgcolor: "#A855F7",
                mb: 1,
                boxShadow: "0 4px 14px rgba(168, 85, 247, 0.25)",
              }}
            />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1C1917" }}>
              Secondary: Lavender
            </Typography>
            <Typography variant="caption" sx={{ color: "#78716C" }}>
              #A855F7 - M&iacute;stico, elegante
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "12px",
                bgcolor: "#F43F5E",
                mb: 1,
                boxShadow: "0 4px 14px rgba(244, 63, 94, 0.25)",
              }}
            />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1C1917" }}>
              Accent: Rose Pink
            </Typography>
            <Typography variant="caption" sx={{ color: "#78716C" }}>
              #F43F5E - Contraste, CTAs
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ my: 4, borderColor: "#E7E5E4" }} />

      {/* Typography Preview */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" sx={{ mb: 3, fontFamily: "'Cormorant Garamond', serif", color: "#1C1917", fontWeight: 600 }}>
          Tipograf&iacute;a
        </Typography>

        <Stack spacing={2}>
          <Box sx={{ p: 3, bgcolor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E7E5E4" }}>
            <Typography
              sx={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2rem",
                fontWeight: 700,
                color: "#1C1917",
              }}
            >
              Cormorant Garamond - Headings
            </Typography>
            <Typography variant="caption" sx={{ color: "#78716C" }}>
              Elegante, cl&aacute;sica con toque moderno - para t&iacute;tulos y elementos destacados
            </Typography>
          </Box>

          <Box sx={{ p: 3, bgcolor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E7E5E4" }}>
            <Typography
              sx={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "1.125rem",
                color: "#44403C",
              }}
            >
              Nunito Sans - Body text redondeada, amigable, alta legibilidad
            </Typography>
            <Typography variant="caption" sx={{ color: "#78716C" }}>
              Para p&aacute;rrafos, formularios y UI general
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ my: 4, borderColor: "#E7E5E4" }} />

      {/* Sample UI Elements */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" sx={{ mb: 3, fontFamily: "'Cormorant Garamond', serif", color: "#1C1917", fontWeight: 600 }}>
          Elementos de UI
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
          {/* Primary Button - Pill style with gradient */}
          <Box
            sx={{
              px: 4,
              py: 1.5,
              background: "linear-gradient(to right, #F59E0B, #FBBF24)",
              borderRadius: "9999px",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(245, 158, 11, 0.25)",
              "&:hover": { filter: "brightness(1.05)" },
            }}
          >
            <Typography sx={{ fontFamily: "'Nunito Sans', sans-serif", fontWeight: 600, color: "#1C1917" }}>
              Explorar Dise&ntilde;os
            </Typography>
          </Box>

          {/* Secondary Button */}
          <Box
            sx={{
              px: 4,
              py: 1.5,
              bgcolor: "#FFFFFF",
              border: "1px solid #E7E5E4",
              borderRadius: "9999px",
              cursor: "pointer",
              "&:hover": { bgcolor: "#F5F5F4" },
            }}
          >
            <Typography sx={{ fontFamily: "'Nunito Sans', sans-serif", fontWeight: 600, color: "#57534E" }}>
              Ver M&aacute;s
            </Typography>
          </Box>

          {/* Category Chips */}
          <Chip
            label="Planners"
            sx={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontWeight: 500,
              bgcolor: "rgba(201, 184, 212, 0.3)",
              color: "#44403C",
              borderRadius: "9999px",
            }}
          />
          <Chip
            label="Bodas"
            sx={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontWeight: 500,
              bgcolor: "rgba(242, 220, 220, 0.5)",
              color: "#44403C",
              borderRadius: "9999px",
            }}
          />
          <Chip
            label="Branding"
            sx={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontWeight: 500,
              bgcolor: "rgba(232, 213, 176, 0.4)",
              color: "#44403C",
              borderRadius: "9999px",
            }}
          />
        </Stack>
      </Box>

      <Divider sx={{ my: 4, borderColor: "#E7E5E4" }} />

      {/* Theme Mode - Light is Default */}
      <Box>
        <Typography variant="h6" sx={{ mb: 3, fontFamily: "'Cormorant Garamond', serif", color: "#1C1917", fontWeight: 600 }}>
          Modo de Tema
        </Typography>

        <Stack direction="row" spacing={3}>
          <Box
            sx={{
              flex: 1,
              p: 3,
              borderRadius: "16px",
              bgcolor: "#FAFAF9",
              border: "2px solid #F59E0B",
              position: "relative",
            }}
          >
            <Chip
              label="Default"
              size="small"
              sx={{
                position: "absolute",
                top: -12,
                right: 16,
                bgcolor: "#F59E0B",
                color: "#1C1917",
                fontWeight: 600,
                fontSize: "0.7rem",
              }}
            />
            <Typography
              variant="subtitle2"
              sx={{ fontFamily: "'Cormorant Garamond', serif", mb: 2, color: "#1C1917", fontWeight: 600 }}
            >
              Light Mode (Por defecto)
            </Typography>
            <Typography variant="body2" sx={{ color: "#57534E", fontFamily: "'Nunito Sans', sans-serif" }}>
              Fondo c&aacute;lido stone (#FAFAF9), mejor para visualizar productos
              y crear sensaci&oacute;n bohemia acogedora.
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              p: 3,
              borderRadius: "16px",
              bgcolor: "#1C1917",
              border: "1px solid #44403C",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontFamily: "'Cormorant Garamond', serif", mb: 2, color: "#F5F5F4", fontWeight: 600 }}
            >
              Dark Mode
            </Typography>
            <Typography variant="body2" sx={{ color: "#A8A29E", fontFamily: "'Nunito Sans', sans-serif" }}>
              Para usuarios que prefieren dark mode. Colores ajustados
              con +10-12% luminosidad.
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ my: 4, borderColor: "#E7E5E4" }} />

      {/* Product Categories Preview */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" sx={{ mb: 3, fontFamily: "'Cormorant Garamond', serif", color: "#1C1917", fontWeight: 600 }}>
          Categor&iacute;as de Productos
        </Typography>

        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          {[
            { name: "Planners", color: "#C9B8D4", desc: "Planificadores digitales" },
            { name: "Tarjetas", color: "#D4B896", desc: "Business cards, thank you" },
            { name: "Social Media", color: "#A855F7", desc: "Kits Instagram, posts" },
            { name: "Bodas", color: "#F2DCDC", desc: "Invitaciones, RSVP" },
            { name: "Branding", color: "#E8D5B0", desc: "Logos, paletas, gu\u00edas" },
            { name: "Thank You", color: "#E1D8EA", desc: "Tarjetas agradecimiento" },
          ].map((cat) => (
            <Box
              key={cat.name}
              sx={{
                p: 2,
                borderRadius: "12px",
                bgcolor: `${cat.color}4D`,
                minWidth: 140,
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  bgcolor: cat.color,
                  mx: "auto",
                  mb: 1,
                }}
              />
              <Typography sx={{ fontWeight: 600, color: "#1C1917", fontSize: "0.9rem" }}>
                {cat.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "#57534E" }}>
                {cat.desc}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography variant="caption" sx={{ color: "#A8A29E" }}>
          Ayla Designs Corporate Identity v1.0.0 &middot; &Uacute;ltima actualizaci&oacute;n: Diciembre 2025
        </Typography>
      </Box>
    </Box>
  );
};

const meta = {
  title: "Brand/Overview",
  component: BrandOverview,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "light",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BrandOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
