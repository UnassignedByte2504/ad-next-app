import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { Chip } from "./Chip";
import Stack from "@mui/material/Stack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import InstagramIcon from "@mui/icons-material/Instagram";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BrushIcon from "@mui/icons-material/Brush";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { categoryColors, neutral } from "@/app/ui/theme";

const meta: Meta<typeof Chip> = {
  title: "Atoms/Chip",
  component: Chip,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "stone",
      values: [
        { name: "stone", value: neutral[50] },
        { name: "white", value: "#FFFFFF" },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["filled", "outlined"],
    },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "error", "warning", "info", "success"],
    },
    size: {
      control: "select",
      options: ["small", "medium"],
    },
    clickable: {
      control: "boolean",
    },
    selected: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

/** Chip por defecto */
export const Default: Story = {
  args: {
    label: "Planners",
  },
};

/** Chip outlined */
export const Outlined: Story = {
  args: {
    label: "Branding",
    variant: "outlined",
  },
};

/** Diferentes colores */
export const Colors: Story = {
  render: () => (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      <Chip label="Default" color="default" />
      <Chip label="Primary" color="primary" />
      <Chip label="Secondary" color="secondary" />
      <Chip label="Success" color="success" />
      <Chip label="Error" color="error" />
      <Chip label="Warning" color="warning" />
      <Chip label="Info" color="info" />
    </Stack>
  ),
};

/** Chip clickeable */
export const Clickable: Story = {
  args: {
    label: "Social Media",
    clickable: true,
    variant: "outlined",
    onClick: fn(),
  },
};

/** Chip seleccionado */
export const Selected: Story = {
  args: {
    label: "Bodas",
    selected: true,
    clickable: true,
  },
};

/** Chip con icono */
export const WithIcon: Story = {
  args: {
    label: "Planners",
    icon: <CalendarMonthIcon />,
    variant: "outlined",
  },
};

/** Chip eliminable */
export const Deletable: Story = {
  args: {
    label: "Tarjetas",
    onDelete: fn(),
  },
};

/** Categorías de productos */
export const ProductCategories: Story = {
  render: () => (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      <Chip label="Planners" clickable variant="outlined" />
      <Chip label="Tarjetas" clickable variant="outlined" />
      <Chip label="Social Media" clickable selected />
      <Chip label="Bodas" clickable variant="outlined" />
      <Chip label="Branding" clickable variant="outlined" />
      <Chip label="Thank You" clickable variant="outlined" />
    </Stack>
  ),
};

/** Categorías con iconos */
export const CategoriesWithIcons: Story = {
  render: () => (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      <Chip label="Planners" icon={<CalendarMonthIcon />} color="primary" variant="outlined" />
      <Chip label="Tarjetas" icon={<CardGiftcardIcon />} color="secondary" variant="outlined" />
      <Chip label="Social Media" icon={<InstagramIcon />} color="secondary" variant="outlined" />
      <Chip label="Bodas" icon={<FavoriteIcon />} color="error" variant="outlined" />
      <Chip label="Branding" icon={<BrushIcon />} color="warning" variant="outlined" />
    </Stack>
  ),
};

/** Tamaños */
export const Sizes: Story = {
  render: () => (
    <Stack direction="row" spacing={1} alignItems="center">
      <Chip label="Descuento 20%" size="small" color="primary" />
      <Chip label="Nuevo" size="medium" color="secondary" />
    </Stack>
  ),
};

/** Categorías con colores del tema - usando categoryColors tokens */
export const CategoryColorsCustom: Story = {
  render: () => (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      <Chip
        label="Planners"
        sx={{
          bgcolor: `${categoryColors.Planners}4D`, // 30% opacity
          color: neutral[700],
          "&:hover": { bgcolor: `${categoryColors.Planners}66` }, // 40% opacity on hover
        }}
      />
      <Chip
        label="Tarjetas"
        sx={{
          bgcolor: `${categoryColors.Tarjetas}4D`,
          color: neutral[700],
          "&:hover": { bgcolor: `${categoryColors.Tarjetas}66` },
        }}
      />
      <Chip
        label="Social Media"
        sx={{
          bgcolor: `${categoryColors["Social Media"]}4D`,
          color: neutral[700],
          "&:hover": { bgcolor: `${categoryColors["Social Media"]}66` },
        }}
      />
      <Chip
        label="Bodas"
        sx={{
          bgcolor: `${categoryColors.Bodas}4D`,
          color: neutral[700],
          "&:hover": { bgcolor: `${categoryColors.Bodas}66` },
        }}
      />
      <Chip
        label="Branding"
        sx={{
          bgcolor: `${categoryColors.Branding}4D`,
          color: neutral[700],
          "&:hover": { bgcolor: `${categoryColors.Branding}66` },
        }}
      />
      <Chip
        label="Thank You"
        sx={{
          bgcolor: `${categoryColors["Thank You"]}4D`,
          color: neutral[700],
          "&:hover": { bgcolor: `${categoryColors["Thank You"]}66` },
        }}
      />
    </Stack>
  ),
};

/** Tags de producto */
export const ProductTags: Story = {
  render: () => (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      <Chip label="Nuevo" color="success" size="small" icon={<LocalOfferIcon />} />
      <Chip label="Popular" color="primary" size="small" />
      <Chip label="Oferta" color="error" size="small" />
      <Chip label="Descargable" color="info" size="small" variant="outlined" />
      <Chip label="Editable" color="secondary" size="small" variant="outlined" />
    </Stack>
  ),
};

/** Filtros seleccionables */
export const SelectableFilters: Story = {
  render: () => (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      <Chip label="Digital" clickable selected />
      <Chip label="Imprimible" clickable variant="outlined" />
      <Chip label="PDF" clickable selected />
      <Chip label="Canva" clickable variant="outlined" />
      <Chip label="PowerPoint" clickable variant="outlined" />
    </Stack>
  ),
};
