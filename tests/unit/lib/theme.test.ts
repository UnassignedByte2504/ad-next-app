/**
 * Theme System Tests
 *
 * Tests for color tokens, typography tokens, and theme utilities.
 * Validates that all design tokens are correctly defined and
 * theme utilities function as expected.
 *
 * @see app/ui/theme/tokens/colors.ts
 * @see app/ui/theme/tokens/typography.ts
 * @see app/ui/theme/index.ts
 */

import { describe, it, expect } from "vitest";
import {
  // Color tokens
  primary,
  secondary,
  accent,
  neutral,
  semantic,
  categoryColors,
  gradients,
  // Typography tokens
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,
  letterSpacing,
  // Theme
  theme,
  // Utilities
  getExtendedPalette,
  createBrandShadow,
} from "@/app/ui/theme";
import { typographyVariants } from "@/app/ui/theme/tokens/typography";

// =============================================================================
// COLOR TOKENS TESTS
// =============================================================================

describe("Color Tokens", () => {
  describe("primary", () => {
    it("has main, light, and dark shades", () => {
      expect(primary.main).toBeDefined();
      expect(primary.light).toBeDefined();
      expect(primary.dark).toBeDefined();
    });

    it("has all required shade levels (50-900)", () => {
      const requiredShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
      requiredShades.forEach((shade) => {
        expect(primary[shade]).toBeDefined();
        expect(primary[shade]).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    it("has contrastText defined", () => {
      expect(primary.contrastText).toBeDefined();
      expect(primary.contrastText).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it("main color is the Amber Gold brand color", () => {
      expect(primary.main).toBe("#F59E0B");
    });
  });

  describe("secondary", () => {
    it("has main, light, and dark shades", () => {
      expect(secondary.main).toBeDefined();
      expect(secondary.light).toBeDefined();
      expect(secondary.dark).toBeDefined();
    });

    it("has all required shade levels (50-900)", () => {
      const requiredShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
      requiredShades.forEach((shade) => {
        expect(secondary[shade]).toBeDefined();
        expect(secondary[shade]).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    it("has contrastText defined", () => {
      expect(secondary.contrastText).toBeDefined();
      expect(secondary.contrastText).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it("main color is the Lavender brand color", () => {
      expect(secondary.main).toBe("#A855F7");
    });
  });

  describe("accent", () => {
    it("has main, light, and dark shades", () => {
      expect(accent.main).toBeDefined();
      expect(accent.light).toBeDefined();
      expect(accent.dark).toBeDefined();
    });

    it("has all required shade levels (50-900)", () => {
      const requiredShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
      requiredShades.forEach((shade) => {
        expect(accent[shade]).toBeDefined();
        expect(accent[shade]).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    it("has contrastText defined", () => {
      expect(accent.contrastText).toBeDefined();
      expect(accent.contrastText).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it("main color is the Rose brand color", () => {
      expect(accent.main).toBe("#F43F5E");
    });
  });

  describe("neutral", () => {
    it("has full grayscale range (0-1000)", () => {
      const requiredShades = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 850, 900, 950, 1000] as const;
      requiredShades.forEach((shade) => {
        expect(neutral[shade]).toBeDefined();
        expect(neutral[shade]).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    it("0 is white and 1000 is black", () => {
      expect(neutral[0]).toBe("#FFFFFF");
      expect(neutral[1000]).toBe("#000000");
    });
  });

  describe("semantic", () => {
    it("has error, warning, info, and success colors", () => {
      expect(semantic.error).toBeDefined();
      expect(semantic.warning).toBeDefined();
      expect(semantic.info).toBeDefined();
      expect(semantic.success).toBeDefined();
    });

    it("each semantic color has main, light, dark, bg, and contrastText", () => {
      const semanticKeys = ["error", "warning", "info", "success"] as const;
      semanticKeys.forEach((key) => {
        expect(semantic[key].main).toBeDefined();
        expect(semantic[key].light).toBeDefined();
        expect(semantic[key].dark).toBeDefined();
        expect(semantic[key].bg).toBeDefined();
        expect(semantic[key].contrastText).toBeDefined();
      });
    });

    it("semantic colors have valid hex values for main", () => {
      expect(semantic.error.main).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(semantic.warning.main).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(semantic.info.main).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(semantic.success.main).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it("semantic bg colors use rgba format", () => {
      const rgbaPattern = /^rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)$/;
      expect(semantic.error.bg).toMatch(rgbaPattern);
      expect(semantic.warning.bg).toMatch(rgbaPattern);
      expect(semantic.info.bg).toMatch(rgbaPattern);
      expect(semantic.success.bg).toMatch(rgbaPattern);
    });
  });

  describe("categoryColors", () => {
    it("has common product categories defined", () => {
      const commonCategories = [
        "Planners",
        "Tarjetas",
        "Social Media",
        "Bodas",
        "Branding",
        "Thank You",
        "Digital Art",
        "Stickers",
        "Wall Art",
        "Journals",
      ];
      commonCategories.forEach((category) => {
        expect(categoryColors[category as keyof typeof categoryColors]).toBeDefined();
        expect(categoryColors[category as keyof typeof categoryColors]).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    it("has correct color values for main categories", () => {
      expect(categoryColors.Planners).toBe("#C9B8D4");
      expect(categoryColors.Tarjetas).toBe("#D4B896");
      expect(categoryColors["Social Media"]).toBe("#A855F7");
      expect(categoryColors.Bodas).toBe("#F2DCDC");
      expect(categoryColors.Branding).toBe("#E8D5B0");
      expect(categoryColors["Thank You"]).toBe("#E1D8EA");
    });

    it("has unique colors for different categories", () => {
      const colors = Object.values(categoryColors);
      const uniqueColors = new Set(colors);
      // Allow some duplicates but most should be unique
      expect(uniqueColors.size).toBeGreaterThan(colors.length * 0.6);
    });
  });

  describe("gradients", () => {
    it("has all preset gradients defined", () => {
      expect(gradients.brand).toBeDefined();
      expect(gradients.cta).toBeDefined();
      expect(gradients.glowDark).toBeDefined();
      expect(gradients.glowLight).toBeDefined();
    });

    it("gradients are valid CSS linear-gradient values", () => {
      const gradientPattern = /^linear-gradient\(.+\)$/;
      expect(gradients.brand).toMatch(gradientPattern);
      expect(gradients.cta).toMatch(gradientPattern);
      expect(gradients.glowDark).toMatch(gradientPattern);
      expect(gradients.glowLight).toMatch(gradientPattern);
    });

    it("brand gradient uses primary and secondary colors", () => {
      expect(gradients.brand).toContain(primary.main);
      expect(gradients.brand).toContain(secondary.main);
    });
  });
});

// =============================================================================
// TYPOGRAPHY TOKENS TESTS
// =============================================================================

describe("Typography Tokens", () => {
  describe("fontFamilies", () => {
    it("has heading, body, and mono font families", () => {
      expect(fontFamilies.heading).toBeDefined();
      expect(fontFamilies.body).toBeDefined();
      expect(fontFamilies.mono).toBeDefined();
    });

    it("heading uses Cormorant Garamond font", () => {
      expect(fontFamilies.heading).toContain("Cormorant Garamond");
    });

    it("body uses Nunito Sans font", () => {
      expect(fontFamilies.body).toContain("Nunito Sans");
    });

    it("mono uses JetBrains Mono font", () => {
      expect(fontFamilies.mono).toContain("JetBrains Mono");
    });

    it("all font families include fallbacks", () => {
      expect(fontFamilies.heading).toContain("serif");
      expect(fontFamilies.body).toContain("sans-serif");
      expect(fontFamilies.mono).toContain("monospace");
    });
  });

  describe("fontWeights", () => {
    it("has regular, medium, semibold, and bold weights", () => {
      expect(fontWeights.regular).toBe(400);
      expect(fontWeights.medium).toBe(500);
      expect(fontWeights.semibold).toBe(600);
      expect(fontWeights.bold).toBe(700);
    });

    it("weights are in ascending order", () => {
      expect(fontWeights.regular).toBeLessThan(fontWeights.medium);
      expect(fontWeights.medium).toBeLessThan(fontWeights.semibold);
      expect(fontWeights.semibold).toBeLessThan(fontWeights.bold);
    });
  });

  describe("fontSizes", () => {
    it("has all size scales from xs to 6xl", () => {
      const expectedSizes = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"] as const;
      expectedSizes.forEach((size) => {
        expect(fontSizes[size]).toBeDefined();
        expect(fontSizes[size]).toMatch(/^\d+(\.\d+)?rem$/);
      });
    });

    it("base size is 1rem (16px)", () => {
      expect(fontSizes.base).toBe("1rem");
    });

    it("sizes are in ascending order", () => {
      const parseRem = (val: string) => parseFloat(val.replace("rem", ""));
      expect(parseRem(fontSizes.xs)).toBeLessThan(parseRem(fontSizes.sm));
      expect(parseRem(fontSizes.sm)).toBeLessThan(parseRem(fontSizes.base));
      expect(parseRem(fontSizes.base)).toBeLessThan(parseRem(fontSizes.lg));
      expect(parseRem(fontSizes.lg)).toBeLessThan(parseRem(fontSizes.xl));
    });
  });

  describe("lineHeights", () => {
    it("has tight to loose range", () => {
      expect(lineHeights.tight).toBeDefined();
      expect(lineHeights.snug).toBeDefined();
      expect(lineHeights.normal).toBeDefined();
      expect(lineHeights.relaxed).toBeDefined();
      expect(lineHeights.loose).toBeDefined();
    });

    it("line heights are numeric values", () => {
      expect(typeof lineHeights.tight).toBe("number");
      expect(typeof lineHeights.loose).toBe("number");
    });

    it("line heights are in ascending order", () => {
      expect(lineHeights.tight).toBeLessThan(lineHeights.snug);
      expect(lineHeights.snug).toBeLessThan(lineHeights.normal);
      expect(lineHeights.normal).toBeLessThan(lineHeights.relaxed);
      expect(lineHeights.relaxed).toBeLessThan(lineHeights.loose);
    });
  });

  describe("letterSpacing", () => {
    it("has tight to widest range", () => {
      expect(letterSpacing.tight).toBeDefined();
      expect(letterSpacing.normal).toBeDefined();
      expect(letterSpacing.wide).toBeDefined();
      expect(letterSpacing.wider).toBeDefined();
      expect(letterSpacing.widest).toBeDefined();
    });

    it("tight has negative letter spacing", () => {
      expect(letterSpacing.tight).toContain("-");
    });

    it("normal has zero letter spacing", () => {
      expect(letterSpacing.normal).toBe("0");
    });
  });

  describe("typographyVariants", () => {
    it("has all MUI heading variants (h1-h6)", () => {
      expect(typographyVariants.h1).toBeDefined();
      expect(typographyVariants.h2).toBeDefined();
      expect(typographyVariants.h3).toBeDefined();
      expect(typographyVariants.h4).toBeDefined();
      expect(typographyVariants.h5).toBeDefined();
      expect(typographyVariants.h6).toBeDefined();
    });

    it("has body variants", () => {
      expect(typographyVariants.body1).toBeDefined();
      expect(typographyVariants.body2).toBeDefined();
    });

    it("has subtitle variants", () => {
      expect(typographyVariants.subtitle1).toBeDefined();
      expect(typographyVariants.subtitle2).toBeDefined();
    });

    it("has button, caption, and overline variants", () => {
      expect(typographyVariants.button).toBeDefined();
      expect(typographyVariants.caption).toBeDefined();
      expect(typographyVariants.overline).toBeDefined();
    });

    it("headings use heading font family", () => {
      expect(typographyVariants.h1.fontFamily).toBe(fontFamilies.heading);
      expect(typographyVariants.h2.fontFamily).toBe(fontFamilies.heading);
      expect(typographyVariants.h3.fontFamily).toBe(fontFamilies.heading);
    });

    it("body variants use body font family", () => {
      expect(typographyVariants.body1.fontFamily).toBe(fontFamilies.body);
      expect(typographyVariants.body2.fontFamily).toBe(fontFamilies.body);
    });

    it("each variant has required properties", () => {
      const variants = Object.values(typographyVariants);
      variants.forEach((variant) => {
        expect(variant.fontFamily).toBeDefined();
        expect(variant.fontSize).toBeDefined();
        expect(variant.fontWeight).toBeDefined();
      });
    });

    it("button has textTransform set to none", () => {
      expect(typographyVariants.button.textTransform).toBe("none");
    });

    it("overline has uppercase textTransform", () => {
      expect(typographyVariants.overline.textTransform).toBe("uppercase");
    });
  });
});

// =============================================================================
// THEME TESTS
// =============================================================================

describe("Theme", () => {
  describe("theme object", () => {
    it("is a valid MUI theme object", () => {
      expect(theme).toBeDefined();
      expect(theme.palette).toBeDefined();
      expect(theme.typography).toBeDefined();
      expect(theme.spacing).toBeDefined();
      expect(theme.breakpoints).toBeDefined();
    });

    it("has colorSchemes for light and dark", () => {
      // colorSchemes is added by MUI when using the colorSchemes option in createTheme
      const themeWithSchemes = theme as unknown as { colorSchemes?: { light?: unknown; dark?: unknown } };
      expect(themeWithSchemes.colorSchemes).toBeDefined();
      expect(themeWithSchemes.colorSchemes?.light).toBeDefined();
      expect(themeWithSchemes.colorSchemes?.dark).toBeDefined();
    });

    it("has correct shape border radius", () => {
      expect(theme.shape.borderRadius).toBe(12);
    });

    it("has correct spacing base unit", () => {
      // MUI 7 with CSS variables returns var(--mui-spacing, 8px)
      const spacingValue = theme.spacing(1);
      expect(spacingValue).toMatch(/8px/);
    });

    it("has correct breakpoint values", () => {
      expect(theme.breakpoints.values.xs).toBe(0);
      expect(theme.breakpoints.values.sm).toBe(600);
      expect(theme.breakpoints.values.md).toBe(900);
      expect(theme.breakpoints.values.lg).toBe(1200);
      expect(theme.breakpoints.values.xl).toBe(1536);
    });

    it("has z-index scale defined", () => {
      expect(theme.zIndex.mobileStepper).toBe(1000);
      expect(theme.zIndex.appBar).toBe(1100);
      expect(theme.zIndex.drawer).toBe(1200);
      expect(theme.zIndex.modal).toBe(1300);
      expect(theme.zIndex.snackbar).toBe(1400);
      expect(theme.zIndex.tooltip).toBe(1500);
    });

    it("has component overrides defined", () => {
      expect(theme.components).toBeDefined();
    });

    it("uses body font family as default typography", () => {
      expect(theme.typography.fontFamily).toBe(fontFamilies.body);
    });
  });
});

// =============================================================================
// UTILITY FUNCTIONS TESTS
// =============================================================================

describe("Theme Utilities", () => {
  describe("getExtendedPalette", () => {
    it("returns correct palette for dark mode", () => {
      const darkPalette = getExtendedPalette("dark");
      expect(darkPalette).toBeDefined();
      expect(darkPalette).toHaveProperty("accent");
      expect(darkPalette).toHaveProperty("neutral");
    });

    it("returns correct palette for light mode", () => {
      const lightPalette = getExtendedPalette("light");
      expect(lightPalette).toBeDefined();
      expect(lightPalette).toHaveProperty("accent");
      expect(lightPalette).toHaveProperty("neutral");
    });

    it("returns different palettes for light and dark modes", () => {
      const darkPalette = getExtendedPalette("dark");
      const lightPalette = getExtendedPalette("light");

      // They should be different objects
      expect(darkPalette).not.toBe(lightPalette);
    });

    it("extended palette includes surface levels", () => {
      const palette = getExtendedPalette("dark");
      expect(palette).toHaveProperty("surface");
    });

    it("extended palette includes gradient", () => {
      const palette = getExtendedPalette("dark");
      expect(palette).toHaveProperty("gradient");
    });
  });

  describe("createBrandShadow", () => {
    it("returns a valid CSS box-shadow string", () => {
      const shadow = createBrandShadow(1, "dark");
      expect(shadow).toMatch(/^0\s+\d+px\s+\d+px\s+rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)$/);
    });

    it("creates different shadows for different elevations", () => {
      const shadow1 = createBrandShadow(1, "dark");
      const shadow2 = createBrandShadow(2, "dark");
      const shadow4 = createBrandShadow(4, "dark");

      expect(shadow1).not.toBe(shadow2);
      expect(shadow2).not.toBe(shadow4);
    });

    it("creates different shadows for light and dark modes", () => {
      const darkShadow = createBrandShadow(2, "dark");
      const lightShadow = createBrandShadow(2, "light");

      expect(darkShadow).not.toBe(lightShadow);
    });

    it("higher elevation creates larger shadow spread", () => {
      const shadow1 = createBrandShadow(1, "dark");
      const shadow4 = createBrandShadow(4, "dark");

      // Extract the pixel values from the shadows
      const extractSpread = (shadow: string) => {
        const match = shadow.match(/(\d+)px\s+(\d+)px/);
        return match ? parseInt(match[2]) : 0;
      };

      expect(extractSpread(shadow4)).toBeGreaterThan(extractSpread(shadow1));
    });

    it("uses brand color (amber primary) in the shadow", () => {
      const shadow = createBrandShadow(1, "dark");
      // Primary color RGB: #F59E0B = rgb(245, 158, 11)
      expect(shadow).toContain("rgba(245, 158, 11");
    });

    it("defaults to elevation 1 and light mode when no params provided", () => {
      const shadow = createBrandShadow();
      expect(shadow).toBeDefined();
      expect(shadow).toMatch(/^0\s+\d+px\s+\d+px\s+rgba\(.+\)$/);
    });
  });
});
