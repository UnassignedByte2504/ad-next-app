"use client";

import PinterestIcon from "@mui/icons-material/Pinterest";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { Instagram, Mail, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { forwardRef } from "react";

import { durations, easings, neutral, primary, springs } from "@/app/ui/theme";
import { Logo } from "@atoms/Logo";

// =============================================================================
// TYPES
// =============================================================================

export interface FooterLink {
  /** Link label (translation key or text) */
  label: string;
  /** Link href */
  href: string;
  /** External link */
  external?: boolean;
}

export interface FooterColumn {
  /** Column title */
  title: string;
  /** Links in column */
  links: FooterLink[];
}

export type SocialPlatform = "instagram" | "pinterest" | "etsy" | "email";

export interface SocialLink {
  /** Platform name */
  platform: SocialPlatform;
  /** URL */
  href: string;
  /** Aria label */
  ariaLabel?: string;
}

export interface FooterProps {
  /** Custom columns (overrides default) */
  columns?: FooterColumn[];
  /** Social media links */
  socialLinks?: SocialLink[];
  /** Show logo */
  showLogo?: boolean;
  /** Show tagline */
  showTagline?: boolean;
  /** Copyright text */
  copyright?: string;
  /** Max width of container */
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  /** Additional CSS class */
  className?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const MotionBox = motion.create(Box);

const socialIcons: Record<
  SocialPlatform,
  React.ComponentType<{ size?: number }>
> = {
  instagram: Instagram,
  pinterest: ({ size }) => <PinterestIcon sx={{ fontSize: size }} />,
  etsy: ShoppingBag,
  email: Mail,
};

const defaultSocialLinks: SocialLink[] = [
  { platform: "instagram", href: "https://www.instagram.com/ayladesigns" },
  { platform: "email", href: "mailto:hello@ayladesigns.me" },
];

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Footer - Site footer with navigation columns and social links.
 *
 * Features:
 * - Responsive layout (logo + tagline + 2 nav columns)
 * - Social media links with hover animations
 * - Accent colored column titles
 * - i18n support for all labels
 * - Semantic theme tokens
 *
 * @example
 * ```tsx
 * <Footer />
 *
 * // With custom social links
 * <Footer
 *   socialLinks={[
 *     { platform: "instagram", href: "https://instagram.com/mybrand" },
 *     { platform: "pinterest", href: "https://pinterest.com/mybrand" },
 *   ]}
 * />
 * ```
 */
export const Footer = forwardRef<HTMLElement, FooterProps>(
  (
    {
      columns,
      socialLinks = defaultSocialLinks,
      showLogo = true,
      showTagline = true,
      copyright,
      maxWidth = "xl",
      className,
    },
    ref
  ) => {
    const t = useTranslations("Components.footer");

    // Default columns with i18n - Products and Support
    const defaultColumns: FooterColumn[] = [
      {
        title: t("products.title"),
        links: [
          { label: t("products.planners"), href: "/products/planners" },
          { label: t("products.cards"), href: "/products/cards" },
          { label: t("products.socialMedia"), href: "/products/social-media" },
          { label: t("products.branding"), href: "/products/branding" },
        ],
      },
      {
        title: t("support.title"),
        links: [
          { label: t("support.faq"), href: "/faq" },
          { label: t("support.contact"), href: "/contact" },
          { label: t("support.licenses"), href: "/licenses" },
          { label: t("support.terms"), href: "/terms" },
        ],
      },
    ];

    const footerColumns = columns || defaultColumns;
    const currentYear = new Date().getFullYear();
    const copyrightText = copyright || t("copyright", { year: currentYear });

    return (
      <Box
        ref={ref}
        component="footer"
        className={className}
        sx={{
          bgcolor: "grey.900",
          pt: { xs: 6, md: 8 },
          pb: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth={maxWidth}>
          {/* Main Footer Content */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "2fr repeat(2, 1fr)",
              },
              gap: { xs: 4, md: 8 },
            }}
          >
            {/* Logo, Tagline & Social Section */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={springs.smooth}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {showLogo && (
                <Link
                  href="/"
                  style={{ display: "inline-block", width: "fit-content" }}
                >
                  <Logo size="lg" variant="full" textColor={neutral[50]} />
                </Link>
              )}

              {/* Tagline */}
              {showTagline && (
                <Typography
                  sx={{
                    color: "grey.400",
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                    maxWidth: 360,
                  }}
                >
                  {t("tagline")}
                </Typography>
              )}

              {/* Social Links */}
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                {socialLinks.map((social) => {
                  const Icon = socialIcons[social.platform];
                  const isEmail = social.platform === "email";
                  return (
                    <motion.div
                      key={social.platform}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={springs.snappy}
                    >
                      <IconButton
                        component="a"
                        href={social.href}
                        target={isEmail ? undefined : "_blank"}
                        rel={isEmail ? undefined : "noopener noreferrer"}
                        aria-label={
                          social.ariaLabel || t(`social.${social.platform}`)
                        }
                        sx={{
                          color: "grey.400",
                          bgcolor: "grey.800",
                          "&:hover": {
                            color: primary.main,
                            bgcolor: `${primary.main}1A`,
                          },
                          transition: `all ${durations.fast}ms ${easings.default}`,
                        }}
                      >
                        <Icon size={20} />
                      </IconButton>
                    </motion.div>
                  );
                })}
              </Box>
            </MotionBox>

            {/* Navigation Columns */}
            {footerColumns.map((column, colIndex) => (
              <MotionBox
                key={column.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...springs.smooth, delay: 0.1 * (colIndex + 1) }}
              >
                {/* Column title with accent color */}
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color: primary.main, // Amber accent
                    mb: 2.5,
                    fontSize: "0.875rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  {column.title}
                </Typography>

                <Box
                  component="ul"
                  sx={{
                    listStyle: "none",
                    p: 0,
                    m: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  {column.links.map((link) => (
                    <Box component="li" key={link.href}>
                      <Typography
                        component={Link}
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        sx={{
                          color: "grey.400",
                          textDecoration: "none",
                          fontSize: "0.875rem",
                          transition: `color ${durations.fast}ms ${easings.default}`,
                          "&:hover": {
                            color: "grey.100",
                          },
                        }}
                      >
                        {link.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </MotionBox>
            ))}
          </Box>

          {/* Bottom Bar - Centered Copyright */}
          <Divider sx={{ my: { xs: 4, md: 6 }, borderColor: "grey.800" }} />

          <Typography
            variant="body2"
            sx={{
              color: "grey.500",
              textAlign: "center",
              fontSize: "0.875rem",
            }}
          >
            {copyrightText}
          </Typography>
        </Container>
      </Box>
    );
  }
);

Footer.displayName = "Footer";

export default Footer;
