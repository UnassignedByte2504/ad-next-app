import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { Toast } from "./Toast";

const meta: Meta<typeof Toast> = {
  title: "Atoms/Toast",
  component: Toast,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Toast notification component for temporary feedback messages.

## Features
- **M3 Expressive Animations**: Spring physics for smooth enter/exit
- **Multiple Variants**: success, info, warning, error
- **Auto-dismiss**: Parent controls visibility with timeout
- **Accessible**: Semantic colors and clear iconography

## Usage
Use Toast for temporary feedback after user actions like adding to cart,
saving changes, or displaying errors.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    message: {
      control: "text",
      description: "Toast message to display",
    },
    isVisible: {
      control: "boolean",
      description: "Whether the toast is visible",
    },
    variant: {
      control: "select",
      options: ["success", "info", "warning", "error"],
      description: "Toast variant",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default success toast
 */
export const Default: Story = {
  args: {
    message: "Item added to cart!",
    isVisible: true,
    variant: "success",
  },
  decorators: [
    (Story) => (
      <Box sx={{ height: 200, position: "relative" }}>
        <Story />
      </Box>
    ),
  ],
};

/**
 * Success variant
 */
export const Success: Story = {
  args: {
    message: "Changes saved successfully!",
    isVisible: true,
    variant: "success",
  },
  decorators: [
    (Story) => (
      <Box sx={{ height: 200, position: "relative" }}>
        <Story />
      </Box>
    ),
  ],
};

/**
 * Info variant
 */
export const Info: Story = {
  args: {
    message: "Processing your request...",
    isVisible: true,
    variant: "info",
  },
  decorators: [
    (Story) => (
      <Box sx={{ height: 200, position: "relative" }}>
        <Story />
      </Box>
    ),
  ],
};

/**
 * Warning variant
 */
export const Warning: Story = {
  args: {
    message: "Please review your information",
    isVisible: true,
    variant: "warning",
  },
  decorators: [
    (Story) => (
      <Box sx={{ height: 200, position: "relative" }}>
        <Story />
      </Box>
    ),
  ],
};

/**
 * Error variant
 */
export const Error: Story = {
  args: {
    message: "Something went wrong. Please try again.",
    isVisible: true,
    variant: "error",
  },
  decorators: [
    (Story) => (
      <Box sx={{ height: 200, position: "relative" }}>
        <Story />
      </Box>
    ),
  ],
};

/**
 * All variants side by side (for documentation)
 */
export const AllVariants: Story = {
  render: () => (
    <Box sx={{ height: 400, position: "relative" }}>
      <Stack spacing={2} sx={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)" }}>
        <Toast message="Success message" isVisible variant="success" />
      </Stack>
    </Box>
  ),
};

/**
 * Interactive demo - click buttons to show toasts
 */
export const Interactive: Story = {
  render: () => {
    const [toast, setToast] = useState<{
      visible: boolean;
      message: string;
      variant: "success" | "info" | "warning" | "error";
    }>({
      visible: false,
      message: "",
      variant: "success",
    });

    const showToast = (
      message: string,
      variant: "success" | "info" | "warning" | "error"
    ) => {
      setToast({ visible: true, message, variant });
      setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 2500);
    };

    return (
      <Box sx={{ height: 300, p: 4 }}>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            color="success"
            onClick={() => showToast("Added to cart!", "success")}
          >
            Show Success
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={() => showToast("Processing...", "info")}
          >
            Show Info
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => showToast("Check your input", "warning")}
          >
            Show Warning
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => showToast("Error occurred!", "error")}
          >
            Show Error
          </Button>
        </Stack>
        <Toast
          message={toast.message}
          isVisible={toast.visible}
          variant={toast.variant}
        />
      </Box>
    );
  },
};

/**
 * Ayla Designs cart toast example
 */
export const AylaCartToast: Story = {
  render: () => {
    const [visible, setVisible] = useState(false);

    const handleAddToCart = () => {
      setVisible(true);
      setTimeout(() => setVisible(false), 2500);
    };

    return (
      <Box sx={{ height: 300, p: 4, textAlign: "center" }}>
        <Button
          variant="contained"
          onClick={handleAddToCart}
          sx={{
            bgcolor: "#F59E0B",
            "&:hover": { bgcolor: "#D97706" },
          }}
        >
          Add to Cart
        </Button>
        <Toast
          message="Celestial Planner added to cart!"
          isVisible={visible}
          variant="success"
        />
      </Box>
    );
  },
};
