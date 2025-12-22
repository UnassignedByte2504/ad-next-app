import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { NavLink } from "./NavLink";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DownloadIcon from "@mui/icons-material/Download";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { neutral, fontFamilies, shadows } from "@/app/ui/theme";

const meta = {
  title: "Atoms/NavLink",
  component: NavLink,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "stone",
      values: [
        { name: "stone", value: neutral[50] },
        { name: "white", value: "#FFFFFF" },
      ],
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "pill", "vertical"],
      description: "Estilo del enlace: default (underline), pill (M3 filled), vertical (mobile drawer)",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Tamaño del enlace",
    },
    active: {
      control: "boolean",
      description: "Estado activo (sobreescribe detección automática)",
    },
    href: {
      control: "text",
    },
  },
  args: {
    onClick: fn(),
    size: "md",
  },
  decorators: [
    (Story) => (
      <nav className="p-4">
        <Story />
      </nav>
    ),
  ],
} satisfies Meta<typeof NavLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Enlace de navegación por defecto con underline animado */
export const Default: Story = {
  args: {
    href: "/",
    children: "Shop",
  },
};

/** Enlace en estado activo */
export const Active: Story = {
  args: {
    href: "/account",
    children: "Account",
    active: true,
  },
};

/** Enlace con icono */
export const WithIcon: Story = {
  args: {
    href: "/cart",
    children: "Cart",
    icon: <ShoppingCartIcon fontSize="small" />,
  },
};

/** Enlace con icono activo */
export const WithIconActive: Story = {
  args: {
    href: "/favorites",
    children: "Favorites",
    icon: <FavoriteIcon fontSize="small" />,
    active: true,
  },
};

/**
 * Variante Pill (M3 Expressive 2025)
 *
 * El indicador pill-shaped es el estándar de Material Design 3
 * para navigation bars. La animación usa physics-based springs.
 */
export const PillVariant: Story = {
  args: {
    href: "/categories",
    children: "Categories",
    variant: "pill",
    icon: <CategoryIcon fontSize="small" />,
  },
};

/** Pill activo con animación spring */
export const PillVariantActive: Story = {
  args: {
    href: "/cart",
    children: "Cart",
    variant: "pill",
    icon: <ShoppingCartIcon fontSize="small" />,
    active: true,
  },
};

/**
 * Variante Vertical (para Mobile Drawer / Navigation Rail)
 *
 * Usado en menús laterales expandidos. El indicador activo
 * aparece como una barra vertical a la izquierda.
 */
export const VerticalVariant: Story = {
  args: {
    href: "/downloads",
    children: "Downloads",
    variant: "vertical",
    icon: <DownloadIcon />,
  },
};

/** Vertical activo con indicador lateral */
export const VerticalVariantActive: Story = {
  args: {
    href: "/account",
    children: "Account",
    variant: "vertical",
    icon: <PersonIcon />,
    active: true,
  },
};

/** Tamaños disponibles */
export const Sizes: Story = {
  args: { href: "#", children: "Link" },
  render: () => (
    <Stack direction="row" spacing={4} alignItems="center">
      <NavLink href="/sm" size="sm" icon={<CategoryIcon />}>
        Small
      </NavLink>
      <NavLink href="/md" size="md" icon={<CategoryIcon />}>
        Medium
      </NavLink>
      <NavLink href="/lg" size="lg" icon={<CategoryIcon />}>
        Large
      </NavLink>
    </Stack>
  ),
};

/**
 * Storefront Navigation Bar (M3 2025)
 *
 * Demostración de la navegación principal de Ayla Designs con pill indicators
 * animados. Haz clic en los enlaces para ver la animación del
 * pill moviéndose entre items.
 */
export const NavigationBarPill: Story = {
  args: { href: "#", children: "Link" },
  render: function NavigationBarPillDemo() {
    const [activeLink, setActiveLink] = useState("/shop");

    const links = [
      { href: "/shop", label: "Shop", icon: <HomeIcon fontSize="small" /> },
      { href: "/categories", label: "Categories", icon: <CategoryIcon fontSize="small" /> },
      { href: "/favorites", label: "Favorites", icon: <FavoriteIcon fontSize="small" /> },
      { href: "/cart", label: "Cart", icon: <ShoppingCartIcon fontSize="small" /> },
      { href: "/account", label: "Account", icon: <PersonIcon fontSize="small" /> },
    ];

    return (
      <Box sx={{ p: 3, bgcolor: neutral[0], borderRadius: 3, boxShadow: shadows.sm }}>
        <Typography
          variant="caption"
          sx={{ mb: 2, display: "block", color: neutral[500], fontFamily: fontFamilies.body }}
        >
          Haz clic para ver la animación del pill indicator
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              variant="pill"
              active={activeLink === link.href}
              onClick={() => setActiveLink(link.href)}
            >
              {link.label}
            </NavLink>
          ))}
        </Stack>
      </Box>
    );
  },
};

