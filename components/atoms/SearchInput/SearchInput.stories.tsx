import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { SearchInput } from "./SearchInput";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { createTranslator } from "next-intl";
import storybookMessages from "@/messages/es/storybook.json";
import componentMessages from "@/messages/es/components.json";

const storyLocale = "es";
const storyT = createTranslator({
  locale: storyLocale,
  messages: storybookMessages,
  namespace: "SearchInput",
});
const componentT = createTranslator({
  locale: storyLocale,
  messages: componentMessages,
  namespace: "searchInput",
});

const meta = {
  title: "Atoms/SearchInput",
  component: SearchInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: "select",
      options: ["outlined", "filled"],
    },
    showButton: {
      control: "boolean",
    },
    loading: {
      control: "boolean",
    },
    fullWidth: {
      control: "boolean",
    },
  },
  args: {
    onChange: fn(),
    onSearch: fn(),
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Input de búsqueda por defecto */
export const Default: Story = {
  args: {
    placeholder: componentT("placeholder"),
  },
};

/** Input con valor inicial */
export const WithValue: Story = {
  args: {
    value: storyT("values.withValue"),
    placeholder: componentT("placeholder"),
  },
};

/** Input tamaño pequeño */
export const Small: Story = {
  args: {
    size: "sm",
    placeholder: storyT("placeholders.sizes.sm"),
  },
};

/** Input tamaño grande */
export const Large: Story = {
  args: {
    size: "lg",
    placeholder: storyT("placeholders.extended"),
  },
};

/** Variante filled */
export const FilledVariant: Story = {
  args: {
    variant: "filled",
    placeholder: componentT("placeholder"),
  },
};

/** Con botón de búsqueda */
export const WithButton: Story = {
  args: {
    placeholder: componentT("placeholder"),
    showButton: true,
  },
};

/** Estado de carga */
export const Loading: Story = {
  args: {
    placeholder: storyT("placeholders.loading"),
    loading: true,
    value: storyT("values.loading"),
  },
};

/** Ancho completo */
export const FullWidth: Story = {
  args: {
    placeholder: componentT("placeholder"),
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: 400 }}>
        <Story />
      </Box>
    ),
  ],
};

/** Diferentes tamaños */
export const Sizes: Story = {
  args: {},
  render: () => (
    <Stack spacing={2} sx={{ width: 400 }}>
      <SearchInput size="sm" placeholder={storyT("placeholders.sizes.sm")} fullWidth />
      <SearchInput size="md" placeholder={storyT("placeholders.sizes.md")} fullWidth />
      <SearchInput size="lg" placeholder={storyT("placeholders.sizes.lg")} fullWidth />
    </Stack>
  ),
};

/** Diferentes variantes */
export const Variants: Story = {
  args: {},
  render: () => (
    <Stack spacing={2} sx={{ width: 400 }}>
      <SearchInput variant="outlined" placeholder={storyT("placeholders.outlined")} fullWidth />
      <SearchInput variant="filled" placeholder={storyT("placeholders.filled")} fullWidth />
    </Stack>
  ),
};

/** Con botón y cargando */
export const WithButtonAndLoading: Story = {
  args: {
    placeholder: componentT("placeholder"),
    showButton: true,
    loading: true,
    value: storyT("values.buttonLoading"),
  },
};

/** Ejemplo de uso real */
export const RealWorldExample: Story = {
  args: {},
  render: () => (
    <Box sx={{ width: 500 }}>
      <SearchInput
        size="lg"
        placeholder={storyT("placeholders.extended")}
        showButton
        fullWidth
      />
    </Box>
  ),
};
