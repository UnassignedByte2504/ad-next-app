/**
 * Unit Tests - ThemeToggle Component
 *
 * Tests para el componente ThemeToggle con animaciones Framer Motion:
 * - Renderizado correcto
 * - Visualización de iconos SVG según tema
 * - Ciclo de temas (full y simple)
 * - Labels y tooltips
 * - Tamaños (sm, md, lg)
 * - Accesibilidad
 * - Estado disabled
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@tests/utils";
import { ThemeToggle } from "@atoms/ThemeToggle";
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

describe("ThemeToggle", () => {
  const mockSetTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUI).mockImplementation((selector) =>
      selector(createMockUISlice("light"))
    );
    vi.mocked(useUIActions).mockReturnValue({
      setTheme: mockSetTheme,
    } as unknown as ReturnType<typeof useUIActions>);
  });

  describe("Rendering", () => {
    it("renders button correctly", () => {
      render(<ThemeToggle />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      render(<ThemeToggle className="custom-class" />);

      const button = screen.getByRole("button");
      expect(button.className).toMatch(/custom-class/);
    });

    it("renders SVG icon", () => {
      render(<ThemeToggle />);

      const button = screen.getByRole("button");
      const svg = button.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  describe("Theme Display", () => {
    it("renders sun icon for light theme (has 8 ray lines)", () => {
      vi.mocked(useUI).mockImplementation((selector) =>
        selector(createMockUISlice("light"))
      );
      render(<ThemeToggle />);

      const button = screen.getByRole("button");
      const svg = button.querySelector("svg");
      // Sun icon has a circle + 8 ray lines
      const lines = svg?.querySelectorAll("line");
      expect(lines?.length).toBe(8);
    });

    it("renders moon icon for dark theme (has path element)", () => {
      vi.mocked(useUI).mockImplementation((selector) =>
        selector(createMockUISlice("dark"))
      );
      render(<ThemeToggle />);

      const button = screen.getByRole("button");
      const svg = button.querySelector("svg");
      // Moon icon has a path (crescent) + circles (stars)
      const path = svg?.querySelector("path");
      expect(path).toBeInTheDocument();
    });

    it("renders system icon for system theme (has rect for monitor)", () => {
      vi.mocked(useUI).mockImplementation((selector) =>
        selector(createMockUISlice("system"))
      );
      render(<ThemeToggle />);

      const button = screen.getByRole("button");
      const svg = button.querySelector("svg");
      // System icon has a rect (monitor shape)
      const rect = svg?.querySelector("rect");
      expect(rect).toBeInTheDocument();
    });
  });

  describe("Theme Cycling - Full Mode", () => {
    it("cycles from light to dark", async () => {
      vi.mocked(useUI).mockImplementation((selector) =>
        selector(createMockUISlice("light"))
      );
      const { user } = render(<ThemeToggle cycleMode="full" />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });

    it("cycles from dark to system", async () => {
      vi.mocked(useUI).mockImplementation((selector) =>
        selector(createMockUISlice("dark"))
      );
      const { user } = render(<ThemeToggle cycleMode="full" />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(mockSetTheme).toHaveBeenCalledWith("system");
    });

    it("cycles from system to light", async () => {
      vi.mocked(useUI).mockImplementation((selector) =>
        selector(createMockUISlice("system"))
      );
      const { user } = render(<ThemeToggle cycleMode="full" />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(mockSetTheme).toHaveBeenCalledWith("light");
    });

    it("uses full cycle mode by default", async () => {
      vi.mocked(useUI).mockImplementation((selector) =>
        selector(createMockUISlice("dark"))
      );
      const { user } = render(<ThemeToggle />);

      const button = screen.getByRole("button");
      await user.click(button);

      // En modo full, dark → system
      expect(mockSetTheme).toHaveBeenCalledWith("system");
    });
  });

  describe("Theme Cycling - Simple Mode", () => {
    it("toggles from light to dark", async () => {
      vi.mocked(useUI).mockImplementation((selector) =>
        selector(createMockUISlice("light"))
      );
      const { user } = render(<ThemeToggle cycleMode="simple" />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });

    it("toggles from dark to light", async () => {
      vi.mocked(useUI).mockImplementation((selector) =>
        selector(createMockUISlice("dark"))
      );
      const { user } = render(<ThemeToggle cycleMode="simple" />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(mockSetTheme).toHaveBeenCalledWith("light");
    });

    it("toggles from system to light in simple mode", async () => {
      vi.mocked(useUI).mockImplementation((selector) =>
        selector(createMockUISlice("system"))
      );
      const { user } = render(<ThemeToggle cycleMode="simple" />);

      const button = screen.getByRole("button");
      await user.click(button);

      // system no es light, así que devuelve light
      expect(mockSetTheme).toHaveBeenCalledWith("light");
    });
  });

  describe("showLabel", () => {
    it("shows label text when showLabel=true for light theme", () => {
      vi.mocked(useUI).mockImplementation((selector) =>
        selector(createMockUISlice("light"))
      );
      render(<ThemeToggle showLabel />);

      expect(screen.getByText("Claro")).toBeInTheDocument();
    });

    it("shows label text when showLabel=true for dark theme", () => {
      vi.mocked(useUI).mockImplementation((selector) =>
        selector(createMockUISlice("dark"))
      );
      render(<ThemeToggle showLabel />);

      expect(screen.getByText("Oscuro")).toBeInTheDocument();
    });

    it("shows label text when showLabel=true for system theme", () => {
      vi.mocked(useUI).mockImplementation((selector) =>
        selector(createMockUISlice("system"))
      );
      render(<ThemeToggle showLabel />);

      expect(screen.getByText("Sistema")).toBeInTheDocument();
    });

    it("shows tooltip when showLabel=false", async () => {
      vi.mocked(useUI).mockImplementation((selector) =>
        selector(createMockUISlice("light"))
      );
      const { user } = render(<ThemeToggle showLabel={false} />);

      // El wrapper span contiene el button, necesitamos hover en el span
      const wrapper = screen.getByRole("button").parentElement;
      if (wrapper) {
        await user.hover(wrapper);
      }

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toHaveTextContent("Cambiar a tema oscuro");
      });
    });

    it("does not render label text when showLabel=false", () => {
      vi.mocked(useUI).mockImplementation((selector) =>
        selector(createMockUISlice("light"))
      );
      render(<ThemeToggle showLabel={false} />);

      expect(screen.queryByText("Claro")).not.toBeInTheDocument();
    });
  });

  describe("Size", () => {
    it("renders md size by default (44px)", () => {
      render(<ThemeToggle />);

      const button = screen.getByRole("button");
      expect(button).toHaveStyle({ width: "44px", height: "44px" });
    });

    it("renders sm size (36px)", () => {
      render(<ThemeToggle size="sm" />);

      const button = screen.getByRole("button");
      expect(button).toHaveStyle({ width: "36px", height: "36px" });
    });

    it("renders lg size (52px)", () => {
      render(<ThemeToggle size="lg" />);

      const button = screen.getByRole("button");
      expect(button).toHaveStyle({ width: "52px", height: "52px" });
    });
  });

  describe("Disabled State", () => {
    it("does not call setTheme when disabled", async () => {
      vi.mocked(useUI).mockImplementation((selector) =>
        selector(createMockUISlice("light"))
      );
      const { user } = render(<ThemeToggle disabled />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(mockSetTheme).not.toHaveBeenCalled();
    });

    it("has disabled attribute when disabled=true", () => {
      render(<ThemeToggle disabled />);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("has reduced opacity when disabled", () => {
      render(<ThemeToggle disabled />);

      const button = screen.getByRole("button");
      expect(button.className).toMatch(/disabled:opacity-50/);
    });
  });

  describe("Accessibility", () => {
    it("has correct aria-label for light theme", () => {
      vi.mocked(useUI).mockImplementation((selector) =>
        selector(createMockUISlice("light"))
      );
      render(<ThemeToggle />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute(
        "aria-label",
        "Cambiar tema. Tema actual: Claro"
      );
    });

    it("has correct aria-label for dark theme", () => {
      vi.mocked(useUI).mockImplementation((selector) =>
        selector(createMockUISlice("dark"))
      );
      render(<ThemeToggle />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute(
        "aria-label",
        "Cambiar tema. Tema actual: Oscuro"
      );
    });

    it("has correct aria-label for system theme", () => {
      vi.mocked(useUI).mockImplementation((selector) =>
        selector(createMockUISlice("system"))
      );
      render(<ThemeToggle />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute(
        "aria-label",
        "Cambiar tema. Tema actual: Sistema"
      );
    });

    it("is focusable", async () => {
      const { user } = render(<ThemeToggle />);

      await user.tab();

      const button = screen.getByRole("button");
      expect(button).toHaveFocus();
    });

    it("has rounded-full class for circular shape", () => {
      render(<ThemeToggle />);

      const button = screen.getByRole("button");
      expect(button.className).toMatch(/rounded-full/);
    });
  });

  describe("Keyboard Interaction", () => {
    it("can be activated with Enter key", async () => {
      vi.mocked(useUI).mockImplementation((selector) =>
        selector(createMockUISlice("light"))
      );
      const { user } = render(<ThemeToggle />);

      await user.tab();
      await user.keyboard("{Enter}");

      expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });

    it("can be activated with Space key", async () => {
      vi.mocked(useUI).mockImplementation((selector) =>
        selector(createMockUISlice("light"))
      );
      const { user } = render(<ThemeToggle />);

      await user.tab();
      await user.keyboard(" ");

      expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to button element", () => {
      const ref = vi.fn();
      render(<ThemeToggle ref={ref} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLButtonElement);
    });
  });
});
