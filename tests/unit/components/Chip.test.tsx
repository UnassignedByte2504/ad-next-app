/**
 * Unit Tests - Chip Component
 *
 * Tests para el componente Chip:
 * - Renderizado correcto
 * - Variantes
 * - Estados (selected, clickable)
 * - Eventos (onDelete)
 * - Accesibilidad
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@tests/utils";
import { Chip } from "@atoms/Chip";

describe("Chip", () => {
  describe("Rendering", () => {
    it("renders label correctly", () => {
      render(<Chip label="Rock" />);
      expect(screen.getByText("Rock")).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      render(<Chip label="Jazz" className="custom-chip" />);
      const chip = screen.getByText("Jazz").closest(".MuiChip-root");
      expect(chip?.className).toContain("custom-chip");
    });

    it("renders icon when provided", () => {
      const icon = <span data-testid="chip-icon">🎸</span>;
      render(<Chip label="Guitar" icon={icon} />);
      expect(screen.getByTestId("chip-icon")).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("renders filled variant by default", () => {
      render(<Chip label="Genre" />);
      const chip = screen.getByText("Genre").closest(".MuiChip-root");
      expect(chip).toHaveClass("MuiChip-filled");
    });

    it("renders outlined variant", () => {
      render(<Chip label="Genre" variant="outlined" />);
      const chip = screen.getByText("Genre").closest(".MuiChip-root");
      expect(chip).toHaveClass("MuiChip-outlined");
    });
  });

  describe("Colors", () => {
    it("renders default color by default", () => {
      render(<Chip label="Tag" />);
      const chip = screen.getByText("Tag").closest(".MuiChip-root");
      expect(chip).toHaveClass("MuiChip-colorDefault");
    });

    it("renders primary color", () => {
      render(<Chip label="Tag" color="primary" />);
      const chip = screen.getByText("Tag").closest(".MuiChip-root");
      expect(chip).toHaveClass("MuiChip-colorPrimary");
    });

    it("renders secondary color", () => {
      render(<Chip label="Tag" color="secondary" />);
      const chip = screen.getByText("Tag").closest(".MuiChip-root");
      expect(chip).toHaveClass("MuiChip-colorSecondary");
    });

    it("renders error color", () => {
      render(<Chip label="Tag" color="error" />);
      const chip = screen.getByText("Tag").closest(".MuiChip-root");
      expect(chip).toHaveClass("MuiChip-colorError");
    });
  });

  describe("Sizes", () => {
    it("renders medium size by default", () => {
      render(<Chip label="Tag" />);
      const chip = screen.getByText("Tag").closest(".MuiChip-root");
      expect(chip).toHaveClass("MuiChip-sizeMedium");
    });

    it("renders small size", () => {
      render(<Chip label="Tag" size="small" />);
      const chip = screen.getByText("Tag").closest(".MuiChip-root");
      expect(chip).toHaveClass("MuiChip-sizeSmall");
    });
  });

  describe("Clickable", () => {
    it("is not clickable by default", () => {
      render(<Chip label="Tag" />);
      const chip = screen.getByText("Tag").closest(".MuiChip-root");
      expect(chip).not.toHaveClass("MuiChip-clickable");
    });

    it("is clickable when clickable=true", () => {
      render(<Chip label="Tag" clickable />);
      const chip = screen.getByText("Tag").closest(".MuiChip-root");
      expect(chip).toHaveClass("MuiChip-clickable");
    });
  });

  describe("Selected State", () => {
    it("applies primary color when selected", () => {
      render(<Chip label="Genre" selected />);
      const chip = screen.getByText("Genre").closest(".MuiChip-root");
      expect(chip).toHaveClass("MuiChip-colorPrimary");
    });

    it("applies filled variant when selected", () => {
      render(<Chip label="Genre" selected variant="outlined" />);
      const chip = screen.getByText("Genre").closest(".MuiChip-root");
      expect(chip).toHaveClass("MuiChip-filled");
    });
  });

  describe("Delete", () => {
    it("shows delete icon when onDelete is provided", () => {
      const handleDelete = vi.fn();
      render(<Chip label="Tag" onDelete={handleDelete} />);
      const chip = screen.getByText("Tag").closest(".MuiChip-root");
      expect(chip).toHaveClass("MuiChip-deletable");
    });

    it("calls onDelete when delete icon is clicked", async () => {
      const handleDelete = vi.fn();
      const { user } = render(<Chip label="Tag" onDelete={handleDelete} />);

      // Find the delete button by its role or svg
      const deleteButton = screen.getByTestId("CancelIcon").closest("svg");
      if (deleteButton) {
        await user.click(deleteButton);
        expect(handleDelete).toHaveBeenCalled();
      }
    });
  });

  describe("Accessibility", () => {
    it("is focusable when clickable", async () => {
      const { user } = render(<Chip label="Tag" clickable />);

      await user.tab();

      const chip = screen.getByText("Tag").closest(".MuiChip-root");
      expect(chip).toHaveFocus();
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to the root element", () => {
      const ref = vi.fn();
      render(<Chip label="Tag" ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });
  });
});
