"use client";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { ChevronDown, Heart, Moon, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

// Atoms
import { Chip } from "@atoms/Chip";
import { Toast } from "@atoms/Toast";

// Molecules
import { CategoryChips, type CategoryItem } from "@molecules/CategoryChips";
import { MagicText } from "@molecules/MagicText";
import { ReviewCard } from "@molecules/ReviewCard";
import { SectionHeader } from "@molecules/SectionHeader";

// Organisms
import { Cart } from "@organisms/Cart";
import { FeaturesSection, type FeatureItem } from "@organisms/FeaturesSection";
import { FloatingStars } from "@organisms/FloatingStars";
import { Footer } from "@organisms/Footer";
import { GlowCTA } from "@organisms/GlowCTA";
import { Hero } from "@organisms/Hero";
import { HeroDecorations } from "@organisms/HeroDecorations";
import { Navbar } from "@organisms/Navbar";
import { ProductCard } from "@organisms/ProductCard";
import { ProductModal } from "@organisms/ProductModal";

// Data
import { products, reviews } from "@/data/ayla";

// Theme
import { fontFamilies, primary } from "@/app/ui/theme";

// Types
import type { AylaCartItem, AylaProduct, AylaToast } from "@/types/ayla";

// =============================================================================
// COMPONENT
// =============================================================================

export function HomeContent() {
  const t = useTranslations("Home");

  // ---------------------------------------------------------------------------
  // NAV LINKS (inside component for i18n)
  // ---------------------------------------------------------------------------

  const navLinks = [
    { label: t("nav.products"), href: "#productos" },
    { label: t("nav.testimonials"), href: "#testimonios" },
    { label: t("nav.contact"), href: "#contacto" },
  ];

  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  const [cartItems, setCartItems] = useState<AylaCartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<AylaProduct | null>(
    null
  );
  const [toast, setToast] = useState<AylaToast>({
    visible: false,
    message: "",
    variant: "success",
  });

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const showToast = (
    message: string,
    variant: AylaToast["variant"] = "success"
  ) => {
    setToast({ visible: true, message, variant });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 2500);
  };

  const addToCart = (product: AylaProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        showToast(`${product.name} actualizado`);
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      showToast(`${product.name} añadido`);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // ---------------------------------------------------------------------------
  // DATA
  // ---------------------------------------------------------------------------

  const features: FeatureItem[] = [
    {
      key: "bohemian",
      icon: <Moon size={24} />,
      title: t("features.bohemian.title"),
      description: t("features.bohemian.description"),
      iconColor: "primary",
    },
    {
      key: "professional",
      icon: <Sparkles size={24} />,
      title: t("features.professional.title"),
      description: t("features.professional.description"),
      iconColor: "secondary",
    },
    {
      key: "editable",
      icon: <Heart size={24} />,
      title: t("features.editable.title"),
      description: t("features.editable.description"),
      iconColor: "info",
    },
  ];

  const categories: CategoryItem[] = [
    { key: "invitations", label: t("categories.items.invitations") },
    { key: "digitalArt", label: t("categories.items.digitalArt") },
    { key: "socialMedia", label: t("categories.items.socialMedia") },
    { key: "planners", label: t("categories.items.planners") },
    { key: "stickers", label: t("categories.items.stickers") },
    { key: "wallArt", label: t("categories.items.wallArt") },
    { key: "branding", label: t("categories.items.branding") },
    { key: "cards", label: t("categories.items.cards") },
  ];

  const footerColumns = [
    {
      title: t("footer.columns.products"),
      links: [
        { label: t("footer.links.planners"), href: "/planners" },
        { label: t("footer.links.cards"), href: "/tarjetas" },
        { label: t("footer.links.socialMedia"), href: "/social-media" },
        { label: t("footer.links.branding"), href: "/branding" },
      ],
    },
    {
      title: t("footer.columns.support"),
      links: [
        { label: t("footer.links.faq"), href: "/faq" },
        { label: t("footer.links.contact"), href: "/contacto" },
        { label: t("footer.links.licenses"), href: "/licencias" },
        { label: t("footer.links.terms"), href: "/terminos" },
      ],
    },
  ];

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* ===================================================================
          NAVBAR
          =================================================================== */}
      <Navbar
        brandProps={{
          logoProps: { variant: "short", size: "md" },
          showTagline: false,
          href: "/",
        }}
        links={navLinks}
        variant="transparent"
        position="fixed"
        scrollEffect={true}
        showSearch={false}
        actionsProps={{
          showThemeToggle: true,
          children: (
            <IconButton
              onClick={() => setIsCartOpen(true)}
              size="small"
              aria-label="Carrito de compras"
              sx={{
                color: "text.primary",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <Badge badgeContent={cartCount} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          ),
        }}
      />

      {/* ===================================================================
          HERO SECTION
          =================================================================== */}
      <Hero
        headline={t("title")}
        subheadline={t("subtitle")}
        ctaText={t("cta.start")}
        ctaHref="#productos"
        secondaryCtaText={t("cta.explore")}
        secondaryCtaHref="#testimonios"
        height="full"
        align="center"
        overlay="gradient"
        backgroundDecoration={
          <>
            <HeroDecorations />
            <FloatingStars starColor={primary.light} count={15} />
          </>
        }
        beforeHeadline={
          <Chip
            label={t("badge")}
            variant="outlined"
            size="medium"
            icon={<AutoAwesomeIcon sx={{ fontSize: 14 }} />}
            sx={{
              borderColor: primary.main,
              color: primary.main,
              bgcolor: `${primary.main}10`,
            }}
          />
        }
        headlineSlot={
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h1"
              sx={{
                fontFamily: fontFamilies.heading,
                fontWeight: 500,
                fontSize: {
                  xs: "2.5rem",
                  sm: "3rem",
                  md: "4rem",
                  lg: "4.5rem",
                },
                lineHeight: 1.1,
                color: "text.primary",
              }}
            >
              {t("title")}
            </Typography>
            <Typography
              variant="h1"
              component="div"
              sx={{
                fontFamily: fontFamilies.heading,
                fontWeight: 500,
                fontSize: {
                  xs: "2.5rem",
                  sm: "3rem",
                  md: "4rem",
                  lg: "4.5rem",
                },
                lineHeight: 1.1,
                fontStyle: "italic",
              }}
            >
              <MagicText color="amber">{t("titleMagic1")}</MagicText>
              <Box
                component="span"
                sx={{ color: "text.primary", mx: 1, fontStyle: "normal" }}
              >
                {t("titleConnector")}
              </Box>
            </Typography>
            <Typography
              variant="h1"
              component="div"
              sx={{
                fontFamily: fontFamilies.heading,
                fontWeight: 500,
                fontSize: {
                  xs: "2.5rem",
                  sm: "3rem",
                  md: "4rem",
                  lg: "4.5rem",
                },
                lineHeight: 1.1,
                fontStyle: "italic",
              }}
            >
              <MagicText color="purple">{t("titleMagic2")}</MagicText>
            </Typography>
          </Box>
        }
      />

      {/* Scroll Indicator */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        sx={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          cursor: "pointer",
          color: "text.secondary",
          "&:hover": { color: "primary.main" },
          "@keyframes bounce": {
            "0%, 100%": { transform: "translateX(-50%) translateY(0)" },
            "50%": { transform: "translateX(-50%) translateY(8px)" },
          },
          animation: "bounce 2s ease-in-out infinite",
        }}
        onClick={() => {
          document
            .getElementById("productos")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <ChevronDown size={28} />
      </Box>

      {/* ===================================================================
          FEATURES SECTION
          =================================================================== */}
      <FeaturesSection features={features} columns={3} background="subtle" />

      {/* ===================================================================
          CATEGORIES SECTION
          =================================================================== */}
      <Box
        component="section"
        sx={{
          py: { xs: 6, md: 10 },
          bgcolor: "background.paper",
        }}
      >
        <Container maxWidth="lg">
          <SectionHeader
            title={t("categories.title")}
            size="lg"
            align="center"
          />
          <Box sx={{ mt: 4 }}>
            <CategoryChips categories={categories} />
          </Box>
        </Container>
      </Box>

      {/* ===================================================================
          PRODUCTS SECTION
          =================================================================== */}
      <Box
        id="productos"
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: "background.default",
        }}
      >
        <Container maxWidth="lg">
          <SectionHeader
            title={t("products.title")}
            subtitle={t("products.subtitle")}
            size="lg"
            align="center"
          />
          <Box
            sx={{
              mt: 6,
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 4,
            }}
          >
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onViewProduct={setSelectedProduct}
                index={index}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* ===================================================================
          TESTIMONIALS SECTION
          =================================================================== */}
      <Box
        id="testimonios"
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: "background.paper",
        }}
      >
        <Container maxWidth="lg">
          <SectionHeader
            title={t("testimonials.title")}
            size="lg"
            align="center"
          />
          <Box
            sx={{
              mt: 6,
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {reviews.map((review, index) => (
              <ReviewCard key={index} review={review} index={index} />
            ))}
          </Box>
        </Container>
      </Box>

      {/* ===================================================================
          CTA SECTION
          =================================================================== */}
      <GlowCTA
        title={t("glowCta.title")}
        subtitle={t("glowCta.subtitle")}
        ctaText={t("glowCta.button")}
        ctaHref="#productos"
      />

      {/* ===================================================================
          FOOTER
          =================================================================== */}
      <Box id="contacto">
        <Footer
          columns={footerColumns}
          socialLinks={[{ platform: "instagram", href: "#" }]}
          copyright={t("footer.copyright")}
        />
      </Box>

      {/* ===================================================================
          OVERLAYS
          =================================================================== */}
      <Cart
        items={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
      />

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />

      <Toast
        message={toast.message}
        isVisible={toast.visible}
        variant={toast.variant}
      />
    </Box>
  );
}

export default HomeContent;
