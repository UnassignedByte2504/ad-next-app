import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import IconButton from "@mui/material/IconButton";

import { Input } from "./Input";
import { neutral, fontFamilies } from "@/app/ui/theme";

// =============================================================================
// STATEFUL WRAPPER COMPONENTS (for hooks in stories)
// =============================================================================

function PasswordWithToggleDemo() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box sx={{ width: 320 }}>
      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="Enter your password"
        startAdornment={<LockIcon />}
        endAdornment={
          <IconButton
            size="small"
            onClick={() => setShowPassword(!showPassword)}
            sx={{ p: 0.5, color: "inherit" }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        }
      />
    </Box>
  );
}

function ClearableDemo() {
  const [value, setValue] = useState("Type something...");

  return (
    <Box sx={{ width: 320 }}>
      <Input
        label="Clearable input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue("")}
        clearable
      />
    </Box>
  );
}

function LiveValidationDemo() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showError = touched && email && !isValid;
  const showSuccess = touched && !!email && isValid;

  return (
    <Box sx={{ width: 320 }}>
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setTouched(true)}
        startAdornment={<EmailIcon />}
        error={showError ? "Please enter a valid email" : undefined}
        success={showSuccess}
        helperText={
          showSuccess ? "Valid email address" : "We'll never share your email"
        }
        clearable
        onClear={() => {
          setEmail("");
          setTouched(false);
        }}
      />
    </Box>
  );
}

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof Input> = {
  title: "Atoms/Input",
  component: Input,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "stone",
      values: [
        { name: "stone", value: neutral[50] },
        { name: "white", value: "#FFFFFF" },
      ],
    },
    docs: {
      description: {
        component: `
Ayla Designs' elegant text input atom with bohemian aesthetic.

## Features
- **Floating Label**: Animated label that elegantly floats on focus
- **Spring Animations**: Natural physics-based animations for smooth interactions
- **Two Variants**: Filled (subtle background) and Outlined (border-focused)
- **Three Sizes**: sm, md, lg for different contexts
- **Rich States**: Focus, error, success, disabled with clear visual feedback
- **Adornments**: Leading/trailing icons or custom elements
- **Clearable**: Optional clear button for easy content reset
- **Character Count**: Built-in maxLength counter
- **Accessibility**: Full ARIA support and keyboard navigation

## Design Philosophy
This input embodies Ayla's "Magical Professionalism" brand - bohemian warmth with elegant functionality.
The amber focus state represents creative energy and professional excellence.

## Ayla Brand Features
- Light backgrounds (stone.50 #FAFAF9, stone.100 #F5F5F4)
- Amber (#F59E0B) focus states
- Rose (#F43F5E) error states
- Stone palette for neutrals (warmer than gray)
- Rounded corners (8-12px) for soft, approachable feel
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Input size variant",
    },
    variant: {
      control: "select",
      options: ["filled", "outlined"],
      description: "Visual style variant",
    },
    label: {
      control: "text",
      description: "Floating label text",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    helperText: {
      control: "text",
      description: "Helper text below input",
    },
    error: {
      control: "text",
      description: "Error message (activates error state)",
    },
    success: {
      control: "boolean",
      description: "Success state",
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
    },
    clearable: {
      control: "boolean",
      description: "Show clear button when has value",
    },
    showCount: {
      control: "boolean",
      description: "Show character count (requires maxLength)",
    },
    fullWidth: {
      control: "boolean",
      description: "Full width input",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// BASIC STORIES
// =============================================================================

/**
 * Default filled input with floating label
 */
export const Default: Story = {
  args: {
    label: "Email",
    placeholder: "Enter your email",
    size: "md",
    variant: "filled",
  },
  render: (args) => (
    <Box sx={{ width: 320 }}>
      <Input {...args} />
    </Box>
  ),
};

/**
 * Outlined variant - minimal, border-focused design
 */
export const Outlined: Story = {
  args: {
    label: "Email address",
    placeholder: "you@example.com",
    variant: "outlined",
  },
  render: (args) => (
    <Box sx={{ width: 320 }}>
      <Input {...args} />
    </Box>
  ),
};

/**
 * With helper text providing guidance
 */
export const WithHelperText: Story = {
  args: {
    label: "Password",
    type: "password",
    helperText: "Must be at least 8 characters",
  },
  render: (args) => (
    <Box sx={{ width: 320 }}>
      <Input {...args} />
    </Box>
  ),
};

/**
 * Error state with validation message
 */
export const WithError: Story = {
  args: {
    label: "Email",
    defaultValue: "invalid-email",
    error: "Please enter a valid email address",
  },
  render: (args) => (
    <Box sx={{ width: 320 }}>
      <Input {...args} />
    </Box>
  ),
};

/**
 * Success state for validated fields
 */
export const WithSuccess: Story = {
  args: {
    label: "Email",
    defaultValue: "ayla@example.com",
    helperText: "Email is valid!",
    success: true,
  },
  render: (args) => (
    <Box sx={{ width: 320 }}>
      <Input {...args} />
    </Box>
  ),
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    label: "Email",
    defaultValue: "disabled@example.com",
    disabled: true,
  },
  render: (args) => (
    <Box sx={{ width: 320 }}>
      <Input {...args} />
    </Box>
  ),
};

// =============================================================================
// ADORNMENTS
// =============================================================================

/**
 * With leading icon (start adornment)
 */
export const WithStartAdornment: Story = {
  args: {
    label: "Search products",
    placeholder: "Planners, cards, branding kits...",
    startAdornment: <SearchIcon />,
    clearable: true,
  },
  render: (args) => (
    <Box sx={{ width: 320 }}>
      <Input {...args} />
    </Box>
  ),
};

/**
 * With trailing icon (end adornment)
 */
export const WithEndAdornment: Story = {
  args: {
    label: "Promo code",
    placeholder: "Enter discount code",
    endAdornment: <LocalOfferIcon />,
  },
  render: (args) => (
    <Box sx={{ width: 320 }}>
      <Input {...args} />
    </Box>
  ),
};

/**
 * Password input with visibility toggle
 */
export const PasswordWithToggle: Story = {
  render: () => <PasswordWithToggleDemo />,
};

// =============================================================================
// SIZES
// =============================================================================

/**
 * All size variants comparison
 */
export const SizeComparison: Story = {
  render: () => (
    <Stack spacing={3} sx={{ width: 320 }}>
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 1, display: "block" }}
        >
          Small (sm) - Compact UI
        </Typography>
        <Input label="Small input" placeholder="Compact size" size="sm" />
      </Box>
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 1, display: "block" }}
        >
          Medium (md) - Default
        </Typography>
        <Input label="Medium input" placeholder="Default size" size="md" />
      </Box>
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 1, display: "block" }}
        >
          Large (lg) - Prominent forms
        </Typography>
        <Input label="Large input" placeholder="Prominent size" size="lg" />
      </Box>
    </Stack>
  ),
};

// =============================================================================
// VARIANTS
// =============================================================================

/**
 * Variant comparison - Filled vs Outlined
 */
export const VariantComparison: Story = {
  render: () => (
    <Stack spacing={4} sx={{ width: 350 }}>
      <Box>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ mb: 2, display: "block" }}
        >
          Filled Variant
        </Typography>
        <Stack spacing={2}>
          <Input
            label="Product search"
            placeholder="Search our collection"
            variant="filled"
            startAdornment={<SearchIcon />}
          />
          <Input
            label="With error"
            variant="filled"
            defaultValue="abc"
            error="Please enter at least 3 characters"
          />
        </Stack>
      </Box>
      <Box>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ mb: 2, display: "block" }}
        >
          Outlined Variant
        </Typography>
        <Stack spacing={2}>
          <Input
            label="Product search"
            placeholder="Search our collection"
            variant="outlined"
            startAdornment={<SearchIcon />}
          />
          <Input
            label="With error"
            variant="outlined"
            defaultValue="abc"
            error="Please enter at least 3 characters"
          />
        </Stack>
      </Box>
    </Stack>
  ),
};

// =============================================================================
// FEATURES
// =============================================================================

/**
 * Clearable input with clear button
 */
export const Clearable: Story = {
  render: () => <ClearableDemo />,
};

/**
 * Character count with maxLength
 */
export const WithCharacterCount: Story = {
  args: {
    label: "Review",
    placeholder: "Share your thoughts about this product...",
    maxLength: 200,
    showCount: true,
    helperText: "Write a helpful review for other customers",
  },
  render: (args) => (
    <Box sx={{ width: 320 }}>
      <Input {...args} />
    </Box>
  ),
};

/**
 * Full width input for forms
 */
export const FullWidth: Story = {
  args: {
    label: "Full width input",
    placeholder: "Stretches to container width",
    fullWidth: true,
  },
  render: (args) => (
    <Box sx={{ width: 500, p: 3, bgcolor: neutral[50], borderRadius: 2 }}>
      <Input {...args} />
    </Box>
  ),
};

// =============================================================================
// INTERACTIVE DEMOS
// =============================================================================

/**
 * Form field examples - realistic usage
 */
export const FormFieldsDemo: Story = {
  render: () => (
    <Box
      sx={{
        width: 400,
        p: 4,
        bgcolor: "white",
        borderRadius: 3,
        border: 1,
        borderColor: neutral[200],
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          fontWeight: 600,
          fontFamily: fontFamilies.heading,
          color: neutral[900]
        }}
      >
        Checkout Information
      </Typography>
      <Stack spacing={3}>
        <Input
          label="Full name"
          placeholder="Your name"
          startAdornment={<PersonIcon />}
          fullWidth
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          startAdornment={<EmailIcon />}
          helperText="Order confirmation will be sent to this email"
          fullWidth
        />
        <Input
          label="Search products"
          placeholder="Planners, cards, branding kits..."
          startAdornment={<SearchIcon />}
          clearable
          fullWidth
        />
        <Input
          label="Promo code"
          placeholder="Enter discount code"
          startAdornment={<LocalOfferIcon />}
          fullWidth
        />
      </Stack>
    </Box>
  ),
};

/**
 * States showcase - all input states
 */
export const AllStates: Story = {
  render: () => (
    <Stack spacing={3} sx={{ width: 320 }}>
      <Box>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Default
        </Typography>
        <Input label="Default state" placeholder="Type here..." />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          With Value
        </Typography>
        <Input label="Has value" defaultValue="Some content" />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Error State
        </Typography>
        <Input
          label="Error state"
          defaultValue="Invalid input"
          error="This field has an error"
        />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Success State
        </Typography>
        <Input
          label="Success state"
          defaultValue="Valid input"
          success
          helperText="Looking good!"
        />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Disabled State
        </Typography>
        <Input label="Disabled state" defaultValue="Cannot edit" disabled />
      </Box>
    </Stack>
  ),
};

/**
 * Live validation example
 */
export const LiveValidation: Story = {
  render: () => <LiveValidationDemo />,
};
