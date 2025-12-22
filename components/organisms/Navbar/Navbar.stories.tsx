import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Navbar } from "./Navbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import GroupsIcon from "@mui/icons-material/Groups";
import PlaceIcon from "@mui/icons-material/Place";
import EventIcon from "@mui/icons-material/Event";
import { fn } from "storybook/test";
import type { NavLinkItem } from "@molecules/NavbarLinks";
import navigationMessages from "@/messages/es/navigation.json";
import storybookMessages from "@/messages/es/storybook.json";

// Helper function for getting translation values in stories
const navT = (key: keyof typeof navigationMessages) => navigationMessages[key];
const storyT = (key: keyof typeof storybookMessages.Navbar) => storybookMessages.Navbar[key];

const defaultLinks: NavLinkItem[] = [
  { href: "/musicians", label: navT("musicians"), icon: <MusicNoteIcon fontSize="small" /> },
  { href: "/bands", label: navT("bands"), icon: <GroupsIcon fontSize="small" /> },
  { href: "/venues", label: navT("venues"), icon: <PlaceIcon fontSize="small" /> },
  { href: "/events", label: navT("events"), icon: <EventIcon fontSize="small" /> },
];

const simpleLinks: NavLinkItem[] = [
  { href: "/musicians", label: navT("musicians") },
  { href: "/bands", label: navT("bands") },
  { href: "/venues", label: navT("venues") },
];

const meta = {
  title: "Organisms/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "transparent", "elevated"],
    },
    position: {
      control: "select",
      options: ["fixed", "sticky", "static"],
    },
    maxWidth: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", false],
    },
    showSearch: {
      control: "boolean",
    },
  },
  args: {
    links: defaultLinks,
  },
  decorators: [
    (Story) => (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Story />
        <Box sx={{ p: 4 }}>
          <Typography variant="body2" color="text.secondary">
            {storyT("pageContent")}
          </Typography>
        </Box>
      </Box>
    ),
  ],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Navbar por defecto (no autenticado) */
export const Default: Story = {
  args: {
    links: defaultLinks,
    showSearch: true,
    actionsProps: {
      isAuthenticated: false,
      onLoginClick: fn(),
    },
  },
};

/** Usuario autenticado */
export const Authenticated: Story = {
  args: {
    links: defaultLinks,
    showSearch: true,
    actionsProps: {
      isAuthenticated: true,
      user: {
        name: "Carlos García",
        avatar: "https://i.pravatar.cc/150?u=carlos",
      },
      notificationCount: 3,
      onProfileClick: fn(),
      onNotificationsClick: fn(),
    },
  },
};

/** Con tagline en el brand */
export const WithTagline: Story = {
  args: {
    brandProps: {
      showTagline: true,
    },
    links: simpleLinks,
    actionsProps: {
      isAuthenticated: false,
    },
  },
};

/** Sin barra de búsqueda */
export const NoSearch: Story = {
  args: {
    links: defaultLinks,
    showSearch: false,
    actionsProps: {
      isAuthenticated: true,
      user: {
        name: "María López",
        avatar: "https://i.pravatar.cc/150?u=maria",
      },
    },
  },
};

/** Variante elevada (con sombra) */
export const Elevated: Story = {
  args: {
    variant: "elevated",
    links: defaultLinks,
    actionsProps: {
      isAuthenticated: true,
      user: {
        name: "Ana Ruiz",
      },
      notificationCount: 12,
    },
  },
};

/** Variante transparente (para hero sections) */
export const Transparent: Story = {
  args: {
    variant: "transparent",
    links: simpleLinks,
    showSearch: false,
    actionsProps: {
      isAuthenticated: false,
    },
  },
  decorators: [
    (Story) => (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0A0A0A 0%, #1a1a2e 50%, #16213e 100%)",
        }}
      >
        <Story />
        <Box sx={{ p: 4, pt: 10, textAlign: "center" }}>
          <Typography variant="h2" color="white" gutterBottom>
            {storyT("heroTitle")}
          </Typography>
          <Typography color="rgba(255,255,255,0.7)">
            {storyT("heroDescription")}
          </Typography>
        </Box>
      </Box>
    ),
  ],
};

/** Posición fixed */
export const FixedPosition: Story = {
  args: {
    position: "fixed",
    links: defaultLinks,
    actionsProps: {
      isAuthenticated: true,
      user: {
        name: "Pedro Sánchez",
        avatar: "https://i.pravatar.cc/150?u=pedro",
      },
    },
  },
  decorators: [
    (Story) => (
      <Box sx={{ minHeight: "200vh", bgcolor: "background.default" }}>
        <Story />
        <Box sx={{ p: 4, pt: 12 }}>
          <Typography variant="h4" gutterBottom>
            {storyT("fixedTitle")}
          </Typography>
          {Array.from({ length: 20 }).map((_, i) => (
            <Typography key={i} paragraph color="text.secondary">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Typography>
          ))}
        </Box>
      </Box>
    ),
  ],
};

/** Sin enlaces (solo brand y actions) */
export const MinimalNavbar: Story = {
  args: {
    links: [],
    showSearch: false,
    actionsProps: {
      isAuthenticated: false,
    },
  },
};

/** Con enlace activo */
export const WithActiveLink: Story = {
  args: {
    links: [
      { href: "/musicians", label: "Músicos", icon: <MusicNoteIcon fontSize="small" />, active: true },
      { href: "/bands", label: "Bandas", icon: <GroupsIcon fontSize="small" /> },
      { href: "/venues", label: "Locales", icon: <PlaceIcon fontSize="small" /> },
      { href: "/events", label: "Eventos", icon: <EventIcon fontSize="small" /> },
    ],
    actionsProps: {
      isAuthenticated: true,
      user: {
        name: "Elena Vega",
        avatar: "https://i.pravatar.cc/150?u=elena",
      },
    },
  },
};

