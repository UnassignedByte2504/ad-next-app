import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NavbarActions } from "./NavbarActions";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { fn } from "storybook/test";

const meta = {
  title: "Molecules/NavbarActions",
  component: NavbarActions,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isAuthenticated: {
      control: "boolean",
    },
    notificationCount: {
      control: { type: "number", min: 0, max: 100 },
    },
    showThemeToggle: {
      control: "boolean",
    },
    showNotifications: {
      control: "boolean",
    },
  },
  args: {
    onLoginClick: fn(),
    onProfileClick: fn(),
    onNotificationsClick: fn(),
  },
} satisfies Meta<typeof NavbarActions>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Estado no autenticado (por defecto) */
export const Default: Story = {
  args: {
    isAuthenticated: false,
  },
};

/** Usuario autenticado */
export const Authenticated: Story = {
  args: {
    isAuthenticated: true,
    user: {
      name: "Carlos García",
      avatar: "https://i.pravatar.cc/150?u=carlos",
    },
  },
};

/** Autenticado con notificaciones */
export const WithNotifications: Story = {
  args: {
    isAuthenticated: true,
    user: {
      name: "María López",
      avatar: "https://i.pravatar.cc/150?u=maria",
    },
    notificationCount: 5,
  },
};

/** Muchas notificaciones (badge truncado) */
export const ManyNotifications: Story = {
  args: {
    isAuthenticated: true,
    user: {
      name: "Ana Ruiz",
    },
    notificationCount: 150,
  },
};

/** Sin avatar (iniciales) */
export const NoAvatar: Story = {
  args: {
    isAuthenticated: true,
    user: {
      name: "Pedro Sánchez",
    },
    notificationCount: 3,
  },
};

/** Sin toggle de tema */
export const NoThemeToggle: Story = {
  args: {
    isAuthenticated: true,
    user: {
      name: "Laura Martín",
      avatar: "https://i.pravatar.cc/150?u=laura",
    },
    showThemeToggle: false,
  },
};

/** Sin notificaciones */
export const NoNotifications: Story = {
  args: {
    isAuthenticated: true,
    user: {
      name: "Juan Torres",
      avatar: "https://i.pravatar.cc/150?u=juan",
    },
    showNotifications: false,
  },
};

/** Comparación: No autenticado vs Autenticado */
export const AuthComparison: Story = {
  render: () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="overline" sx={{ mb: 2, display: "block" }}>
          No Autenticado
        </Typography>
        <Box sx={{ bgcolor: "background.paper", p: 2, borderRadius: 2 }}>
          <NavbarActions isAuthenticated={false} />
        </Box>
      </Box>
      <Box>
        <Typography variant="overline" sx={{ mb: 2, display: "block" }}>
          Autenticado (sin notificaciones)
        </Typography>
        <Box sx={{ bgcolor: "background.paper", p: 2, borderRadius: 2 }}>
          <NavbarActions
            isAuthenticated
            user={{ name: "Carlos", avatar: "https://i.pravatar.cc/150?u=carlos" }}
          />
        </Box>
      </Box>
      <Box>
        <Typography variant="overline" sx={{ mb: 2, display: "block" }}>
          Autenticado (con notificaciones)
        </Typography>
        <Box sx={{ bgcolor: "background.paper", p: 2, borderRadius: 2 }}>
          <NavbarActions
            isAuthenticated
            user={{ name: "María", avatar: "https://i.pravatar.cc/150?u=maria" }}
            notificationCount={12}
          />
        </Box>
      </Box>
    </Stack>
  ),
};

/** En contexto oscuro */
export const OnDarkBackground: Story = {
  args: {
    isAuthenticated: true,
    user: {
      name: "Elena Vega",
      avatar: "https://i.pravatar.cc/150?u=elena",
    },
    notificationCount: 7,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
  decorators: [
    (Story) => (
      <Box sx={{ p: 2 }}>
        <Story />
      </Box>
    ),
  ],
};
