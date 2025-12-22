import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NavbarLinks, NavLinkItem } from "./NavbarLinks";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import GroupsIcon from "@mui/icons-material/Groups";
import PlaceIcon from "@mui/icons-material/Place";
import EventIcon from "@mui/icons-material/Event";
import { fn } from "storybook/test";

const defaultLinks: NavLinkItem[] = [
  { href: "/musicians", label: "Músicos" },
  { href: "/bands", label: "Bandas" },
  { href: "/venues", label: "Locales" },
  { href: "/events", label: "Eventos" },
];

const linksWithIcons: NavLinkItem[] = [
  { href: "/musicians", label: "Músicos", icon: <MusicNoteIcon fontSize="small" /> },
  { href: "/bands", label: "Bandas", icon: <GroupsIcon fontSize="small" /> },
  { href: "/venues", label: "Locales", icon: <PlaceIcon fontSize="small" /> },
  { href: "/events", label: "Eventos", icon: <EventIcon fontSize="small" /> },
];

const meta = {
  title: "Molecules/NavbarLinks",
  component: NavbarLinks,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "button"],
    },
    direction: {
      control: "select",
      options: ["row", "column"],
    },
    spacing: {
      control: { type: "range", min: 0, max: 6, step: 0.5 },
    },
  },
  args: {
    links: defaultLinks,
    onLinkClick: fn(),
  },
} satisfies Meta<typeof NavbarLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Enlaces por defecto (horizontal) */
export const Default: Story = {
  args: {
    links: defaultLinks,
  },
};

/** Con iconos */
export const WithIcons: Story = {
  args: {
    links: linksWithIcons,
  },
};

/** Variante pill */
export const PillVariant: Story = {
  args: {
    links: defaultLinks,
    variant: "pill",
  },
};

/** Layout vertical (para menú móvil) */
export const Vertical: Story = {
  args: {
    links: linksWithIcons,
    direction: "column",
    spacing: 1,
  },
};

/** Con enlace activo */
export const WithActiveLink: Story = {
  args: {
    links: [
      { href: "/musicians", label: "Músicos", active: true },
      { href: "/bands", label: "Bandas" },
      { href: "/venues", label: "Locales" },
      { href: "/events", label: "Eventos" },
    ],
  },
};

/** Variante pill con activo */
export const PillVariantWithActive: Story = {
  args: {
    links: [
      { href: "/musicians", label: "Músicos" },
      { href: "/bands", label: "Bandas", active: true },
      { href: "/venues", label: "Locales" },
      { href: "/events", label: "Eventos" },
    ],
    variant: "pill",
  },
};

/** Comparación de variantes */
export const VariantComparison: Story = {
  args: { links: [] },
  render: () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="overline" sx={{ mb: 1, display: "block" }}>
          Default Variant
        </Typography>
        <NavbarLinks
          links={[
            { href: "/musicians", label: "Músicos", active: true },
            { href: "/bands", label: "Bandas" },
            { href: "/venues", label: "Locales" },
          ]}
          variant="default"
        />
      </Box>
      <Box>
        <Typography variant="overline" sx={{ mb: 1, display: "block" }}>
          Pill Variant
        </Typography>
        <NavbarLinks
          links={[
            { href: "/musicians", label: "Músicos", active: true },
            { href: "/bands", label: "Bandas" },
            { href: "/venues", label: "Locales" },
          ]}
          variant="pill"
        />
      </Box>
    </Stack>
  ),
};

/** Responsive: Desktop vs Mobile */
export const ResponsiveComparison: Story = {
  args: { links: [] },
  render: () => (
    <Stack spacing={4} direction="row">
      <Box sx={{ minWidth: 300 }}>
        <Typography variant="overline" sx={{ mb: 2, display: "block" }}>
          Desktop (Row)
        </Typography>
        <Box sx={{ bgcolor: "background.paper", p: 2, borderRadius: 2 }}>
          <NavbarLinks links={linksWithIcons} direction="row" />
        </Box>
      </Box>
      <Box sx={{ minWidth: 200 }}>
        <Typography variant="overline" sx={{ mb: 2, display: "block" }}>
          Mobile (Column)
        </Typography>
        <Box sx={{ bgcolor: "background.paper", p: 2, borderRadius: 2 }}>
          <NavbarLinks links={linksWithIcons} direction="column" spacing={1.5} />
        </Box>
      </Box>
    </Stack>
  ),
};