/** Ancho máximo pequeño */
export const NarrowContainer: Story = {
  args: {
    maxWidth: "md",
    links: simpleLinks,
    actionsProps: {
      isAuthenticated: false,
    },
  },
};

/** Mobile: Redimensiona la ventana para ver el drawer */
export const MobileView: Story = {
  args: {
    links: defaultLinks,
    actionsProps: {
      isAuthenticated: true,
      user: {
        name: "Laura Martín",
        avatar: "https://i.pravatar.cc/150?u=laura",
      },
      notificationCount: 5,
    },
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

/**
 * 🎨 M3 Pill Links (Material Design 3 Expressive 2025)
 *
 * Navegación con pill-shaped indicators animados.
 * Característica M3 2025 para destacar el estado activo.
 */
export const PillLinks: Story = {
  args: {
    links: [
      {
        href: "/musicians",
        label: "Músicos",
        icon: <MusicNoteIcon fontSize="small" />,
        active: true,
      },
      {
        href: "/bands",
        label: "Bandas",
        icon: <GroupsIcon fontSize="small" />,
      },
      {
        href: "/venues",
        label: "Locales",
        icon: <PlaceIcon fontSize="small" />,
      },
      {
        href: "/events",
        label: "Eventos",
        icon: <EventIcon fontSize="small" />,
      },
    ],
    usePillLinks: true,
    showSearch: true,
    actionsProps: {
      isAuthenticated: true,
      user: {
        name: "Alex Music",
        avatar: "https://i.pravatar.cc/150?u=alex",
      },
    },
  },
};

/**
 * 📜 Scroll Effect Demo (M3 Color Fill on Scroll)
 *
 * Haz scroll para ver el efecto M3 2025: el navbar
 * pasa de transparente a color sólido con blur.
 * Sin drop shadows (deprecated en M3 2025).
 */
export const ScrollEffect: Story = {
  args: {
    links: defaultLinks,
    scrollEffect: true,
    variant: "default",
    actionsProps: {
      isAuthenticated: true,
      user: {
        name: "Scroll Tester",
        avatar: "https://i.pravatar.cc/150?u=scroll",
      },
    },
  },
  decorators: [
    (Story) => (
      <Box sx={{ minHeight: "300vh", bgcolor: "background.default" }}>
        <Story />
        <Box sx={{ p: 4, pt: 10 }}>
          <Typography variant="h3" gutterBottom>
            Scroll Effect Demo
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Haz scroll hacia abajo para ver el efecto M3 &quot;Color Fill on
            Scroll&quot;.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            El navbar pasa de transparente a un fondo sólido con blur
            (glassmorphism). Este es el patrón recomendado por Material Design 3
            Expressive (Mayo 2025) que reemplaza los drop shadows tradicionales.
          </Typography>
          {Array.from({ length: 30 }).map((_, i) => (
            <Typography key={i} paragraph color="text.secondary">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </Typography>
          ))}
        </Box>
      </Box>
    ),
  ],
};

/**
 * 🌟 Hero con Scroll Transparente (M3 2025)
 *
 * Combina variante transparente con scroll effect.
 * Ideal para landing pages con hero images.
 */
export const HeroWithScroll: Story = {
  args: {
    variant: "transparent",
    scrollEffect: true,
    links: simpleLinks,
    showSearch: false,
    actionsProps: {
      isAuthenticated: false,
      onLoginClick: fn(),
    },
  },
  decorators: [
    (Story) => (
      <Box
        sx={{
          minHeight: "300vh",
          background:
            "linear-gradient(180deg, #0A0A0A 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%)",
        }}
      >
        <Story />
        <Box sx={{ p: 4, pt: 8, textAlign: "center" }}>
          <Typography
            variant="h1"
            sx={{
              color: "white",
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "2.5rem", md: "4rem" },
            }}
          >
            El Amanecer de la Música
          </Typography>
          <Typography
            variant="h5"
            sx={{ color: "rgba(255,255,255,0.7)", mb: 4 }}
          >
            Conecta con músicos, bandas y locales
          </Typography>
          <Box sx={{ height: "60vh" }} />
          <Typography variant="h4" color="white" gutterBottom>
            Sigue haciendo scroll...
          </Typography>
          {Array.from({ length: 20 }).map((_, i) => (
            <Typography
              key={i}
              paragraph
              sx={{ color: "rgba(255,255,255,0.5)" }}
            >
              Contenido de la página que demuestra cómo el navbar transparente
              se transforma suavemente a un fondo sólido con glassmorphism al
              hacer scroll.
            </Typography>
          ))}
        </Box>
      </Box>
    ),
  ],
};

/**
 * 📱 Mobile Drawer Animado (M3 Navigation Rail)
 *
 * Abre el menú móvil para ver las animaciones:
 * - Stagger animation en los links
 * - Indicadores verticales M3
 * - Glassmorphism backdrop
 */
export const MobileDrawerAnimated: Story = {
  args: {
    links: defaultLinks,
    showSearch: true,
    actionsProps: {
      isAuthenticated: true,
      user: {
        name: "Mobile User",
        avatar: "https://i.pravatar.cc/150?u=mobile",
      },
      notificationCount: 7,
    },
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story:
          "Haz clic en el icono de menú para ver el drawer con animaciones M3 Expressive: entrada staggered de los links, indicadores verticales, y efecto glassmorphism.",
      },
    },
  },
};
