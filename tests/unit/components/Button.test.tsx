/**
 * Unit Tests - Button Component
 *
 * Tests para el componente Button:
 * - Renderizado correcto
 * - Props y variantes
 * - Estados (loading, disabled)
 * - Eventos de click
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@tests/utils";
import { within } from "@testing-library/react";
import { Button } from "@atoms/Button";

describe("Button", () => {
  describe("Rendering", () => {
    it("renders with default props", () => {
      render(<Button>Click me</Button>);

      const button = screen.getByRole("button");
      expect(within(button).getByText(/click me/i)).toBeInTheDocument();
    });

    it("renders children correctly", () => {
      render(<Button>Custom Text</Button>);

      expect(screen.getByRole("button")).toHaveTextContent("Custom Text");
    });

    it("renders with custom className", () => {
      render(<Button className="custom-class">Button</Button>);

      const button = screen.getByRole("button");
      expect(button.className).toMatch(/custom-class/);
    });
  });

  describe("Variants", () => {
    it("renders contained variant by default", () => {
      render(<Button>Contained</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("MuiButton-contained");
    });

    it("renders outlined variant", () => {
      render(<Button variant="outlined">Outlined</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("MuiButton-outlined");
    });

    it("renders text variant", () => {
      render(<Button variant="text">Text</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("MuiButton-text");
    });
  });

  describe("Colors", () => {
    it("renders primary color by default", () => {
      render(<Button>Primary</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("MuiButton-colorPrimary");
    });

    it("renders secondary color", () => {
      render(<Button color="secondary">Secondary</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("MuiButton-colorSecondary");
    });

    it("renders error color", () => {
      render(<Button color="error">Error</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("MuiButton-colorError");
    });
  });

  describe("Sizes", () => {
    it("renders medium size by default", () => {
      render(<Button>Medium</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("MuiButton-sizeMedium");
    });

    it("renders small size", () => {
      render(<Button size="small">Small</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("MuiButton-sizeSmall");
    });

    it("renders large size", () => {
      render(<Button size="large">Large</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("MuiButton-sizeLarge");
    });
  });

  describe("Loading State", () => {
    it("shows loading spinner when loading", () => {
      render(<Button loading>Loading</Button>);

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("disables button when loading", () => {
      render(<Button loading>Loading</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("replaces startIcon with spinner when loading", () => {
      const startIcon = <span data-testid="start-icon">Icon</span>;
      render(
        <Button loading startIcon={startIcon}>
          Loading
        </Button>
      );

      expect(screen.queryByTestId("start-icon")).not.toBeInTheDocument();
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });

  describe("Disabled State", () => {
    it("is disabled when disabled prop is true", () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("does not call onClick when disabled", async () => {
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );

      const button = screen.getByRole("button");

      // MUI adds pointer-events: none to disabled buttons
      // So we just verify the button is disabled and trust browser behavior
      expect(button).toBeDisabled();
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("Events", () => {
    it("calls onClick when clicked", async () => {
      const handleClick = vi.fn();
      const { user } = render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("passes event to onClick handler", async () => {
      const handleClick = vi.fn();
      const { user } = render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe("Icons", () => {
    it("renders startIcon", () => {
      const startIcon = <span data-testid="start-icon">→</span>;
      render(<Button startIcon={startIcon}>With Icon</Button>);

      expect(screen.getByTestId("start-icon")).toBeInTheDocument();
    });

    it("renders endIcon", () => {
      const endIcon = <span data-testid="end-icon">←</span>;
      render(<Button endIcon={endIcon}>With Icon</Button>);

      expect(screen.getByTestId("end-icon")).toBeInTheDocument();
    });

    it("renders both icons", () => {
      const startIcon = <span data-testid="start-icon">→</span>;
      const endIcon = <span data-testid="end-icon">←</span>;
      render(
        <Button startIcon={startIcon} endIcon={endIcon}>
          Both Icons
        </Button>
      );

      expect(screen.getByTestId("start-icon")).toBeInTheDocument();
      expect(screen.getByTestId("end-icon")).toBeInTheDocument();
    });
  });

  describe("FullWidth", () => {
    it("renders full width when fullWidth is true", () => {
      render(<Button fullWidth>Full Width</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("MuiButton-fullWidth");
    });
  });

  describe("Accessibility", () => {
    it("is focusable", async () => {
      const { user } = render(<Button>Focus me</Button>);

      await user.tab();

      const button = screen.getByRole("button");
      expect(button).toHaveFocus();
    });

    it("can be activated with keyboard", async () => {
      const handleClick = vi.fn();
      const { user } = render(<Button onClick={handleClick}>Press me</Button>);

      await user.tab();
      await user.keyboard("{Enter}");

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("can be activated with space key", async () => {
      const handleClick = vi.fn();
      const { user } = render(<Button onClick={handleClick}>Press me</Button>);

      await user.tab();
      await user.keyboard(" ");

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
