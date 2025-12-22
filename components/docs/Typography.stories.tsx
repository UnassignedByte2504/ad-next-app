import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

const TypographyShowcase = () => {
  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: "auto", bgcolor: "#FAFAF9", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{ mb: 1, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: "#1C1917" }}
      >
        Ayla Designs Typography
      </Typography>
      <Typography variant="body2" sx={{ mb: 4, color: "#78716C", fontFamily: "'Nunito Sans', sans-serif" }}>
        Font pairing: Cormorant Garamond (headings) + Nunito Sans (body)
      </Typography>

      {/* Font Stack */}
      <Box sx={{ mb: 4, p: 3, bgcolor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E7E5E4" }}>
        <Typography variant="overline" sx={{ color: "#78716C" }}>
          Font Stack
        </Typography>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Box>
            <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 600, color: "#1C1917" }}>
              Cormorant Garamond
            </Typography>
            <Typography variant="body2" sx={{ color: "#57534E", fontFamily: "'Nunito Sans', sans-serif" }}>
              Headings, t&iacute;tulos de productos, elementos destacados. Elegante, cl&aacute;sica con toque moderno.
            </Typography>
            <Typography variant="caption" sx={{ color: "#A8A29E" }}>
              Weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold) + Italic
            </Typography>
          </Box>
          <Divider sx={{ borderColor: "#E7E5E4" }} />
          <Box>
            <Typography sx={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "1.25rem", fontWeight: 500, color: "#1C1917" }}>
              Nunito Sans
            </Typography>
            <Typography variant="body2" sx={{ color: "#57534E", fontFamily: "'Nunito Sans', sans-serif" }}>
              Body text, p&aacute;rrafos, formularios, UI. Redondeada, amigable, alta legibilidad.
            </Typography>
            <Typography variant="caption" sx={{ color: "#A8A29E" }}>
              Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold)
            </Typography>
          </Box>
          <Divider sx={{ borderColor: "#E7E5E4" }} />
          <Box>
            <Typography sx={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", color: "#1C1917" }}>
              JetBrains Mono
            </Typography>
            <Typography variant="body2" sx={{ color: "#57534E", fontFamily: "'Nunito Sans', sans-serif" }}>
              Precios, c&oacute;digos de descuento, datos t&eacute;cnicos.
            </Typography>
            <Typography variant="caption" sx={{ color: "#A8A29E" }}>
              Weight: 400
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ my: 4, borderColor: "#E7E5E4" }} />

      {/* Headings */}
      <Typography variant="overline" sx={{ color: "#78716C", mb: 2, display: "block" }}>
        Headings (Cormorant Garamond)
      </Typography>

      <Stack spacing={3} sx={{ mb: 4 }}>
        <Box>
          <Typography
            sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "4rem", fontWeight: 700, lineHeight: 1.1, color: "#1C1917" }}
          >
            H1 - Dise&ntilde;os con alma
          </Typography>
          <Typography variant="caption" sx={{ color: "#A8A29E" }}>
            64px / 700 / 1.1 line-height - Hero sections
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "3rem", fontWeight: 600, lineHeight: 1.2, color: "#1C1917" }}
          >
            H2 - Plantillas bohemias
          </Typography>
          <Typography variant="caption" sx={{ color: "#A8A29E" }}>
            48px / 600 / 1.2 line-height - Section titles
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.25rem", fontWeight: 600, lineHeight: 1.3, color: "#1C1917" }}
          >
            H3 - Magia profesional
          </Typography>
          <Typography variant="caption" sx={{ color: "#A8A29E" }}>
            36px / 600 / 1.3 line-height - Subsections
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 500, lineHeight: 1.4, color: "#1C1917" }}
          >
            H4 - Celestial Planner 2025
          </Typography>
          <Typography variant="caption" sx={{ color: "#A8A29E" }}>
            24px / 500 / 1.4 line-height - Card titles
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", fontWeight: 500, lineHeight: 1.4, color: "#1C1917" }}
          >
            H5 - Kit de branding completo
          </Typography>
          <Typography variant="caption" sx={{ color: "#A8A29E" }}>
            20px / 500 / 1.4 line-height - Small titles
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 500, lineHeight: 1.5, color: "#1C1917" }}
          >
            H6 - Descarga instant&aacute;nea
          </Typography>
          <Typography variant="caption" sx={{ color: "#A8A29E" }}>
            16px / 500 / 1.5 line-height - Captions
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ my: 4, borderColor: "#E7E5E4" }} />

      {/* Body Text */}
      <Typography variant="overline" sx={{ color: "#78716C", mb: 2, display: "block" }}>
        Body Text (Nunito Sans)
      </Typography>

      <Stack spacing={3} sx={{ mb: 4 }}>
        <Box>
          <Typography
            sx={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "1.125rem", lineHeight: 1.7, color: "#44403C" }}
          >
            Body Large - Ayla Designs crea plantillas digitales con una est&eacute;tica bohemia
            &uacute;nica. Cada dise&ntilde;o combina elementos celestiales con profesionalismo moderno.
          </Typography>
          <Typography variant="caption" sx={{ color: "#A8A29E" }}>
            18px / 400 / 1.7 line-height
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "1rem", lineHeight: 1.6, color: "#44403C" }}
          >
            Body - Descubre nuestra colecci&oacute;n de planners, tarjetas de visita, kits de
            branding y m&aacute;s. Todos los archivos est&aacute;n listos para personalizar.
          </Typography>
          <Typography variant="caption" sx={{ color: "#A8A29E" }}>
            16px / 400 / 1.6 line-height
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.875rem", lineHeight: 1.5, color: "#57534E" }}
          >
            Body Small - Incluye formatos PDF, PNG y Canva editable. Descarga
            instant&aacute;nea despu&eacute;s de la compra.
          </Typography>
          <Typography variant="caption" sx={{ color: "#A8A29E" }}>
            14px / 400 / 1.5 line-height
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.75rem", lineHeight: 1.4, color: "#78716C" }}
          >
            Caption - 5 descargas restantes &middot; Versi&oacute;n 2.1 disponible
          </Typography>
          <Typography variant="caption" sx={{ color: "#A8A29E" }}>
            12px / 400 / 1.4 line-height
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ my: 4, borderColor: "#E7E5E4" }} />

      {/* Italic & Emphasis */}
      <Typography variant="overline" sx={{ color: "#78716C", mb: 2, display: "block" }}>
        &Eacute;nfasis Elegante (Italic)
      </Typography>

      <Box sx={{ mb: 4, p: 4, bgcolor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E7E5E4" }}>
        <Typography
          sx={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.75rem",
            fontStyle: "italic",
            fontWeight: 400,
            color: "#57534E",
            textAlign: "center",
          }}
        >
          &ldquo;Dise&ntilde;os que dan vida a tu visi&oacute;n&rdquo;
        </Typography>
        <Typography variant="caption" sx={{ color: "#A8A29E", display: "block", textAlign: "center", mt: 1 }}>
          Cormorant Garamond Italic - Para testimonios, citas, taglines
        </Typography>
      </Box>

      <Divider sx={{ my: 4, borderColor: "#E7E5E4" }} />

      {/* UI Elements */}
      <Typography variant="overline" sx={{ color: "#78716C", mb: 2, display: "block" }}>
        UI Elements
      </Typography>

      <Stack direction="row" spacing={4} flexWrap="wrap" useFlexGap>
        <Box>
          <Box
            sx={{
              px: 4,
              py: 1.5,
              background: "linear-gradient(to right, #F59E0B, #FBBF24)",
              borderRadius: "9999px",
              display: "inline-block",
              boxShadow: "0 4px 14px rgba(245, 158, 11, 0.25)",
            }}
          >
            <Typography
              sx={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.875rem", fontWeight: 600, color: "#1C1917" }}
            >
              A&ntilde;adir al carrito
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: "#A8A29E", display: "block", mt: 1 }}>
            Nunito Sans 14px / 600 - Buttons
          </Typography>
        </Box>

        <Box>
          <Box
            sx={{
              px: 3,
              py: 0.75,
              bgcolor: "rgba(201, 184, 212, 0.3)",
              borderRadius: "9999px",
              display: "inline-block",
            }}
          >
            <Typography
              sx={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.75rem", fontWeight: 500, color: "#44403C" }}
            >
              Planners
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: "#A8A29E", display: "block", mt: 1 }}>
            Nunito Sans 12px / 500 - Chips
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#78716C",
            }}
          >
            Categor&iacute;a
          </Typography>
          <Typography variant="caption" sx={{ color: "#A8A29E", display: "block", mt: 1 }}>
            Nunito Sans 12px / 500 / uppercase - Labels
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ my: 4, borderColor: "#E7E5E4" }} />

      {/* Price Display */}
      <Typography variant="overline" sx={{ color: "#78716C", mb: 2, display: "block" }}>
        Precios (Cormorant Garamond + JetBrains Mono)
      </Typography>

      <Stack direction="row" spacing={4} alignItems="baseline">
        <Box>
          <Typography
            sx={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2rem",
              fontWeight: 600,
              color: "#1C1917",
            }}
          >
            $24.99
          </Typography>
          <Typography variant="caption" sx={{ color: "#A8A29E" }}>
            Cormorant 32px / 600 - Product price
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.875rem",
              color: "#57534E",
              bgcolor: "#F5F5F4",
              px: 2,
              py: 0.5,
              borderRadius: "8px",
            }}
          >
            MAGIC20
          </Typography>
          <Typography variant="caption" sx={{ color: "#A8A29E", display: "block", mt: 1 }}>
            JetBrains Mono 14px - Discount codes
          </Typography>
        </Box>

        <Box>
          <Typography
            component="span"
            sx={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.25rem",
              fontWeight: 500,
              color: "#A8A29E",
              textDecoration: "line-through",
              mr: 1,
            }}
          >
            $34.99
          </Typography>
          <Typography
            component="span"
            sx={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#B45309",
            }}
          >
            $24.99
          </Typography>
          <Typography variant="caption" sx={{ color: "#A8A29E", display: "block", mt: 1 }}>
            Strike-through + sale price
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ my: 4, borderColor: "#E7E5E4" }} />

      {/* Code */}
      <Typography variant="overline" sx={{ color: "#78716C", mb: 2, display: "block" }}>
        Code (JetBrains Mono)
      </Typography>

      <Box
        sx={{
          p: 3,
          bgcolor: "#1C1917",
          borderRadius: "12px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.875rem",
          color: "#F5F5F4",
        }}
      >
        <code>const product = await api.getProduct(slug);</code>
      </Box>
    </Box>
  );
};

const meta = {
  title: "Brand/Typography",
  component: TypographyShowcase,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "light",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TypographyShowcase>;

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
