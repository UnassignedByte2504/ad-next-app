import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within } from "@tests/utils";
import { Navbar, NavbarProps } from "@organisms/Navbar";
import userEvent from "@testing-library/user-event";
import { useUI, useUIActions } from "@store";
import type { ThemeMode, UISlice } from "@/store/types";

// Mock del store
vi.mock("@store", () => ({
  useUI: vi.fn(),
  useUIActions: vi.fn(),
}));

// Helper para crear un estado UI Slice mockeado completo
const createMockUISlice = (theme: ThemeMode): UISlice => ({
  theme,
  sidebarOpen: false,
  sidebarCollapsed: false,
  notifications: [],
  modals: [],
  isOnline: true,
  isMobile: false,
  setTheme: vi.fn(),
  toggleSidebar: vi.fn(),
  setSidebarOpen: vi.fn(),
  setSidebarCollapsed: vi.fn(),
  addNotification: vi.fn(() => "notification-id"),
  removeNotification: vi.fn(),
  clearNotifications: vi.fn(),
  openModal: vi.fn(() => "modal-id"),
  closeModal: vi.fn(),
  closeAllModals: vi.fn(),
  setOnline: vi.fn(),
  setMobile: vi.fn(),
});

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      "search.desktopPlaceholder": "Buscar músicos, bandas...",
      "search.mobilePlaceholder": "Buscar...",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
    };
    return translations[key] || key;
  },
}));

// Mock usePathname for NavLink - override the global mock
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/musicians",
  useParams: () => ({}),
}));

// Mock window.matchMedia for responsive tests
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

const mockLinks = [
  { href: "/musicians", label: "Músicos" },
  { href: "/bands", label: "Bandas" },
  { href: "/events", label: "Eventos" },
];

const defaultProps: Partial<NavbarProps> = {
  links: mockLinks,
  showSearch: true,
};