/** Barra de navegación con underline (estilo clásico) */
export const NavigationBarUnderline: Story = {
  args: { href: "#", children: "Link" },
  render: function NavigationBarUnderlineDemo() {
    const [activeLink, setActiveLink] = useState("/shop");

    const links = [
      { href: "/shop", label: "Shop", icon: <HomeIcon fontSize="small" /> },
      { href: "/categories", label: "Categories", icon: <CategoryIcon fontSize="small" /> },
      { href: "/cart", label: "Cart", icon: <ShoppingCartIcon fontSize="small" /> },
      { href: "/account", label: "Account", icon: <PersonIcon fontSize="small" /> },
    ];

    return (
      <Stack direction="row" spacing={3} alignItems="center">
        {links.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            icon={link.icon}
            variant="default"
            active={activeLink === link.href}
            onClick={() => setActiveLink(link.href)}
          >
            {link.label}
          </NavLink>
        ))}
      </Stack>
    );
  },
};

/**
 * Navigation Rail / Mobile Drawer
 *
 * Estilo vertical para menús laterales expandidos,
 * siguiendo el patrón M3 Expanded Navigation Rail.
 * Usado en el panel de cuenta del cliente.
 */
export const NavigationRail: Story = {
  args: { href: "#", children: "Link" },
  render: function NavigationRailDemo() {
    const [activeLink, setActiveLink] = useState("/account");

    const links = [
      { href: "/shop", label: "Shop", icon: <HomeIcon /> },
      { href: "/categories", label: "Categories", icon: <CategoryIcon /> },
      { href: "/favorites", label: "Favorites", icon: <FavoriteIcon /> },
      { href: "/downloads", label: "Downloads", icon: <DownloadIcon /> },
      { href: "/cart", label: "Cart", icon: <ShoppingCartIcon /> },
      { href: "/account", label: "Account", icon: <PersonIcon /> },
    ];

    return (
      <Box
        sx={{
          width: 280,
          bgcolor: neutral[0],
          borderRadius: 3,
          py: 2,
          boxShadow: shadows.sm,
        }}
      >
        <Stack spacing={0.5} sx={{ px: 1 }}>
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              variant="vertical"
              active={activeLink === link.href}
              onClick={() => setActiveLink(link.href)}
            >
              {link.label}
            </NavLink>
          ))}
        </Stack>
      </Box>
    );
  },
};

/** Comparación de todas las variantes */
export const AllVariants: Story = {
  args: { href: "#", children: "Link" },
  render: () => (
    <Stack spacing={4}>
      <Box>
        <Typography
          variant="overline"
          gutterBottom
          sx={{ color: neutral[500], fontFamily: fontFamilies.body }}
        >
          Default (Underline)
        </Typography>
        <Stack direction="row" spacing={3}>
          <NavLink href="/shop" variant="default">Shop</NavLink>
          <NavLink href="/cart" variant="default" active>Cart</NavLink>
          <NavLink href="/account" variant="default" icon={<PersonIcon fontSize="small" />}>Account</NavLink>
        </Stack>
      </Box>

      <Box>
        <Typography
          variant="overline"
          gutterBottom
          sx={{ color: neutral[500], fontFamily: fontFamilies.body }}
        >
          Pill (M3 Expressive)
        </Typography>
        <Stack direction="row" spacing={2}>
          <NavLink href="/categories" variant="pill">Categories</NavLink>
          <NavLink href="/favorites" variant="pill" active>Favorites</NavLink>
          <NavLink href="/cart" variant="pill" icon={<ShoppingCartIcon fontSize="small" />}>Cart</NavLink>
        </Stack>
      </Box>

      <Box>
        <Typography
          variant="overline"
          gutterBottom
          sx={{ color: neutral[500], fontFamily: fontFamilies.body }}
        >
          Vertical (Navigation Rail)
        </Typography>
        <Box sx={{ width: 200 }}>
          <Stack spacing={0.5}>
            <NavLink href="/shop" variant="vertical" icon={<HomeIcon />}>Shop</NavLink>
            <NavLink href="/downloads" variant="vertical" icon={<DownloadIcon />} active>Downloads</NavLink>
          </Stack>
        </Box>
      </Box>
    </Stack>
  ),
};
