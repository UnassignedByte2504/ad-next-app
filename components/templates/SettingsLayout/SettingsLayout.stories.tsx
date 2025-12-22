import type { Meta, StoryObj } from "@storybook/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PaletteIcon from "@mui/icons-material/Palette";
import { SettingsLayout } from "./SettingsLayout";

const meta: Meta<typeof SettingsLayout> = {
  title: "Templates/SettingsLayout",
  component: SettingsLayout,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Layout template for settings pages with responsive sidebar navigation.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SettingsLayout>;

// Mock sidebar component
const MockSidebar = () => (
  <List disablePadding>
    <ListItemButton selected sx={{ borderRadius: 2, m: 1 }}>
      <ListItemIcon>
        <PersonIcon />
      </ListItemIcon>
      <ListItemText primary="Profile" />
    </ListItemButton>
    <ListItemButton sx={{ borderRadius: 2, m: 1 }}>
      <ListItemIcon>
        <SecurityIcon />
      </ListItemIcon>
      <ListItemText primary="Security" />
    </ListItemButton>
    <ListItemButton sx={{ borderRadius: 2, m: 1 }}>
      <ListItemIcon>
        <NotificationsIcon />
      </ListItemIcon>
      <ListItemText primary="Notifications" />
    </ListItemButton>
    <ListItemButton sx={{ borderRadius: 2, m: 1 }}>
      <ListItemIcon>
        <PaletteIcon />
      </ListItemIcon>
      <ListItemText primary="Appearance" />
    </ListItemButton>
  </List>
);

// Mock content component
const MockContent = () => (
  <Box>
    <Typography variant="h5" fontWeight={600} gutterBottom>
      Profile Settings
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
      Manage your public profile information.
    </Typography>

    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Display Name
        </Typography>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "action.hover",
            color: "text.primary",
          }}
        >
          Carlos García
        </Box>
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Bio
        </Typography>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "action.hover",
            color: "text.primary",
            minHeight: 80,
          }}
        >
          Guitarrista con 10 años de experiencia. Busco banda de rock/metal para
          tocar en vivo.
        </Box>
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Location
        </Typography>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "action.hover",
            color: "text.primary",
          }}
        >
          Madrid, España
        </Box>
      </Box>
    </Box>
  </Box>
);

/**
 * Default settings layout.
 */
export const Default: Story = {
  args: {
    title: "Settings",
    sidebar: <MockSidebar />,
    children: <MockContent />,
  },
};

/**
 * With header actions.
 */
export const WithActions: Story = {
  args: {
    title: "Settings",
    sidebar: <MockSidebar />,
    children: <MockContent />,
    actions: (
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="outlined">Cancel</Button>
        <Button variant="contained">Save Changes</Button>
      </Box>
    ),
  },
};

/**
 * Custom title.
 */
export const CustomTitle: Story = {
  args: {
    title: "Account & Security",
    sidebar: <MockSidebar />,
    children: (
      <Box>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Security Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your password, two-factor authentication, and login sessions.
        </Typography>
      </Box>
    ),
  },
};

/**
 * Dense content.
 */
export const DenseContent: Story = {
  args: {
    title: "Notification Preferences",
    sidebar: <MockSidebar />,
    children: (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {[
          "Email notifications",
          "Push notifications",
          "SMS notifications",
          "Weekly digest",
          "Marketing emails",
          "New follower alerts",
          "Message notifications",
          "Band invitations",
        ].map((item) => (
          <Box
            key={item}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderRadius: 2,
              bgcolor: "action.hover",
            }}
          >
            <Typography>{item}</Typography>
            <Box
              sx={{
                width: 40,
                height: 24,
                borderRadius: 12,
                bgcolor: "primary.main",
              }}
            />
          </Box>
        ))}
      </Box>
    ),
  },
};