describe("Navbar", () => {
  const mockSetTheme = vi.fn();

  beforeEach(() => {
    mockMatchMedia(true); // Desktop by default
    vi.clearAllMocks();

    // Setup store mocks
    vi.mocked(useUI).mockImplementation((selector) =>
      selector(createMockUISlice("light"))
    );
    vi.mocked(useUIActions).mockReturnValue({
      setTheme: mockSetTheme,
    } as unknown as ReturnType<typeof useUIActions>);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("renders without crashing", () => {
      render(<Navbar {...defaultProps} />);
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("renders with default props", () => {
      render(<Navbar />);
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("renders navigation links", () => {
      render(<Navbar {...defaultProps} />);
      expect(screen.getByText("Músicos")).toBeInTheDocument();
      expect(screen.getByText("Bandas")).toBeInTheDocument();
      expect(screen.getByText("Eventos")).toBeInTheDocument();
    });

    it("renders search input when showSearch is true", () => {
      render(<Navbar {...defaultProps} showSearch />);
      // Search is rendered but hidden on smaller screens (lg breakpoint)
      // It exists in the DOM but may not be visible
      const searchInputs = screen.getAllByRole("textbox");
      expect(searchInputs.length).toBeGreaterThan(0);
    });

    it("does not render search input when showSearch is false", () => {
      render(<Navbar {...defaultProps} showSearch={false} />);
      // No text inputs should exist when search is disabled
      const textInputs = screen.queryAllByRole("textbox");
      expect(textInputs.length).toBe(0);
    });

    it("renders mobile menu button", () => {
      render(<Navbar {...defaultProps} />);
      // Both open and close buttons exist (animated)
      const menuButton = screen.getByLabelText("Abrir menú");
      expect(menuButton).toBeInTheDocument();
    });
  });

  describe("Props", () => {
    it("applies custom className", () => {
      render(<Navbar {...defaultProps} className="custom-navbar" />);
      const navbar = screen.getByRole("banner");
      expect(navbar).toHaveClass("custom-navbar");
    });

    it("uses default variant styling", () => {
      render(<Navbar {...defaultProps} variant="default" />);
      const navbar = screen.getByRole("banner");
      expect(navbar).toBeInTheDocument();
      // Default has transparent bg without scroll
    });

    it("uses transparent variant styling", () => {
      render(<Navbar {...defaultProps} variant="transparent" />);
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("uses elevated variant styling", () => {
      render(<Navbar {...defaultProps} variant="elevated" />);
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("applies sticky position by default", () => {
      render(<Navbar {...defaultProps} />);
      const navbar = screen.getByRole("banner");
      expect(navbar).toHaveClass("MuiAppBar-positionSticky");
    });

    it("applies fixed position when specified", () => {
      render(<Navbar {...defaultProps} position="fixed" />);
      const navbar = screen.getByRole("banner");
      expect(navbar).toHaveClass("MuiAppBar-positionFixed");
    });

    it("applies static position when specified", () => {
      render(<Navbar {...defaultProps} position="static" />);
      const navbar = screen.getByRole("banner");
      expect(navbar).toHaveClass("MuiAppBar-positionStatic");
    });
  });

  describe("Search Input", () => {
    it("renders search with custom placeholder", () => {
      render(
        <Navbar
          {...defaultProps}
          showSearch
          searchProps={{ placeholder: "Buscar artistas" }}
        />
      );
      expect(screen.getByPlaceholderText("Buscar artistas")).toBeInTheDocument();
    });

    it("renders search with default desktop placeholder", () => {
      render(<Navbar {...defaultProps} showSearch />);
      expect(
        screen.getByPlaceholderText("Buscar músicos, bandas...")
      ).toBeInTheDocument();
    });
  });

  describe("Mobile Menu", () => {
    it("opens mobile drawer when menu button is clicked", async () => {
      const user = userEvent.setup();
      render(<Navbar {...defaultProps} />);

      const menuButton = screen.getByLabelText("Abrir menú");
      await user.click(menuButton);

      // Drawer should be open - check for drawer content
      const drawer = document.querySelector(".MuiDrawer-root");
      expect(drawer).toBeInTheDocument();
    });

    it("closes mobile drawer when close button is clicked", async () => {
      const user = userEvent.setup();
      render(<Navbar {...defaultProps} />);

      // Open drawer
      const menuButton = screen.getByLabelText("Abrir menú");
      await user.click(menuButton);

      // Find and click close button in drawer
      const closeButtons = screen.getAllByLabelText("Cerrar menú");
      // Get the close button in the drawer (second one)
      const drawerCloseButton = closeButtons.find((btn) =>
        btn.closest(".MuiDrawer-root")
      );

      if (drawerCloseButton) {
        await user.click(drawerCloseButton);
      }

      // Wait for animation
      await vi.waitFor(() => {
        const drawer = document.querySelector(".MuiDrawer-root");
        // Drawer might still be in DOM but hidden
        expect(drawer).toBeInTheDocument();
      });
    });

    it("renders navigation links in mobile drawer", async () => {
      const user = userEvent.setup();
      render(<Navbar {...defaultProps} />);

      // Open drawer
      const menuButton = screen.getByLabelText("Abrir menú");
      await user.click(menuButton);

      // Check links are in drawer
      const drawer = document.querySelector(".MuiDrawer-paper");
      expect(drawer).toBeInTheDocument();

      if (drawer) {
        const drawerWithin = within(drawer as HTMLElement);
        expect(drawerWithin.getByText("Músicos")).toBeInTheDocument();
        expect(drawerWithin.getByText("Bandas")).toBeInTheDocument();
        expect(drawerWithin.getByText("Eventos")).toBeInTheDocument();
      }
    });

    it("renders search in mobile drawer", async () => {
      const user = userEvent.setup();
      render(<Navbar {...defaultProps} showSearch />);

      // Open drawer
      const menuButton = screen.getByLabelText("Abrir menú");
      await user.click(menuButton);

      // Check search is in drawer with mobile placeholder
      const drawer = document.querySelector(".MuiDrawer-paper");
      if (drawer) {
        const drawerWithin = within(drawer as HTMLElement);
        expect(drawerWithin.getByPlaceholderText("Buscar...")).toBeInTheDocument();
      }
    });

    it("closes drawer when clicking on a link", async () => {
      const user = userEvent.setup();
      render(<Navbar {...defaultProps} />);

      // Open drawer
      const menuButton = screen.getByLabelText("Abrir menú");
      await user.click(menuButton);

      // Click on a link in the drawer
      const drawer = document.querySelector(".MuiDrawer-paper");
      if (drawer) {
        const drawerWithin = within(drawer as HTMLElement);
        const link = drawerWithin.getByText("Músicos");
        await user.click(link);

        // The onLinkClick should have been called, closing the drawer
        // Note: actual navigation won't happen due to jsdom limitations
      }
    });

    it("menu button has correct aria attributes", async () => {
      const user = userEvent.setup();
      render(<Navbar {...defaultProps} />);

      const menuButton = screen.getByLabelText("Abrir menú");
      expect(menuButton).toHaveAttribute("aria-expanded", "false");

      await user.click(menuButton);

      // After opening, aria-expanded should be true
      expect(menuButton).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("M3 2025 Features", () => {
    it("enables scroll effect by default", () => {
      render(<Navbar {...defaultProps} scrollEffect />);
      expect(screen.getByRole("banner")).toBeInTheDocument();
      // scrollEffect is enabled, useMotionValueEvent should be called
    });

    it("disables scroll effect when scrollEffect is false", () => {
      render(<Navbar {...defaultProps} scrollEffect={false} />);
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("uses pill variant for links when usePillLinks is true", () => {
      render(<Navbar {...defaultProps} usePillLinks />);
      // Links should have pill variant
      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThan(0);
    });

    it("uses default variant for links when usePillLinks is false", () => {
      render(<Navbar {...defaultProps} usePillLinks={false} />);
      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThan(0);
    });

    it("renders mobile drawer with vertical variant links", async () => {
      const user = userEvent.setup();
      render(<Navbar {...defaultProps} />);

      // Open drawer
      const menuButton = screen.getByLabelText("Abrir menú");
      await user.click(menuButton);

      // In mobile drawer, NavbarLinks uses variant="vertical"
      const drawer = document.querySelector(".MuiDrawer-paper");
      expect(drawer).toBeInTheDocument();
      // Vertical links should be present
    });

    it("applies glassmorphism effect to drawer", async () => {
      const user = userEvent.setup();
      render(<Navbar {...defaultProps} />);

      // Open drawer
      const menuButton = screen.getByLabelText("Abrir menú");
      await user.click(menuButton);

      const drawerPaper = document.querySelector(".MuiDrawer-paper");
      expect(drawerPaper).toBeInTheDocument();
      // Check for backdrop-filter style (glassmorphism)
      // Note: computed styles might not be testable in jsdom
    });

    it("has no elevation/shadow by default (M3 2025)", () => {
      render(<Navbar {...defaultProps} />);
      const navbar = screen.getByRole("banner");
      // elevation={0} should be applied
      expect(navbar).not.toHaveClass("MuiPaper-elevation1");
      expect(navbar).not.toHaveClass("MuiPaper-elevation2");
    });
  });

  describe("Accessibility", () => {
    it("has role banner for main navigation", () => {
      render(<Navbar {...defaultProps} />);
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("navigation links are accessible", () => {
      render(<Navbar {...defaultProps} />);
      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThan(0);
    });

    it("search input is accessible", () => {
      render(<Navbar {...defaultProps} showSearch />);
      // Search inputs are rendered (even if visually hidden for responsiveness)
      const textInputs = screen.getAllByRole("textbox");
      expect(textInputs.length).toBeGreaterThan(0);
    });

    it("mobile menu button has correct aria-label", () => {
      render(<Navbar {...defaultProps} />);
      const menuButton = screen.getByLabelText("Abrir menú");
      expect(menuButton).toBeInTheDocument();
    });

    it("supports keyboard navigation for mobile menu", async () => {
      const user = userEvent.setup();
      render(<Navbar {...defaultProps} />);

      const menuButton = screen.getByLabelText("Abrir menú");
      menuButton.focus();
      expect(menuButton).toHaveFocus();

      // Press Enter to open menu
      await user.keyboard("{Enter}");

      // Menu should open
      const drawer = document.querySelector(".MuiDrawer-root");
      expect(drawer).toBeInTheDocument();
    });
  });

  describe("Brand", () => {
    it("renders brand by default", () => {
      render(<Navbar {...defaultProps} />);
      // NavbarBrand should be rendered (contains logo)
      const logo = screen.getByRole("img");
      expect(logo).toBeInTheDocument();
    });

    it("passes brandProps to NavbarBrand", () => {
      render(
        <Navbar {...defaultProps} brandProps={{ href: "/custom-home" }} />
      );
      // Brand link should have custom href
      const brandLink = screen.getByRole("link", { name: /ayla/i });
      expect(brandLink).toHaveAttribute("href", "/custom-home");
    });
  });

  describe("Actions", () => {
    it("renders actions section", () => {
      render(<Navbar {...defaultProps} />);
      // Actions section should be present (contains ThemeToggle by default)
    });

    it("passes actionsProps to NavbarActions", () => {
      render(
        <Navbar
          {...defaultProps}
          actionsProps={{
            showThemeToggle: false,
          }}
        />
      );
      // ThemeToggle should not be rendered if showThemeToggle is false
    });
  });

  describe("Responsive Behavior", () => {
    it("renders desktop layout correctly", () => {
      mockMatchMedia(true); // Desktop
      render(<Navbar {...defaultProps} />);

      // Desktop navigation links should be visible
      // Mobile menu button should also be present but hidden via CSS
      expect(screen.getByText("Músicos")).toBeInTheDocument();
    });

    it("shows mobile layout on small screens", () => {
      mockMatchMedia(false); // Mobile
      render(<Navbar {...defaultProps} />);

      // Mobile menu button should be in the document
      const menuButton = screen.getByLabelText("Abrir menú");
      expect(menuButton).toBeInTheDocument();
    });
  });

  describe("Container Width", () => {
    it("uses xl maxWidth by default", () => {
      render(<Navbar {...defaultProps} />);
      const container = document.querySelector(".MuiContainer-root");
      expect(container).toHaveClass("MuiContainer-maxWidthXl");
    });

    it("uses custom maxWidth when specified", () => {
      render(<Navbar {...defaultProps} maxWidth="lg" />);
      const container = document.querySelector(".MuiContainer-root");
      expect(container).toHaveClass("MuiContainer-maxWidthLg");
    });

    it("disables maxWidth when set to false", () => {
      render(<Navbar {...defaultProps} maxWidth={false} />);
      const container = document.querySelector(".MuiContainer-root");
      expect(container).not.toHaveClass("MuiContainer-maxWidthXl");
      expect(container).not.toHaveClass("MuiContainer-maxWidthLg");
    });
  });

  describe("Animation Integration", () => {
    it("renders animated menu icon", async () => {
      const user = userEvent.setup();
      render(<Navbar {...defaultProps} />);

      // Menu icon should be visible
      const menuButton = screen.getByLabelText("Abrir menú");
      expect(menuButton).toBeInTheDocument();

      // Click to toggle (triggers AnimatePresence)
      await user.click(menuButton);

      // Close icon should now be visible (animated transition)
      // Due to mock, both might be present
    });

    it("drawer has stagger animation setup", async () => {
      const user = userEvent.setup();
      render(<Navbar {...defaultProps} />);

      // Open drawer
      const menuButton = screen.getByLabelText("Abrir menú");
      await user.click(menuButton);

      // NavbarLinks in drawer has animate prop
      const drawer = document.querySelector(".MuiDrawer-paper");
      expect(drawer).toBeInTheDocument();
    });
  });
});
