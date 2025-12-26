"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Typography from "@mui/material/Typography";
import BrushIcon from "@mui/icons-material/Brush";
import DownloadIcon from "@mui/icons-material/Download";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// Atoms
import { Toast } from "@atoms/Toast";
import { Chip } from "@atoms/Chip";

// Molecules
import { MagicText } from "@molecules/MagicText";
import { CategoryChips, type CategoryItem } from "@molecules/CategoryChips";
import { SectionHeader } from "@molecules/SectionHeader";
import { ReviewCard } from "@molecules/ReviewCard";

// Organisms
import { Navbar } from "@organisms/Navbar";
import { Hero } from "@organisms/Hero";
import { FeaturesSection, type FeatureItem } from "@organisms/FeaturesSection";
import { FloatingStars } from "@organisms/FloatingStars";
import { ProductCard } from "@organisms/ProductCard";
import { ProductModal } from "@organisms/ProductModal";
import { Cart } from "@organisms/Cart";
import { GlowCTA } from "@organisms/GlowCTA";
import { Footer } from "@organisms/Footer";

// Data
import { products, reviews } from "@/data/ayla";

// Theme
import { primary, fontFamilies } from "@/app/ui/theme";

// Types
import type { AylaProduct, AylaCartItem, AylaToast } from "@/types/ayla";

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
  const [selectedProduct, setSelectedProduct] = useState<AylaProduct | null>(null);
  const [toast, setToast] = useState<AylaToast>({
    visible: false,
    message: "",
    variant: "success",
  });

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const showToast = (message: string, variant: AylaToast["variant"] = "success") => {
    setToast({ visible: true, message, variant });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 2500);
  };

  const addToCart = (product: AylaProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        showToast(`${product.name} actualizado`);
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
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
      key: "personalized",
      icon: <BrushIcon />,
      title: t("features.personalized.title"),
      description: t("features.personalized.description"),
      iconColor: "primary",
    },
    {
      key: "instant",
      icon: <DownloadIcon />,
      title: t("features.instant.title"),
      description: t("features.instant.description"),
      iconColor: "secondary",
    },
    {
      key: "handcrafted",
      icon: <AutoAwesomeIcon />,
      title: t("features.handcrafted.title"),
      description: t("features.handcrafted.description"),
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
          logoProps: { variant: "full", size: "md" },
          showTagline: true,
          tagline: "Designs",
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
        backgroundDecoration={<FloatingStars starColor={primary.light} count={15} />}
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
          <Typography
            variant="h1"
            sx={{
              fontFamily: fontFamilies.heading,
              fontWeight: 600,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem", lg: "4rem" },
              lineHeight: 1.2,
              color: "text.primary",
            }}
          >
            {t("title")} <MagicText color="amber">✨</MagicText>
          </Typography>
        }
      />

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

      <Toast message={toast.message} isVisible={toast.visible} variant={toast.variant} />
    </Box>
  );
}

export default HomeContent;
