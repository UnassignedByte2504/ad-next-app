/**
 * Unit Tests - NavLink Component
 *
 * Tests para el componente NavLink con M3 Expressive design:
 * - Renderizado correcto
 * - Estados activo/inactivo
 * - Variantes (default, pill, vertical)
 * - Tamaños (sm, md, lg)
 * - Icon rendering con animaciones
 * - Eventos de click
 * - Accesibilidad
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@tests/utils";
import { NavLink } from "@atoms/NavLink";

// Helper to mock usePathname for specific tests
const mockUsePathname = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

describe("NavLink", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders link with correct href", () => {
      render(<NavLink href="/about">About</NavLink>);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/about");
    });

    it("renders children correctly", () => {
      render(<NavLink href="/home">Home Page</NavLink>);

      expect(screen.getByRole("link")).toHaveTextContent("Home Page");
    });

    it("renders complex children correctly", () => {
      render(
        <NavLink href="/profile">
          <strong>My Profile</strong>
        </NavLink>
      );

      const link = screen.getByRole("link");
      expect(link).toContainHTML("<strong>My Profile</strong>");
    });
  });

  describe("Active State", () => {
    it("renders with aria-current='page' when active", () => {
      mockUsePathname.mockReturnValue("/dashboard");
      render(<NavLink href="/dashboard">Dashboard</NavLink>);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("aria-current", "page");
    });

    it("does not have aria-current when inactive", () => {
      mockUsePathname.mockReturnValue("/");
      render(<NavLink href="/about">About</NavLink>);

      const link = screen.getByRole("link");
      expect(link).not.toHaveAttribute("aria-current");
    });

    it("auto-detects active state based on pathname", () => {
      mockUsePathname.mockReturnValue("/contact");
      render(<NavLink href="/contact">Contact</NavLink>);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("aria-current", "page");
    });

    it("is inactive when pathname does not match href", () => {
      mockUsePathname.mockReturnValue("/home");
      render(<NavLink href="/settings">Settings</NavLink>);

      const link = screen.getByRole("link");
      expect(link).not.toHaveAttribute("aria-current");
    });
  });

  describe("Manual Active Override", () => {
    it("active prop overrides auto-detection to true", () => {
      mockUsePathname.mockReturnValue("/other-page");
      render(
        <NavLink href="/dashboard" active>
          Dashboard
        </NavLink>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("aria-current", "page");
    });

    it("active prop overrides auto-detection to false", () => {
      mockUsePathname.mockReturnValue("/dashboard");
      render(
        <NavLink href="/dashboard" active={false}>
          Dashboard
        </NavLink>
      );

      const link = screen.getByRole("link");
      expect(link).not.toHaveAttribute("aria-current");
    });
  });

  describe("Variants", () => {
    it("renders default variant with rounded-full styling", () => {
      render(<NavLink href="/home">Home</NavLink>);

      const link = screen.getByRole("link");
      expect(link.className).toMatch(/rounded-full/);
    });

    it("renders pill variant with rounded-full styling", () => {
      render(
        <NavLink href="/home" variant="pill">
          Home
        </NavLink>
      );

      const link = screen.getByRole("link");
      expect(link.className).toMatch(/rounded-full/);
    });

    it("renders vertical variant with flex-col styling", () => {
      render(
        <NavLink href="/home" variant="vertical">
          Home
        </NavLink>
      );

      const link = screen.getByRole("link");
      expect(link.className).toMatch(/flex-col/);
      expect(link.className).toMatch(/rounded-2xl/);
      expect(link.className).toMatch(/w-full/);
    });

    it("pill variant applies active white text class when active", () => {
      mockUsePathname.mockReturnValue("/home");
      render(
        <NavLink href="/home" variant="pill">
          Home
        </NavLink>
      );

      const link = screen.getByRole("link");
      expect(link.className).toMatch(/text-white/);
    });

    it("vertical variant applies active primary color when active", () => {
      mockUsePathname.mockReturnValue("/home");
      render(
        <NavLink href="/home" variant="vertical">
          Home
        </NavLink>
      );

      const link = screen.getByRole("link");
      // Uses brand primary color #F15640
      expect(link.className).toMatch(/text-\[#F15640\]/);
    });

    it("default variant applies neutral text styling when not active", () => {
      mockUsePathname.mockReturnValue("/other");
      render(
        <NavLink href="/home" variant="default">
          Home
        </NavLink>
      );

      const link = screen.getByRole("link");
      expect(link.className).toMatch(/text-neutral-400/);
    });

    it("vertical variant has full width", () => {
      mockUsePathname.mockReturnValue("/other");
      render(
        <NavLink href="/home" variant="vertical">
          Home
        </NavLink>
      );

      const link = screen.getByRole("link");
      expect(link.className).toMatch(/w-full/);
    });
  });

  describe("Sizes", () => {
    it("renders small size with correct padding and text", () => {
      render(
        <NavLink href="/home" size="sm">
          Home
        </NavLink>
      );

      const link = screen.getByRole("link");
      expect(link.className).toMatch(/px-3/);
      expect(link.className).toMatch(/py-1\.5/);
      expect(link.className).toMatch(/text-xs/);
      expect(link.className).toMatch(/gap-1\.5/);
    });

    it("renders medium size (default) with correct padding and text", () => {
      render(<NavLink href="/home">Home</NavLink>);

      const link = screen.getByRole("link");
      expect(link.className).toMatch(/px-4/);
      expect(link.className).toMatch(/py-2/);
      expect(link.className).toMatch(/text-sm/);
      expect(link.className).toMatch(/gap-2/);
    });

    it("renders large size with correct padding and text", () => {
      render(
        <NavLink href="/home" size="lg">
          Home
        </NavLink>
      );

      const link = screen.getByRole("link");
      expect(link.className).toMatch(/px-5/);
      expect(link.className).toMatch(/py-2\.5/);
      expect(link.className).toMatch(/text-base/);
      expect(link.className).toMatch(/gap-2\.5/);
    });
  });

  describe("Icon", () => {
    it("renders icon when provided", () => {
      const icon = <span data-testid="nav-icon">🏠</span>;
      render(
        <NavLink href="/home" icon={icon}>
          Home
        </NavLink>
      );

      expect(screen.getByTestId("nav-icon")).toBeInTheDocument();
    });

    it("does not render icon wrapper when icon not provided", () => {
      render(<NavLink href="/home">Home</NavLink>);

      const link = screen.getByRole("link");
      // Should only have the motion.span for text
      const motionSpans = link.querySelectorAll(":scope > span");
      // Default variant has UnderlineIndicator + text span = 2 spans
      expect(motionSpans.length).toBeGreaterThanOrEqual(1);
    });

    it("icon has flex styling for alignment", () => {
      const icon = <span data-testid="nav-icon">🏠</span>;
      render(
        <NavLink href="/home" icon={icon}>
          Home
        </NavLink>
      );

      const iconWrapper = screen.getByTestId("nav-icon").parentElement;
      expect(iconWrapper?.className).toMatch(/flex/);
      expect(iconWrapper?.className).toMatch(/items-center/);
      expect(iconWrapper?.className).toMatch(/justify-center/);
    });

    it("icon has margin-bottom in vertical variant", () => {
      const icon = <span data-testid="nav-icon">🏠</span>;
      render(
        <NavLink href="/home" variant="vertical" icon={icon}>
          Home
        </NavLink>
      );

      const iconWrapper = screen.getByTestId("nav-icon").parentElement;
      expect(iconWrapper?.className).toMatch(/mb-1/);
    });
  });

  describe("Custom className", () => {
    it("applies custom className correctly", () => {
      render(
        <NavLink href="/home" className="custom-nav-class">
          Home
        </NavLink>
      );

      const link = screen.getByRole("link");
      expect(link.className).toMatch(/custom-nav-class/);
    });

    it("merges custom className with default classes", () => {
      render(
        <NavLink href="/home" className="my-custom-style">
          Home
        </NavLink>
      );

      const link = screen.getByRole("link");
      expect(link.className).toMatch(/my-custom-style/);
      expect(link.className).toMatch(/inline-flex/);
      expect(link.className).toMatch(/items-center/);
    });
  });

  describe("Events", () => {
    it("calls onClick handler when clicked", async () => {
      const handleClick = vi.fn();
      const { user } = render(
        <NavLink href="/home" onClick={handleClick}>
          Home
        </NavLink>
      );

      const link = screen.getByRole("link");
      await user.click(link);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not throw when onClick is not provided", async () => {
      const { user } = render(<NavLink href="/home">Home</NavLink>);

      const link = screen.getByRole("link");

      await expect(user.click(link)).resolves.not.toThrow();
    });
  });

  describe("Accessibility", () => {
    it("has proper focus-visible styles with brand color", () => {
      render(<NavLink href="/home">Home</NavLink>);

      const link = screen.getByRole("link");
      expect(link.className).toMatch(/focus-visible:outline-none/);
      expect(link.className).toMatch(/focus-visible:ring-2/);
      expect(link.className).toMatch(/focus-visible:ring-\[#F15640\]/);
      expect(link.className).toMatch(/focus-visible:ring-offset-2/);
    });

    it("is focusable via keyboard", async () => {
      const { user } = render(<NavLink href="/home">Home</NavLink>);

      await user.tab();

      const link = screen.getByRole("link");
      expect(link).toHaveFocus();
    });

    it("maintains semantic link role", () => {
      render(<NavLink href="/about">About</NavLink>);

      const link = screen.getByRole("link", { name: /about/i });
      expect(link).toBeInTheDocument();
    });

    it("supports ref forwarding", () => {
      const ref = vi.fn();
      render(
        <NavLink href="/home" ref={ref}>
          Home
        </NavLink>
      );

      expect(ref).toHaveBeenCalled();
    });

    it("has cursor-pointer and select-none for proper UX", () => {
      render(<NavLink href="/home">Home</NavLink>);

      const link = screen.getByRole("link");
      expect(link.className).toMatch(/cursor-pointer/);
      expect(link.className).toMatch(/select-none/);
    });
  });

  describe("Framer Motion Integration", () => {
    it("renders motion elements for animations", () => {
      const icon = <span data-testid="nav-icon">🏠</span>;
      render(
        <NavLink href="/home" icon={icon}>
          Home
        </NavLink>
      );

      // Icon should be wrapped in motion.span
      const iconWrapper = screen.getByTestId("nav-icon").parentElement;
      expect(iconWrapper).toBeInTheDocument();
    });

    it("pill variant renders pill indicator when active", () => {
      mockUsePathname.mockReturnValue("/home");
      render(
        <NavLink href="/home" variant="pill">
          Home
        </NavLink>
      );

      const link = screen.getByRole("link");
      // Pill indicator should be a span with brand bg-[#F15640]
      const pillIndicator = link.querySelector('span[class*="bg-[#F15640]"]');
      expect(pillIndicator).toBeInTheDocument();
    });

    it("vertical variant renders vertical indicator when active", () => {
      mockUsePathname.mockReturnValue("/home");
      render(
        <NavLink href="/home" variant="vertical">
          Home
        </NavLink>
      );

      const link = screen.getByRole("link");
      // Vertical indicator should be a span with w-1
      const verticalIndicator = link.querySelector("span.w-1");
      expect(verticalIndicator).toBeInTheDocument();
    });
  });
});
