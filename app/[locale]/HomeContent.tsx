"use client";

import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import BrushIcon from "@mui/icons-material/Brush";
import DownloadIcon from "@mui/icons-material/Download";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import { Hero } from "@organisms/Hero";
import { FeaturesSection, type FeatureItem } from "@organisms/FeaturesSection";
import { CategoryChips, type CategoryItem } from "@molecules/CategoryChips";

// =============================================================================
// COMPONENT
// =============================================================================

export function HomeContent() {
  const t = useTranslations("Home");

  // Feature items with icons
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

  // Category items
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Hero Section */}
      <Hero
        headline={t("title")}
        subheadline={t("subtitle")}
        ctaText={t("cta.start")}
        ctaHref="/shop"
        secondaryCtaText={t("cta.explore")}
        secondaryCtaHref="/collections"
        height="large"
        align="center"
        overlay="none"
      />

      {/* Features Section */}
      <FeaturesSection features={features} columns={3} />

      {/* Categories Section */}
      <Box
        component="section"
        sx={{
          py: { xs: 6, md: 10 },
          bgcolor: "background.paper",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            fontWeight={700}
            textAlign="center"
            sx={{ mb: 4 }}
          >
            {t("categories.title")}
          </Typography>
          <CategoryChips categories={categories} />
        </Container>
      </Box>

      {/* Footer Note */}
      <Box
        component="footer"
        sx={{
          py: 4,
          textAlign: "center",
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {t("footer.tech")}
        </Typography>
      </Box>
    </Box>
  );
}

export default HomeContent;
