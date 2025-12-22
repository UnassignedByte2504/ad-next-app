/**
 * Bemyre Component Style Overrides
 *
 * Customizes MUI components to match Bemyre's design language:
 * - Rounded corners (8-16px)
 * - Poppins font for buttons and labels
 * - No uppercase transforms
 * - Subtle shadows and hover effects
 *
 * @see docs/branding/CORPORATE_IDENTITY.md
 */

import type { Components, Theme } from "@mui/material/styles";
import { fontFamilies } from "../tokens/typography";
import { shapes } from "../tokens/motion";
import { gradients, shadows, primary } from "../tokens/colors";

/**
 * Component style overrides for MUI components
 */
export const componentOverrides: Components<Theme> = {
  // =========================================================================
  // BUTTONS
  // =========================================================================
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        fontFamily: fontFamilies.heading,
        borderRadius: shapes.full, // Pill shape per brand guidelines
        padding: "10px 24px",
        textTransform: "none",
        fontWeight: 500,
      },
      contained: ({ theme }) => ({
        // Primary gradient amber per brand guidelines
        background: theme.palette.primary.main === primary.main ? gradients.cta : undefined,
        boxShadow: "none",
        "&:hover": {
          background: theme.palette.primary.main === primary.main ? gradients.cta : undefined,
          filter: "brightness(1.05)",
          boxShadow: shadows.ctaGlow, // Amber-tinted shadow
        },
      }),
      outlined: {
        borderWidth: 1.5,
        "&:hover": {
          borderWidth: 1.5,
        },
      },
      sizeSmall: {
        padding: "6px 16px",
        fontSize: "0.8125rem",
      },
      sizeLarge: {
        padding: "14px 32px",
        fontSize: "1rem",
      },
    },
  },

  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },

  MuiFab: {
    styleOverrides: {
      root: {
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      },
    },
  },

  // =========================================================================
  // CARDS & PAPER
  // =========================================================================
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 16,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 4px 20px rgba(0,0,0,0.4)"
            : "0 4px 20px rgba(0,0,0,0.08)",
        backgroundImage: "none", // Remove default gradient
      }),
    },
  },

  MuiCardHeader: {
    styleOverrides: {
      title: {
        fontFamily: fontFamilies.heading,
        fontWeight: 600,
      },
    },
  },

  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: "none", // Remove default gradient
      },
      rounded: {
        borderRadius: 12,
      },
    },
  },

  // =========================================================================
  // CHIPS & BADGES
  // =========================================================================
  MuiChip: {
    styleOverrides: {
      root: {
        fontFamily: fontFamilies.heading,
        fontWeight: 500,
        borderRadius: shapes.full, // Pill shape per brand guidelines
      },
      sizeSmall: {
        fontSize: "0.75rem",
      },
    },
  },

  MuiBadge: {
    styleOverrides: {
      badge: {
        fontFamily: fontFamilies.heading,
        fontWeight: 600,
      },
    },
  },

  // =========================================================================
  // INPUTS & FORMS
  // =========================================================================
  MuiTextField: {
    defaultProps: {
      variant: "outlined",
    },
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          borderRadius: 8,
        },
      },
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderWidth: 2,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderWidth: 2,
        },
      },
    },
  },

  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontFamily: fontFamilies.body,
      },
    },
  },

  MuiFormHelperText: {
    styleOverrides: {
      root: {
        fontFamily: fontFamilies.body,
      },
    },
  },

  MuiSelect: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },

  // =========================================================================
  // DIALOGS & MODALS
  // =========================================================================
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 16,
      },
    },
  },

  MuiDialogTitle: {
    styleOverrides: {
      root: {
        fontFamily: fontFamilies.heading,
        fontWeight: 600,
        fontSize: "1.25rem",
      },
    },
  },

  // =========================================================================
  // TABS & NAVIGATION
  // =========================================================================
  MuiTab: {
    styleOverrides: {
      root: {
        fontFamily: fontFamilies.heading,
        fontWeight: 500,
        textTransform: "none",
        minHeight: 48,
      },
    },
  },

  MuiTabs: {
    styleOverrides: {
      indicator: {
        height: 3,
        borderRadius: "3px 3px 0 0",
      },
    },
  },

  MuiBottomNavigationAction: {
    styleOverrides: {
      root: {
        fontFamily: fontFamilies.heading,
      },
      label: {
        fontFamily: fontFamilies.heading,
        fontWeight: 500,
      },
    },
  },

  // =========================================================================
  // MENUS & LISTS
  // =========================================================================
  MuiMenu: {
    styleOverrides: {
      paper: {
        borderRadius: 12,
        marginTop: 8,
      },
    },
  },

  MuiMenuItem: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        margin: "0 8px",
        padding: "8px 16px",
      },
    },
  },

  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },

  // =========================================================================
  // TOOLTIPS & POPOVERS
  // =========================================================================
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        fontFamily: fontFamilies.body,
        borderRadius: 8,
        fontSize: "0.75rem",
      },
    },
  },

  MuiPopover: {
    styleOverrides: {
      paper: {
        borderRadius: 12,
      },
    },
  },

  // =========================================================================
  // ALERTS & SNACKBARS
  // =========================================================================
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 12,
      },
      message: {
        fontFamily: fontFamilies.body,
      },
    },
  },

  MuiSnackbar: {
    styleOverrides: {
      root: {
        "& .MuiPaper-root": {
          borderRadius: 12,
        },
      },
    },
  },

  // =========================================================================
  // AVATAR & SKELETON
  // =========================================================================
  MuiAvatar: {
    styleOverrides: {
      root: {
        fontFamily: fontFamilies.heading,
        fontWeight: 600,
      },
      rounded: {
        borderRadius: 12,
      },
    },
  },

  MuiSkeleton: {
    styleOverrides: {
      rounded: {
        borderRadius: 8,
      },
    },
  },

  // =========================================================================
  // APP BAR
  // =========================================================================
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundImage: "none",
      },
    },
  },

  // =========================================================================
  // DRAWER
  // =========================================================================
  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundImage: "none",
      },
    },
  },

  // =========================================================================
  // TYPOGRAPHY
  // =========================================================================
  MuiTypography: {
    defaultProps: {
      variantMapping: {
        h1: "h1",
        h2: "h2",
        h3: "h3",
        h4: "h4",
        h5: "h5",
        h6: "h6",
        subtitle1: "p",
        subtitle2: "p",
        body1: "p",
        body2: "p",
      },
    },
  },

  // =========================================================================
  // CSS BASELINE
  // =========================================================================
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarColor: "rgba(255,255,255,0.2) transparent",
        "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
          width: 8,
          height: 8,
        },
        "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
          borderRadius: 8,
          backgroundColor: "rgba(255,255,255,0.2)",
        },
        "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "rgba(255,255,255,0.3)",
        },
        "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
      },
    },
  },
};

export default componentOverrides;
