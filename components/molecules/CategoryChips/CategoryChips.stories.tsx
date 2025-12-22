import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import PaletteIcon from "@mui/icons-material/Palette";
import CampaignIcon from "@mui/icons-material/Campaign";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { CategoryChips, type CategoryItem } from "./CategoryChips";

const meta: Meta<typeof CategoryChips> = {
  title: "Molecules/CategoryChips",
  component: CategoryChips,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A group of selectable category chips with M3 Expressive animations.

## Features
- **Staggered Entrance Animation**: Chips animate in with staggered timing
- **Shape Morphing**: Selected chips morph from pill to rounded shape
- **Spring Physics**: Natural, bouncy interactions
- **Single or Multi-select**: Support for both selection modes
- **Reduced Motion Support**: Respects user's motion preferences
- **Accessible**: Focus ring and keyboard navigation

## Usage
Use CategoryChips for filtering products, selecting categories, or any tag-based selection interface.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    categories: {
      control: false,
      description: "Array of category items to display",
    },
    selected: {
      control: "text",
      description: "Currently selected category key(s)",
    },
    multiple: {
      control: "boolean",
      description: "Allow multiple selections",
    },
    size: {
      control: "select",
      options: ["small", "medium"],
      description: "Chip size",
    },
    direction: {
      control: "select",
      options: ["row", "column"],
      description: "Layout direction",
    },
    align: {
      control: "select",
      options: ["start", "center", "end"],
      description: "Content alignment",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// SAMPLE DATA
// =============================================================================

const aylaCategories: CategoryItem[] = [
  { key: "invitations", label: "Invitation Suites" },
  { key: "digitalArt", label: "Digital Art" },
  { key: "socialMedia", label: "Social Media Templates" },
  { key: "planners", label: "Planners & Journals" },
  { key: "stickers", label: "Digital Stickers" },
  { key: "wallArt", label: "Wall Art Prints" },
  { key: "branding", label: "Branding Kits" },
  { key: "cards", label: "Greeting Cards" },
];

const shortCategories: CategoryItem[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "popular", label: "Popular" },
  { key: "sale", label: "On Sale" },
];

const categoriesWithIcons: CategoryItem[] = [
  { key: "invitations", label: "Invitations", icon: <CardGiftcardIcon /> },
  { key: "art", label: "Digital Art", icon: <PaletteIcon /> },
  { key: "social", label: "Social Media", icon: <CampaignIcon /> },
  { key: "planners", label: "Planners", icon: <CalendarMonthIcon /> },
];

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default category chips with no selection
 */
export const Default: Story = {
  args: {
    categories: aylaCategories,
    size: "medium",
    align: "center",
  },
};

/**
 * With single selection - Interactive demo
 */
export const SingleSelection: Story = {
  render: () => {
    const [selected, setSelected] = useState<string>("invitations");

    return (
      <Box sx={{ maxWidth: 600 }}>
        <CategoryChips
          categories={aylaCategories}
          selected={selected}
          onSelect={setSelected}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 3, textAlign: "center" }}
        >
          Selected: <strong>{selected}</strong>
        </Typography>
      </Box>
    );
  },
};

/**
 * With multiple selection - Interactive demo
 */
export const MultipleSelection: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(["invitations", "art"]);

    const handleToggle = (key: string) => {
      setSelected((prev) =>
        prev.includes(key)
          ? prev.filter((k) => k !== key)
          : [...prev, key]
      );
    };

    return (
      <Box sx={{ maxWidth: 600 }}>
        <CategoryChips
          categories={aylaCategories}
          selected={selected}
          onSelect={handleToggle}
          multiple
        />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 3, textAlign: "center" }}
        >
          Selected: <strong>{selected.join(", ") || "None"}</strong>
        </Typography>
      </Box>
    );
  },
};

/**
 * Small size chips
 */
export const SmallSize: Story = {
  args: {
    categories: shortCategories,
    selected: "all",
    size: "small",
    align: "center",
  },
};

/**
 * Column layout with left alignment
 */
export const ColumnLayout: Story = {
  args: {
    categories: shortCategories,
    selected: "popular",
    direction: "column",
    align: "start",
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: 200 }}>
        <Story />
      </Box>
    ),
  ],
};

/**
 * Different alignments
 */
export const Alignments: Story = {
  render: () => (
    <Box sx={{ width: 500, display: "flex", flexDirection: "column", gap: 4 }}>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
          align="start"
        </Typography>
        <CategoryChips categories={shortCategories} selected="all" align="start" />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
          align="center"
        </Typography>
        <CategoryChips categories={shortCategories} selected="new" align="center" />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
          align="end"
        </Typography>
        <CategoryChips categories={shortCategories} selected="popular" align="end" />
      </Box>
    </Box>
  ),
};

/**
 * Ayla Designs product categories
 */
export const AylaProductCategories: Story = {
  render: () => {
    const [selected, setSelected] = useState<string>("invitations");

    return (
      <Box sx={{ maxWidth: 700, textAlign: "center" }}>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
          Explore Our Collections
        </Typography>
        <CategoryChips
          categories={aylaCategories}
          selected={selected}
          onSelect={setSelected}
        />
      </Box>
    );
  },
};

/**
 * Filter bar example
 */
export const FilterBar: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(["new"]);

    const handleToggle = (key: string) => {
      if (key === "all") {
        setSelected([]);
        return;
      }
      setSelected((prev) =>
        prev.includes(key)
          ? prev.filter((k) => k !== key)
          : [...prev, key]
      );
    };

    const filterCategories = [
      { key: "all", label: "All Products" },
      { key: "new", label: "New Arrivals" },
      { key: "bestseller", label: "Bestsellers" },
      { key: "sale", label: "On Sale" },
      { key: "free", label: "Free Downloads" },
    ];

    return (
      <Box sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
          Filter by:
        </Typography>
        <CategoryChips
          categories={filterCategories}
          selected={selected}
          onSelect={handleToggle}
          multiple
          align="start"
          size="small"
        />
      </Box>
    );
  },
};

/**
 * Many chips - wrapping behavior
 */
export const ManyChips: Story = {
  args: {
    categories: [
      ...aylaCategories,
      { key: "templates", label: "Templates" },
      { key: "mockups", label: "Mockups" },
      { key: "fonts", label: "Font Pairings" },
      { key: "textures", label: "Textures" },
    ],
    selected: "invitations",
    align: "center",
  },
  decorators: [
    (Story) => (
      <Box sx={{ maxWidth: 500 }}>
        <Story />
      </Box>
    ),
  ],
};
