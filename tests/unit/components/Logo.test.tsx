import { Logo } from "@atoms/Logo";
import { render, screen } from "@tests/utils";
import { describe, expect, it, vi } from "vitest";

// Mock next/link
vi.mock("next/link", () => ({
  default: vi.fn(({ href, children, className }) => (
    <a href={href} className={className}>
      {children}
    </a>
  )),
}));

// Mock useTheme
vi.mock("@mui/material/styles", async () => {
  const actual = await vi.importActual("@mui/material/styles");
  return {
    ...actual,
    useTheme: () => ({
      palette: {
        primary: { main: "#F59E0B" },
        text: { primary: "#1C1917" },
      },
    }),
  };
});

describe("Logo", () => {
  describe("Rendering", () => {
    it("renders correctly with default props", () => {
      render(<Logo />);
      expect(screen.getByText("Ayla")).toBeInTheDocument();
      expect(screen.getByText(".")).toBeInTheDocument();
    });

    it("renders full variant correctly", () => {
      render(<Logo variant="full" />);
      expect(screen.getByText("Ayla")).toBeInTheDocument();
      expect(screen.getByText("Designs")).toBeInTheDocument();
    });
  });

  describe("Link", () => {
    it("renders as a link when linkTo prop is provided", () => {
      render(<Logo linkTo="/home" />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/home");
    });
  });

  describe("Customization", () => {
    it("applies custom className", () => {
      render(<Logo className="custom-class" />);
      // The container is the first div
      const container = screen.getByText("Ayla").parentElement;
      expect(container).toHaveClass("custom-class");
    });

    it("applies custom textColor", () => {
      render(<Logo textColor="#FF0000" />);
      const text = screen.getByText("Ayla");
      // Note: style prop in React renders as inline style
      expect(text).toHaveStyle({ color: "#FF0000" });
    });
  });
});
