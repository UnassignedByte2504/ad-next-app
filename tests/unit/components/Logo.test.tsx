import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@tests/utils";
import { Logo } from "@atoms/Logo";

// Mock next/image since it requires Next.js environment
vi.mock("next/image", () => ({
  default: vi.fn(({ src, alt, width, height, priority, className }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      data-priority={priority}
      className={className}
    />
  )),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: vi.fn(({ href, children, className }) => (
    <a href={href} className={className}>
      {children}
    </a>
  )),
}));

describe("Logo", () => {
  describe("Rendering", () => {
    it("renders correctly with default props", () => {
      render(<Logo />);
      const image = screen.getByRole("img", { name: "Bemyre" });
      expect(image).toBeInTheDocument();
    });

    it("renders the Bemyre logo image", () => {
      render(<Logo />);
      const image = screen.getByRole("img", { name: "Bemyre" });
      expect(image).toHaveAttribute("src", "/images/Bemyre_logo.png");
    });
  });

  describe("Sizes", () => {
    it("renders sm size with correct dimensions", () => {
      render(<Logo size="sm" />);
      const image = screen.getByRole("img", { name: "Bemyre" });
      expect(image).toHaveAttribute("width", "80");
      expect(image).toHaveAttribute("height", "32");
    });

    it("renders md size with correct dimensions (default)", () => {
      render(<Logo size="md" />);
      const image = screen.getByRole("img", { name: "Bemyre" });
      expect(image).toHaveAttribute("width", "120");
      expect(image).toHaveAttribute("height", "48");
    });

    it("renders lg size with correct dimensions", () => {
      render(<Logo size="lg" />);
      const image = screen.getByRole("img", { name: "Bemyre" });
      expect(image).toHaveAttribute("width", "160");
      expect(image).toHaveAttribute("height", "64");
    });

    it("defaults to md size when no size prop provided", () => {
      render(<Logo />);
      const image = screen.getByRole("img", { name: "Bemyre" });
      expect(image).toHaveAttribute("width", "120");
      expect(image).toHaveAttribute("height", "48");
    });
  });

  describe("Link", () => {
    it("renders as a link when linkTo prop is provided", () => {
      render(<Logo linkTo="/home" />);
      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });

    it("link has correct href", () => {
      render(<Logo linkTo="/dashboard" />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/dashboard");
    });

    it("does not render link when linkTo is not provided", () => {
      render(<Logo />);
      const link = screen.queryByRole("link");
      expect(link).not.toBeInTheDocument();
    });

    it("link contains the logo image", () => {
      render(<Logo linkTo="/home" />);
      const link = screen.getByRole("link");
      const image = screen.getByRole("img", { name: "Bemyre" });
      expect(link).toContainElement(image);
    });

    it("link has hover transition class", () => {
      render(<Logo linkTo="/home" />);
      const link = screen.getByRole("link");
      expect(link).toHaveClass("hover:opacity-80", "transition-opacity");
    });
  });

  describe("Custom className", () => {
    it("applies className correctly to container", () => {
      render(<Logo className="custom-class" />);
      const image = screen.getByRole("img", { name: "Bemyre" });
      const container = image.closest("div");
      expect(container).toHaveClass("custom-class");
    });

    it("preserves default classes when custom className is added", () => {
      render(<Logo className="my-logo" />);
      const image = screen.getByRole("img", { name: "Bemyre" });
      const container = image.closest("div");
      expect(container).toHaveClass("relative", "inline-flex", "items-center", "justify-center");
      expect(container).toHaveClass("my-logo");
    });
  });

  describe("Priority", () => {
    it("passes priority=false by default", () => {
      render(<Logo />);
      const image = screen.getByRole("img", { name: "Bemyre" });
      expect(image).toHaveAttribute("data-priority", "false");
    });

    it("passes priority=true when prop is set", () => {
      render(<Logo priority />);
      const image = screen.getByRole("img", { name: "Bemyre" });
      expect(image).toHaveAttribute("data-priority", "true");
    });
  });

  describe("Alt text", () => {
    it("has correct alt text 'Bemyre'", () => {
      render(<Logo />);
      const image = screen.getByRole("img", { name: "Bemyre" });
      expect(image).toHaveAttribute("alt", "Bemyre");
    });
  });

  describe("Accessibility", () => {
    it("logo is visible and accessible", () => {
      render(<Logo />);
      const image = screen.getByRole("img", { name: "Bemyre" });
      expect(image).toBeVisible();
    });

    it("logo in link is keyboard accessible", () => {
      render(<Logo linkTo="/home" />);
      const link = screen.getByRole("link");
      expect(link).toBeVisible();
    });

    it("image has object-contain class for proper display", () => {
      render(<Logo />);
      const image = screen.getByRole("img", { name: "Bemyre" });
      expect(image).toHaveClass("object-contain");
    });
  });

  describe("Ref forwarding", () => {
    it("forwards ref to container div", () => {
      const ref = vi.fn();
      render(<Logo ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe("Variant", () => {
    it("accepts variant prop without error", () => {
      expect(() => render(<Logo variant="full" />)).not.toThrow();
      expect(() => render(<Logo variant="icon" />)).not.toThrow();
    });
  });
});
