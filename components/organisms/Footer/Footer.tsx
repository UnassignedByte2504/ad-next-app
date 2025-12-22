"use client";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";

import { Logo } from "@atoms/Logo";
import { springs, durations, easings, neutral, primary } from "@/app/ui/theme";

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

export interface SocialLink {
  /** Platform name */
  platform: "instagram" | "facebook" | "twitter" | "x";
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

const socialIcons = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  twitter: XIcon,
  x: XIcon,
};

const defaultSocialLinks: SocialLink[] = [
  { platform: "instagram", href: "https://www.instagram.com/bemyre" },
  { platform: "facebook", href: "https://www.facebook.com/bemyre" },
  { platform: "x", href: "https://x.com/bemyre" },
];

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Footer - Site footer with navigation columns and social links.
 *
 * Features:
 * - Responsive 4-column layout (logo + 3 nav columns)
 * - Social media links with hover animations
 * - i18n support for all labels
 * - M3 Expressive styling with theme tokens
 *
 * @example
 * ```tsx
 * <Footer />
 *
 * // With custom social links
 * <Footer
 *   socialLinks={[
 *     { platform: "instagram", href: "https://instagram.com/mybrand" },
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
      copyright,
      maxWidth = "xl",
      className,
    },
    ref
  ) => {
    const t = useTranslations("Components.footer");

    // Default columns with i18n
    const defaultColumns: FooterColumn[] = [
      {
        title: t("navigation.title"),
        links: [
          { label: t("navigation.home"), href: "/" },
          { label: t("navigation.profile"), href: "/profile" },
          { label: t("navigation.register"), href: "/auth/signup" },
          { label: t("navigation.login"), href: "/auth/login" },
        ],
      },
      {
        title: t("about.title"),
        links: [
          { label: t("about.faq"), href: "/faq" },
          { label: t("about.whatIsBemyre"), href: "/faq#what-is-bemyre" },
          { label: t("about.createBand"), href: "/faq#create-band" },
          { label: t("about.joinBand"), href: "/faq#join-band" },
          { label: t("about.values"), href: "/about" },
        ],
      },
      {
        title: t("discover.title"),
        links: [
          { label: t("discover.popularBands"), href: "/bands" },
          { label: t("discover.popularMusicians"), href: "/musicians" },
          { label: t("discover.popularVenues"), href: "/venues" },
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
          bgcolor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
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
                md: "1.5fr repeat(3, 1fr)",
              },
              gap: { xs: 4, md: 6 },
            }}
          >
            {/* Logo & Social Section */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={springs.smooth}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              {showLogo && (
                <Link href="/" style={{ display: "inline-block", width: "fit-content" }}>
                  <Logo size="md" />
                </Link>
              )}

              {/* Social Links */}
              <Box sx={{ display: "flex", gap: 1 }}>
                {socialLinks.map((social) => {
                  const Icon = socialIcons[social.platform];
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
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.ariaLabel || t(`social.${social.platform}`)}
                        sx={{
                          color: "text.secondary",
                          bgcolor: `${neutral[800]}40`,
                          "&:hover": {
                            color: primary.main,
                            bgcolor: `${primary.main}1A`,
                          },
                          transition: `all ${durations.fast}ms ${easings.default}`,
                        }}
                      >
                        <Icon sx={{ fontSize: 24 }} />
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
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    mb: 2,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontSize: "0.75rem",
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
                          color: "text.secondary",
                          textDecoration: "none",
                          fontSize: "0.875rem",
                          transition: `color ${durations.fast}ms ${easings.default}`,
                          "&:hover": {
                            color: primary.main,
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

          {/* Bottom Bar */}
          <Divider sx={{ my: { xs: 4, md: 6 }, opacity: 0.5 }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", textAlign: { xs: "center", sm: "left" } }}
            >
              {copyrightText}
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 3,
              }}
            >
              <Typography
                component={Link}
                href="/privacy"
                sx={{
                  color: "text.secondary",
                  textDecoration: "none",
                  fontSize: "0.75rem",
                  "&:hover": { color: primary.main },
                  transition: `color ${durations.fast}ms ${easings.default}`,
                }}
              >
                {t("legal.privacy")}
              </Typography>
              <Typography
                component={Link}
                href="/terms"
                sx={{
                  color: "text.secondary",
                  textDecoration: "none",
                  fontSize: "0.75rem",
                  "&:hover": { color: primary.main },
                  transition: `color ${durations.fast}ms ${easings.default}`,
                }}
              >
                {t("legal.terms")}
              </Typography>
              <Typography
                component={Link}
                href="/cookies"
                sx={{
                  color: "text.secondary",
                  textDecoration: "none",
                  fontSize: "0.75rem",
                  "&:hover": { color: primary.main },
                  transition: `color ${durations.fast}ms ${easings.default}`,
                }}
              >
                {t("legal.cookies")}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }
);

Footer.displayName = "Footer";

export default Footer;
